'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Events() {
  const [showCards, setShowCards] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {

    setTimeout(() => {
      setShowCards(true);
    }, 100);

    const fetchEvents = async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 3);
      const cutoffStr = cutoffDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('tanggal', cutoffStr)
        .order('tanggal', { ascending: true });
      if (data) {
        setEvents(data);
      }
    };
    fetchEvents();
  }, []);

  const getBadgeConfig = (status: string, openUntil?: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (openUntil && today > openUntil) {
      return { badge: 'REGISTRATION CLOSED', badgeClass: 'bg-red-100 text-red-600', btnText: 'Pendaftaran Ditutup', btnClass: 'bg-[#ececf0] text-[#7f7f88] cursor-not-allowed', disabled: true };
    }

    switch(status) {
      case 'Aktif':
        return { badge: 'OPEN REGISTRATION', badgeClass: 'bg-[#d8fff0] text-[#15803d]', btnText: 'Daftar Sekarang', btnClass: 'bg-[#06244d] text-white hover:bg-[#041b39]', disabled: false };
      case 'Akan Datang':
        return { badge: 'COMING SOON', badgeClass: 'bg-[#e0f2fe] text-[#0369a1]', btnText: 'Belum Dibuka', btnClass: 'bg-[#ececf0] text-[#7f7f88] cursor-not-allowed', disabled: true };
      case 'Selesai':
      default:
        return { badge: 'FINISHED', badgeClass: 'bg-[#ffe2e2] text-[#b91c1c]', btnText: 'Event Selesai', btnClass: 'bg-[#ececf0] text-[#7f7f88] cursor-not-allowed', disabled: true };
    }
  };

  const handleRegister = (link: string, disabled: boolean) => {
    if (disabled) return;
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('Link pendaftaran belum tersedia.');
    }
  };

  return (
    <>

      <section className="pt-[70px] pb-[90px]">
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 min-[1100px]:grid-cols-3 gap-[34px]">
          {events.length === 0 && (
            <div className="col-span-full text-center text-[#5e6f84] py-10 font-medium">
              Belum ada event yang tersedia saat ini.
            </div>
          )}

          {events.map((event, idx) => {
            const config = getBadgeConfig(event.status, event.open_until);

            const imageStyle = event.gambar?.startsWith('bg-') ? {} : { backgroundImage: `url('${event.gambar || '/assets/event1.jpg'}')` };
            const imageClass = event.gambar?.startsWith('bg-') ? event.gambar : 'bg-cover bg-center';

            return (
              <div
                key={event.id}
                className={`bg-white rounded-[26px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,.10)] transition-all duration-700 hover:-translate-y-[8px] hover:shadow-[0_20px_35px_rgba(0,0,0,.15)] ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40px]'}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className={`h-[220px] md:h-[280px] relative ${imageClass}`} style={imageStyle}>
                  <span className={`absolute top-[14px] left-[14px] px-[14px] py-[8px] rounded-full text-[12px] font-bold tracking-[1px] ${config.badgeClass}`}>
                    {config.badge}
                  </span>
                </div>
                <div className="p-[26px]">
                  <div className="text-[14px] font-bold text-[#5d7a98] mb-[18px]">
                    <i className="fa-regular fa-calendar mr-[6px]"></i>
                    {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} {event.waktu ? `| ${event.waktu.slice(0, 5)}` : ''}
                  </div>
                  <h2 className="text-[24px] font-bold leading-[1.25] mb-[16px] min-h-[66px]">
                    {event.nama_event}
                  </h2>
                  <p className="text-[16px] leading-[1.7] text-[#5e6f84] mb-[28px] min-h-[92px]">
                    {event.deskripsi}
                  </p>
                  <button
                    className={`w-full h-[56px] border-none rounded-[16px] text-[18px] font-bold transition ${config.btnClass}`}
                    onClick={() => handleRegister(event.link_pendaftaran, config.disabled)}
                    disabled={config.disabled}
                  >
                    {config.btnText}
                  </button>
                </div>

              </div>
            );
          })}

        </div>
      </section>
    </>
  );
}