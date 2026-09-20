import React from 'react';
import { Phone, MapPin, UserCheck, Sparkles, Navigation, Award } from 'lucide-react';

export const Contact: React.FC = () => {
  const teamOrganizers = [
    {
      role: 'Event Convener',
      name: 'Dr K K Senthil Kumar',
      designation: 'Professor / Vice Principal',
      phone: '9789832134'
    },
    {
      role: 'Event Co-ordinator',
      name: 'Ms Shalini M',
      designation: 'Assistant Professor / ECE',
      phone: '7358148482'
    },
    {
      role: 'Event Co-ordinator',
      name: 'Ms Presilla Vasanthini K',
      designation: 'Assistant Professor / EEE',
      phone: '9789021793'
    }
  ];

  const studentCoordinators = [
    { name: 'Mohammed Shameem S', role: 'Student Chair Coordinator', phone: '7305794294' },
    { name: 'Vasiharan B', role: 'Student Coordinator', phone: '70105 71781' },
    { name: 'Sivaram S', role: 'Student Coordinator', phone: '80987 77032' },
    { name: 'Surhendhaar V', role: 'Student Coordinator', phone: '89030 73373' },
    { name: 'Shriram K', role: 'Student Coordinator', phone: '72994 94206' }
  ];

  return (
    <section id="contact" className="py-20 bg-transparent text-white relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#3B82F6]/40 text-[#3B82F6] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Connect & Support</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Organizing Team & Campus Location
          </h2>
          <p className="text-sm text-gray-200 font-poppins">
            Reach out to our conveners, faculty coordinators, and student team for event guidance or support.
          </p>
        </div>

        {/* 1. TEAM ORGANIZER SECTION */}
        <div className="space-y-4">
          <h3 className="font-heading text-2xl font-bold text-white flex items-center justify-center gap-2 text-center">
            <Award className="w-6 h-6 text-[#3B82F6]" />
            <span>Faculty Organizing Team</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamOrganizers.map((org) => (
              <div
                key={org.name}
                className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#3B82F6] flex flex-col items-center justify-between text-center space-y-4 transition-all hover:shadow-xl"
              >
                <div className="space-y-2 w-full">
                  <div className="text-xs uppercase font-space font-extrabold text-[#3B82F6] tracking-wider">
                    {org.role}
                  </div>
                  <h4 className="font-heading text-xl font-black text-white">
                    {org.name}
                  </h4>
                  <p className="font-space text-xs font-bold text-gray-200 tracking-wide">
                    {org.designation}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/15 w-full flex items-center justify-center">
                  <a
                    href={`tel:${org.phone}`}
                    className="inline-flex items-center gap-2 text-xs font-space font-extrabold text-[#3B82F6] hover:underline transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>+91 {org.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. STUDENT COORDINATORS SECTION */}
        <div className="space-y-4 pt-4">
          <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#3B82F6]" />
            <span>Student Coordinators</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {studentCoordinators.map((coord, idx) => (
              <div
                key={coord.name}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#3B82F6] transition-all duration-300 flex flex-col justify-between shadow-md"
              >
                <div>
                  <span className="text-[10px] font-space font-bold uppercase tracking-wider text-[#3B82F6] mb-1 block">
                    COORDINATOR #0{idx + 1}
                  </span>
                  <h4 className="font-heading text-base font-bold text-white mb-0.5 leading-tight">
                    {coord.name}
                  </h4>
                  <p className="text-xs text-gray-200 font-poppins mb-3">
                    {coord.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-space font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <a href={`tel:${coord.phone.replace(/\s+/g, '')}`} className="hover:underline text-[#3B82F6]">
                      +91 {coord.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. GOOGLE MAPS & CAMPUS LOCATION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/15 pb-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#3B82F6]" />
                <span>Campus Location & Venue Map</span>
              </h3>
              <p className="text-xs text-gray-200 font-space mt-1">
                Prince Shri Venkateshwara Padmavathy Engineering College (Ponmar, Chennai)
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Prince+Shri+Venkateshwara+Padmavathy+Engineering+College"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#3B82F6] hover:bg-blue-600 text-white font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>Get Directions</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Embedded Google Maps iFrame */}
            <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/20 shadow-inner relative bg-gray-900">
              <iframe
                title="PSVPEC College Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.7891234567!2d80.1451!3d12.8532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52599999999999%3A0x9999999999999999!2sPrince%20Shri%20Venkateshwara%20Padmavathy%20Engineering+College!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-125"
              ></iframe>
            </div>

            {/* Address & Direct Call Support Numbers */}
            <div className="lg:col-span-5 space-y-6 font-poppins">
              
              <div className="space-y-2">
                <div className="text-xs font-space font-bold text-[#3B82F6] uppercase tracking-widest">
                  OFFICIAL CAMPUS ADDRESS
                </div>
                <div className="font-heading text-lg font-bold text-white leading-snug">
                  Prince Shri Venkateshwara Padmavathy Engineering College
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-space">
                  Medavakkam - Mambakkam Main Road, Ponmar,<br />
                  Chennai, Tamil Nadu - 600127.
                </p>
              </div>

              {/* Direct Call Support Numbers */}
              <div className="space-y-3 pt-4 border-t border-white/15">
                <div className="text-xs font-space font-bold text-gray-200 uppercase tracking-wider">
                  DIRECT CALL SUPPORT
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-space text-xs font-bold">
                  <a
                    href="tel:7305794294"
                    className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#3B82F6] hover:text-white transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-300 uppercase">Call Support #1</div>
                      <div>+91 73057 94294</div>
                    </div>
                  </a>

                  <a
                    href="tel:7010571781"
                    className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-[#3B82F6] hover:text-white transition-all flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-300 uppercase">Call Support #2</div>
                      <div>+91 70105 71781</div>
                    </div>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
