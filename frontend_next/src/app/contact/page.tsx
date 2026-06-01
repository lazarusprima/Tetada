'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Contact = {
  id: number;
  name: string;
  description: string;
  phone: string;
  wa: string;
  status: string;
};

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*');
      
      if (data) {
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const getContact = (id: number) => {
    return contacts.find(c => c.id === id);
  };

  const renderButton = (id: number, styleProps: any) => {
    if (loading) {
      return <div className="bg-white/20 animate-pulse rounded-[16px] w-[140px] h-[48px]"></div>;
    }

    const contact = getContact(id);
    const isActive = contact ? contact.status !== 'Tidak Aktif' : false;
    const phone = contact?.phone || '';

    if (!isActive) {
      return (
        <div className="bg-gray-300/50 rounded-[16px] px-6 py-3 flex items-center gap-2 cursor-not-allowed inline-block w-fit">
          <i className="fa-solid fa-phone-slash text-gray-500"></i>
          <span className="text-gray-500 font-bold text-base">Tidak Tersedia</span>
        </div>
      );
    }

    if (id === 6) {
      const waNumber = phone.replace(/[^0-9]/g, '');
      const waLink = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.substring(1)}` : `https://wa.me/${waNumber}`;
      return (
        <a href={waLink} target="_blank" rel="noopener noreferrer" className={styleProps.buttonClass}>
          <i className={`fa-brands fa-whatsapp ${styleProps.iconColor} group-hover:scale-110 transition-transform`}></i>
          <span className={`${styleProps.textColor} font-bold text-base`}>WhatsApp Chat</span>
        </a>
      );
    }

    return (
      <a href={`tel:${phone}`} className={styleProps.buttonClass}>
        <i className={`fa-solid fa-phone ${styleProps.iconColor} group-hover:scale-110 transition-transform`}></i>
        <span className={`${styleProps.textColor} font-bold text-base`}>Telepon</span>
      </a>
    );
  };

  const getCardClass = (id: number, baseClass: string) => {
    if (loading) return baseClass;
    const contact = getContact(id);
    const isActive = contact ? contact.status !== 'Tidak Aktif' : false;
    return `${baseClass} ${!isActive ? 'opacity-60 grayscale' : ''}`;
  };

  return (
    <div className="bg-[#F5F5F4] min-h-screen w-full flex flex-col items-center pb-24 font-['Plus_Jakarta_Sans',sans-serif]">

      <div className="w-full max-w-[1232px] px-4 md:px-0 mx-auto mt-12 flex flex-col gap-16 md:gap-[120px]">

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className={getCardClass(1, "md:col-span-2 bg-[#031F41] rounded-[20px] p-6 md:p-[32px] flex flex-col justify-between relative overflow-hidden min-h-[340px] transition-all duration-300")}>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <i className="fa-solid fa-phone text-[160px] text-white"></i>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#B9ECEE] rounded flex items-center justify-center">
                  <i className="fa-solid fa-phone text-[#031F41] text-xs"></i>
                </div>
                <span className="text-white font-bold text-sm tracking-[1.4px] uppercase font-['Inter',sans-serif]">
                  {loading ? 'RESOURCES' : getContact(1)?.name?.toUpperCase() || 'RESOURCES'}
                </span>
              </div>
              <h2 className="text-white font-extrabold text-[28px] md:text-[36px] leading-[1.1] mb-4 max-w-[70%]">
                Garda Terdepan Keamanan Lingkungan
              </h2>
              <p className="text-[#D5E3FF] text-base leading-normal max-w-[384px] opacity-80 font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(1)?.description || 'Kami siap membantu Anda dalam situasi darurat dengan respons cepat dan terkoordinasi di area kampus.'}
              </p>
            </div>
            <div className="mt-8 relative z-10">
              {renderButton(1, {
                buttonClass: "bg-white rounded-[16px] px-6 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors inline-block w-fit cursor-pointer group",
                iconColor: "text-[#031F41]",
                textColor: "text-[#031F41]"
              })}
            </div>
          </div>

          <div className={getCardClass(2, "bg-[#B9ECEE] rounded-[20px] p-6 md:p-[32px] flex flex-col justify-between min-h-[340px] transition-all duration-300")}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-[#356668] rounded flex items-center justify-center">
                  <i className="fa-solid fa-phone text-white text-xs"></i>
                </div>
                <span className="text-[#356668] font-bold text-sm tracking-[1.4px] uppercase font-['Inter',sans-serif]">
                  Fasilitas Kesehatan
                </span>
              </div>
              <h3 className="text-[#002021] font-bold text-[24px] mb-2">
                {loading ? 'Poliklinik IPB' : getContact(2)?.name || 'Poliklinik IPB'}
              </h3>
              <p className="text-[#1A4E50] text-sm leading-[1.6] font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(2)?.description || 'Penanganan pertama medis dan rujukan darurat.'}
              </p>
            </div>
            <div className="mt-8">
              {renderButton(2, {
                buttonClass: "bg-[#356668] w-full rounded-[16px] px-0 py-3 flex items-center justify-center gap-2 hover:bg-[#284f50] transition-colors cursor-pointer group",
                iconColor: "text-white text-sm",
                textColor: "text-white"
              })}
            </div>
          </div>

          <div className={getCardClass(3, "bg-[#E9E7EB] rounded-[20px] p-6 md:p-[32px] flex flex-col justify-end min-h-[256px] relative group hover:bg-[#e0dee2] transition-colors duration-300")}>
            <div className="absolute top-8 left-8 text-[#490000] text-xl">
              <i className="fa-solid fa-phone group-hover:scale-110 transition-transform"></i>
            </div>
            <div className="mt-12">
              <h4 className="text-[#1B1B1E] font-bold text-[20px] leading-[1.4] mb-2">
                {loading ? 'Ambulan IPB' : getContact(3)?.name || 'Ambulan IPB'}
              </h4>
              <p className="text-[#44474E] text-sm mb-6 font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(3)?.description || 'Unit Ambulan.'}
              </p>
              <div className="flex justify-end">
                {renderButton(3, {
                  buttonClass: "bg-white rounded-[16px] px-6 py-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer",
                  iconColor: "text-[#031F41]",
                  textColor: "text-[#031F41]"
                })}
              </div>
            </div>
          </div>

          <div className={getCardClass(4, "bg-[#E9E7EB] rounded-[20px] p-6 md:p-[32px] flex flex-col justify-end min-h-[256px] relative group hover:bg-[#e0dee2] transition-colors duration-300")}>
            <div className="absolute top-8 left-8 text-[#490000] text-xl">
              <i className="fa-solid fa-phone group-hover:scale-110 transition-transform"></i>
            </div>
            <div className="mt-12">
              <h4 className="text-[#1B1B1E] font-bold text-[20px] leading-[1.4] mb-2">
                {loading ? 'Polsek Dramaga' : getContact(4)?.name || 'Polsek Dramaga'}
              </h4>
              <p className="text-[#44474E] text-sm mb-6 font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(4)?.description || 'Unit Kepolisian.'}
              </p>
              <div className="flex justify-end">
                {renderButton(4, {
                  buttonClass: "bg-white rounded-[16px] px-6 py-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer",
                  iconColor: "text-[#031F41]",
                  textColor: "text-[#031F41]"
                })}
              </div>
            </div>
          </div>

          <div className={getCardClass(5, "bg-[#E9E7EB] rounded-[20px] p-6 md:p-[32px] flex flex-col justify-end min-h-[256px] relative group hover:bg-[#e0dee2] transition-colors duration-300")}>
            <div className="absolute top-8 left-8 text-[#490000] text-xl">
              <i className="fa-solid fa-phone group-hover:scale-110 transition-transform"></i>
            </div>
            <div className="mt-12">
              <h4 className="text-[#1B1B1E] font-bold text-[20px] leading-[1.4] mb-2">
                {loading ? 'Pemadam Kebakaran' : getContact(5)?.name || 'Pemadam Kebakaran'}
              </h4>
              <p className="text-[#44474E] text-sm mb-6 font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(5)?.description || 'Unit Damkar.'}
              </p>
              <div className="flex justify-end">
                {renderButton(5, {
                  buttonClass: "bg-white rounded-[16px] px-6 py-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer",
                  iconColor: "text-[#031F41]",
                  textColor: "text-[#031F41]"
                })}
              </div>
            </div>
          </div>

          <div className={getCardClass(6, "md:col-span-3 bg-[#BA1A1A] rounded-[20px] p-6 md:p-[32px] flex flex-col md:flex-row items-center justify-between min-h-[160px] relative overflow-hidden transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(186,26,26,0.3)]")}>
            <div className="absolute -right-8 -top-8 opacity-20">
              <i className="fa-solid fa-triangle-exclamation text-[150px] text-white"></i>
            </div>
            
            <div className="relative z-10 flex flex-col gap-2 w-full md:w-2/3 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-bell text-[#BA1A1A] text-[10px]"></i>
                </div>
                <span className="text-white font-bold text-sm tracking-[1.4px] uppercase font-['Inter',sans-serif]">
                  TIM TANGGAP DARURAT
                </span>
              </div>
              <h3 className="text-white font-extrabold text-[28px] md:text-[32px] leading-[1.1]">
                {loading ? 'TETADA IPB' : getContact(6)?.name || 'TETADA IPB'}
              </h3>
              <p className="text-white/80 text-base leading-[1.6] font-['Inter',sans-serif]">
                {loading ? 'Memuat deskripsi...' : getContact(6)?.description || 'Hubungi tim kami langsung jika terjadi kondisi darurat di area kampus atau asrama.'}
              </p>
            </div>

            <div className="relative z-10 w-full md:w-auto flex justify-end">
              {renderButton(6, {
                buttonClass: "bg-white rounded-[16px] px-8 py-4 flex items-center gap-3 shadow-lg hover:bg-gray-100 transition-all cursor-pointer group",
                iconColor: "text-[#BA1A1A] text-lg",
                textColor: "text-[#BA1A1A] text-lg"
              })}
            </div>
          </div>

        </section>

        <section className="flex flex-col items-center">
          <h2 className="text-black font-extrabold text-3xl md:text-[40px] mb-12 text-center">
            Laporan Kejadian Darurat
          </h2>

          <div className="flex flex-col lg:flex-row w-full gap-12 lg:gap-[80px]">
            
            <div className="flex flex-col gap-6 lg:w-[400px] shrink-0">
              <h3 className="text-[#031F41] font-extrabold text-[36px] leading-[1.1] ">
                Alur Pelaporan
              </h3>
              <p className="text-[#44474E] text-base leading-[1.6] font-['Inter',sans-serif]">
                Kami memastikan setiap laporan ditangani dengan profesionalisme dan kerahasiaan tinggi. Ikuti langkah sederhana ini untuk melaporkan insiden.
              </p>
              
              <a href="https://ipb.link/form-kedaruratan" target="_blank" rel="noopener noreferrer" className="bg-[#BA1A1A] shadow-[0_10px_15px_-3px_rgba(186,26,26,0.2),0_4px_6px_-4px_rgba(186,26,26,0.2)] rounded-[16px] px-10 py-4 mt-4 flex items-center justify-center hover:bg-[#9a1515] transition-colors w-full sm:w-max group">
                <span className="text-white font-extrabold text-sm tracking-[1.4px] uppercase font-['Inter',sans-serif] group-hover:scale-105 transition-transform">
                  BUAT LAPORAN TERTULIS
                </span>
              </a>
            </div>

            <div className="flex flex-col relative w-full lg:flex-1">
              
              <div className="hidden lg:block absolute w-[1px] bg-[#C4C6CF] top-[48px] bottom-[48px] left-[48px] z-0"></div>

              <div className="flex flex-row gap-6 p-6 relative z-10 bg-transparent rounded-[20px]">
                <div className="w-12 h-12 shrink-0 bg-[#1D3557] rounded-full flex items-center justify-center text-white font-black text-base ">
                  1
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <h4 className="text-[#1B1B1E] font-bold text-[20px] ">Hubungi Kami</h4>
                  <p className="text-[#44474E] text-base font-['Inter',sans-serif]">Segera hubungi tim melalui nomor darurat yang tertera di atas.</p>
                </div>
              </div>

              <div className="flex flex-row gap-6 p-6 relative z-10 bg-transparent rounded-[20px]">
                <div className="w-12 h-12 shrink-0 bg-[#1D3557] rounded-full flex items-center justify-center text-white font-black text-base ">
                  2
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <h4 className="text-[#1B1B1E] font-bold text-[20px] ">Sampaikan Detail Kejadian</h4>
                  <p className="text-[#44474E] text-base font-['Inter',sans-serif]">Berikan informasi lokasi, jenis insiden, dan kondisi terkini dengan jelas.</p>
                </div>
              </div>

              <div className="flex flex-row gap-6 p-6 relative z-10 bg-transparent rounded-[20px]">
                <div className="w-12 h-12 shrink-0 bg-[#1D3557] rounded-full flex items-center justify-center text-white font-black text-base ">
                  3
                </div>
                <div className="flex flex-col gap-1 pt-2">
                  <h4 className="text-[#1B1B1E] font-bold text-[20px] ">Tim Menuju Lokasi</h4>
                  <p className="text-[#44474E] text-base font-['Inter',sans-serif]">Tim kami akan segera berkoordinasi dan menuju lokasi Anda untuk penanganan lebih lanjut.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
