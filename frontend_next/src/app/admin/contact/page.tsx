'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Contact = {
  id: number;
  name: string;
  description: string;
  phone: string;
  wa: string;
  status: string;
};

const SkeletonRow = () => (
  <tr className="animate-pulse hover:bg-gray-50 dark:hover:bg-[#1a2b4c] transition-colors">
    <td className="py-[16px] px-[24px]">
      <div className="h-[20px] bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="h-[16px] bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="h-[20px] bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="h-[24px] bg-gray-200 dark:bg-gray-700 rounded-[6px] w-[50px] inline-block"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="flex justify-center items-center gap-2">
        <div className="h-[28px] w-[50px] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </td>
  </tr>
);

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error("Error fetching contacts:", error);
    } else if (data) {
      setContacts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-[#031F41] dark:text-[#F1FAEE] font-extrabold text-3xl md:text-[40px] leading-[1.2]">
          Kelola Emergency Contacts
        </h1>
        <p className="text-[#44474E] dark:text-[#A0AEC0] text-base">
          Ubah informasi, nomor kontak, dan atur status darurat yang ditampilkan di halaman publik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[12px] p-6 flex flex-col gap-2 transition-colors shadow-sm">
          <span className="text-[#457B9D] dark:text-[#7ea2c8] font-bold text-[11px] tracking-wider uppercase">
            TOTAL KONTAK
          </span>
          <span className="text-[#1D3557] dark:text-white font-bold text-[38px] leading-none transition-colors">
            {loading ? '...' : contacts.length}
          </span>
        </div>

        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[12px] p-6 flex flex-col gap-2 transition-colors shadow-sm">
          <span className="text-[#457B9D] dark:text-[#7ea2c8] font-bold text-[11px] tracking-wider uppercase">
            KONTAK AKTIF
          </span>
          <span className="text-[#38A169] dark:text-green-400 font-bold text-[38px] leading-none transition-colors">
            {loading ? '...' : contacts.filter(c => c.status !== 'Tidak Aktif').length}
          </span>
        </div>

        <div className="bg-[#FFF5F5] dark:bg-red-900/20 border border-[#FEB2B2] dark:border-red-900/50 rounded-[12px] p-6 flex flex-col gap-2 transition-colors shadow-sm">
          <span className="text-[#C53030] dark:text-red-400 font-bold text-[11px] tracking-wider uppercase">
            ⚠ PERHATIAN
          </span>
          <p className="text-[#742A2A] dark:text-red-300 text-[12px] leading-[15px]">
            Halaman publik akan terpengaruh.
          </p>
          <p className="text-[#C53030] dark:text-red-400 text-[11px] mt-1">
            Gunakan status &quot;Tidak Aktif&quot; jika nomor sedang bermasalah.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[12px] flex flex-col overflow-hidden shadow-sm transition-colors">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-[#E2E8F0] dark:border-[#233554] gap-4 transition-colors">
          <h2 className="text-[#1D3557] dark:text-gray-200 font-bold text-[16px] transition-colors">
            Daftar Kontak Darurat
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#0a192f] border-b border-[#E2E8F0] dark:border-[#233554] transition-colors">
              <tr>
                <th className="py-[16px] px-[24px] text-left font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">NAMA / INSTANSI</th>
                <th className="py-[16px] px-[24px] text-left font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">DESKRIPSI / PERAN</th>
                <th className="py-[16px] px-[24px] text-left font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">NO. TELEPON</th>
                <th className="py-[16px] px-[24px] text-left font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">STATUS</th>
                <th className="py-[16px] px-[24px] text-center font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#233554] transition-colors">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-[32px] text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada kontak yang ditemukan.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const isActive = contact.status !== 'Tidak Aktif';
                  return (
                  <tr key={contact.id} className={`hover:bg-gray-50 dark:hover:bg-[#1a2b4c] transition-colors ${!isActive ? 'opacity-60 bg-gray-50 dark:bg-[#112240]/50' : ''}`}>
                    <td className="py-[16px] px-[24px]">
                      <span className={`font-bold text-[14px] block transition-colors ${!isActive ? 'text-gray-500' : 'text-[#1D3557] dark:text-white'}`}>{contact.name}</span>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <span className="text-[#4A5568] dark:text-gray-300 text-[13px] block transition-colors">{contact.description}</span>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <span className={`font-bold text-[14px] transition-colors ${!isActive ? 'text-gray-500' : 'text-[#1D3557] dark:text-white'}`}>{contact.phone}</span>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      {isActive ? (
                        <div className="bg-[#C6F6D5] dark:bg-green-900/30 text-[#276749] dark:text-green-400 text-[11px] font-bold px-3 py-1 rounded-[6px] inline-block text-center transition-colors">
                          {contact.status}
                        </div>
                      ) : (
                        <div className="bg-[#FED7D7] dark:bg-red-900/30 text-[#9B2C2C] dark:text-red-400 text-[11px] font-bold px-3 py-1 rounded-[6px] inline-block text-center transition-colors">
                          Tidak Aktif
                        </div>
                      )}
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <div className="flex justify-center items-center gap-2">
                        <Link 
                          href={`/admin/contact/edit/${contact.id}`}
                          className="bg-[#EBF8FF] dark:bg-blue-900/30 text-[#2B6CB0] dark:text-blue-400 text-[12px] font-bold px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors inline-block"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-[#E2E8F0] dark:border-[#233554] bg-[#F8FAFC] dark:bg-[#0a192f] transition-colors">
          <span className="text-[#718096] dark:text-gray-400 text-[12px]">
            Menampilkan {contacts.length} dari {contacts.length} kontak
          </span>
        </div>
      </div>
    </div>
  );
}
