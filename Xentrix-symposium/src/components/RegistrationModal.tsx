import React, { useState } from 'react';
import { SymposiumEvent, RegistrationResult } from '../types';
import { X, CheckCircle, ArrowRight, ArrowLeft, ShieldAlert, Download, AlertTriangle, CreditCard, User, Users, Mail, Phone, Building, Check, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SymposiumEvent[];
  onSuccess: (result: RegistrationResult) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  cart,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1); // Step 1 to 4

  // Form State
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  
  // Teammates state (max 3 teammates + 1 leader = 4 total)
  const [teammates, setTeammates] = useState<{ name: string; email: string; phone: string }[]>([
    { name: '', email: '', phone: '' }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedResult, setCompletedResult] = useState<RegistrationResult | null>(null);
  const [passDataUrls, setPassDataUrls] = useState<{ name: string; role: string; qrUrl: string }[]>([]);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.fee, 0);

  // Determine max team size limit based on selected events
  const maxTeamMembersAllowed = Math.max(
    ...cart.map((evt) => {
      if (evt.maxMembers) return evt.maxMembers;
      if (evt.teamSize?.includes('1 Member')) return 1;
      if (evt.teamSize?.includes('2 Members')) return 2;
      return 4;
    }),
    1
  );

  const handleAddTeammate = () => {
    if (teammates.length < maxTeamMembersAllowed - 1) {
      setTeammates([...teammates, { name: '', email: '', phone: '' }]);
    }
  };

  const handleRemoveTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  const handleTeammateChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    const updated = [...teammates];
    updated[index][field] = value;
    setTeammates(updated);
  };

  // Step 1 -> Step 2 Validation
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!collegeName.trim() || !department.trim() || !leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage('Please fill in all mandatory contact and college information.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(leaderPhone.trim())) {
      setErrorMessage('Leader phone number must be a valid 10-digit Indian mobile number.');
      return;
    }

    setCurrentStep(2); // Move to Part 2: Review
  };

  // Step 3 -> Process Final Payment & API Registration
  const handleProcessPayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      teamName: teamName.trim() || `${leaderName}'s Team`,
      collegeName: collegeName.trim(),
      department: department.trim(),
      year: year,
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.trim(),
      leaderPhone: leaderPhone.trim(),
      members: teammates.filter((m) => m.name.trim() !== ''),
      selectedEvents: cart,
      totalAmount: totalAmount
    };

    try {
      const response = await fetch('/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        const resultData: RegistrationResult = {
          registrationId: data.registration_id || 'SYM2026-' + Math.floor(100 + Math.random() * 900),
          teamName: payload.teamName,
          collegeName: payload.collegeName,
          department: payload.department,
          leaderName: payload.leaderName,
          leaderEmail: payload.leaderEmail,
          totalAmount: totalAmount,
          members: data.details?.members || [
            { name: leaderName, email: leaderEmail, phone: leaderPhone, role: 'Team Leader', qr_token: 'UUID-' + Math.random() }
          ],
          selectedEvents: cart,
          events: cart
        };

        // Generate QR Codes for each member
        const membersList = resultData.members || [];
        const passesWithQR = await Promise.all(
          membersList.map(async (m: any) => {
            const qrToken = m.qr_token || resultData.registrationId;
            const qrDataUrl = await QRCode.toDataURL(qrToken, { width: 300, margin: 2 });
            return {
              name: m.name,
              role: m.role || 'Participant',
              qrUrl: qrDataUrl
            };
          })
        );

        setPassDataUrls(passesWithQR);
        setCompletedResult(resultData);
        setCurrentStep(4); // Move to Part 4: Completion & Multi-Pass Download
        onSuccess(resultData);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single Click Multi-Pass Download
  const handleDownloadAllPasses = () => {
    if (!completedResult || passDataUrls.length === 0) return;

    passDataUrls.forEach((pass) => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Pass Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 600, 800);

      // Gold Border
      ctx.strokeStyle = '#C89B3C';
      ctx.lineWidth = 10;
      ctx.strokeRect(10, 10, 580, 780);

      // Header Banner
      ctx.fillStyle = '#6D071A';
      ctx.fillRect(15, 15, 570, 100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("PSVPEC - XenTriX '26 OFFICIAL PASS", 300, 55);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#C89B3C';
      ctx.fillText('ECE | EEE | MECH | CIVIL', 300, 85);

      // Details
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(pass.name, 40, 160);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`ROLE: ${pass.role.toUpperCase()}`, 40, 190);
      ctx.fillText(`REG ID: ${completedResult.registrationId}`, 40, 215);
      ctx.fillText(`COLLEGE: ${completedResult.collegeName}`, 40, 240);
      ctx.fillText(`DEPT: ${completedResult.department}`, 40, 265);

      // Event List
      ctx.fillStyle = '#C89B3C';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('REGISTERED EVENTS:', 40, 305);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '14px sans-serif';
      const eventList = completedResult.events || completedResult.selectedEvents || [];
      eventList.forEach((evt: any, i: number) => {
        ctx.fillText(`• ${evt.name}`, 50, 335 + i * 25);
      });

      // QR Image
      const img = new Image();
      img.src = pass.qrUrl;
      img.onload = () => {
        ctx.drawImage(img, 175, 480, 250, 250);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COLLEGE ID IS MANDATORY FOR ENTRY VERIFICATION', 300, 755);

        const a = document.createElement('a');
        a.download = `XenTriX26_PASS_${pass.name.replace(/\s+/g, '_')}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4" data-lenis-prevent>
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-gold-500/30 shadow-2xl overflow-hidden relative text-richblack" data-lenis-prevent>
        
        {/* Header */}
        <div className="px-6 py-4 bg-maroon-700 text-white flex items-center justify-between border-b border-gold-500/40">
          <div>
            <div className="text-[10px] font-space font-bold uppercase tracking-widest text-gold-400">
              Registration Portal • Part {currentStep} of 4
            </div>
            <h2 className="font-heading text-xl font-bold">
              XenTriX '26 Symposium Entry
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5 flex">
          <div
            className="bg-gold-500 h-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6">
          
          {/* ======================================================== */}
          {/* PART 1: USER & TEAM DETAILS                              */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToReview} className="space-y-6">
              
              {/* First Element: Selected Events Summary */}
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-500/40 space-y-2">
                <div className="text-xs font-space font-bold uppercase text-gold-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  <span>Selected Events Cart ({cart.length})</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {cart.map((evt) => (
                    <span key={evt.id} className="px-3 py-1 rounded-full bg-white text-maroon-700 text-xs font-bold font-space border border-gold-500/30">
                      {evt.name} (₹{evt.fee})
                    </span>
                  ))}
                </div>
                <div className="text-xs font-bold text-richblack font-space pt-1">
                  Total Amount to Pay: ₹{totalAmount}
                </div>
              </div>

              {/* Leader / Primary User Details */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold border-b border-bordergray pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-maroon-700" />
                  <span>Primary Participant / Team Leader Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. Mohammed Shameem"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Mobile Phone (10-Digit) *</label>
                    <input
                      type="tel"
                      required
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">College / Institution *</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. PSVPEC Chennai"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="ECE">ECE - Electronics & Communication</option>
                      <option value="EEE">EEE - Electrical & Electronics</option>
                      <option value="MECH">MECH - Mechanical Engineering</option>
                      <option value="CIVIL">CIVIL - Civil Engineering</option>
                      <option value="CSE/IT">CSE / IT Computer Engineering</option>
                      <option value="OTHER">Other Engineering Discipline</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Year of Study</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-maroon-700 outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Teammates Section */}
              {maxTeamMembersAllowed > 1 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-bordergray pb-2">
                    <h3 className="font-heading text-base font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-maroon-700" />
                      <span>Teammate Details (Max {maxTeamMembersAllowed - 1} Teammates)</span>
                    </h3>

                    {teammates.length < maxTeamMembersAllowed - 1 && (
                      <button
                        type="button"
                        onClick={handleAddTeammate}
                        className="px-3 py-1 rounded-lg bg-maroon-50 text-maroon-700 text-xs font-bold hover:bg-maroon-700 hover:text-white transition-colors"
                      >
                        + Add Teammate
                      </button>
                    )}
                  </div>

                  {teammates.map((member, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span>Teammate #{idx + 1}</span>
                        {teammates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTeammate(idx)}
                            className="text-red-600 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                          placeholder="Teammate Name"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-maroon-700"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                          placeholder="Teammate Email"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-maroon-700"
                        />
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleTeammateChange(idx, 'phone', e.target.value)}
                          placeholder="Teammate Phone"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-maroon-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-maroon-700 text-gold-400 font-space font-bold text-xs uppercase tracking-wider hover:bg-gold-500 hover:text-richblack transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Part 2: Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* PART 2: REVIEW REGISTRATION (READ ONLY)                   */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                ℹ️ <strong>Review Your Details:</strong> Please verify your registration summary carefully before proceeding to payment. If you need to make changes, click "Edit Details".
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-bordergray space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-3">
                  <div>
                    <span className="text-gray-500 font-semibold block">Primary Leader:</span>
                    <span className="font-bold text-richblack text-sm">{leaderName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block">Contact Email:</span>
                    <span className="font-bold text-richblack">{leaderEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block">Mobile Phone:</span>
                    <span className="font-bold text-richblack">{leaderPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold block">College & Dept:</span>
                    <span className="font-bold text-richblack">{collegeName} ({department})</span>
                  </div>
                </div>

                {/* Selected Events List */}
                <div>
                  <span className="text-gray-500 font-semibold block mb-1">Selected Events List:</span>
                  <ul className="list-disc pl-5 space-y-1 font-bold text-maroon-700">
                    {cart.map((evt) => (
                      <li key={evt.id}>{evt.name} — ₹{evt.fee} ({evt.venue})</li>
                    ))}
                  </ul>
                </div>

                {/* Teammates List */}
                {teammates.some((m) => m.name.trim()) && (
                  <div className="border-t border-gray-200 pt-3">
                    <span className="text-gray-500 font-semibold block mb-1">Additional Teammates:</span>
                    {teammates.filter((m) => m.name.trim()).map((m, i) => (
                      <div key={i} className="text-gray-800 font-medium">
                        • {m.name} ({m.phone || 'No phone'})
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t-2 border-dashed border-gray-300 pt-3 flex items-center justify-between text-sm font-bold font-space">
                  <span>TOTAL REGISTRATION FEE:</span>
                  <span className="text-maroon-700 text-lg">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-maroon-700 text-gold-400 font-space font-bold text-xs uppercase tracking-wider hover:bg-gold-500 hover:text-richblack transition-all flex items-center gap-2"
                >
                  <span>Proceed to Part 3: Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PART 3: PAYMENT PART WITH EXPLICIT WARNING                */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* EXPLICIT MANDATORY WARNING BANNER */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-900 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider font-space">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>CRITICAL PAYMENT INSTRUCTIONS & REFUND POLICY</span>
                </div>
                <p className="text-xs leading-relaxed font-semibold">
                  ⚠️ <strong>Money is non-refundable.</strong> Please ensure you have a stable internet connection before paying. If money is not debited properly due to network failure, the college is not responsible and registration will not be completed.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-space font-bold uppercase text-gray-700">Select Payment Gateway / Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['UPI / QR', 'Net Banking', 'Debit/Credit Card'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl text-xs font-space font-bold border text-center transition-all ${
                        paymentMethod === method
                          ? 'bg-maroon-700 text-gold-400 border-gold-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-maroon-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Gateway Details */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-bordergray text-center space-y-3">
                <div className="text-xs font-bold text-gray-600">Merchant: PSVPEC XenTriX '26 Symposium Account</div>
                <div className="font-heading text-3xl font-extrabold text-maroon-700 font-space">₹{totalAmount}</div>
                <div className="text-[11px] text-gray-500 font-poppins">Clicking below simulates live payment processing and saves your registration record.</div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Review</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleProcessPayment}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-space font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{totalAmount} & Complete Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PART 4: REGISTRATION COMPLETED & MULTI-PASS DOWNLOAD      */}
          {/* ======================================================== */}
          {currentStep === 4 && completedResult && (
            <div className="space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-richblack">
                  Registration Successfully Completed!
                </h3>
                <p className="text-xs text-gray-500 font-space mt-1">
                  Registration ID: <span className="font-extrabold text-maroon-700">{completedResult.registrationId}</span>
                </p>
              </div>

              {/* MANDATORY CAMPUS VERIFICATION WARNING */}
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-900 text-xs font-bold leading-relaxed space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-red-700 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>MANDATORY CAMPUS ENTRY RULE</span>
                </div>
                <p>
                  ⚠️ <strong>COLLEGE ID IS MUST.</strong> We will verify each participant with their physical College ID and Pass upon arrival at the campus main gate.
                </p>
              </div>

              {/* Multi-Pass Preview Cards */}
              <div className="space-y-3 pt-2 text-left">
                <div className="text-xs font-space font-bold uppercase text-gray-700">
                  Generated Smart QR Passes ({passDataUrls.length} Members)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {passDataUrls.map((pass, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
                      <img src={pass.qrUrl} alt="QR Token" className="w-14 h-14 border rounded-lg bg-white" />
                      <div className="text-xs">
                        <div className="font-bold text-richblack">{pass.name}</div>
                        <div className="text-[10px] text-maroon-700 font-semibold">{pass.role}</div>
                        <div className="text-[10px] text-gray-500 font-space">Token: Encrypted UUID</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SINGLE CLICK DOWNLOAD BUTTON FOR ALL PASSES */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadAllPasses}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-maroon-700 text-gold-400 font-space font-extrabold text-xs uppercase tracking-wider hover:bg-gold-500 hover:text-richblack transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Passes in 1 Click (PNG/PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-space font-bold text-xs uppercase hover:bg-gray-100"
                >
                  Close Window
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
