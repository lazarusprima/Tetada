'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STATUS_OPTIONS = ['Akan Datang', 'Aktif', 'Selesai'];

export default function TambahEventPage() {
  const router = useRouter();

  const [namaEvent, setNamaEvent] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState('Akan Datang');
  const [fotoUrl, setFotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('events').insert([
      {
        nama_event: namaEvent,
        tanggal,
        lokasi,
        deskripsi,
        status,
        foto_url: fotoUrl || null,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      alert('Gagal menambahkan event: ' + error.message);
    } else {
      router.push('/admin/events');
    }
  };

  return (
    <div className="flex flex-col gap-[34px]">

      {/* Page Header */}
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

      {/* Form Card */}
      <div className="bg-white dark:bg-[#112240] rounded-[30px] border border-[#E2E8F0] dark:border-[#233554] p-[23px_26px_47px] shadow-sm flex flex-col gap-[20px] max-w-[1056px]">

        <div className="flex flex-col gap-[7px]">
          <h2 className="text-[#1D3557] dark:text-white font-bold text-[14px]">Detail Event</h2>
          <div className="h-px bg-[#E2E8F0] dark:bg-[#233554] w-full"></div>
        </div>

        <form className="flex flex-col gap-[24px] mt-[10px]" onSubmit={handleSubmit}>

          {/* Nama Event */}
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

          {/* Tanggal & Status */}
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
                  } catch { /* ignore */ }
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
          </div>

          {/* Lokasi */}
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

          {/* Deskripsi */}
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

          {/* Foto URL */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px] uppercase tracking-wide">
              URL Foto / File (opsional)
            </label>
            <input
              type="text"
              placeholder="https://... atau nama file (e.g. 2.jpeg)"
              value={fotoUrl}
              onChange={e => setFotoUrl(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#4A5568] dark:text-[#ccd6f6] text-[13px] focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
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
