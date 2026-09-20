import React from 'react';
import { UserCheck, Shield, Phone, Sparkles, Award } from 'lucide-react';

export const Coordinators: React.FC = () => {
  const staffCoordinators = [
    {
      name: 'Dr. K K Senthil Kumar',
      role: 'Convener',
      phone: '+91 97898 32134',
    },
    {
      name: 'Ms. Shalini M',
      role: 'Co-ordinator',
      phone: '+91 73581 48482',
    },
    {
      name: 'Mr. Janakiraman',
      role: 'Co-ordinator',
      phone: '+91 99629 20928',
    },
  ];

  const techStudentCoordinators = [
    { name: 'Surhendhar', phone: '' },
    { name: 'Arul Kumaran', phone: '+91 63824 21766' },
    { name: 'Aadithya', phone: '+91 90316 98412' },
  ];

  const nonTechStudentCoordinators = [
    { name: 'Mohammed Shameem', phone: '' },
    { name: 'Sivaram', phone: '' },
    { name: 'Vasiharan', phone: '' },
  ];

  return (
    <section id="coordinators" className="py-20 bg-transparent text-richblack relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= STAFF COORDINATORS SECTION ================= */}
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs font-outfit font-extrabold uppercase tracking-widest shadow-sm">
              <Shield className="w-3.5 h-3.5 text-gold-500" />
              <span>Faculty Leadership</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900 tracking-tight">
              Staff Coordinators
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-maroon-700 to-gold-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {staffCoordinators.map((staff) => (
              <div
                key={staff.name}
                className="p-6 rounded-3xl bg-white border-2 border-maroon-100 hover:border-gold-500 shadow-md flex flex-col items-center justify-between text-center space-y-3 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 text-gold-300 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-outfit font-black uppercase text-gold-600 tracking-wider">
                    {staff.role}
                  </div>
                  <h3 className="font-heading text-base font-bold text-maroon-950">{staff.name}</h3>
                </div>
                <a
                  href={`tel:${staff.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-maroon-50 hover:bg-maroon-100 text-maroon-800 text-xs font-outfit font-bold transition-colors border border-maroon-200"
                >
                  <Phone className="w-3.5 h-3.5 text-maroon-700" />
                  <span>{staff.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ================= STUDENT COORDINATORS SECTION ================= */}
        <div className="space-y-8 pt-8 border-t border-maroon-100 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-50 border border-gold-300 text-maroon-800 text-xs font-outfit font-extrabold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Student Organizers</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-maroon-900 tracking-tight">
              Student Coordinators
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-maroon-700 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Technical Student Coordinators */}
            <div className="p-8 rounded-3xl bg-white border-2 border-maroon-100 shadow-xl space-y-6 text-left">
              <div className="flex items-center gap-3 border-b border-maroon-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-maroon-700 text-gold-300 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-maroon-950">Technical Coordinators</h3>
                  <p className="text-xs font-outfit text-gold-600 font-bold">Engineering & Competitions Lead</p>
                </div>
              </div>

              <div className="space-y-3">
                {techStudentCoordinators.map((student, idx) => (
                  <div
                    key={student.name}
                    className="p-3.5 rounded-2xl bg-maroon-50/50 border border-maroon-100 flex items-center justify-between gap-3 text-sm font-outfit font-extrabold text-richblack"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-maroon-700 text-gold-200 text-xs flex items-center justify-center font-bold">
                        0{idx + 1}
                      </span>
                      <span>{student.name}</span>
                    </div>
                    {student.phone && (
                      <a
                        href={`tel:${student.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 text-xs text-maroon-800 hover:underline font-bold bg-white px-3 py-1 rounded-full border border-maroon-200 shadow-sm"
                      >
                        <Phone className="w-3 h-3 text-maroon-700" />
                        <span>{student.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Technical Student Coordinators */}
            <div className="p-8 rounded-3xl bg-white border-2 border-gold-200 shadow-xl space-y-6 text-left">
              <div className="flex items-center gap-3 border-b border-gold-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500 text-maroon-950 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-maroon-950">Non-Technical Coordinators</h3>
                  <p className="text-xs font-outfit text-maroon-800 font-bold">Esports, Cultural & Fun Lead</p>
                </div>
              </div>

              <div className="space-y-3">
                {nonTechStudentCoordinators.map((student, idx) => (
                  <div
                    key={student.name}
                    className="p-3.5 rounded-2xl bg-gold-50/50 border border-gold-200 flex items-center justify-between gap-3 text-sm font-outfit font-extrabold text-richblack"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gold-500 text-maroon-950 text-xs flex items-center justify-center font-bold">
                        0{idx + 1}
                      </span>
                      <span>{student.name}</span>
                    </div>
                    {student.phone && (
                      <a
                        href={`tel:${student.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 text-xs text-maroon-800 hover:underline font-bold bg-white px-3 py-1 rounded-full border border-maroon-200 shadow-sm"
                      >
                        <Phone className="w-3 h-3 text-maroon-700" />
                        <span>{student.phone}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
