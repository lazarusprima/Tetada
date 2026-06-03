'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

function EditJadwalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [stokTotal, setStokTotal] = useState('');
  const [stokSisa, setStokSisa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalTanggal, setOriginalTanggal] = useState('');

  useEffect(() => {
    if (id) {
      const fetchJadwal = async () => {
        const { data, error } = await supabase.from('jadwal_distribusi').select('*').eq('id', id).single();
        if (data && !error) {
          setTanggal(data.tanggal_distribusi || '');
          setOriginalTanggal(data.tanggal_distribusi || '');
          setWaktu(data.waktu ? data.waktu.substring(0, 5) : '');
          setLokasi(data.lokasi || '');
          setStokTotal(data.stok_paket_total?.toString() || '');
          setStokSisa(data.stok_paket_sisa?.toString() || '');
        }
        setIsLoading(false);
      };
      fetchJadwal();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (parseInt(stokSisa) > parseInt(stokTotal)) {
      alert("Stok paket total tidak boleh kurang dari stok paket sisa!");
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('jadwal_distribusi')
      .update({
        tanggal_distribusi: tanggal,
        waktu: waktu,
        lokasi: lokasi,
        stok_paket_total: parseInt(stokTotal),
        stok_paket_sisa: parseInt(stokSisa)
      })
      .eq('id', id)
      .select();

    setIsSubmitting(false);

    if (error) {
      alert(`Gagal mengedit jadwal: ${error.message}`);
    } else if (!data || data.length === 0) {
      alert("Gagal mengedit: Kemungkinan akses ditolak oleh aturan database (RLS) atau data tidak ditemukan.");
    } else {
      let notifMsg = `telah memperbarui Jadwal Distribusi Buah & Susu`;
      if (tanggal !== originalTanggal) {
        notifMsg += ` (tanggal diubah dari ${originalTanggal} menjadi ${tanggal})`;
      } else {
        notifMsg += ` pada tanggal ${tanggal}`;
      }
      window.dispatchEvent(new CustomEvent('app-notify', { detail: notifMsg }));

      alert("Jadwal berhasil diperbarui!");
      router.push('/admin/stok');
      router.refresh();
    }
  };

  if (isLoading) {
    return <div className="text-center p-10 text-[#4A5568] dark:text-[#a8b2d1]">Memuat data...</div>;
  }

  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[#1D3557] dark:text-white text-[22px] font-bold leading-[1.2] mb-[8px]">
            Edit Jadwal Buah & Susu
          </h1>
          <p className="text-[#457B9D] dark:text-[#8892b0] font-normal text-[13px]">
            Tambah, edit, dan hapus jadwal distribusi & stok paket
          </p>
        </div>
        <Link
          href="/admin/stok"
          className="flex items-center justify-center gap-[6px] bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] text-[#4A5568] dark:text-[#ccd6f6] font-bold text-[13px] px-[16px] py-[10px] rounded-[12px] hover:bg-[#E2E8F0] transition-colors"
        >
          &larr; Kembali
        </Link>
      </div>

      <div className="bg-white dark:bg-[#112240] rounded-[30px] border border-[#E2E8F0] dark:border-[#233554] p-[23px_26px_47px] shadow-sm flex flex-col gap-[20px] max-w-[1056px]">
        <div className="flex flex-col gap-[7px]">
          <h2 className="text-[#1D3557] dark:text-white font-bold text-[14px]">Jadwal Distribusi</h2>
          <div className="h-px bg-black dark:bg-[#233554] w-full border-t border-[#E2E8F0] dark:border-transparent"></div>
        </div>

        <form className="flex flex-col gap-[24px] mt-[10px]" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-[26px]">
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px]">Tanggal Distribusi *</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                onClick={(e) => {
                  try {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      e.currentTarget.showPicker();
                    }
                  } catch (err) {  }
                }}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#1D3557] dark:text-[#ccd6f6] font-bold text-[12px] focus:outline-none focus:border-blue-500 cursor-pointer w-full appearance-none relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px]">Waktu *</label>
              <input
                type="time"
                required
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                onClick={(e) => {
                  try {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      e.currentTarget.showPicker();
                    }
                  } catch (err) {  }
                }}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#4A5568] dark:text-[#ccd6f6] text-[12px] focus:outline-none focus:border-blue-500 cursor-pointer w-full appearance-none relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-[26px]">
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px]">Lokasi *</label>
              <input
                type="text"
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#4A5568] dark:text-[#ccd6f6] text-[12px] focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-[7px] flex-1">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px]">Stok Paket Total *</label>
              <input
                type="number"
                required
                value={stokTotal}
                onChange={(e) => setStokTotal(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#2B6CB0] dark:text-[#63b3ed] text-[12px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-[26px]">
            <div className="flex flex-col gap-[7px] flex-1 md:max-w-[calc(50%-13px)]">
              <label className="text-[#4A5568] dark:text-[#a8b2d1] font-bold text-[11px]">Stok Paket Sisa *</label>
              <input
                type="number"
                required
                value={stokSisa}
                onChange={(e) => setStokSisa(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#0a192f] border-[1.4px] border-[#E2E8F0] dark:border-[#233554] rounded-[12px] px-[16px] h-[46px] text-[#2B6CB0] dark:text-[#63b3ed] text-[12px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[15px] mt-[24px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-[168px] h-[48px] text-white font-bold text-[13px] rounded-[12px] transition-colors flex items-center justify-center ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#222375] hover:bg-[#1a1b5c]'}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link
              href="/admin/stok"
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

export default function EditJadwalPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Memuat...</div>}>
      <EditJadwalContent />
    </Suspense>
  );
}