'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [stock, setStock] = useState(0);
  const [maxStock, setMaxStock] = useState(0);
  const [schedule, setSchedule] = useState<any>(null);
  const [time, setTime] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('jadwal_distribusi')
        .select('*')
        .ilike('status', 'aktif')
        .order('tanggal_distribusi', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (data) {
        const scheduleDate = new Date(data.tanggal_distribusi);
        const today = new Date();
        if (scheduleDate.getDate() === today.getDate() &&
            scheduleDate.getMonth() === today.getMonth() &&
            scheduleDate.getFullYear() === today.getFullYear()) {
          setSchedule(data);
          setStock(data.stok_paket_sisa || 0);
          setMaxStock(data.stok_paket_total || 0);
          
          if (data.created_at) {
            const d = new Date(data.created_at);
            const h = String(d.getHours()).padStart(2, "0");
            const m = String(d.getMinutes()).padStart(2, "0");
            setTime(`${h}.${m} WIB`);
          }
        } else {
          setStock(0);
          setMaxStock(0);
          setTime('--.-- WIB');
        }
      }

      const { data: authSession } = await supabase.auth.getSession();
      if (authSession?.session?.user) {
        const { data: profile } = await supabase
          .from('profil_admin')
          .select('nama')
          .eq('id', authSession.session.user.id)
          .maybeSingle();
        if (profile && profile.nama) {
          setAdminName(profile.nama);
        } else {
           const meta = authSession.session.user.user_metadata;
           setAdminName(meta?.full_name || meta?.name || 'Admin');
        }
      }

      const { data: stokData } = await supabase
        .from('stok_buah_susu')
        .select('jumlah, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: jadwalData } = await supabase
        .from('jadwal_distribusi')
        .select('lokasi, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      let acts: any[] = [];
      if (stokData) {
        stokData.forEach(item => {
          acts.push({
            text: `Admin update stok menjadi ${item.jumlah}`,
            dateObj: new Date(item.created_at)
          });
        });
      }
      if (jadwalData) {
        jadwalData.forEach(item => {
          acts.push({
            text: `Admin menambahkan jadwal distribusi ${item.lokasi}`,
            dateObj: new Date(item.created_at)
          });
        });
      }

      acts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
      const formattedActs = acts.slice(0, 3).map(act => {
        const d = act.dateObj;
        const h = String(d.getHours()).padStart(2, "0");
        const m = String(d.getMinutes()).padStart(2, "0");
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return {
          text: act.text,
          timeStr: `${h}.${m} ${day}/${month}/${year}`
        };
      });

      setActivities(formattedActs);
    };
    fetchData();
  }, []);

  const percent = maxStock > 0 ? (stock / maxStock) * 100 : 0;

  return (
    <>
      <div className="bg-[linear-gradient(135deg,#05244d,#0a3d8f)] text-white p-[34px] rounded-[22px] mb-[26px] shadow-lg">
        <p className="text-[18px] opacity-80 mb-[8px]">SELAMAT DATANG!</p>
        <h1 className="text-[42px] md:text-[72px] leading-none mb-[10px] font-bold">{adminName}</h1>
        <span className="text-[17px] text-[#d2def0]">
          Ini merupakan dashboard admin yang berfungsi untuk mengubah data yang telah ditampilkan.
        </span>
      </div>

      <div className="bg-[#eef2f7] dark:bg-[#112240] rounded-[22px] p-[28px] mb-[26px] transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-[20px] mb-[28px]">
          <div>
            <h2 className="text-[30px] md:text-[48px] leading-none mb-[8px] font-bold dark:text-[#ccd6f6]">UPDATE BUAH & SUSU CEPAT</h2>
            <p className="text-[16px] text-[#5b6f86] dark:text-[#8892b0]">Central control for nutritional support distribution.</p>
          </div>
          <Link href="/admin/stok" className="border-none bg-[#05244d] dark:bg-[#1e2d4a] text-white px-[28px] py-[18px] rounded-[18px] text-[20px] font-bold cursor-pointer transition hover:bg-[#173f97] dark:hover:bg-[#3b82f6] no-underline inline-block whitespace-nowrap shadow-md">
            <i className="fa-solid fa-plus mr-[8px]"></i> Update Sekarang!
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-[28px]">
          <div className="bg-[#05244d] dark:bg-[#020c1b] text-white p-[30px] rounded-[22px] shadow-md transition-colors duration-300">
            <h4 className="text-[15px] mb-[18px] font-bold">STOK PAKET TERSISA</h4>
            <h1 className="text-[72px] md:text-[96px] leading-none mb-[10px] font-extrabold">{stock}</h1>
            <p className="text-[#9db3cb] mb-[16px]">dari {maxStock} paket total</p>
            <div className="h-[10px] bg-white/12 rounded-[30px] overflow-hidden mb-[16px]">
              <span className="block h-full bg-[#9dd7d7] rounded-[30px] transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></span>
            </div>
            <small className="text-[#c3d2e4]">Diperbarui manual oleh admin · {time}</small>
          </div>

          <div className="bg-white dark:bg-[#233554] p-[24px] rounded-[18px] shadow-md transition-colors duration-300">
            <h3 className="text-[32px] font-bold mb-[18px] dark:text-[#ccd6f6]">Jadwal Distribusi Hari Ini</h3>
            {schedule ? (
              <>
                <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
                  <span className="text-[#8da0b6]">Tanggal</span>
                  <b className="font-bold dark:text-[#e2e8f0]">{new Date(schedule.tanggal_distribusi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b>
                </div>
                <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
                  <span className="text-[#8da0b6]">Waktu</span>
                  <b className="font-bold dark:text-[#e2e8f0]">{schedule.waktu ? schedule.waktu.substring(0, 5) : ''} WIB</b>
                </div>
                <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
                  <span className="text-[#8da0b6]">Lokasi</span>
                  <b className="font-bold dark:text-[#e2e8f0]">{schedule.lokasi}</b>
                </div>
              </>
            ) : (
              <div className="py-[30px] text-center text-[#8da0b6]">
                Belum ada jadwal distribusi aktif untuk hari ini.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#05244d] dark:bg-[#112240] text-white p-[30px] rounded-[22px] shadow-lg transition-colors duration-300">
        <h3 className="text-[28px] md:text-[40px] font-bold mb-[24px]">Recent Activity</h3>
        {activities.length > 0 ? activities.map((act, idx) => (
          <div key={idx} className="flex justify-between items-center gap-[12px] md:gap-[16px] text-[15px] md:text-[20px] text-[#a7b8cd] mb-[16px] tracking-[0.5px]">
            <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[60%]">{act.text}</span>
            <div className="flex-1 border-b-[2px] border-dotted border-[#a7b8cd]/30 h-[1px]"></div>
            <span className="whitespace-nowrap">{act.timeStr}</span>
          </div>
        )) : (
          <p className="text-[18px] md:text-[24px] text-[#a7b8cd] mb-[12px] tracking-[1px]">Belum ada aktivitas terbaru.</p>
        )}
      </div>
    </>
  );
}