'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[1000] min-[1100px]:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header className="bg-[#06244d] py-[18px] sticky top-0 z-[999] shadow-[0_6px_18px_rgba(0,0,0,0.14)]">
        <div className="w-[92%] max-w-[1600px] mx-auto flex justify-between min-[1100px]:grid min-[1100px]:grid-cols-[260px_1fr_260px] items-center gap-[20px] min-h-[64px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[42px] h-[42px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden shrink-0 bg-white">
              <img src="/assets/logo_tetada.png" alt="Logo TETADA" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] md:text-[22px] text-white font-bold leading-none mb-[4px] whitespace-nowrap">TETADA IPB</h2>
              <p className="text-[10px] md:text-[11px] text-[#b9c8d8] whitespace-nowrap hidden sm:block">Tim Tanggap Darurat IPB University</p>
            </div>
          </div>
          <button
            className="min-[1100px]:hidden text-white text-[24px] cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <nav className="hidden min-[1100px]:flex flex-row justify-center items-center gap-[34px] w-auto">
            <Link href="/" className={`no-underline text-[13px] font-semibold tracking-[1px] pb-[6px] transition duration-200 whitespace-nowrap hover:text-white ${pathname === '/' ? 'text-white border-b-[3px] border-[#d7fff5]' : 'text-[#8ea7bb]'}`}>HOME</Link>
            <Link href="/buahsusu" className={`no-underline text-[13px] font-semibold tracking-[1px] pb-[6px] transition duration-200 whitespace-nowrap hover:text-white ${pathname === '/buahsusu' ? 'text-white border-b-[3px] border-[#d7fff5]' : 'text-[#8ea7bb]'}`}>BUAH & SUSU</Link>
            <Link href="/events" className={`no-underline text-[13px] font-semibold tracking-[1px] pb-[6px] transition duration-200 whitespace-nowrap hover:text-white ${pathname === '/events' ? 'text-white border-b-[3px] border-[#d7fff5]' : 'text-[#8ea7bb]'}`}>EVENTS</Link>
            <Link href="/archive" className={`no-underline text-[13px] font-semibold tracking-[1px] pb-[6px] transition duration-200 whitespace-nowrap hover:text-white ${pathname === '/archive' ? 'text-white border-b-[3px] border-[#d7fff5]' : 'text-[#8ea7bb]'}`}>ARCHIVE</Link>
            <Link href="/contact" className={`no-underline text-[13px] font-semibold tracking-[1px] pb-[6px] transition duration-200 whitespace-nowrap hover:text-white ${pathname === '/contact' ? 'text-white border-b-[3px] border-[#d7fff5]' : 'text-[#8ea7bb]'}`}>CONTACT</Link>
          </nav>

          <div className="hidden min-[1100px]:flex justify-end items-center gap-[12px]">
            <Link href="/login" className="no-underline text-[12px] text-[#d7e6f5] px-[16px] py-[10px] rounded-full bg-white/5 border border-white/10 whitespace-nowrap hover:bg-white/10">Login Admin</Link>
            <Link href="/contact" className="no-underline border-none bg-[#e11d1d] text-white px-[20px] py-[11px] rounded-full text-[12px] font-bold cursor-pointer whitespace-nowrap hover:bg-[#c51414]">
              EMERGENCY
            </Link>
          </div>

        </div>
      </header>

      <div className={`fixed inset-y-0 left-0 z-[1001] transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} min-[1100px]:hidden transition-transform duration-300 ease-in-out w-[280px] bg-[#05244d] p-[28px_18px] text-white flex flex-col shadow-2xl`}>
        <div className="flex items-center justify-between mb-[34px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 bg-white">
              <img src="/assets/logo_tetada.png" alt="Logo TETADA" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] text-white font-bold leading-none mb-[4px] whitespace-nowrap">TETADA IPB</h2>
            </div>
          </div>
          <button className="text-white text-[24px] hover:text-[#c4d5ea] transition" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex flex-col gap-[16px] mb-8">
          <Link href="/" className={`no-underline text-[15px] font-semibold tracking-[1px] transition duration-200 hover:text-white ${pathname === '/' ? 'text-white' : 'text-[#8ea7bb]'}`} onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
          <Link href="/buahsusu" className={`no-underline text-[15px] font-semibold tracking-[1px] transition duration-200 hover:text-white ${pathname === '/buahsusu' ? 'text-white' : 'text-[#8ea7bb]'}`} onClick={() => setIsMobileMenuOpen(false)}>BUAH & SUSU</Link>
          <Link href="/events" className={`no-underline text-[15px] font-semibold tracking-[1px] transition duration-200 hover:text-white ${pathname === '/events' ? 'text-white' : 'text-[#8ea7bb]'}`} onClick={() => setIsMobileMenuOpen(false)}>EVENTS</Link>
          <Link href="/archive" className={`no-underline text-[15px] font-semibold tracking-[1px] transition duration-200 hover:text-white ${pathname === '/archive' ? 'text-white' : 'text-[#8ea7bb]'}`} onClick={() => setIsMobileMenuOpen(false)}>ARCHIVE</Link>
          <Link href="/contact" className={`no-underline text-[15px] font-semibold tracking-[1px] transition duration-200 hover:text-white ${pathname === '/contact' ? 'text-white' : 'text-[#8ea7bb]'}`} onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link>
        </nav>

        <div className="flex flex-col gap-[12px] mt-auto">
          <Link href="/login" className="no-underline text-center text-[13px] text-[#d7e6f5] px-[16px] py-[12px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>Login Admin</Link>
          <Link href="/contact" className="no-underline text-center border-none bg-[#e11d1d] text-white px-[20px] py-[12px] rounded-full text-[13px] font-bold cursor-pointer hover:bg-[#c51414]" onClick={() => setIsMobileMenuOpen(false)}>
            EMERGENCY
          </Link>
        </div>
      </div>
    </>
  );
}