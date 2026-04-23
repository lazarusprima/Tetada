'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#03172f] text-white pt-[50px] mt-[60px]">
      <div className="w-[92%] max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[2fr_1fr_1fr] gap-[30px] pb-[30px]">
        <div>
          <h3 className="mb-[16px] text-[24px] font-bold">TETADA IPB</h3>
          <p className="text-[16px] leading-[1.8] text-[#9fb3ca]">Tim Respon Cepat & Layanan Mahasiswa IPB University.</p>
        </div>
        <div>
          <h4 className="mb-[16px] text-[24px] font-bold">RESOURCES</h4>
          <p className="text-[16px] leading-[1.8] text-[#9fb3ca] cursor-pointer hover:text-white transition">IPB University</p>
          <p className="text-[16px] leading-[1.8] text-[#9fb3ca] cursor-pointer hover:text-white transition">Student Services</p>
        </div>
        <div>
          <h4 className="mb-[16px] text-[24px] font-bold">SUPPORT</h4>
          <p className="text-[16px] leading-[1.8] text-[#9fb3ca] cursor-pointer hover:text-white transition">Privacy Policy</p>
          <p className="text-[16px] leading-[1.8] text-[#9fb3ca] cursor-pointer hover:text-white transition">Contact Support</p>
        </div>
      </div>
      <div className="text-center p-[16px] bg-[#021223] text-[#9fb6ce] text-[14px]">
        © 2024 TETADA IPB
      </div>
    </footer>
  );
}
