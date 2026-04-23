'use client';

import { useState, useEffect } from 'react';

export default function Events() {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => {
      setShowCards(true);
    }, 100);
  }, []);

  const eventData = [
    {
      id: 1,
      image: 'bg-[url(/assets/event1.jpg)]',
      badge: 'OPEN REGISTRATION',
      badgeClass: 'bg-[#d8fff0] text-[#15803d]',
      date: 'OCT 24, 2024',
      title: 'IPB Blood Drive: Campus Sentinel',
      desc: "Contribute to the university's emergency blood reserve. Professional medical staff on-site at...",
      btnText: 'Daftar Sekarang',
      btnClass: 'bg-[#06244d] text-white hover:bg-[#041b39]',
      onClick: () => alert('Pendaftaran event dibuka.')
    },
    {
      id: 2,
      image: 'bg-[url(/assets/event2.jpg)]',
      badge: 'COMING SOON',
      badgeClass: 'bg-[#ececec] text-[#666]',
      date: 'NOV 05, 2024',
      title: 'Advanced First Aid Training',
      desc: "Level II medical emergency training for student volunteers. Certification provided by the Red...",
      btnText: 'Not Yet Open',
      btnClass: 'bg-[#ececf0] text-[#7f7f88] cursor-not-allowed',
      onClick: () => {}
    },
    {
      id: 3,
      image: 'bg-[url(/assets/event3.jpg)]',
      badge: 'FULL',
      badgeClass: 'bg-[#ffe2e2] text-[#b91c1c]',
      date: 'OCT 18, 2024',
      title: 'Disaster Response Simulation',
      desc: "Large scale coordination drill with local fire and rescue departments across IPB main campus...",
      btnText: 'Quota Full',
      btnClass: 'bg-[#ececf0] text-[#7f7f88] cursor-not-allowed',
      onClick: () => {}
    }
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-[55px] pb-[50px] text-center bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: `linear-gradient(rgba(6,36,77,.82), rgba(6,36,77,.88)), url('/assets/event_tetada.jpg')` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.05),transparent_60%)] pointer-events-none"></div>
        <div className="w-[92%] max-w-[1600px] mx-auto relative z-10">
          <h1 className="text-[38px] md:text-[56px] text-white font-bold mb-[12px]">📅 Event & Kegiatan</h1>
          <p className="text-[18px] text-[#d2e0ef]">
            Informasi event terbaru yang diselenggarakan oleh TETADA IPB
          </p>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="pt-[70px] pb-[90px]">
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 min-[1100px]:grid-cols-3 gap-[34px]">
          
          {eventData.map((event, idx) => (
            <div 
              key={event.id}
              className={`bg-white rounded-[26px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,.10)] transition-all duration-700 hover:-translate-y-[8px] hover:shadow-[0_20px_35px_rgba(0,0,0,.15)] ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40px]'}`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              
              <div className={`h-[220px] md:h-[280px] bg-cover bg-center relative ${event.image}`}>
                <span className={`absolute top-[14px] left-[14px] px-[14px] py-[8px] rounded-full text-[12px] font-bold tracking-[1px] ${event.badgeClass}`}>
                  {event.badge}
                </span>
              </div>
              
              <div className="p-[26px]">
                <div className="text-[14px] font-bold text-[#5d7a98] mb-[18px]">
                  <i className="fa-regular fa-calendar mr-[6px]"></i>
                  {event.date}
                </div>
                
                <h2 className="text-[24px] font-bold leading-[1.25] mb-[16px] min-h-[66px]">
                  {event.title}
                </h2>
                
                <p className="text-[16px] leading-[1.7] text-[#5e6f84] mb-[28px] min-h-[92px]">
                  {event.desc}
                </p>
                
                <button 
                  className={`w-full h-[56px] border-none rounded-[16px] text-[18px] font-bold transition ${event.btnClass}`}
                  onClick={event.onClick}
                >
                  {event.btnText}
                </button>
              </div>

            </div>
          ))}

        </div>
      </section>
    </>
  );
}
