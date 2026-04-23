'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [barWidth, setBarWidth] = useState('0%');

  useEffect(() => {
    // Trigger progress bar animation after a short delay
    const timer = setTimeout(() => {
      setBarWidth('55%');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="bg-[linear-gradient(135deg,#05244d,#0a3d8f)] text-white p-[34px] rounded-[22px] mb-[26px] shadow-lg">
        <p className="text-[18px] opacity-80 mb-[8px]">SELAMAT DATANG!</p>
        <h1 className="text-[42px] md:text-[72px] leading-none mb-[10px] font-bold">Admin</h1>
        <span className="text-[17px] text-[#d2def0]">
          Ini merupakan dashboard admin yang berfungsi untuk mengubah data yang telah ditampilkan.
        </span>
      </div>

      {/* QUICK PANEL */}
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
          
          {/* STOK CARD */}
          <div className="bg-[#05244d] dark:bg-[#020c1b] text-white p-[30px] rounded-[22px] shadow-md transition-colors duration-300">
            <h4 className="text-[15px] mb-[18px] font-bold">STOK PAKET TERSISA</h4>
            <h1 className="text-[72px] md:text-[96px] leading-none mb-[10px] font-extrabold">128</h1>
            <p className="text-[#9db3cb] mb-[16px]">dari 340 paket total</p>
            
            <div className="h-[10px] bg-white/12 rounded-[30px] overflow-hidden mb-[16px]">
              <span className="block h-full bg-[#9dd7d7] rounded-[30px] transition-all duration-[400ms] ease-out" style={{ width: barWidth }}></span>
            </div>
            
            <small className="text-[#c3d2e4]">Diperbarui manual oleh admin · 14.23 WIB</small>
          </div>

          {/* JADWAL CARD */}
          <div className="bg-white dark:bg-[#233554] p-[24px] rounded-[18px] shadow-md transition-colors duration-300">
            <h3 className="text-[32px] font-bold mb-[18px] dark:text-[#ccd6f6]">Jadwal Distribusi Hari Ini</h3>
            
            <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
              <span className="text-[#8da0b6]">Tanggal</span>
              <b className="font-bold dark:text-[#e2e8f0]">Rabu, 19 Maret 2025</b>
            </div>
            
            <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
              <span className="text-[#8da0b6]">Waktu</span>
              <b className="font-bold dark:text-[#e2e8f0]">14.00 - 16.00 WIB</b>
            </div>
            
            <div className="flex justify-between py-[16px] border-b border-[#edf1f6] dark:border-[#112240]">
              <span className="text-[#8da0b6]">Lokasi</span>
              <b className="font-bold dark:text-[#e2e8f0]">Gedung Rektorat Lt.1</b>
            </div>
          </div>

        </div>
      </div>

      {/* ACTIVITY */}
      <div className="bg-[#05244d] dark:bg-[#112240] text-white p-[30px] rounded-[22px] shadow-lg transition-colors duration-300">
        <h3 className="text-[28px] md:text-[40px] font-bold mb-[18px]">Recent Activity</h3>
        <p className="text-[18px] md:text-[24px] text-[#a7b8cd] mb-[12px] tracking-[1px]">Admin update stok menjadi 128 ............ 07.30 26/5/2026</p>
        <p className="text-[18px] md:text-[24px] text-[#a7b8cd] mb-[12px] tracking-[1px]">Admin menambahkan archive ............... 04.30 21/5/2026</p>
        <p className="text-[18px] md:text-[24px] text-[#a7b8cd] mb-[12px] tracking-[1px]">Admin update stok menjadi 100 .......... 05.30 20/5/2026</p>
      </div>

    </>
  );
}
