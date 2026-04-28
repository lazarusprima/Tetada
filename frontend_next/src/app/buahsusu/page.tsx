'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function BuahSusu() {
  const [time, setTime] = useState('');
  const [showTimeline, setShowTimeline] = useState(false);
  const timelineRef = useRef<HTMLElement>(null);
  
  const [buahStock, setBuahStock] = useState(0);
  const [buahMaxStock, setBuahMaxStock] = useState(0);
  const [schedule, setSchedule] = useState<any>(null);

  const percent = buahMaxStock > 0 ? Math.round((buahStock / buahMaxStock) * 100) : 0;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} WIB`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    const fetchStok = async () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const { data } = await supabase.from('jadwal_distribusi').select('stok_paket_sisa, stok_paket_total').eq('tanggal_distribusi', todayStr).gt('stok_paket_sisa', 0).order('tanggal_distribusi', { ascending: false }).limit(1).single();
      if (data) {
        setBuahStock(data.stok_paket_sisa || 0);
        setBuahMaxStock(data.stok_paket_total || 0);
      } else {
        setBuahStock(0);
        setBuahMaxStock(0);
      }
    };

    const fetchSchedule = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('jadwal_distribusi').select('*').gte('tanggal_distribusi', today).order('tanggal_distribusi', { ascending: true }).limit(1).single();
      if (data) {
        setSchedule(data);
      }
    };

    fetchStok();
    fetchSchedule();

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setShowTimeline(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      
      <section 
        className="py-[70px] text-center text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(rgba(6,36,77,.84),rgba(6,36,77,.88)), url('/assets/buah_susu.jpg')` }}
      >
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <h1 className="text-[42px] md:text-[62px] font-bold mb-[16px]">🍎 Distribusi Buah & Susu</h1>
          <p className="text-[20px] text-[#d7e8f8]">
            Informasi jadwal, lokasi, stok tersisa, dan alur pengambilan paket.
          </p>
        </div>
      </section>

      
      <section className="py-[50px]">
        <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[30px]">
          
          
          <div className="bg-[#082f5d] text-white p-[34px] rounded-[24px] shadow-[0_10px_24px_rgba(0,0,0,.05)]">
            <h5 className="font-bold mb-[10px]">STOK PAKET TERSISA</h5>
            <div className="text-[60px] md:text-[92px] font-extrabold leading-none mb-[10px]">
              {buahStock}
            </div>
            <p className="text-[#d7e8f8] mb-[18px]">dari {buahMaxStock} paket total</p>
            
            <div className="h-[12px] bg-white/15 rounded-full overflow-hidden mb-[18px]">
              <span 
                className="block h-full bg-[#22c55e] transition-all duration-1000"
                style={{ width: `${percent}%` }}
              ></span>
            </div>
            
            <div className="flex justify-between text-[14px]">
              <div>Terakhir diperbarui:</div>
              <div className="font-bold">{time}</div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-[#112240] p-[34px] rounded-[24px] shadow-[0_10px_24px_rgba(0,0,0,.05)] text-[#08284d] dark:text-[#ccd6f6] transition-colors duration-300">
            <h3 className="text-[28px] md:text-[36px] font-bold mb-[26px]">Jadwal Distribusi Berikutnya</h3>
            
            {schedule ? (
              <>
                <div className="flex justify-between py-[14px] border-b border-[#edf2f7] dark:border-[#233554]">
                  <span className="text-[#718096] dark:text-[#8892b0]">Tanggal</span>
                  <b className="font-bold">{new Date(schedule.tanggal_distribusi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b>
                </div>
                <div className="flex justify-between py-[14px] border-b border-[#edf2f7] dark:border-[#233554]">
                  <span className="text-[#718096] dark:text-[#8892b0]">Waktu</span>
                  <b className="font-bold">{schedule.waktu ? schedule.waktu.substring(0, 5) : ''}</b>
                </div>
                <div className="flex justify-between py-[14px] border-b border-[#edf2f7] dark:border-[#233554]">
                  <span className="text-[#718096] dark:text-[#8892b0]">Lokasi</span>
                  <b className="font-bold">{schedule.lokasi}</b>
                </div>
              </>
            ) : (
              <div className="py-[20px] text-center text-[#718096] dark:text-[#8892b0]">
                Belum ada jadwal distribusi terdekat.
              </div>
            )}
            
            <div className="flex justify-between py-[14px] border-b border-[#edf2f7] dark:border-[#233554]">
              <span className="text-[#718096] dark:text-[#8892b0]">Syarat</span>
              <b className="font-bold">KTM / e-KTM Aktif</b>
            </div>
            <div className="flex justify-between py-[14px] border-b border-[#edf2f7] dark:border-[#233554]">
              <span className="text-[#718096] dark:text-[#8892b0]">Ketentuan</span>
              <b className="font-bold">1 Paket / Mahasiswa</b>
            </div>
          </div>

        </div>
      </section>

      
      <section ref={timelineRef} className="py-[90px] text-center">
        <div className="w-[92%] max-w-[1600px] mx-auto">
          <small className="block text-[15px] tracking-[3px] font-bold text-[#5d7794] mb-[14px]">OPERATIONAL PROTOCOL</small>
          <h2 className="text-[40px] md:text-[58px] font-bold mb-[70px]">Panduan Antrean</h2>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-y-[28px] items-center max-w-[1300px] mx-auto">
            
            <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#d8e1ea]"></div>

            
            {[
              { id: 1, icon: 'fa-ticket', title: '01. Ambil Nomor Antrean', desc: 'Dapatkan nomor antrean di area pembagian.', pos: 'left' },
              { id: 2, icon: 'fa-box-open', title: '02. Tunggu Sampai Paket Siap Dibagikan', desc: 'Silakan menunggu di dekat area pembagian.', pos: 'right' },
              { id: 3, icon: 'fa-chair', title: '03. Nomor Antrean Akan Dipanggil', desc: 'Setiap 10 orang akan dipanggil berdasarkan nomor urut.', pos: 'left' },
              { id: 4, icon: 'fa-bullhorn', title: '04. Berbaris Sesuai Urutan Nomor Antrean', desc: 'Berbaris rapi memanjang tanpa menghalangi jalanan.', pos: 'right' },
              { id: 5, icon: 'fa-user-check', title: '05. Serahkan Nomor serta KTM/eKTM', desc: 'Serahkan nomor antrean serta KTM/e-KTM kepada petugas.', pos: 'left' },
              { id: 6, icon: 'fa-list-check', title: '06. Verifikasi Mahasiswa Aktif', desc: 'Petugas melakukan verifikasi status mahasiswa aktif.', pos: 'right' },
              { id: 7, icon: 'fa-box', title: '07. Isi Daftar Pengambilan Buah dan Susu', desc: 'Petugas akan memasukkan buah dan susu ke dalam kantong ramah lingkungan.', pos: 'left' },
              { id: 8, icon: 'fa-hand', title: '08. Ambil Kembali KTM/E-KTM', desc: 'Terima paket nutrisi Anda dengan tertib dari petugas distribusi.', pos: 'right' },
              { id: 9, icon: 'fa-qrcode', title: '09. Ambil Paket Buah Dan Susu', desc: 'Lakukan scan QR Code di pintu keluar sebagai bukti pengambilan selesai.', pos: 'left' },
              { id: 10, icon: 'fa-right-from-bracket', title: '10. Silakan Melanjutkan Aktivitas', desc: 'Ikuti tanda panah keluar untuk menghindari bentrokan arus antrean.', pos: 'right', isLast: true },
            ].map((step, idx) => (
              <div key={step.id} className="contents">
                {step.pos === 'right' && (
                  <>
                    <div className={`hidden lg:flex text-[34px] text-[#d8d8d8] dark:text-[#334155] justify-center transition-all duration-700 hover:text-[#08284d] dark:hover:text-white hover:scale-110 ${showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                      <i className={`fa-solid ${step.icon}`}></i>
                    </div>
                    <div className={`col-start-1 lg:col-start-2 w-[52px] h-[52px] rounded-full text-white flex items-center justify-center font-bold text-[18px] mx-auto z-20 transition-all duration-700 ${step.isLast ? 'bg-[#3d7c83] dark:bg-[#2dd4bf]' : 'bg-[#08284d] dark:bg-[#3b82f6]'} ${showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                      {step.id}
                    </div>
                  </>
                )}

                <div className={`col-start-1 ${step.pos === 'left' ? 'lg:col-start-1 lg:text-left' : 'lg:col-start-3 lg:text-left'} text-center bg-white dark:bg-[#112240] p-[26px] rounded-[18px] shadow-[0_10px_24px_rgba(0,0,0,.05)] relative z-10 transition-all duration-700 ${showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                  <h3 className="text-[20px] md:text-[22px] font-bold mb-[8px] dark:text-[#e2e8f0]">{step.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-[#6b7280] dark:text-[#94a3b8]">{step.desc}</p>
                </div>

                {step.pos === 'left' && (
                  <>
                    <div className={`hidden lg:flex col-start-2 w-[52px] h-[52px] rounded-full text-white items-center justify-center font-bold text-[18px] mx-auto z-20 transition-all duration-700 ${step.isLast ? 'bg-[#3d7c83] dark:bg-[#2dd4bf]' : 'bg-[#08284d] dark:bg-[#3b82f6]'} ${showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                      {step.id}
                    </div>
                    <div className={`hidden lg:flex col-start-3 text-[34px] text-[#d8d8d8] dark:text-[#334155] justify-center transition-all duration-700 hover:text-[#08284d] dark:hover:text-white hover:scale-110 ${showTimeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${idx * 70}ms` }}>
                      <i className={`fa-solid ${step.icon}`}></i>
                    </div>
                  </>
                )}
              </div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}
