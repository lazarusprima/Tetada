'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CreateArchivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    date_month: '',
    description: '',
    category: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB.');
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrl: string | null = null;

    if (fotoFile) {
      const fileExt = fotoFile.name.split('.').pop();
      const fileName = `archive/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dokumentasi')
        .upload(fileName, fotoFile, { upsert: true });

      if (uploadError) {
        alert('Gagal mengupload foto: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('dokumentasi')
        .getPublicUrl(uploadData.path);
      uploadedUrl = publicUrlData.publicUrl;
    }

    try {
      const { error } = await supabase
        .from('archive_kegiatan')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category || 'UMUM',
          year: formData.year,
          image_url: uploadedUrl
        }]);

      if (error) throw error;
      
      alert('Kegiatan berhasil ditambahkan!');
      router.push('/admin/archive');
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan kegiatan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[32px] w-full max-w-[1047px] mx-auto pb-[50px]">
      
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[22px] leading-[28px] text-[#1D3557] dark:text-white transition-colors">
            Tambah Kegiatan
          </h1>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[16px] text-[#457B9D] dark:text-[#93c5fd] transition-colors">
            Isi informasi kegiatan yang ingin didokumentasikan
          </p>
        </div>
        
        <Link 
          href="/admin/archive"
          className="flex items-center justify-center bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#4A5568] dark:text-white hover:bg-gray-200 dark:hover:bg-[#1e2d4a] transition-colors"
        >
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        
        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm transition-colors">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] leading-[18px] text-[#1D3557] dark:text-white border-b border-[#E2E8F0] dark:border-[#233554] pb-[16px] transition-colors">
            Informasi Kegiatan
          </h2>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
              Nama Kegiatan *
            </label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
              placeholder="Contoh: Pelantikan TETADA 9"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
              Kategori Kegiatan *
            </label>
            <input 
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
              placeholder="Contoh: PENGABDIAN MASYARAKAT"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                Tahun Pelaksanaan *
              </label>
              <div className="relative">
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white appearance-none outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                >
                  {Array.from({ length: new Date().getFullYear() - 2015 + 1 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="absolute right-[16px] top-[50%] -translate-y-1/2 text-[#A0AEC0] pointer-events-none">▾</span>
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                Tanggal / Bulan *
              </label>
              <div className="flex gap-[8px]">
                <div className="relative w-1/3">
                  <select 
                    required
                    className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white appearance-none outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                    onChange={(e) => {
                      const currentMonth = formData.date_month.split(' ')[1] || 'Jan';
                      setFormData({...formData, date_month: `${e.target.value} ${currentMonth}`});
                    }}
                    value={formData.date_month ? formData.date_month.split(' ')[0] : '1'}
                  >
                    <option value="" disabled hidden>Tgl</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="absolute right-[12px] top-[50%] -translate-y-1/2 text-[#A0AEC0] pointer-events-none text-[10px]">▾</span>
                </div>
                <div className="relative w-2/3">
                  <select 
                    required
                    className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white appearance-none outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                    onChange={(e) => {
                      const currentDay = formData.date_month.split(' ')[0] || '1';
                      setFormData({...formData, date_month: `${currentDay} ${e.target.value}`});
                    }}
                    value={formData.date_month ? formData.date_month.split(' ')[1] : 'Jan'}
                  >
                    <option value="" disabled hidden>Bulan</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span className="absolute right-[12px] top-[50%] -translate-y-1/2 text-[#A0AEC0] pointer-events-none text-[10px]">▾</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300 flex justify-between">
              <span>Ringkasan Kegiatan *</span>
              <span className="font-normal text-[#A0AEC0]">{formData.description.length} / 750 karakter</span>
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={750}
              rows={4}
              className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 resize-none transition-colors"
              placeholder="Contoh: Pelantikan Tetada di Gunung Bunder..."
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm transition-colors">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] leading-[18px] text-[#1D3557] dark:text-white border-b border-[#E2E8F0] dark:border-[#233554] pb-[16px] transition-colors">
            Upload Dokumentasi
          </h2>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
              Foto Dokumentasi
            </label>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] leading-[13px] text-[#A0AEC0] mb-[8px]">
              Upload gambar. Format: JPG, PNG, WEBP. Maks 2MB.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileChange(e.dataTransfer.files[0]);
              }}
              className={`relative flex flex-col items-center justify-center gap-[10px] rounded-[12px] border-2 border-dashed cursor-pointer transition-colors min-h-[160px] ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-[#E2E8F0] dark:border-[#233554] bg-[#F8FAFC] dark:bg-[#0a192f] hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
              }`}
            >
              {fotoPreview ? (
                <>
                  <img src={fotoPreview} alt="Preview" className="max-h-[140px] max-w-full rounded-[8px] object-contain" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFotoFile(null); setFotoPreview(null); }}
                    className="absolute top-[8px] right-[8px] bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-[24px] h-[24px] flex items-center justify-center text-[12px] font-bold transition-colors"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-[32px] text-[#A0AEC0] dark:text-[#4a5568]"></i>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-[#4A5568] dark:text-[#a8b2d1]">Drag &amp; drop foto di sini</p>
                  </div>
                  <span className="bg-[#222375] text-white text-[12px] font-bold px-[16px] py-[8px] rounded-[8px] hover:bg-[#1a1b5c] transition-colors mt-[4px]">
                    Pilih File
                  </span>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />

            {fotoFile && (
              <p className="text-[11px] text-[#4A5568] dark:text-[#a8b2d1] mt-2">
                <i className="fa-solid fa-check text-green-500 mr-1"></i>
                {fotoFile.name} ({(fotoFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-[16px] mt-[16px]">
          <Link 
            href="/admin/archive"
            className="flex items-center justify-center bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] w-[131px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#718096] dark:text-white hover:bg-gray-200 dark:hover:bg-[#1e2d4a] transition-colors"
          >
            Batal
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-[#222375] dark:bg-[#173f97] rounded-[8px] w-[168px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-white hover:bg-[#10114a] dark:hover:bg-[#1e4eb8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
          </button>
        </div>
      </form>
    </div>
  );
}
