'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  image_url: string;
  link_url?: string;
}

export default function ArchivePage() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchArchives = async () => {
      const { data, error } = await supabase
        .from('archive_kegiatan')
        .select('*')
        .order('year', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setArchives(data);
      }
      setLoading(false);
    };

    fetchArchives();
  }, []);

  const groupedArchives = archives.reduce((acc, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = [];
    }
    acc[curr.year].push(curr);
    return acc;
  }, {} as Record<number, ArchiveItem[]>);

  const sortedYears = Object.keys(groupedArchives).map(Number).sort((a, b) => b - a);

  const displayYears = sortedYears.length > 0 ? sortedYears : [2026, 2025];
  const displayArchives = sortedYears.length > 0 ? groupedArchives : {
    2026: [
      {
        id: '1',
        title: 'Kegiatan pelatihan dan pelantikan TETADA 9 di Gunung Bunder',
        description: 'Kegiatan tahunan yang melibatkan seluruh anggota baru TETADA untuk menjalani pelatihan dan pelantikan.',
        category: 'PELATIHAN KEGAWATDARURATAN',
        year: 2026,
        image_url: '/assets/WhatsApp Image 2026-04-20 at 08.49.59.jpg',
      },
      {
        id: '2',
        title: 'Implementasi Sistem Monitoring Drone untuk Kawasan Hutan IPB',
        description: 'Peluncuran unit pemantauan udara untuk pencegahan dini kebakaran hutan dan lahan di kawasan pendidikan.',
        category: 'TEKNOLOGI MITIGASI',
        year: 2026,
        image_url: '',
      }
    ],
    2025: [
      {
        id: '3',
        title: 'Pemeriksaan Kesehatan Gratis & Simulasi Gempa di Desa Cikarawang',
        description: 'Inisiatif tahunan tim medis TETADA IPB untuk meningkatkan resiliensi masyarakat di desa penyangga kampus.',
        category: 'PENGABDIAN MASYARAKAT',
        year: 2025,
        image_url: '',
      },
      {
        id: '4',
        title: 'Implementasi Sistem Monitoring Drone untuk Kawasan Hutan IPB',
        description: 'Peluncuran unit pemantauan udara untuk pencegahan dini kebakaran hutan dan lahan di kawasan pendidikan.',
        category: 'TEKNOLOGI MITIGASI',
        year: 2025,
        image_url: '',
      }
    ]
  };

  useEffect(() => {
    if (displayYears.length > 0 && activeYear === null) {
      setActiveYear(displayYears[0]);
    }
  }, [displayYears, activeYear]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const yearStr = entry.target.id.split('-')[1];
            if (yearStr) {
              setActiveYear(Number(yearStr));
            }
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    displayYears.forEach((year) => {
      const element = document.getElementById(`year-${year}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [displayYears]);

  return (
    <div className="bg-[#F5F5F4] min-h-screen pb-[100px]">
      <section className="w-full h-[140px] bg-[#031F41] flex flex-col justify-center items-center">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[32px] md:text-[40px] leading-[50px] text-white">
          📁 Arsip Kegiatan
        </h1>
      </section>

      <div className="max-w-[1440px] mx-auto relative mt-[50px] px-[24px] lg:px-[104px]">
        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[130px] relative">
          
          <aside className="lg:w-[300px] flex-shrink-0 lg:sticky lg:top-[120px] h-fit">
            <div className="bg-[#F5F3F6] rounded-[20px] p-[32px] shadow-sm">
              <h3 className="font-['Manrope',sans-serif] font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] text-[#031F41] mb-[24px]">
                Timeline Arsip
              </h3>
              <nav className="flex flex-col gap-[4px]">
                {displayYears.map((year) => {
                  const isActive = activeYear === year;
                  return (
                    <a 
                      key={year}
                      href={`#year-${year}`}
                      onClick={() => setActiveYear(year)}
                      className={`group flex justify-between items-center px-[16px] py-[12px] rounded-[16px] transition-all duration-300 ${isActive ? 'bg-[#E9E7EB]' : 'hover:bg-[#E9E7EB]/70'}`}
                    >
                      <span className={`font-['Inter',sans-serif] text-[16px] leading-[24px] transition-colors duration-300 ${isActive ? 'font-extrabold text-[#44474E]' : 'font-normal text-[#031F41] group-hover:text-[#44474E]'}`}>
                        Tahun {year}
                      </span>
                      <div className={`w-[9px] h-[9px] rounded-full transition-all duration-300 ${isActive ? 'bg-[#44474E] opacity-100 scale-100' : 'bg-[#44474E] opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-100'}`}></div>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-[80px]">
            {loading && displayYears.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-['Inter']">Memuat data arsip...</div>
            ) : (
              displayYears.map((year) => (
                <section key={year} id={`year-${year}`} className="flex flex-col gap-[48px] scroll-mt-[120px]">
                  <div className="flex items-center gap-[24px]">
                    <h2 className="font-['Manrope',sans-serif] font-extrabold text-[72px] md:text-[96px] leading-none text-[#E9E7EB]">
                      {year}
                    </h2>
                    <div className="h-[2px] flex-1 bg-[#E9E7EB]"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    {displayArchives[year].map((item: any) => (
                      <div key={item.id} className="bg-[rgba(227,226,229,0.3)] rounded-[20px] p-[24px] md:p-[32px] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
                        <div className="w-full aspect-[370/192] rounded-[16px] bg-gray-300 relative overflow-hidden mb-[16px]">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/370x192?text=CONTOH';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#031F41] bg-opacity-80 text-white font-['Inter',sans-serif] font-semibold text-[32px] md:text-[48px] uppercase tracking-widest relative">
                               <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                CONTOH
                               </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col flex-1">
                          <p className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#FF715D] mb-[8px]">
                            {item.category || 'KATEGORI'}
                          </p>
                          <h4 className="font-['Manrope',sans-serif] font-bold text-[20px] leading-[28px] text-[#031F41] mb-[8px] line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#44474E] mb-[16px] line-clamp-3">
                            {item.description}
                          </p>
                          
                          <div className="mt-auto pt-[4px]">
                            <a 
                              href={item.link_url || '#'} 
                              className="inline-block font-['Inter',sans-serif] font-bold text-[12px] leading-[16px] uppercase text-[#1D3557] border-b-[2px] border-[#1D3557] pb-[4px] hover:text-[#FF715D] hover:border-[#FF715D] transition-colors w-fit"
                            >
                              LIHAT DETAIL
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
