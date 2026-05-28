'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STATUS_OPTIONS = ['Aktif', 'Nonaktif'];

export default function TambahEventPage() {
  const router = useRouter();

  const [namaEvent, setNamaEvent] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState('Aktif');
  const [waktu, setWaktu] = useState('');
  const [linkPendaftaran, setLinkPendaftaran] = useState('');
  const [pendaftaranSelesai, setPendaftaranSelesai] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (pendaftaranSelesai > tanggal) {
      alert('Tanggal pendaftaran tidak boleh melebihi tanggal event!');
      return;
    }
    setIsSubmitting(true);

    let uploadedUrl: string | null = null;

    if (fotoFile) {
      const fileExt = fotoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, fotoFile, { upsert: true });

      if (uploadError) {
        alert('Gagal mengupload foto: ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('gambar')
        .getPublicUrl(uploadData.path);
      uploadedUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('events').insert([
      {
        nama_event: namaEvent,
        tanggal,
        lokasi,
        waktu,
        deskripsi,
        status,
        gambar: uploadedUrl,
        link_pendaftaran: linkPendaftaran,
        open_until: pendaftaranSelesai,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      window.dispatchEvent(new CustomEvent('app-notify', { detail: `Gagal menambahkan event ${namaEvent}: ${error.message}` }));
    } else {
      window.dispatchEvent(new CustomEvent('app-notify', { detail: `telah menambahkan Event baru: ${namaEvent}` }));
      setTimeout(() => {
        router.push('/admin/events');
      }, 100);
    }
  };

  return (
    <div className="flex flex-col gap-[34px]">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[#1D3557] dark:text-white text-[22px] font-bold leading-[1.2] mb-[8px]">
            Tambah Event Baru
          </h1>
          <p className="text-[#457B9D] dark:text-[#8892b0] font-normal text-[13px]">
            Tambah, edit, dan hapus jadwal Event
          </p>
        </div>
        <Link
          href="/admin/events"
          className="flex items-center justify-center gap-[6px] bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] text-[#4A5568] dark:text-[#ccd6f6] font-bold text-[13px] px-[16px] py-[10px] rounded-[12px] hover:bg-[#E2E8F0] transition-colors self-start md:self-auto"
        >
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white dark:bg-[#112240] rounded-[30px] border border-[#E2E8F0] dark:border-[#233554] p-[23px_26px_47px] shadow-sm flex flex-col gap-[20px] max-w-[1056px]">

        <div className="flex flex-col gap-[7px]">
          <h2 className="text-[#1D3557] dark:text-white font-bold text-[14px]">Detail Event</h2>
          <div className="h-px bg-[#E2E8F0] dark:bg-[#233554] w-full"></div>
        </div>

        <form className="flex flex-col gap-[24px] mt-[10px]" onSubmit={handleSubmit}>

          <div className="flex flex-col gap-[7px]">
            <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
              Nama Event *
            </label>
            <input
              type="text"
              required
              placeholder="IPB Foodbank"
              value={namaEvent}
              onChange={e => setNamaEvent(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-[26px]">
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
                Tanggal Event *
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                onClick={e => {
                  try {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      (e.currentTarget as HTMLInputElement).showPicker();
                    }
                  } catch {  }
                }}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] font-bold text-[12px] focus:outline-none focus:border-blue-500 cursor-pointer w-full"
              />
            </div>
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
                Status *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
                Waktu Event *
              </label>
              <input
                type="time"
                required
                value={waktu}
                onChange={e => setWaktu(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] font-bold text-[12px] focus:outline-none focus:border-blue-500 cursor-pointer w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[7px]">
            <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
              Lokasi *
            </label>
            <input
              type="text"
              required
              placeholder="Gedung Rektorat Lt. 1"
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#4A5568] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-[26px]">
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
                Link Pendaftaran *
              </label>
              <input
                type="url"
                required
                placeholder="https://bit.ly/pendaftaran-event"
                value={linkPendaftaran}
                onChange={e => setLinkPendaftaran(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#4A5568] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
                Pendaftaran Sampai Tanggal *
              </label>
              <input
                type="date"
                required
                max={tanggal}
                value={pendaftaranSelesai}
                onChange={e => setPendaftaranSelesai(e.target.value)}
                onClick={e => {
                  try {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      (e.currentTarget as HTMLInputElement).showPicker();
                    }
                  } catch {  }
                }}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] font-bold text-[12px] focus:outline-none focus:border-blue-500 cursor-pointer w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
              Deskripsi
            </label>
            <textarea
              rows={4}
              placeholder="Foodbank Tetada 9 dengan..."
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] py-[12px] text-[#4A5568] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
              Upload Foto (opsional · JPG, PNG, WEBP · maks. 2MB)
            </label>

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
                    <p className="text-[12px] text-[#A0AEC0] mt-[4px]">atau</p>
                  </div>
                  <span className="bg-[#222375] text-white text-[12px] font-bold px-[16px] py-[8px] rounded-[8px] hover:bg-[#1a1b5c] transition-colors">
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
              <p className="text-[11px] text-[#4A5568] dark:text-[#a8b2d1]">
                <i className="fa-solid fa-check text-green-500 mr-1"></i>
                {fotoFile.name} ({(fotoFile.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-[15px] mt-[8px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-[168px] h-[48px] text-white font-bold text-[13px] rounded-[12px] transition-colors flex items-center justify-center gap-[8px] ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#031F41] hover:bg-[#102F77]'
              }`}
            >
              {isSubmitting ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
              ) : (
                <><i className="fa-solid fa-floppy-disk"></i> Tambahkan</>
              )}
            </button>
            <Link
              href="/admin/events"
              className="w-full sm:w-[131px] h-[48px] bg-[#F0F2F5] dark:bg-[#233554] hover:bg-[#E2E8F0] dark:hover:bg-[#1e2d4a] border border-[#E2E8F0] dark:border-transparent text-[#718096] dark:text-[#ccd6f6] font-bold text-[13px] rounded-[12px] transition-colors flex items-center justify-center"
            >
              Batal
            </Link>
          </div>

        </form>
      </div>

    </div>
  );
}