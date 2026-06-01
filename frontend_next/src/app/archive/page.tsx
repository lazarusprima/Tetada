'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  date_month: string;
  image_url: string;
  link_url?: string;
}

const SkeletonCard = () => (
  <div className="bg-[rgba(227,226,229,0.3)] rounded-[20px] p-[24px] md:p-[32px] flex flex-col animate-pulse">
    <div className="w-full aspect-[370/192] rounded-[16px] bg-gray-300/60 mb-[16px]"></div>
    <div className="flex flex-col flex-1">
      <div className="w-1/4 h-[15px] bg-gray-300/60 rounded mb-[12px]"></div>
      <div className="w-3/4 h-[28px] bg-gray-300/60 rounded mb-[12px]"></div>
      <div className="w-full h-[20px] bg-gray-300/60 rounded mb-[8px]"></div>
      <div className="w-5/6 h-[20px] bg-gray-300/60 rounded mb-[16px]"></div>
      <div className="mt-auto pt-[4px]">
        <div className="w-1/3 h-[16px] bg-gray-300/60 rounded"></div>
      </div>
    </div>
  </div>
);

export default function ArchivePage() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [errorState, setErrorState] = useState<boolean>(false);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const { data, error } = await supabase
          .from('archive_kegiatan')
          .select('*')
          .order('year', { ascending: false });
        
        if (error) {
          throw error;
        }

        if (data) {
          setArchives(data);
        }
      } catch (err) {
        console.error("Error fetching archives:", err);
        setErrorState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  const filteredArchives = archives.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const groupedArchives = filteredArchives.reduce((acc, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = [];
    }
    acc[curr.year].push(curr);
    return acc;
  }, {} as Record<number, ArchiveItem[]>);

  const sortedYears = Object.keys(groupedArchives).map(Number).sort((a, b) => b - a);
  const displayYears = sortedYears;
  const displayArchives = groupedArchives;

  useEffect(() => {
    if (displayYears.length > 0 && (activeYear === null || !displayYears.includes(activeYear))) {
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

      <div className="max-w-[1440px] mx-auto relative mt-[50px] px-[24px] lg:px-[104px]">

        <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[130px] relative">

          <aside className="lg:w-[300px] flex-shrink-0 lg:sticky lg:top-[120px] h-fit flex flex-col gap-6">
            <div className="bg-white rounded-[16px] p-[12px] shadow-sm flex items-center w-full">
              <div className="relative w-full">
                <span className="absolute left-[16px] top-[50%] -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Cari arsip..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F3F6] border border-transparent focus:border-[#1D3557] rounded-[12px] py-[10px] pl-[44px] pr-[16px] text-[#031F41] text-[14px] outline-none transition-colors font-['Inter',sans-serif]"
                />
              </div>
            </div>

            <div className="bg-[#F5F3F6] rounded-[20px] p-[32px] shadow-sm">
              <h3 className="font-['Manrope',sans-serif] font-extrabold text-[20px] leading-[28px] tracking-[-0.5px] text-[#031F41] mb-[24px]">
                Timeline Arsip
              </h3>
              <nav className="flex flex-col gap-[4px]">
                {loading ? (
                   Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center px-[16px] py-[12px] rounded-[16px] animate-pulse">
                      <div className="h-[20px] bg-gray-300/60 rounded w-[80px]"></div>
                    </div>
                  ))
                ) : displayYears.length === 0 ? (
                  <div className="text-gray-500 font-['Inter',sans-serif] text-[14px]">Tidak ada tahun tersedia</div>
                ) : (
                  displayYears.map((year) => {
                    const isActive = activeYear === year;
                    return (
                      <a 
                        key={year}
                        href={`#year-${year}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveYear(year);
                          document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`group flex justify-between items-center px-[16px] py-[12px] rounded-[16px] transition-all duration-300 ${isActive ? 'bg-[#E9E7EB]' : 'hover:bg-[#E9E7EB]/70'}`}
                      >
                        <span className={`font-['Inter',sans-serif] text-[16px] leading-[24px] transition-colors duration-300 ${isActive ? 'font-extrabold text-[#44474E]' : 'font-normal text-[#031F41] group-hover:text-[#44474E]'}`}>
                          Tahun {year}
                        </span>
                        <div className={`w-[9px] h-[9px] rounded-full transition-all duration-300 ${isActive ? 'bg-[#44474E] opacity-100 scale-100' : 'bg-[#44474E] opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-100'}`}></div>
                      </a>
                    );
                  })
                )}
              </nav>
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-[80px]">
            {loading ? (
              <div className="flex flex-col gap-[48px]">
                <div className="flex items-center gap-[24px] animate-pulse">
                  <div className="w-[150px] h-[72px] md:h-[96px] bg-gray-300/60 rounded-[12px]"></div>
                  <div className="h-[2px] flex-1 bg-gray-300/60"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            ) : errorState ? (
              <div className="text-center py-20 bg-white rounded-[20px] shadow-sm">
                <p className="text-[#FF715D] font-['Inter',sans-serif] font-semibold text-[18px] mb-2">Terjadi kesalahan</p>
                <p className="text-gray-500 font-['Inter',sans-serif] text-[14px]">Gagal memuat data arsip. Silakan muat ulang halaman.</p>
              </div>
            ) : displayYears.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[20px] shadow-sm">
                <p className="text-gray-500 font-['Inter',sans-serif] text-[16px]">
                  {archives.length === 0 ? "Belum ada arsip kegiatan." : "Tidak ada arsip yang cocok dengan pencarian Anda."}
                </p>
              </div>
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
                          <div className="flex items-center gap-2 mb-[8px]">
                            <p className="font-['Inter',sans-serif] font-semibold text-[10px] leading-[15px] tracking-[1px] uppercase text-[#FF715D]">
                              {item.category || 'KATEGORI'}
                            </p>
                            {item.date_month && (
                              <>
                                <span className="text-[#A0AEC0] text-[10px]">•</span>
                                <p className="font-['Inter',sans-serif] font-medium text-[10px] leading-[15px] uppercase text-[#A0AEC0]">
                                  {item.date_month} {item.year}
                                </p>
                              </>
                            )}
                          </div>
                          <h4 className="font-['Manrope',sans-serif] font-bold text-[20px] leading-[28px] text-[#031F41] mb-[8px] line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#44474E] mb-[16px] line-clamp-3">
                            {item.description}
                          </p>
                          
                          <div className="mt-auto pt-[4px]">
                            <a 
                              href={`/archive/${item.id}`} 
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
