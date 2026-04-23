'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [homeStock, setHomeStock] = useState(150);
  const [time, setTime] = useState('');
  const homeMaxStock = 200;

  useEffect(() => {
    // Clock
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} WIB`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Fetch Stock
    const loadStock = async () => {
      const { data, error } = await supabase
        .from("stok_buah_susu")
        .select("*")
        .limit(1)
        .single();
      
      if (!error && data) {
        setHomeStock(data.stock);
      }
    };
    loadStock();

    return () => clearInterval(interval);
  }, []);

  const percent = Math.round((homeStock / homeMaxStock) * 100);

  return (
    <>
      {/* HERO SECTION */}
      <section 
        className="py-[80px] min-h-[calc(100vh-100px)] flex flex-col justify-center bg-cover bg-center bg-no-repeat relative"
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
              <button 
                onClick={() => alert('Form laporan insiden dibuka!')}
                className="py-[15px] px-[22px] bg-white text-[#06244d] border-none rounded-[12px] font-bold cursor-pointer hover:bg-gray-100 transition"
              >
                Laporkan Insiden
              </button>
              <button className="py-[15px] px-[22px] bg-transparent border-[2px] border-white text-white rounded-[12px] font-bold cursor-pointer hover:bg-white/10 transition">
                Layanan Mahasiswa
              </button>
            </div>
          </div>

          <div className="w-full lg:max-w-[430px] aspect-square ml-auto p-[26px] md:p-[34px] rounded-[22px] md:rounded-[28px] relative overflow-hidden text-white border border-white/10 shadow-[0_22px_48px_rgba(0,0,0,.18),0_8px_18px_rgba(0,0,0,.08),inset_0_1px_0_rgba(255,255,255,.08)] bg-cover bg-center bg-no-repeat"
               style={{ backgroundImage: `linear-gradient(rgba(8,25,55,.06), rgba(8,25,55,.08)), url('/assets/buah_susu.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/5 z-0 pointer-events-none rounded-inherit"></div>
            <div className="absolute left-[18px] right-[18px] bottom-[18px] md:left-[24px] md:right-[24px] md:bottom-[24px] h-[64px] md:h-[76px] rounded-[18px] bg-white/5 backdrop-blur-[14px] z-10 pointer-events-none"></div>
            
            <div className="relative z-20 h-full flex flex-col justify-between">
              <div>
                <h5 className="text-[15px] font-bold tracking-[1.4px] uppercase opacity-95 mb-[14px]">
                  TOTAL KETERSEDIAAN HARI INI
                </h5>
                <div className="text-[62px] md:text-[92px] leading-[0.95] font-extrabold tracking-[-2px] mb-[18px] drop-shadow-[0_10px_24px_rgba(0,0,0,.22)]">
                  <span>{homeStock}</span> / 200
                </div>
                <p className="text-[16px] leading-[1.5] opacity-95 mb-[22px]">
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

      {/* EVENTS SECTION */}
      <section className="py-[70px]">
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <div className="flex justify-between flex-wrap gap-[20px] mb-[28px]">
            <h2 className="text-[28px] font-bold">Agenda & Workshop</h2>
            <a href="#" className="text-[#004aad] font-semibold hover:underline">Lihat Semua Event →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="bg-white rounded-[20px] p-[24px] shadow-[0_10px_24px_rgba(0,0,0,.05)]">
              <div className="h-[170px] rounded-[16px] mb-[18px] bg-[#173d8f]"></div>
              <h3 className="mb-[10px] font-bold text-[18px]">First Aid Workshop</h3>
              <p className="text-[#666]">09:00 - 15:00 • Auditorium GWW</p>
            </div>
            <div className="bg-white rounded-[20px] p-[24px] shadow-[0_10px_24px_rgba(0,0,0,.05)]">
              <div className="h-[170px] rounded-[16px] mb-[18px] bg-[#0f766e]"></div>
              <h3 className="mb-[10px] font-bold text-[18px]">Seminar Mental Health</h3>
              <p className="text-[#666]">13:30 - 16:00 • Ruang CCR</p>
            </div>
            <div className="bg-white rounded-[20px] p-[24px] shadow-[0_10px_24px_rgba(0,0,0,.05)]">
              <div className="h-[170px] rounded-[16px] mb-[18px] bg-[#7c3aed]"></div>
              <h3 className="mb-[10px] font-bold text-[18px]">Konsultasi Beasiswa</h3>
              <p className="text-[#666]">08:00 - 12:00 • Student Center</p>
            </div>
          </div>
        </div>
      </section>

      {/* DANGER SECTION */}
      <section className="py-[70px]">
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <div className="bg-[#06244d] text-white p-[40px] rounded-[24px] text-center flex flex-col items-center justify-center">
            <h2 className="text-[28px] font-bold mb-[15px]">Temukan Situasi Berbahaya?</h2>
            <p className="max-w-[600px] mx-auto text-[#b9c8d8]">
              Keamanan kampus adalah tanggung jawab kita bersama.
              Laporkan kerusakan fasilitas, kecelakaan, atau perilaku mencurigakan.
            </p>
            <div className="flex justify-center items-center gap-[14px] flex-wrap mt-[22px]">
              <button 
                onClick={() => alert('Mode darurat diaktifkan!')}
                className="py-[15px] px-[20px] bg-[#dc2626] text-white border-none rounded-[12px] font-bold cursor-pointer hover:bg-red-700 transition flex items-center gap-2"
              >
                <span>✚</span>
                <span>DARURAT SEKARANG</span>
              </button>
              <button className="py-[15px] px-[20px] bg-white text-[#06244d] border-none rounded-[12px] font-bold cursor-pointer hover:bg-gray-100 transition">
                LAPORKAN INSIDEN NON-DARURAT
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
