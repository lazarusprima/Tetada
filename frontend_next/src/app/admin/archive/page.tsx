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

export default function AdminArchive() {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear(),
    image_url: '',
    link_url: ''
  });

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

  const handleOpenModal = (item?: ArchiveItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        year: item.year,
        image_url: item.image_url || '',
        link_url: item.link_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        year: new Date().getFullYear(),
        image_url: '',
        link_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('archive_kegiatan')
          .update(formData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        alert('Data berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('archive_kegiatan')
          .insert([formData]);
        
        if (error) throw error;
        alert('Data berhasil ditambahkan!');
      }
      
      handleCloseModal();
      fetchArchives();
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
      try {
        const { error } = await supabase
          .from('archive_kegiatan')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        alert('Data berhasil dihapus!');
        fetchArchives();
      } catch (error: any) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const filteredArchives = archives.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.year.toString().includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-['Inter',sans-serif] font-extrabold text-[32px] md:text-[40px] leading-tight text-[#031F41] dark:text-white transition-colors">
          Kelola Archive Kegiatan
        </h1>
        <p className="text-[16px] text-gray-500 dark:text-gray-400 transition-colors">Tambah, edit, dan hapus Kegiatan</p>
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
              className="w-full bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] py-[8px] pl-[36px] pr-[16px] text-[14px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
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
                <tr>
                  <td colSpan={5} className="py-[32px] text-center text-gray-500 dark:text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredArchives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-[32px] text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data arsip ditemukan.
                  </td>
                </tr>
              ) : (
                filteredArchives.map((item) => (
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
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-blue-600 dark:text-blue-400 truncate max-w-[100px] inline-block transition-colors">
                          Tersedia
                        </span>
                      ) : (
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-gray-400 dark:text-gray-500 transition-colors">
                          Tidak ada
                        </span>
                      )}
                    </td>
                    <td className="py-[16px] px-[24px]">
                      <div className="flex items-center justify-center gap-[8px]">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="bg-[#EBF8FF] dark:bg-blue-900/30 text-[#2B6CB0] dark:text-blue-400 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[12px] px-[16px] py-[6px] rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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
        <span>Menampilkan {filteredArchives.length} dari {archives.length} kegiatan</span>
        <div className="flex gap-[8px]">
          <span className="bg-[#222375] dark:bg-[#173f97] text-white w-[28px] h-[28px] rounded-[4px] flex items-center justify-center font-bold">1</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#112240] rounded-[16px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl p-[32px] transition-colors">
            <h2 className="text-[24px] font-bold text-[#031F41] dark:text-white mb-[24px] transition-colors">
              {editingItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">Nama Kegiatan</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
                  placeholder="Contoh: Pemeriksaan Kesehatan Gratis..."
                />
              </div>

              <div className="grid grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">Kategori</label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
                    placeholder="Contoh: PENGABDIAN MASYARAKAT"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">Tahun</label>
                  <input 
                    type="number" 
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">Deskripsi Lengkap</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 resize-none transition-colors"
                  placeholder="Penjelasan detail tentang kegiatan tersebut..."
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">URL Gambar / File (Opsional)</label>
                <input 
                  type="text" 
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
                  placeholder="/assets/image.jpg"
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-[#4A5568] dark:text-gray-300">Link Detail Kegiatan (Opsional)</label>
                <input 
                  type="text" 
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-gray-300 dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-gray-900 dark:text-white outline-none focus:border-[#031F41] dark:focus:border-blue-500 transition-colors"
                  placeholder="https://ipb.ac.id/news..."
                />
              </div>

              <div className="flex justify-end gap-[12px] mt-[12px] pt-[20px] border-t border-gray-200 dark:border-[#233554] transition-colors">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-[20px] py-[10px] rounded-[8px] font-bold text-[#4A5568] dark:text-gray-300 bg-gray-100 dark:bg-[#233554] hover:bg-gray-200 dark:hover:bg-[#2a3f66] transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-[20px] py-[10px] rounded-[8px] font-bold text-white bg-[#031F41] dark:bg-[#173f97] hover:bg-[#102F77] dark:hover:bg-[#1e4eb8] transition-colors"
                >
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
