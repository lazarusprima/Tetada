'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminStokPage() {
  const [stock, setStock] = useState(128);
  const maxStock = 340;
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<{id: number, date: string} | null>(null);

  // Dummy data sesuai desain referensi
  const [schedules, setSchedules] = useState([
    { id: 1, date: "5 Mar 2025", location: "Gedung Rektorat Lt. 1", timeStart: "07.00", timeEnd: "09.00", currentStock: 0, maxStock: 220, status: "Selesai" },
    { id: 2, date: "19 Feb 2025", location: "Student Center IPB", timeStart: "07.00", timeEnd: "09.00", currentStock: 0, maxStock: 310, status: "Selesai" },
    { id: 3, date: "5 Feb 2025", location: "Gedung Rektorat Lt. 1", timeStart: "07.00", timeEnd: "09.00", currentStock: 0, maxStock: 300, status: "Selesai" },
    { id: 4, date: "22 Jan 2025", location: "Student Center IPB", timeStart: "07.00", timeEnd: "09.00", currentStock: 0, maxStock: 340, status: "Selesai" }
  ]);

  const openDeleteModal = (s: {id: number, date: string}) => {
    setSelectedSchedule(s);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDelete = () => {
    if (selectedSchedule) {
      setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
      closeDeleteModal();
    }
  };

  return (
    <div className="flex flex-col gap-[34px]">
       
       {/* TITLE */}
       <div>
         <h1 className="text-[#031F41] dark:text-white text-[32px] md:text-[40px] font-extrabold leading-[1.2] mb-[8px]">
           Kelola Buah & Susu
         </h1>
         <p className="text-[#031F41] dark:text-[#8892b0] font-semibold text-[16px] md:text-[20px]">
           Tambah, edit, dan hapus jadwal distribusi & stok paket
         </p>
       </div>

       {/* CARDS GRID */}
       <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_260px] gap-[31px]">
         
         {/* STOCK CARD */}
         <div className="bg-[#031F41] text-[#F1FAEE] rounded-[20px] p-[28px_34px] relative overflow-hidden shadow-lg flex flex-col justify-center">
           <h4 className="text-[13px] font-bold mb-[18px] tracking-[0.5px]">STOK PAKET TERSISA</h4>
           <div className="text-[72px] md:text-[96px] font-bold leading-none mb-[24px]">{stock}</div>
           <p className="text-[15px] text-white/55 mb-[24px]">dari {maxStock} paket total</p>
           
           <div className="h-[10px] bg-white/15 rounded-full overflow-hidden mb-[18px]">
             <div className="h-full bg-[#9dd7d7] rounded-full transition-all duration-500" style={{ width: `${(stock/maxStock)*100}%` }}></div>
           </div>
           
           <p className="text-[13px] text-white/70">Diperbarui manual oleh admin · Terakhir diperbarui: 14.23 WIB</p>
         </div>

         {/* TOTAL DISTRIBUSI CARD */}
         <div className="bg-[#031F41] text-[#F1FAEE] rounded-[20px] p-[28px_20px] relative shadow-lg flex flex-col items-center justify-center">
           <h4 className="text-[15px] font-bold text-center mb-[20px]">TOTAL DISTRIBUSI</h4>
           <div className="flex items-end justify-center gap-[10px] mb-[30px]">
             <div className="text-[72px] md:text-[96px] font-bold leading-none">4</div>
             <div className="text-[18px] font-bold pb-[14px]">Hari</div>
           </div>
           <p className="text-[13px] text-white/55 text-center mt-auto">Sejak Mei 2026</p>
         </div>

       </div>

       {/* TABLE SECTION */}
       <div className="bg-white dark:bg-[#112240] rounded-[16px] border border-[#E2E8F0] dark:border-[#233554] shadow-sm overflow-hidden flex flex-col relative">
         
         {/* Table Header Controls */}
         <div className="p-[20px_24px] border-b border-[#E2E8F0] dark:border-[#233554] flex flex-col md:flex-row justify-between items-center gap-[16px]">
           <h3 className="text-[#1D3557] dark:text-white font-bold text-[16px] md:text-[18px] self-start md:self-center">Daftar Jadwal Distribusi</h3>
           
           <div className="flex flex-col sm:flex-row gap-[12px] w-full md:w-auto">
             <div className="relative flex-1 sm:w-[260px]">
               <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#A0AEC0] text-[13px]">
                 <i className="fa-solid fa-magnifying-glass"></i>
               </span>
               <input 
                 type="text" 
                 placeholder="Cari jadwal..." 
                 className="w-full bg-[#F0F2F5] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] pl-[36px] pr-[16px] py-[10px] text-[13px] text-[#1D3557] dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
               />
             </div>
             
             <Link 
               href="/admin/stok/tambahjadwal"
               className="bg-[#031F41] hover:bg-[#102F77] text-white font-bold text-[13px] px-[20px] py-[10px] rounded-[8px] whitespace-nowrap transition-colors flex items-center justify-center gap-[8px]"
             >
               <i className="fa-solid fa-plus"></i> Tambah Jadwal
             </Link>
           </div>
         </div>

         {/* Table Content */}
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
               <tr className="bg-[#F8FAFC] dark:bg-[#020c1b] border-b border-[#E2E8F0] dark:border-[#233554]">
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px]">TANGGAL</th>
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px]">LOKASI</th>
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px]">WAKTU</th>
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px]">STOK</th>
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px]">STATUS</th>
                 <th className="py-[16px] px-[24px] text-[11px] font-bold text-[#718096] uppercase tracking-[0.5px] w-[140px]">AKSI</th>
               </tr>
             </thead>
             <tbody>
               {schedules.map((s) => (
                 <tr key={s.id} className="border-b border-[#E2E8F0] dark:border-[#233554] hover:bg-gray-50 dark:hover:bg-[#1e2d4a] transition-colors">
                   <td className="py-[18px] px-[24px]">
                     <div className="text-[14px] font-bold text-[#1D3557] dark:text-[#ccd6f6]">{s.date}</div>
                   </td>
                   <td className="py-[18px] px-[24px]">
                     <div className="text-[13px] text-[#4A5568] dark:text-[#8892b0]">{s.location}</div>
                   </td>
                   <td className="py-[18px] px-[24px]">
                     <div className="text-[13px] text-[#4A5568] dark:text-[#8892b0]">{s.timeStart}</div>
                   </td>
                   <td className="py-[18px] px-[24px]">
                     <div className="text-[13px] text-[#718096] dark:text-[#8892b0]">{s.currentStock} / {s.maxStock}</div>
                   </td>
                   <td className="py-[18px] px-[24px]">
                     <span className="bg-[#E2E8F0] dark:bg-[#233554] text-[#718096] dark:text-[#ccd6f6] text-[11px] font-bold px-[10px] py-[4px] rounded-[6px]">
                       {s.status}
                     </span>
                   </td>
                   <td className="py-[18px] px-[24px]">
                     <div className="flex items-center gap-[8px]">
                       <Link 
                         href="/admin/stok/buahedit"
                         className="bg-[#EBF8FF] dark:bg-[#1a365d] text-[#2B6CB0] dark:text-[#63b3ed] text-[11px] font-bold px-[12px] py-[6px] rounded-[6px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors flex items-center justify-center"
                       >
                         Edit
                       </Link>
                       <button 
                         onClick={() => openDeleteModal(s)}
                         className="bg-[#FFF5F5] dark:bg-[#742a2a] text-[#C53030] dark:text-[#fc8181] text-[11px] font-bold px-[12px] py-[6px] rounded-[6px] hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                       >
                         Hapus
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         {/* Table Footer / Pagination */}
         <div className="p-[16px_24px] flex justify-between items-center text-[12px] text-[#718096] dark:text-[#8892b0]">
           <div>Menampilkan {schedules.length} dari {schedules.length} data</div>
           <div className="bg-[#031F41] text-white w-[26px] h-[26px] flex items-center justify-center rounded-[6px] font-bold cursor-pointer hover:bg-[#102F77]">1</div>
         </div>

       </div>

       {/* DELETE MODAL OVERLAY */}
       {isDeleteModalOpen && selectedSchedule && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           {/* Modal Container */}
           <div className="relative w-full max-w-[560px] bg-white dark:bg-[#112240] rounded-[12px] border-[1.5px] border-[#E2E8F0] dark:border-[#233554] shadow-2xl p-[36px_24px_32px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
             
             {/* Close Button (X) */}
             <button 
               onClick={closeDeleteModal}
               className="absolute top-[16px] right-[16px] w-[28px] h-[28px] flex items-center justify-center bg-[#F0F2F5] dark:bg-[#1e2d4a] hover:bg-[#E2E8F0] dark:hover:bg-[#233554] text-[#718096] dark:text-[#8892b0] rounded-[6px] transition-colors"
             >
               <i className="fa-solid fa-xmark text-[13px]"></i>
             </button>

             {/* Content */}
             <h3 className="text-[#C53030] dark:text-[#fc8181] font-bold text-[17px] mb-[12px] text-center">
               Hapus Jadwal Buah & Susu ini?
             </h3>
             <div className="text-[#4A5568] dark:text-[#a8b2d1] text-[13px] text-center leading-[1.4] mb-[8px]">
               Jadwal {selectedSchedule.date} akan dihapus secara<br />permanen dari sistem.
             </div>
             <div className="text-[#C53030] dark:text-[#fc8181] text-[12px] text-center mb-[28px] flex items-center justify-center gap-1">
               <span>⚠</span> Mahasiswa tidak akan bisa melihat jadwal ini lagi.
             </div>

             {/* Buttons */}
             <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
               <button 
                 onClick={handleDelete}
                 className="w-[200px] h-[44px] bg-[#C53030] hover:bg-[#9B2C2C] text-white font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
               >
                 Ya, Hapus
               </button>
               <button 
                 onClick={closeDeleteModal}
                 className="w-[160px] h-[44px] bg-[#E2E8F0] dark:bg-[#233554] hover:bg-[#CBD5E0] dark:hover:bg-[#1e2d4a] text-[#718096] dark:text-[#ccd6f6] font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
               >
                 Batal
               </button>
             </div>

           </div>
         </div>
       )}
    </div>
  );
}
