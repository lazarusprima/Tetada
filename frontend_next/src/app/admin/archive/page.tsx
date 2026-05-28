'use client';

import { useState, useEffect } from 'react';
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

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-[#E2E8F0] dark:border-[#233554]">
    <td className="py-[16px] px-[24px]">
      <div className="h-[20px] bg-gray-200 dark:bg-[#1a2b4c] rounded w-3/4 mb-2"></div>
      <div className="h-[16px] bg-gray-200 dark:bg-[#1a2b4c] rounded w-1/2"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="h-[16px] bg-gray-200 dark:bg-[#1a2b4c] rounded w-full mb-2"></div>
      <div className="h-[16px] bg-gray-200 dark:bg-[#1a2b4c] rounded w-2/3"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="h-[20px] bg-gray-200 dark:bg-[#1a2b4c] rounded w-12"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="w-[40px] h-[40px] bg-gray-200 dark:bg-[#1a2b4c] rounded-lg"></div>
    </td>
    <td className="py-[16px] px-[24px]">
      <div className="flex gap-2 justify-center">
        <div className="h-[28px] w-[50px] bg-gray-200 dark:bg-[#1a2b4c] rounded-full"></div>
        <div className="h-[28px] w-[60px] bg-gray-200 dark:bg-[#1a2b4c] rounded-full"></div>
      </div>
    </td>
  </tr>
);

export default function AdminArchive() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArchives = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('archive_kegiatan')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching archives:', error);
    } else {
      setArchives(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('archive_kegiatan')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDeleteConfirmId(null);
      fetchArchives();
    } catch (error: any) {
      console.error('Error deleting data:', error);
      alert('Gagal menghapus data: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredArchives = archives.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.year.toString().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredArchives.length / itemsPerPage);
  const currentArchives = filteredArchives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-['Inter',sans-serif] font-extrabold text-[32px] md:text-[40px] leading-tight text-[#031F41] dark:text-white transition-colors">
          Kelola Archive Kegiatan
        </h1>
        <p className="font-['Inter',sans-serif] text-[16px] text-gray-500 dark:text-gray-400 transition-colors">Tambah, edit, dan hapus Kegiatan</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-[16px]">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#1D3557] dark:text-gray-200 transition-colors">
          Daftar Kegiatan
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <span className="absolute left-[12px] top-[50%] -translate-y-1/2 text-gray-400 dark:text-gray-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-['Inter',sans-serif] w-full bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] py-[8px] pl-[36px] pr-[16px] text-[14px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
            />
          </div>

          <Link
            href="/admin/archive/create"
            className="w-full sm:w-auto bg-[#031F41] dark:bg-[#173f97] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] px-[20px] py-[10px] rounded-[8px] hover:bg-[#102F77] dark:hover:bg-[#1e4eb8] transition-colors whitespace-nowrap text-center"
          >
            + Tambah Kegiatan
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[12px] overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-[#F8FAFC] dark:bg-[#0a192f] border-b border-[#E2E8F0] dark:border-[#233554] transition-colors">
              <tr>
                <th className="py-[16px] px-[24px] text-left font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">
                  NAMA KEGIATAN & KATEGORI
                </th>
                <th className="py-[16px] px-[24px] text-left font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider">
                  DESKRIPSI
                </th>
                <th className="py-[16px] px-[24px] text-left font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider w-[100px]">
                  TAHUN
                </th>
                <th className="py-[16px] px-[24px] text-left font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider w-[120px]">
                  FILE
                </th>
                <th className="py-[16px] px-[24px] text-center font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] text-[#718096] dark:text-gray-400 uppercase tracking-wider w-[160px]">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#233554]">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : currentArchives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-[32px] text-center text-gray-500 dark:text-gray-400 font-['Plus_Jakarta_Sans',sans-serif]">
                    Tidak ada data arsip ditemukan.
                  </td>
                </tr>
              ) : (
                currentArchives.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#1a2b4c] transition-colors">
                    <td className="py-[16px] px-[24px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#1D3557] dark:text-white transition-colors">
                          {item.title}
                        </span>
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-gray-400 transition-colors">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] text-[#4A5568] dark:text-gray-300 line-clamp-2 max-w-[300px] transition-colors">
                        {item.description}
                      </p>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#1D3557] dark:text-white transition-colors">
                        {item.year}
                      </span>
                    </td>
                    <td className="py-[16px] px-[24px]">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt="thumbnail" 
                          className="w-[40px] h-[40px] object-cover rounded-[8px] shadow-sm border border-gray-200 dark:border-gray-700" 
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] bg-gray-100 dark:bg-[#0a192f] rounded-[8px] flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500 font-['Plus_Jakarta_Sans',sans-serif] border border-gray-200 dark:border-[#233554]">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <div className="flex items-center justify-center gap-[8px]">
                        <Link
                          href={`/admin/archive/edit/${item.id}`}
                          className="bg-[#EBF8FF] dark:bg-blue-900/30 text-[#2B6CB0] dark:text-blue-400 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] px-[16px] py-[6px] rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="bg-[#FFF5F5] dark:bg-red-900/30 text-[#C53030] dark:text-red-400 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] px-[16px] py-[6px] rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center text-[12px] text-[#718096] dark:text-gray-400 font-['Plus_Jakarta_Sans',sans-serif] transition-colors">
        <span>
          Menampilkan {filteredArchives.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredArchives.length)} dari {filteredArchives.length} kegiatan
        </span>
        
        {totalPages > 1 && (
          <div className="flex gap-[8px]">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[28px] h-[28px] rounded-[4px] flex items-center justify-center font-bold transition-colors ${
                    isActive 
                      ? 'bg-[#222375] dark:bg-[#173f97] text-white' 
                      : 'bg-gray-100 dark:bg-[#112240] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1a2b4c]'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#112240] rounded-[16px] p-[32px] shadow-xl w-[90%] max-w-[400px]">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] text-[#031F41] dark:text-white mb-[16px]">
              Konfirmasi Hapus
            </h3>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-gray-600 dark:text-gray-300 mb-[24px]">
              Apakah Anda yakin ingin menghapus arsip kegiatan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-[12px] justify-end">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-[16px] py-[8px] rounded-[8px] text-[#4A5568] dark:text-gray-300 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-[16px] py-[8px] rounded-[8px] bg-[#E53E3E] hover:bg-[#C53030] text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] transition-colors flex items-center gap-2"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
