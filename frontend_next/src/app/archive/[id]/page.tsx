import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  image_url: string;
  link_url?: string;
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const { data: archive, error } = await supabase
    .from('archive_kegiatan')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !archive) {
    return (
      <div className="bg-[#F5F5F4] min-h-screen pb-[100px]">
        <section className="w-full h-[140px] bg-[#031F41] flex flex-col justify-center items-center">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] md:text-[40px] leading-[50px] text-white">
            📁 Arsip Kegiatan
          </h1>
        </section>
        <div className="max-w-[1440px] mx-auto mt-[50px] px-[24px] lg:px-[104px] text-center">
          <h2 className="text-2xl font-bold text-[#031F41] mb-4">Arsip tidak ditemukan</h2>
          <Link href="/archive" className="text-[#1D3557] hover:underline">Kembali ke daftar arsip</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F4] min-h-screen pb-[100px]">
      <section className="w-full h-[140px] bg-[#031F41] flex flex-col justify-center items-center">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] md:text-[40px] leading-[50px] text-white">
          📁 Arsip Kegiatan
        </h1>
      </section>

      <div className="max-w-[1440px] mx-auto relative mt-[50px] px-[24px] lg:px-[104px]">
        <Link 
          href="/archive"
          className="flex items-center gap-[8px] w-fit mb-[32px] hover:opacity-70 transition-opacity cursor-pointer group"
        >
          <div className="w-[23px] h-[23px] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill="#031F41" className="group-hover:-translate-x-1 transition-transform"/>
            </svg>
          </div>
          <span className="font-['Inter',sans-serif] font-normal text-[16px] leading-[23px] text-[#031F41]">
            Kembali
          </span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-[48px] items-start">
          {/* Left Image Section */}
          <div className="w-full lg:w-[446px] h-[400px] lg:h-[632px] bg-[#EFEDF1] rounded-[20px] overflow-hidden relative flex-shrink-0 shadow-sm">
            {archive.image_url ? (
              <img 
                src={archive.image_url} 
                alt={archive.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#031F41] bg-opacity-80 text-white font-['Inter',sans-serif] font-semibold text-[24px] uppercase tracking-widest relative">
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  NO IMAGE
                 </div>
              </div>
            )}
          </div>

          {/* Right Content Section */}
          <div className="flex-1 w-full bg-[#EFEDF1] rounded-[20px] p-[32px] lg:p-[48px] min-h-[400px] lg:min-h-[632px] shadow-sm flex flex-col">
            <div className="mb-[24px]">
              <span className="inline-block px-[16px] py-[6px] bg-[#031F41] text-white font-['Inter',sans-serif] text-[12px] font-bold rounded-full mb-[16px] uppercase tracking-wider">
                {archive.category || 'KATEGORI'} • {archive.year}
              </span>
              <h2 className="font-['Manrope',sans-serif] font-bold text-[28px] lg:text-[36px] leading-tight lg:leading-[40px] text-[#031F41]">
                {archive.title}
              </h2>
            </div>
            
            <div className="font-['Inter',sans-serif] font-normal text-[14px] lg:text-[16px] leading-[23px] lg:leading-[26px] text-[#44474E] text-justify whitespace-pre-line flex-1">
              {archive.description}
            </div>
            
            {archive.link_url && (
              <div className="mt-[48px] pt-[24px] border-t border-[#031F41]/10">
                <a 
                  href={archive.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-[24px] py-[12px] bg-[#031F41] text-white rounded-[12px] font-['Inter',sans-serif] font-semibold text-[14px] hover:bg-[#1D3557] transition-colors"
                >
                  Kunjungi Tautan Eksternal
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
