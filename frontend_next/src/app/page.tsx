'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [homeStock, setHomeStock] = useState(0);
  const [time, setTime] = useState('');
  const [homeMaxStock, setHomeMaxStock] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadStock = async () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const { data, error } = await supabase
        .from('jadwal_distribusi')
        .select('stok_paket_sisa, stok_paket_total, created_at')
        .eq('tanggal_distribusi', todayStr)
        .gt('stok_paket_sisa', 0)
        .order('tanggal_distribusi', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setHomeStock(data.stok_paket_sisa || 0);
        setHomeMaxStock(data.stok_paket_total || 0);

        if (data.created_at) {
          const d = new Date(data.created_at);
          const h = String(d.getHours()).padStart(2, "0");
          const m = String(d.getMinutes()).padStart(2, "0");
          const s = String(d.getSeconds()).padStart(2, "0");
          setTime(`${h}:${m}:${s} WIB`);
        }
      } else {
        setHomeStock(0);
        setHomeMaxStock(0);
        setTime('--:--:-- WIB');
      }
    };

    const fetchEvents = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'Aktif')
        .gte('tanggal', today)
        .order('tanggal', { ascending: true })
        .limit(3);
      if (!error && data) {
        setEvents(data);
      }
    };

    loadStock();
    fetchEvents();
  }, []);

  const percent = homeMaxStock > 0 ? Math.round((homeStock / homeMaxStock) * 100) : 0;

  return (
    <>
      <section
        className="py-[60px] min-h-[500px] md:min-h-[600px] flex flex-col justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `linear-gradient(rgba(6,36,77,.86),rgba(6,36,77,.88)), url('/assets/homepage_tetada.jpg')` }}
      >
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[40px] items-center">
          <div className="text-white">
            <span className="inline-block py-[10px] px-[16px] bg-white/10 rounded-full text-[12px] mb-[20px]">
              SENTINEL RESPONSE SYSTEM
            </span>
            <h1 className="text-[42px] md:text-[56px] leading-[1.1] mb-[18px] font-bold">
              Solusi Tanggap <br />
              <span>Darurat & Layanan</span><br />
              Mahasiswa IPB
            </h1>
            <p className="text-[18px] leading-[1.7] mb-[28px] text-[#dbe7f4]">
              Menjamin keamanan, kesehatan, dan kesejahteraan komunitas kampus
              melalui sistem pemantauan real-time dan respon cepat terintegrasi.
            </p>
            <div className="flex gap-[14px] flex-wrap">
              <Link
                href="/contact#laporan-darurat"
                className="inline-block py-[15px] px-[22px] bg-white text-[#06244d] border-none rounded-[12px] font-bold cursor-pointer hover:bg-gray-100 transition"
              >
                Laporkan Insiden
              </Link>
            </div>
          </div>

          <div className="w-full lg:max-w-[430px] aspect-square ml-auto p-[26px] md:p-[34px] rounded-[22px] md:rounded-[28px] relative overflow-hidden text-white border border-white/10 shadow-[0_22px_48px_rgba(0,0,0,.18),0_8px_18px_rgba(0,0,0,.08),inset_0_1px_0_rgba(255,255,255,.08)] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `linear-gradient(rgba(8,25,55,.06), rgba(8,25,55,.08)), url('/assets/buah_susu.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/5 z-0 pointer-events-none rounded-inherit"></div>
            <div className="absolute left-[18px] right-[18px] bottom-[18px] md:left-[24px] md:right-[24px] md:bottom-[24px] h-[64px] md:h-[76px] rounded-[18px] bg-white/5 backdrop-blur-[14px] z-10 pointer-events-none"></div>
            <div className="relative z-20 h-full flex flex-col justify-between">
              <div className="rounded-[16px] bg-black/[0.12] backdrop-blur-[6px] px-[16px] pt-[16px] pb-[12px] -mx-[4px]">
                <h5 className="text-[15px] font-bold tracking-[1.4px] uppercase opacity-95 mb-[14px]">
                  TOTAL KETERSEDIAAN HARI INI
                </h5>
                <div className="text-[62px] md:text-[92px] leading-[0.95] font-extrabold tracking-[-2px] mb-[18px] drop-shadow-[0_10px_24px_rgba(0,0,0,.22)]">
                  <span>{homeStock}</span> / {homeMaxStock}
                </div>
                <p className="text-[16px] leading-[1.5] opacity-95 mb-[4px]">
                  Paket tersisa di semua titik distribusi.
                </p>
              </div>

              <div className="mt-auto">
                <div className="h-[12px] rounded-full overflow-hidden bg-white/15 mb-[20px]">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] shadow-[0_0_14px_rgba(74,222,128,.35)] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></span>
                </div>
                <div className="flex justify-between items-center px-[10px] text-[14px]">
                  <small>TERAKHIR UPDATE</small>
                  <strong>{time}</strong>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="py-[100px] bg-[#fcfdfe]">
        <div className="w-[92%] max-w-[1216px] mx-auto">
          <div className="flex justify-between items-end flex-wrap gap-[20px] mb-[48px]">
            <div>
              <span className="text-[#004aad] text-[12px] font-black tracking-[3px] uppercase mb-[12px] block">LATEST UPDATES</span>
              <h2 className="text-[36px] font-bold text-[#06244d] leading-none">Agenda & Workshop</h2>
            </div>
            <a href="/events" className="group flex items-center gap-[8px] text-[#004aad] font-bold text-[14px] hover:translate-x-1 transition-transform">
              Lihat Semua Event
              <span className="w-[24px] h-[24px] rounded-full bg-[#004aad]/5 flex items-center justify-center group-hover:bg-[#004aad] group-hover:text-white transition-all">
                →
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] items-stretch">
            {events.length === 0 ? (
              <div className="col-span-full text-center text-[#94a3b8] py-20 bg-white rounded-[32px] border-2 border-dashed border-[#f1f5f9]">
                <i className="fa-regular fa-calendar-xmark text-[40px] mb-[16px] opacity-20"></i>
                <p className="font-medium">Belum ada event yang tersedia saat ini.</p>
              </div>
            ) : (
              events.map((event) => {
                const getBadgeConfig = (status: string, openUntil?: string) => {
                  const today = new Date().toISOString().split('T')[0];
                  if (openUntil && today > openUntil) {
                    return { badge: 'REGISTRATION CLOSED', badgeClass: 'bg-red-100/90 text-red-700', isClosed: true };
                  }

                  switch (status) {
                    case 'Aktif':
                      return { badge: 'OPEN REGISTRATION', badgeClass: 'bg-[#dcfce7]/90 text-[#166534]', isClosed: false };
                    case 'Akan Datang':
                      return { badge: 'COMING SOON', badgeClass: 'bg-[#e0f2fe]/90 text-[#0369a1]', isClosed: false };
                    case 'Selesai':
                    default:
                      return { badge: 'FINISHED', badgeClass: 'bg-[#ffe2e2]/90 text-[#b91c1c]', isClosed: true };
                  }
                };
                const config = getBadgeConfig(event.status, event.open_until);

                return (
                  <div
                    key={event.id}
                    className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:-translate-y-3 flex flex-col"
                  >
                    <div
                      className="h-[240px] w-full bg-cover bg-center shrink-0 transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: event.gambar ? `url('${event.gambar}')` : 'none' }}
                    >
                      {!event.gambar && (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#06244d] to-[#173d8f]">
                          <i className="fa-regular fa-calendar text-white text-[48px] opacity-20"></i>
                        </div>
                      )}
                      <div className="absolute top-[20px] left-[20px] z-10">
                        <span className={`px-[12px] py-[6px] rounded-[10px] text-[10px] font-extrabold tracking-[1px] uppercase shadow-lg backdrop-blur-md ${config.badgeClass}`}>
                          {config.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-[28px] flex flex-col flex-grow relative z-10 bg-white">
                      <div className="flex items-center gap-[6px] text-[#94a3b8] text-[11px] font-bold mb-[14px] uppercase tracking-[1.5px]">
                        {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>

                      <h3 className="text-[20px] font-bold text-[#06244d] leading-[1.4] mb-[12px] group-hover:text-[#004aad] transition-colors">
                        {event.nama_event}
                      </h3>

                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                        <div className="overflow-hidden">
                          <div className="pt-[16px] border-t border-[#f1f5f9] mt-[4px]">
                            <div className="flex flex-col gap-[10px] mb-[20px]">
                              <div className="flex items-center gap-[10px] text-[#64748b] text-[13px]">
                                <div className="w-[32px] h-[32px] rounded-full bg-[#f8fafc] flex items-center justify-center text-[#004aad]">
                                  <i className="fa-regular fa-clock text-[14px]"></i>
                                </div>
                                <span className="font-semibold">{event.waktu ? event.waktu.slice(0, 5) : '00:00'} WIB</span>
                              </div>
                              <div className="flex items-center gap-[10px] text-[#64748b] text-[13px]">
                                <div className="w-[32px] h-[32px] rounded-full bg-[#f8fafc] flex items-center justify-center text-[#004aad]">
                                  <i className="fa-solid fa-location-dot text-[14px]"></i>
                                </div>
                                <span className="line-clamp-1 font-semibold">{event.lokasi || 'TBA'}</span>
                              </div>
                            </div>

                            <p className="text-[#5e6f84] text-[14px] leading-[1.7] mb-[24px]">
                              {event.deskripsi || 'Detail kegiatan akan segera diperbarui.'}
                            </p>
                            {event.link_pendaftaran && !config.isClosed && (
                              <a
                                href={event.link_pendaftaran}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-[12px] py-[16px] px-[20px] bg-[#004aad] text-white rounded-[16px] font-bold text-[14px] hover:bg-[#06244d] shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1"
                              >
                                Daftar Sekarang <i className="fa-solid fa-arrow-right text-[12px]"></i>
                              </a>
                            )}
                            {config.isClosed && event.status !== 'Selesai' && (
                              <div className="w-full py-[16px] px-[20px] bg-gray-100 text-gray-500 rounded-[16px] font-bold text-[14px] text-center border border-gray-200">
                                Pendaftaran Ditutup
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-[70px]">
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <div className="bg-[#06244d] text-white p-[40px] rounded-[24px] text-center flex flex-col items-center justify-center">
            <h2 className="text-[28px] font-bold mb-[15px]">Temukan Situasi Berbahaya?</h2>
            <p className="max-w-[600px] mx-auto text-[#b9c8d8]">
              Keamanan kampus adalah tanggung jawab kita bersama.
              Laporkan kerusakan fasilitas, kecelakaan, atau perilaku mencurigakan.
            </p>
            <div className="flex justify-center items-center gap-[14px] flex-wrap mt-[22px]">
              <Link
                href="/contact"
                className="py-[15px] px-[20px] bg-[#dc2626] text-white border-none rounded-[12px] font-bold cursor-pointer hover:bg-red-700 transition flex items-center gap-2"
              >
                <span>✚</span>
                <span>DARURAT SEKARANG</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}