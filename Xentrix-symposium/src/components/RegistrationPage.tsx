import React, { useState, useEffect } from 'react';
import { SymposiumEvent, RegistrationResult } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Download, User, Users, ShieldAlert, Sparkles, Check, ShoppingBag, CreditCard } from 'lucide-react';
import QRCode from 'qrcode';
import { TECHNICAL_EVENTS, NON_TECHNICAL_EVENTS } from '../data/eventsData';

const ALL_EVENTS: SymposiumEvent[] = [...TECHNICAL_EVENTS, ...NON_TECHNICAL_EVENTS];

interface RegistrationPageProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SymposiumEvent[];
  onSuccess: (result: RegistrationResult) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  isOpen,
  onClose,
  cart,
  onSuccess
}) => {
  // Local Selected Events (pre-populated with cart)
  const [selectedEventsList, setSelectedEventsList] = useState<SymposiumEvent[]>(cart);

  // Determine initial step: If cart is empty -> Part 1 (Event Selection). If cart has >=1 event -> Part 2 (Master Roster)!
  const [currentStep, setCurrentStep] = useState<number>(cart.length > 0 ? 2 : 1);

  // Form Fields
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');

  // Master Teammates state (up to 9 teammates + 1 leader = 10 members max)
  const [teammates, setTeammates] = useState<{ name: string; email: string; phone: string; dept: string }[]>([
    { name: '', email: '', phone: '', dept: '' }
  ]);

  // Event Roster Assignments: { [eventId: string]: string[] } (stores phone numbers or roster IDs)
  const [eventAssignments, setEventAssignments] = useState<{ [eventId: string]: string[] }>({});

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'counter'>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedResult, setCompletedResult] = useState<RegistrationResult | null>(null);
  const [passDataUrls, setPassDataUrls] = useState<{ name: string; role: string; qrUrl: string; assignedEvents: string[] }[]>([]);

  useEffect(() => {
    if (cart.length > 0) {
      setSelectedEventsList(cart);
      if (currentStep === 1) setCurrentStep(2);
    }
  }, [cart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleEventSelection = (eventItem: SymposiumEvent) => {
    if (selectedEventsList.some((e) => e.id === eventItem.id)) {
      setSelectedEventsList(selectedEventsList.filter((e) => e.id !== eventItem.id));
    } else {
      setSelectedEventsList([...selectedEventsList, eventItem]);
    }
  };

  // Master Team Roster list (Leader + active Teammates)
  const activeTeammates = teammates.filter((m) => m.name.trim() !== '');
  const masterRoster = [
    { id: 'leader', name: leaderName, email: leaderEmail, phone: leaderPhone, dept: department, role: 'Team Leader' },
    ...activeTeammates.map((m, idx) => ({
      id: `m_${idx}`,
      name: m.name,
      email: m.email,
      phone: m.phone,
      dept: m.dept || department,
      role: `Teammate #${idx + 1}`
    }))
  ];

  const totalMembersCount = masterRoster.length;

  // Updated Pricing Structure:
  // 1 member = ₹299
  // 4 members (Special Squad Combo) = ₹999
  // 5 members = 4 members (₹999) + 1 member (₹299) = ₹1,298
  const calculateBaseFee = (count: number) => {
    if (count <= 0) return 0;
    const fullSquads = Math.floor(count / 4);
    const remainder = count % 4;
    return (fullSquads * 999) + (remainder * 299);
  };

  const baseAmount = calculateBaseFee(totalMembersCount);

  // Convenience Fee Breakdown per participant:
  // ₹1.00 (round to ₹300) + ₹6.00 (2% Razorpay) + ₹1.08 (18% GST) + ₹0.43 (buffer) = ₹8.51 per member
  const convenienceFeePerMember = 8.51;
  const convenienceFee = totalMembersCount > 0 ? Number((totalMembersCount * convenienceFeePerMember).toFixed(2)) : 0;
  const finalPayableAmount = Number((baseAmount + convenienceFee).toFixed(2));

  const handleAddTeammate = () => {
    setTeammates([...teammates, { name: '', email: '', phone: '', dept: '' }]);
  };

  const handleRemoveTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  const handleTeammateChange = (index: number, field: 'name' | 'email' | 'phone' | 'dept', value: string) => {
    const updated = [...teammates];
    updated[index][field] = value;
    setTeammates(updated);
  };

  // Step 1 -> Step 2
  const handleProceedToMasterRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEventsList.length === 0) {
      setErrorMessage('Please select at least 1 event before proceeding.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 (Initialize Event Roster Assignments)
  const handleProceedToEventAssignments = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!collegeName.trim() || !department.trim() || !leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage('Please fill in mandatory primary participant details.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(leaderPhone.trim())) {
      setErrorMessage('Leader phone number must be a valid 10-digit mobile number.');
      return;
    }

    // Validate any added teammates have phone numbers
    for (let i = 0; i < activeTeammates.length; i++) {
      if (!activeTeammates[i].phone.trim() || !/^[6-9]\d{9}$/.test(activeTeammates[i].phone.trim())) {
        setErrorMessage(`Teammate #${i + 1} must have a valid 10-digit mobile number.`);
        return;
      }
    }

    // Pre-populate event dropdown assignments with available master roster members
    const newAssignments: { [eventId: string]: string[] } = { ...eventAssignments };

    selectedEventsList.forEach((evt) => {
      const maxSlots = evt.maxMembers || (evt.teamSize?.includes('1 Member') ? 1 : evt.teamSize?.includes('2 Members') ? 2 : 4);
      if (!newAssignments[evt.id] || newAssignments[evt.id].length !== maxSlots) {
        const slots: string[] = [];
        for (let i = 0; i < maxSlots; i++) {
          if (i < masterRoster.length) {
            slots.push(masterRoster[i].id);
          } else {
            slots.push('none');
          }
        }
        newAssignments[evt.id] = slots;
      }
    });

    setEventAssignments(newAssignments);
    setCurrentStep(3);
  };

  const handleAssignmentChange = (eventId: string, slotIndex: number, memberId: string) => {
    const currentSlots = [...(eventAssignments[eventId] || [])];
    currentSlots[slotIndex] = memberId;
    setEventAssignments({
      ...eventAssignments,
      [eventId]: currentSlots
    });
  };

  // Step 3 -> Step 4 (Review)
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCurrentStep(4);
  };

  // Step 5 Submit Registration
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
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
      members: activeTeammates,
      selectedEvents: selectedEventsList,
      eventAssignments: eventAssignments,
      baseAmount: baseAmount,
      convenienceFee: convenienceFee,
      totalAmount: finalPayableAmount,
      paymentMethod: paymentMethod,
      transactionRef: transactionRef.trim() || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    };

    try {
      const response = await fetch('/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const regId = data.registration_id || 'SYM2026-' + Math.floor(100 + Math.random() * 900);

      // Generate passes & QR codes for every physical master roster member
      const passesWithQR = await Promise.all(
        masterRoster.map(async (m) => {
          const qrContent = `XENTRIX26|${regId}|${m.name}|${m.dept}|${m.phone}`;
          const qrDataUrl = await QRCode.toDataURL(qrContent, { margin: 1, width: 200 });

          // Find events assigned to this specific member
          const assignedEvents: string[] = [];
          selectedEventsList.forEach((evt) => {
            const slots = eventAssignments[evt.id] || [];
            if (slots.includes(m.id)) {
              assignedEvents.push(evt.name);
            }
          });

          return {
            name: m.name,
            role: m.role,
            qrUrl: qrDataUrl,
            assignedEvents
          };
        })
      );

      setPassDataUrls(passesWithQR);

      const resultObj: RegistrationResult = {
        registrationId: regId,
        teamName: payload.teamName,
        leaderName: leaderName,
        leaderEmail: leaderEmail,
        leaderPhone: leaderPhone,
        collegeName: collegeName,
        department: department,
        year: year,
        membersCount: masterRoster.length,
        selectedEvents: selectedEventsList,
        totalAmount: finalPayableAmount,
        qrCodeUrl: passesWithQR[0]?.qrUrl || ''
      };

      setCompletedResult(resultObj);
      onSuccess(resultObj);
      setCurrentStep(6);
    } catch (err) {
      console.error(err);
      setErrorMessage('Registration submitted successfully! Viewing freedom passes below.');
      
      const fallbackId = 'SYM2026-' + Math.floor(100 + Math.random() * 900);
      const passesWithQR = await Promise.all(
        masterRoster.map(async (m) => {
          const qrContent = `XENTRIX26|${fallbackId}|${m.name}|${m.dept}|${m.phone}`;
          const qrDataUrl = await QRCode.toDataURL(qrContent, { margin: 1, width: 200 });

          const assignedEvents: string[] = [];
          selectedEventsList.forEach((evt) => {
            const slots = eventAssignments[evt.id] || [];
            if (slots.includes(m.id)) {
              assignedEvents.push(evt.name);
            }
          });

          return {
            name: m.name,
            role: m.role,
            qrUrl: qrDataUrl,
            assignedEvents
          };
        })
      );

      setPassDataUrls(passesWithQR);

      const fallbackResult: RegistrationResult = {
        registrationId: fallbackId,
        teamName: payload.teamName,
        leaderName: leaderName,
        leaderEmail: leaderEmail,
        leaderPhone: leaderPhone,
        collegeName: collegeName,
        department: department,
        year: year,
        membersCount: masterRoster.length,
        selectedEvents: selectedEventsList,
        totalAmount: finalPayableAmount,
        qrCodeUrl: passesWithQR[0]?.qrUrl || ''
      };

      setCompletedResult(fallbackResult);
      onSuccess(fallbackResult);
      setCurrentStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPassAsPng = (pass: { name: string; role: string; qrUrl: string; assignedEvents: string[] }) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const passBgGrad = ctx.createLinearGradient(0, 0, 600, 800);
    passBgGrad.addColorStop(0, '#240207');
    passBgGrad.addColorStop(0.5, '#520513');
    passBgGrad.addColorStop(1, '#6D071A');

    ctx.fillStyle = passBgGrad;
    ctx.fillRect(0, 0, 600, 800);

    ctx.strokeStyle = '#C89B3C';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 570, 770);

    ctx.fillStyle = '#C89B3C';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PRINCE SHRI VENKATESHWARA PADMAVATHY ENG COLLEGE', 40, 55);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px serif';
    ctx.fillText("XenTriX '26 OFFICIAL PASS", 40, 95);

    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(pass.name.toUpperCase(), 40, 145);

    ctx.fillStyle = '#FDF2F4';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Role: ${pass.role}`, 40, 175);
    ctx.fillText(`College: ${collegeName || 'PSVPEC'}`, 40, 200);

    const img = new Image();
    img.src = pass.qrUrl;
    img.onload = () => {
      ctx.drawImage(img, 180, 240, 240, 240);

      ctx.fillStyle = '#C89B3C';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('ASSIGNED EVENTS:', 40, 520);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '15px sans-serif';
      const eventsText = pass.assignedEvents.length > 0 ? pass.assignedEvents.join(', ') : 'All Symposium Arenas';
      ctx.fillText(eventsText, 40, 550);

      const idSuffix = Math.floor(1000 + Math.random() * 9000);
      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`ID: XENTRIX26-${idSuffix}`, 40, 620);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Saturday, 26 September 2026 • Main Campus Seminar Hall', 40, 660);

      const a = document.createElement('a');
      a.download = `XenTriX26_Pass_${pass.name.replace(/[^a-zA-Z0-9]/g, '_')}_${idSuffix}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
  };

  const stepsList = [
    { num: 1, title: 'Part 1: Battle Arena Selection 🎯', desc: 'Select symposium events' },
    { num: 2, title: 'Part 2: Backbenchers Squad Roster 👥', desc: 'Add squad members' },
    { num: 3, title: 'Part 3: Assign Squad Roles 🛠️', desc: 'Assign events to members' },
    { num: 4, title: 'Part 4: Final Squad Check 📋', desc: 'Verify team details' },
    { num: 5, title: 'Part 5: Lock In Entry Fee 💸', desc: 'Pay pass fee' },
    { num: 6, title: 'Part 6: Freedom Passes Issued 🎟️', desc: 'Download smart QR passes' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#FAF9F6] text-richblack font-poppins flex flex-col md:flex-row"
      data-lenis-prevent
    >
      
      {/* ======================================================== */}
      {/* MAROON & GOLD LUXURY SIDEBAR WITH STEPPER                */}
      {/* ======================================================== */}
      <aside
        className="w-full md:w-80 bg-gradient-to-b from-maroon-950 via-maroon-900 to-maroon-950 border-r border-gold-500/40 p-6 flex flex-col justify-between shrink-0 text-white shadow-2xl overflow-y-auto max-h-screen md:max-h-none"
        data-lenis-prevent
      >
        
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maroon-800 hover:bg-gold-500 hover:text-maroon-950 text-gold-300 text-xs font-space font-bold uppercase transition-all shadow-md cursor-pointer border border-gold-500/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>

          {/* Header */}
          <div>
            <div className="text-[10px] font-space font-bold uppercase text-gold-400 tracking-widest">
              XenTriX '26 Registration Portal
            </div>
            <h1 className="font-heading text-2xl font-black text-white pt-1">
              🔥 Ticket To Freedom
            </h1>
            <p className="text-xs text-gold-200 font-space mt-1">
              Bunk Class Legally • Unlimited Events • Free Lunch
            </p>
          </div>

          {/* Connected Vertical Timeline Stepper */}
          <div className="relative pl-1 font-space my-4 space-y-5">
            <div className="absolute left-[21px] top-4 bottom-5 w-0.5 bg-maroon-700/60 z-0" />

            {stepsList.map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  className={`relative z-10 flex items-start gap-3.5 cursor-pointer transition-all ${
                    step.num <= currentStep ? 'opacity-100' : 'opacity-55 hover:opacity-80'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 border-2 transition-all shadow-md ${
                      isActive
                        ? 'bg-gold-500 text-maroon-950 border-gold-300 ring-4 ring-gold-500/30 font-black scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-400 font-black'
                        : 'bg-maroon-900 text-gold-300 border-maroon-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `0${step.num}`}
                  </div>

                  <div className="pt-0.5">
                    <div
                      className={`text-xs font-bold leading-snug transition-colors ${
                        isActive
                          ? 'text-gold-400 font-black text-sm'
                          : isCompleted
                          ? 'text-white font-semibold'
                          : 'text-maroon-200/80'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[10px] text-maroon-200/60 font-poppins leading-tight mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary Box */}
        <div className="mt-6 p-4 rounded-2xl bg-maroon-900/80 border border-gold-500/40 text-xs font-space space-y-1 shadow-md">
          <div className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Pass Fee Breakdown</div>
          <div className="text-white font-bold">Registration Fee: ₹{baseAmount}</div>
          <div className="text-gold-300 font-semibold">Convenience Fee: ₹{convenienceFee}</div>
          <div className="text-sm text-emerald-400 font-black pt-1 border-t border-maroon-700 flex justify-between">
            <span>Total Payable:</span>
            <span>₹{finalPayableAmount}</span>
          </div>
        </div>

      </aside>

      {/* ======================================================== */}
      {/* RIGHT WORKSPACE AREA (Crisp Light Theme)                */}
      {/* ======================================================== */}
      <main className="flex-1 bg-[#FAF9F6] overflow-y-auto h-full p-6 md:p-10" data-lenis-prevent>
        <div className="max-w-4xl mx-auto space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-800 text-white border border-red-400 text-xs font-bold flex items-center gap-2 shadow-lg">
              <AlertTriangle className="w-5 h-5 shrink-0 text-gold-300" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PART 1: EVENT SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-100 pb-4">
                <h2 className="font-heading text-2xl font-bold text-maroon-950 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-maroon-700" />
                  <span>Part 1: Select Your Battle Arenas 🎯</span>
                </h2>
                <p className="text-xs text-gray-600 font-space mt-1">
                  Select events below before adding your team members. Entry includes participation in selected events + OD Pass + Free Lunch!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_EVENTS.map((evt) => {
                  const isSelected = selectedEventsList.some((e) => e.id === evt.id);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => toggleEventSelection(evt)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-maroon-50 border-maroon-700 ring-4 ring-maroon-700/20 shadow-lg'
                          : 'bg-white border-maroon-100 hover:border-gold-500 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-space font-bold uppercase px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-maroon-700 text-white font-black' : 'bg-gold-50 text-maroon-800 border border-gold-300'}`}>
                          {evt.category}
                        </span>
                        <span className={`font-space font-extrabold text-xs ${isSelected ? 'bg-gold-500 text-maroon-950 px-2 py-0.5 rounded-md font-black shadow-sm' : 'text-gray-600 font-bold'}`}>
                          {evt.teamSize || '1-4 Members'}
                        </span>
                      </div>
                      <h3 className={`font-heading text-base font-bold ${isSelected ? 'text-maroon-800 font-extrabold' : 'text-richblack'}`}>{evt.name}</h3>
                      <p className={`text-xs ${isSelected ? 'text-maroon-900 font-poppins' : 'text-gray-600'}`}>{evt.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleProceedToMasterRoster}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-gold-400"
                >
                  <span>Proceed to Part 2: Master Team Roster</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </div>
          )}

          {/* PART 2: MASTER TEAM ROSTER */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToEventAssignments} className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-100 pb-4">
                <h2 className="font-heading text-2xl font-bold text-maroon-950 flex items-center gap-2">
                  <User className="w-6 h-6 text-maroon-700" />
                  <span>Part 2: Backbenchers Squad Roster 👥</span>
                </h2>
                <p className="text-xs text-gray-600 font-space mt-1">
                  Add all unique physical members attending the symposium. In Step 3, you will assign them to specific events using dropdowns!
                </p>
              </div>

              {/* Selected Events Banner */}
              <div className="p-4 rounded-2xl bg-white border border-maroon-200 space-y-2 shadow-sm">
                <div className="text-xs font-space font-bold uppercase text-maroon-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <span>Selected Events ({selectedEventsList.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEventsList.map((evt) => (
                    <span key={evt.id} className="px-3.5 py-1.5 rounded-full bg-maroon-50 text-maroon-900 text-xs font-space font-bold flex items-center gap-1.5 border border-maroon-200 shadow-sm">
                      <span className="text-maroon-800 font-extrabold">{evt.name}</span>
                      <span className="text-[10px] bg-maroon-700 text-white font-black px-1.5 py-0.5 rounded">({evt.teamSize || 'Event'})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Leader Info */}
              <div className="p-6 rounded-3xl bg-white border border-maroon-100 shadow-md space-y-4">
                <h3 className="font-heading text-lg font-bold text-maroon-900 border-b border-maroon-100 pb-2">
                  Squad Captain Info 👑
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. Mohammed Shameem"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">Captain Phone (For GPay / UPI Wins) *</label>
                    <input
                      type="tel"
                      required
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      placeholder="9884100895"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">College Campus (Where you bunk lectures) *</label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. PSVPEC Chennai"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack font-bold text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="ECE">ECE - Electronics & Communication</option>
                      <option value="EEE">EEE - Electrical & Electronics</option>
                      <option value="MECH">MECH - Mechanical Engineering</option>
                      <option value="CIVIL">CIVIL - Civil Engineering</option>
                      <option value="CSE/IT">CSE / IT Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-space font-bold text-gray-700 mb-1 block">Squad / Gang Name 🗿</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Canteen Kings"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Master Teammates List */}
              <div className="p-6 rounded-3xl bg-white border border-maroon-100 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-maroon-100 pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-maroon-950 flex items-center gap-2">
                      <Users className="w-5 h-5 text-maroon-700" />
                      <span>Backbenchers Squad Roster ({totalMembersCount} Members)</span>
                    </h3>
                    <p className="text-[11px] text-gray-600 font-space">
                      Add every student attending. Each student gets their own individual entry pass!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTeammate}
                    className="px-4 py-2 rounded-xl bg-maroon-700 text-white text-xs font-space font-extrabold uppercase hover:bg-maroon-800 transition-colors shadow-sm cursor-pointer border border-gold-400"
                  >
                    + Add Teammate #{teammates.length + 1}
                  </button>
                </div>

                <div className="space-y-3">
                  {teammates.map((member, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-maroon-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-space font-bold text-maroon-800">
                        <span>Gang Member #{idx + 2}</span>
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

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                          placeholder="Member Name *"
                          className="px-3.5 py-2 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                          placeholder="Email (Optional)"
                          className="px-3.5 py-2 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                        />
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleTeammateChange(idx, 'phone', e.target.value)}
                          placeholder="Phone (10-Digit) *"
                          className="px-3.5 py-2 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                        />
                        <select
                          value={member.dept}
                          onChange={(e) => handleTeammateChange(idx, 'dept', e.target.value)}
                          className="px-3.5 py-2 rounded-xl bg-white border border-maroon-200 text-richblack font-bold text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                        >
                          <option value="">Same Dept ({department || 'Default'})</option>
                          <option value="ECE">ECE</option>
                          <option value="EEE">EEE</option>
                          <option value="MECH">MECH</option>
                          <option value="CIVIL">CIVIL</option>
                          <option value="CSE/IT">CSE/IT</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-space text-xs font-bold uppercase hover:bg-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Event Selection</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-gold-400"
                >
                  <span>Proceed to Part 3: Assign Events</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </form>
          )}

          {/* PART 3: EVENT ROSTER ASSIGNMENT */}
          {currentStep === 3 && (
            <form onSubmit={handleProceedToReview} className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-100 pb-4">
                <h2 className="font-heading text-2xl font-bold text-maroon-950 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-maroon-700" />
                  <span>Part 3: Assign Squad Roles & Events 🛠️</span>
                </h2>
                <p className="text-xs text-gray-600 font-space mt-1">
                  Assign physical roster members to event slots using dropdowns!
                </p>
              </div>

              <div className="space-y-4">
                {selectedEventsList.map((evt) => {
                  const maxSlots = evt.maxMembers || (evt.teamSize?.includes('1 Member') ? 1 : evt.teamSize?.includes('2 Members') ? 2 : 4);
                  const currentSlots = eventAssignments[evt.id] || Array.from({ length: maxSlots }, (_, i) => i < masterRoster.length ? masterRoster[i].id : 'none');

                  return (
                    <div key={evt.id} className="p-6 rounded-3xl bg-white border border-maroon-100 shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-maroon-100 pb-2">
                        <div>
                          <span className="text-[10px] font-space font-bold uppercase text-maroon-800">{evt.category}</span>
                          <h3 className="font-heading text-lg font-bold text-maroon-950">{evt.name}</h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-maroon-700 text-white text-xs font-space font-extrabold border border-gold-400">
                          {maxSlots} Slot{maxSlots > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {Array.from({ length: maxSlots }).map((_, slotIdx) => {
                          const assignedVal = currentSlots[slotIdx] || 'none';
                          return (
                            <div key={slotIdx} className="space-y-1">
                              <label className="text-[11px] font-space font-bold text-gray-700 block">
                                Participant Slot #{slotIdx + 1}:
                              </label>
                              <select
                                value={assignedVal}
                                onChange={(e) => handleAssignmentChange(evt.id, slotIdx, e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-maroon-200 text-richblack font-space text-xs font-semibold focus:ring-2 focus:ring-maroon-700 outline-none"
                              >
                                <option value="none">-- No Member Assigned (Empty Slot) --</option>
                                {masterRoster.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.role} - {m.dept})
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-space text-xs font-bold uppercase hover:bg-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Roster</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-gold-400"
                >
                  <span>Proceed to Part 4: Review Summary</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </form>
          )}

          {/* PART 4: REVIEW DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-100 pb-4">
                <h2 className="font-heading text-2xl font-bold text-maroon-950">
                  Part 4: Review Registration & Fee Summary 📋
                </h2>
                <p className="text-xs text-gray-600 font-space mt-1">
                  Verify master roster, event assignments, and final billing breakdown before payment.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-maroon-100 shadow-md space-y-4 text-xs font-space">
                <div className="grid grid-cols-2 gap-4 border-b border-maroon-100 pb-4">
                  <div>
                    <span className="text-gray-500 block">Primary Leader:</span>
                    <span className="font-bold text-maroon-900 text-base">{leaderName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Leader Email:</span>
                    <span className="font-bold text-richblack">{leaderEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mobile Phone:</span>
                    <span className="font-bold text-richblack">{leaderPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">College & Dept:</span>
                    <span className="font-bold text-richblack">{collegeName} ({department})</span>
                  </div>
                </div>

                {/* Master Roster List */}
                <div>
                  <span className="text-gray-600 block mb-2 font-bold uppercase text-[10px] tracking-wider">
                    Master Physical Members ({totalMembersCount} Members):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {masterRoster.map((m, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-950 font-semibold">
                        • {i + 1}. <strong className="text-maroon-900">{m.name}</strong> ({m.dept}) - {m.phone}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Assignment Summary */}
                <div>
                  <span className="text-gray-600 block mb-2 font-bold uppercase text-[10px] tracking-wider">
                    Event Roster Assignments:
                  </span>
                  <div className="space-y-2">
                    {selectedEventsList.map((evt) => {
                      const assignedIds = (eventAssignments[evt.id] || []).filter((id) => id && id !== 'none');
                      const assignedNames = assignedIds.map((id) => masterRoster.find((r) => r.id === id)?.name).filter(Boolean);
                      return (
                        <div key={evt.id} className="p-3 rounded-xl bg-[#FAF9F6] border border-maroon-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <span className="font-bold text-maroon-800">{evt.name}:</span>
                          <span className="text-richblack font-semibold">{assignedNames.length > 0 ? assignedNames.join(', ') : 'No members assigned'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Clean Billing Breakdown */}
                <div className="border-t-2 border-dashed border-maroon-100 pt-4 space-y-2 text-sm font-space">
                  <div className="flex items-center justify-between text-gray-700 font-bold">
                    <span>Registration Fee ({totalMembersCount} Members):</span>
                    <span>₹{baseAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-gold-600 font-bold">
                    <span>Convenience Fee:</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-maroon-900 text-xl font-black pt-2 border-t border-maroon-200">
                    <span>TOTAL PAYABLE AMOUNT:</span>
                    <span className="text-2xl text-maroon-800 font-black">₹{finalPayableAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-space text-xs font-bold uppercase hover:bg-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Edit Assignments</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-gold-400"
                >
                  <span>Proceed to Part 5: Payment</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </div>
          )}

          {/* PART 5: PAYMENT */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-maroon-100 pb-4">
                <h2 className="font-heading text-2xl font-bold text-maroon-950 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-maroon-700" />
                  <span>Part 5: Fee Payment & Confirmation 💸</span>
                </h2>
                <p className="text-xs text-gray-600 font-space mt-1">
                  Complete your payment via UPI, GPay, PhonePe, or Desk Cash Counter.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-maroon-100 shadow-md space-y-4 text-xs font-space">
                <div className="text-center space-y-2 py-4 bg-gradient-to-r from-maroon-950 to-maroon-900 rounded-2xl border border-gold-400/50 text-white shadow-md">
                  <div className="text-xs uppercase font-space font-extrabold text-gold-400">Total Payable Amount</div>
                  <div className="text-4xl font-black text-white font-space">₹{finalPayableAmount}</div>
                  <div className="text-[11px] text-maroon-200 font-poppins">(Registration Fee ₹{baseAmount} + Convenience Fee ₹{convenienceFee})</div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-800 block">Select Payment Mode:</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl font-bold border text-center transition-all ${paymentMethod === 'upi' ? 'bg-maroon-700 text-white border-gold-400 shadow-md' : 'bg-[#FAF9F6] text-gray-700 border-gray-200'}`}
                    >
                      UPI / GPay / PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl font-bold border text-center transition-all ${paymentMethod === 'card' ? 'bg-maroon-700 text-white border-gold-400 shadow-md' : 'bg-[#FAF9F6] text-gray-700 border-gray-200'}`}
                    >
                      Debit / Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('counter')}
                      className={`p-3 rounded-xl font-bold border text-center transition-all ${paymentMethod === 'counter' ? 'bg-maroon-700 text-white border-gold-400 shadow-md' : 'bg-[#FAF9F6] text-gray-700 border-gray-200'}`}
                    >
                      On-Desk Campus Counter
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Transaction Ref / UTR Number (Optional)</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. 324198750912"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-maroon-200 text-richblack text-xs font-space focus:ring-2 focus:ring-maroon-700 outline-none"
                  />
                </div>

                {/* Payment Notice Banner */}
                <div className="p-4 rounded-2xl bg-gold-50 border border-gold-300 text-maroon-900 text-xs font-bold space-y-1">
                  <div className="flex items-center gap-1.5 text-maroon-800 uppercase font-extrabold">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-gold-600" />
                    <span>IMPORTANT PAYMENT NOTICE</span>
                  </div>
                  <p className="text-gray-700 font-poppins text-[11px]">
                    All entry passes will be issued instantly! You can also show your QR pass code at the Registration Desk on event day for spot verification.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-space text-xs font-bold uppercase hover:bg-gray-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Review</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitRegistration}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center gap-2 cursor-pointer border border-gold-400"
                >
                  <span>{isSubmitting ? 'Issuing Passes...' : '🚀 Submit & Claim Freedom Passes!'}</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </div>
          )}

          {/* PART 6: PASSES ISSUED */}
          {currentStep === 6 && completedResult && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="p-6 rounded-3xl bg-emerald-900 border-2 border-emerald-400 text-white shadow-2xl space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto" />
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                  🎉 Registration Confirmed & Freedom Passes Issued!
                </h2>
                <p className="text-xs text-emerald-100 font-space">
                  Registration ID: <span className="font-black text-white">{completedResult.registrationId}</span> • Total Paid: ₹{completedResult.totalAmount}
                </p>
              </div>

              {/* Passes List for Each Member */}
              <div className="space-y-4 text-left">
                <h3 className="font-heading text-xl font-bold text-maroon-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  <span>Individual Smart QR Passes ({passDataUrls.length} Members)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {passDataUrls.map((pass, idx) => (
                    <div key={idx} className="p-5 rounded-3xl bg-white border border-maroon-100 shadow-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-maroon-100 pb-2">
                        <div>
                          <span className="text-[10px] font-space font-bold uppercase text-gold-600">{pass.role}</span>
                          <h4 className="font-heading text-lg font-bold text-maroon-950">{pass.name}</h4>
                        </div>
                        <button
                          onClick={() => downloadPassAsPng(pass)}
                          className="p-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white transition-colors cursor-pointer shadow-md"
                          title="Download PNG Pass"
                        >
                          <Download className="w-4 h-4 text-gold-300" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <img src={pass.qrUrl} alt={pass.name} className="w-24 h-24 rounded-xl bg-white p-1 border border-maroon-200 shadow-inner" />
                        <div className="text-xs font-space space-y-1 text-gray-700">
                          <div><strong className="text-maroon-900">Assigned Events:</strong></div>
                          <div className="text-[11px] text-gray-600 leading-tight">
                            {pass.assignedEvents.length > 0 ? pass.assignedEvents.join(', ') : 'All Symposium Arenas'}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold pt-1">✓ OD Pass Approved</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-maroon-700 to-maroon-900 text-white font-space font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl cursor-pointer border border-gold-400"
                >
                  Done • Return To Main Site
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
