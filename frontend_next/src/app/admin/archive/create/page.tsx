'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CreateArchivePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    date_month: '',
    description: '',
    category: '',
    image_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || new Date().getFullYear() : value
    }));

    if (name === 'image_url' && value) {
      setPreviewUrl(value);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `archive/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dokumentasi')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('dokumentasi')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setPreviewUrl(publicUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Gagal upload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('archive_kegiatan')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category || 'UMUM',
          year: formData.year,
          image_url: formData.image_url,
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
              <input 
                type="text"
                name="date_month"
                value={formData.date_month}
                onChange={handleChange}
                required
                className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                placeholder="Contoh: 19 Mar"
              />
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
              Upload gambar atau masukkan URL. Format: JPG, PNG, WEBP. Maks 5MB.
            </p>

            {/* Hidden file input */}
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Preview area - shown when image is uploaded/set */}
            {previewUrl ? (
              <div className="relative w-full rounded-[12px] overflow-hidden border border-[#E2E8F0] dark:border-[#233554] bg-[#F8FAFC] dark:bg-[#0a192f] transition-colors">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full max-h-[280px] object-cover"
                  onError={() => setPreviewUrl(null)}
                />
                <div className="absolute top-[8px] right-[8px] flex gap-[8px]">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 dark:bg-[#112240]/90 backdrop-blur-sm text-[#4A5568] dark:text-gray-300 rounded-full w-[32px] h-[32px] flex items-center justify-center hover:bg-white dark:hover:bg-[#112240] transition-colors shadow-md text-[14px]"
                    title="Ganti gambar"
                  >
                    🔄
                  </button>
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500/90 backdrop-blur-sm text-white rounded-full w-[32px] h-[32px] flex items-center justify-center hover:bg-red-600 transition-colors shadow-md text-[14px]"
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-[16px] py-[10px] bg-white/80 dark:bg-[#112240]/80 backdrop-blur-sm border-t border-[#E2E8F0] dark:border-[#233554]">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#4A5568] dark:text-gray-400 truncate">
                    {formData.image_url}
                  </p>
                </div>
              </div>
            ) : (
              /* Drag & Drop zone - shown when no image */
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`w-full bg-[#F8FAFC] dark:bg-[#0a192f] border-[2px] border-dashed rounded-[12px] flex flex-col items-center justify-center py-[40px] gap-[12px] transition-all duration-200 cursor-pointer
                  ${dragActive 
                    ? 'border-[#2B6CB0] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.01]' 
                    : 'border-[#E2E8F0] dark:border-[#233554] hover:border-[#A0AEC0] dark:hover:border-[#3a5070] hover:bg-[#F0F4F8] dark:hover:bg-[#0c1e38]'
                  }
                  ${uploading ? 'pointer-events-none opacity-70' : ''}
                `}
              >
                {uploading ? (
                  <>
                    <div className="w-[40px] h-[40px] border-[3px] border-[#E2E8F0] dark:border-[#233554] border-t-[#2B6CB0] dark:border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#2B6CB0] dark:text-blue-400">
                      Mengupload gambar...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-[48px] h-[48px] rounded-full bg-[#EBF8FF] dark:bg-blue-900/30 flex items-center justify-center text-[22px]">
                      📷
                    </div>
                    <div className="flex flex-col items-center gap-[4px]">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#1D3557] dark:text-white">
                        {dragActive ? 'Lepaskan file di sini' : 'Klik atau seret gambar ke sini'}
                      </span>
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#A0AEC0]">
                        JPG, PNG, atau WEBP — Maksimal 5MB
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Manual URL input as fallback */}
            <div className="flex items-center gap-[12px] mt-[8px]">
              <div className="flex-1 h-[1px] bg-[#E2E8F0] dark:bg-[#233554]"></div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#A0AEC0] uppercase tracking-wider">atau masukkan URL</span>
              <div className="flex-1 h-[1px] bg-[#E2E8F0] dark:bg-[#233554]"></div>
            </div>

            <input 
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
              placeholder="https://contoh.com/gambar.jpg"
            />
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
            disabled={loading || uploading}
            className="flex items-center justify-center bg-[#222375] dark:bg-[#173f97] rounded-[8px] w-[168px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-white hover:bg-[#10114a] dark:hover:bg-[#1e4eb8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
          </button>
        </div>
      </form>
    </div>
  );
}
