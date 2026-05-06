'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (window.confirm("Are you sure you want to log out?")) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error);
          alert("Gagal logout: " + error.message);
        } else {

          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f7fb] text-[#08284d] dark:bg-[#0a192f] dark:text-[#ccd6f6] transition-colors duration-300">
      
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      
      <aside className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-[280px] md:w-[300px] bg-[#05244d] dark:bg-[#020c1b] p-[28px_18px] text-white flex flex-col shrink-0 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between mb-[34px]">
          <div className="flex items-center gap-[14px]">
            <img src="/assets/logo_tetada.png" className="w-[48px] h-[48px] rounded-full object-cover bg-white" alt="Logo" />
            <div>
              <h2 className="text-[20px] font-bold mb-[4px]">TETADA IPB</h2>
              <p className="text-[13px] text-[#c4d5ea]">Tim Tanggap Darurat IPB</p>
            </div>
          </div>
          <button className="md:hidden text-white text-[24px] hover:text-[#c4d5ea] transition" onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex flex-col gap-[10px]">
          <Link href="/admin/dashboard" className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/dashboard') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-table-columns w-[20px]"></i> BERANDA
          </Link>
          <Link href="/admin/stok" className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/stok') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-apple-whole w-[20px]"></i> BUAH & SUSU
          </Link>
          <Link href="/admin/events" className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/events') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-regular fa-calendar w-[20px]"></i> EVENTS
          </Link>
          <Link href="/admin/archive" className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/archive') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-regular fa-folder w-[20px]"></i> ARCHIVE
          </Link>
          <Link href="/admin/reports" className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/reports') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-snowflake w-[20px]"></i> EMERGENCY REPORTS
          </Link>
        </nav>
      </aside>

      
      <div className="flex-1 flex flex-col w-full md:w-auto">
        
        
        <header className="h-[70px] bg-white dark:bg-[#112240] flex justify-between items-center px-[20px] md:px-[30px] border-b border-[#e5ebf2] dark:border-[#233554] transition-colors duration-300">
          <div className="flex items-center gap-[14px]">
            <button onClick={handleLogout} className="border-none bg-[#eef2f7] dark:bg-[#233554] px-[16px] md:px-[22px] py-[10px] md:py-[12px] rounded-[12px] text-[14px] md:text-[16px] font-bold cursor-pointer text-[#08284d] dark:text-[#ccd6f6] transition hover:bg-[#dde6f1] dark:hover:bg-[#1e2d4a]">
              Logout
            </button>
          </div>

          <div className="flex items-center gap-[16px] md:gap-[22px] text-[24px] text-[#6c7d94] dark:text-[#8892b0]">
            <i className="fa-regular fa-bell cursor-pointer transition hover:text-[#173f97] dark:hover:text-white" onClick={() => alert("Tidak ada notifikasi baru.")}></i>
            <i className="fa-solid fa-gear cursor-pointer transition hover:text-[#173f97] dark:hover:text-white hidden sm:block"></i>

            <div className="w-[42px] h-[42px] rounded-full overflow-hidden cursor-pointer border-[2px] border-white dark:border-[#233554] shadow-[0_6px_18px_rgba(0,0,0,.12)] bg-cover bg-center bg-no-repeat shrink-0"
                 style={{ backgroundImage: `url('/assets/profil.jpg')` }}>
            </div>

            <button 
              className="md:hidden text-[#08284d] dark:text-[#ccd6f6] text-[24px] p-[6px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e2d4a] transition ml-[4px]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </header>

        
        <div className="p-[18px] md:p-[28px_34px] overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}
