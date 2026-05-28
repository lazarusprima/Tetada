'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminStokPage() {
  const [stock, setStock] = useState(0);
  const [maxStock, setMaxStock] = useState(0);
  const [totalDistribusi, setTotalDistribusi] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);

  const [schedules, setSchedules] = useState<any[]>([]);

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const getAutoStatus = (tanggal: string, stokSisa: number) => {
    const todayStr = getTodayStr();
    if (tanggal < todayStr || stokSisa <= 0) return 'Selesai';
    if (tanggal === todayStr) return 'Aktif';
    return 'Akan Datang';
  };

  const fetchSchedules = async () => {
    const { data } = await supabase.from('jadwal_distribusi').select('*').order('tanggal_distribusi', { ascending: false });
    if (data) {
      setSchedules(data);
      const count = data.filter(s => {
        const st = getAutoStatus(s.tanggal_distribusi, s.stok_paket_sisa);
        return st === 'Aktif' || st === 'Selesai';
      }).length;
      setTotalDistribusi(count);
    }
  };

  const fetchStok = async () => {
    const todayStr = getTodayStr();
    const { data } = await supabase
      .from('jadwal_distribusi')
      .select('id, stok_paket_sisa, stok_paket_total')
      .eq('tanggal_distribusi', todayStr)
      .order('tanggal_distribusi', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      setStock(data.stok_paket_sisa || 0);
      setMaxStock(data.stok_paket_total || 0);
      setActiveScheduleId(data.id);
    } else {
      setStock(0);
      setMaxStock(0);
      setActiveScheduleId(null);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchStok();
  }, []);

  const openDeleteModal = (s: any) => {
    setSelectedSchedule(s);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDelete = async () => {
    if (selectedSchedule) {
      const { error } = await supabase.from('jadwal_distribusi').delete().eq('id', selectedSchedule.id);
      if (!error) {
        fetchSchedules();
        fetchStok();
      }
      closeDeleteModal();
    }
  };

  const updateStock = async (amount: number) => {
    if (!activeScheduleId) return;
    const newStock = stock + amount;
    if (newStock < 0 || newStock > maxStock) return;

    setStock(newStock);
    setSchedules(prev => prev.map(s => s.id === activeScheduleId ? { ...s, stok_paket_sisa: newStock } : s));

    const { error } = await supabase
      .from('jadwal_distribusi')
      .update({ stok_paket_sisa: newStock })
      .eq('id', activeScheduleId);

    if (!error) {
      await supabase.from('stok_buah_susu').insert([{ jumlah: newStock, max_stok: maxStock, status: 'aktif' }]);
    } else {
      fetchStok();
      fetchSchedules();
      alert('Gagal mengupdate stok.');
    }
  };

  return (
    <div className="flex flex-col gap-[34px]">

      <div>
        <h1 className="text-[#031F41] dark:text-white text-[32px] md:text-[40px] font-extrabold leading-[1.2] mb-[8px]">
          Kelola Buah &amp; Susu
        </h1>
        <p className="text-[#031F41] dark:text-[#8892b0] font-semibold text-[16px] md:text-[20px]">
          Tambah, edit, dan hapus jadwal distribusi &amp; stok paket
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        <div className="sm:col-span-2 bg-[#031F41] dark:bg-[#112240] text-white rounded-[24px] p-[32px] shadow-lg flex flex-col justify-center relative overflow-hidden min-h-[220px]">
          <h4 className="text-[13px] font-bold text-white/60 mb-[20px] uppercase tracking-[1px]">STOK PAKET TERSISA</h4>
          <div className="flex items-center gap-[30px] mb-[20px]">
            <div className="text-[72px] md:text-[92px] font-bold leading-none">{stock}</div>
            {activeScheduleId && (
              <div className="flex flex-col gap-[8px]">
                <button
                  onClick={() => updateStock(1)}
                  disabled={stock >= maxStock}
                  className="w-[44px] h-[44px] bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-[12px] flex items-center justify-center transition-all border border-white/5"
                ><i className="fa-solid fa-plus"></i></button>
                <button
                  onClick={() => updateStock(-1)}
                  disabled={stock <= 0}
                  className="w-[44px] h-[44px] bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white rounded-[12px] flex items-center justify-center transition-all border border-white/5"
                ><i className="fa-solid fa-minus"></i></button>
              </div>
            )}
          </div>
          <p className="text-[15px] text-white/50 mb-[20px]">dari <span className="text-white font-bold">{maxStock}</span> paket total hari ini</p>
          <div className="h-[8px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#38a169] rounded-full transition-all duration-700" style={{ width: `${maxStock > 0 ? (stock / maxStock) * 100 : 0}%` }}></div>
          </div>
          <div className="mt-[20px] text-[12px] text-white/40 italic">
            {activeScheduleId ? '⚡ Update stok langsung via tombol di atas' : '⚠ Tidak ada jadwal distribusi aktif saat ini'}
          </div>
        </div>

        <div className="bg-[#031F41] dark:bg-[#112240] text-white rounded-[24px] p-[32px] shadow-lg flex flex-col items-center justify-center text-center min-h-[220px]">
          <h4 className="text-[13px] font-bold text-white/60 mb-[24px] uppercase tracking-[1px]">TOTAL DISTRIBUSI</h4>
          <div className="flex items-baseline gap-[8px] mb-[12px]">
            <span className="text-[72px] md:text-[92px] font-bold leading-none">{totalDistribusi}</span>
            <span className="text-[18px] font-bold text-white/60">Hari</span>
          </div>
          <p className="text-[13px] text-white/40 mt-auto">Aktif sejak Mei 2026</p>
        </div>

      </div>

      <div className="bg-white dark:bg-[#112240] rounded-[24px] border border-[#E2E8F0] dark:border-[#233554] shadow-sm overflow-hidden flex flex-col mt-[16px]">

        <div className="p-[20px] md:p-[28px_32px] border-b border-[#E2E8F0] dark:border-[#233554] flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-[24px]">
          <h3 className="text-[#1D3557] dark:text-white font-bold text-[18px] self-start md:self-center">Daftar Jadwal Distribusi</h3>
          <div className="flex flex-col sm:flex-row gap-[16px] w-full md:w-auto">
            <div className="relative flex-1 w-full sm:w-[320px]">
              <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#A0AEC0] text-[13px]">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                placeholder="🔍 Cari jadwal..."
                className="w-full bg-[#F0F2F5] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-[11.3px] text-[#A0AEC0] dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <Link
              href="/admin/stok/tambahjadwal"
              className="bg-[#031F41] hover:bg-[#102F77] text-white font-bold text-[13px] px-[20px] py-[10px] rounded-[8px] whitespace-nowrap transition-colors flex items-center justify-center gap-[8px]"
            >
              <i className="fa-solid fa-plus"></i> Tambah Jadwal
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-[#020c1b] border-b border-[#E2E8F0] dark:border-[#233554]">
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">TANGGAL</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">LOKASI</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">WAKTU</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">STOK</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">STATUS</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px] w-[140px]">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-[60px] text-[#718096] dark:text-[#8892b0]">Belum ada data jadwal.</td>
                </tr>
              )}
              {schedules.map((s) => {
                const status = getAutoStatus(s.tanggal_distribusi, s.stok_paket_sisa);
                const scheduleDate = new Date(s.tanggal_distribusi);
                return (
                  <tr key={s.id} className="border-b border-[#E2E8F0] dark:border-[#233554] hover:bg-gray-50/50 dark:hover:bg-[#1e2d4a]/50 transition-colors">
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] font-bold text-[#1D3557] dark:text-white/90">{scheduleDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] text-[#718096] dark:text-[#a0aec0]">{s.lokasi}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] text-[#4A5568] dark:text-[#8892b0]">{s.waktu ? s.waktu.substring(0, 5) : ''}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] text-[#718096] dark:text-[#8892b0]">{s.stok_paket_sisa} / {s.stok_paket_total}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className={`inline-block text-[10.3px] font-bold px-[12px] py-[6px] rounded-[50px] text-center min-w-[68px] ${status === 'Selesai' ? 'bg-[#F0F2F5] text-[#718096]' : (status === 'Aktif' ? 'bg-[#d8fff0] text-[#15803d]' : 'bg-[#e0f2fe] text-[#0369a1]')}`}>
                        {status}
                      </div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="flex items-center gap-[8px]">
                        <Link
                          href={`/admin/stok/buahedit?id=${s.id}`}
                          className="bg-[#EBF8FF] dark:bg-[#1a365d] text-[#2B6CB0] dark:text-[#63b3ed] text-[10.3px] font-bold px-[12px] py-[6px] rounded-[50px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-center min-w-[57px]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(s)}
                          className="bg-[#FFF5F5] dark:bg-[#742a2a] text-[#C53030] dark:text-[#fc8181] text-[10.3px] font-bold px-[12px] py-[6px] rounded-[50px] hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-center min-w-[57px]"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-[28px_32px] border-t border-[#E2E8F0] dark:border-[#233554] flex justify-between items-center text-[11.3px] text-[#718096] dark:text-[#a0aec0]">
          <div>Menampilkan {schedules.length} dari {schedules.length} data</div>
          <div className="bg-[#1D3557] text-white w-[34px] h-[31px] flex items-center justify-center rounded-[6px] font-bold cursor-pointer hover:bg-[#031F41] transition-colors">1</div>
        </div>

      </div>

      {isDeleteModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[560px] bg-white dark:bg-[#112240] rounded-[12px] border-[1.5px] border-[#E2E8F0] dark:border-[#233554] shadow-2xl p-[36px_24px_32px] flex flex-col items-center">
            <button
              onClick={closeDeleteModal}
              className="absolute top-[16px] right-[16px] w-[28px] h-[28px] flex items-center justify-center bg-[#F0F2F5] dark:bg-[#1e2d4a] hover:bg-[#E2E8F0] dark:hover:bg-[#233554] text-[#718096] dark:text-[#8892b0] rounded-[6px] transition-colors"
            >
              <i className="fa-solid fa-xmark text-[13px]"></i>
            </button>
            <h3 className="text-[#C53030] dark:text-[#fc8181] font-bold text-[17px] mb-[12px] text-center">
              Hapus Jadwal Buah &amp; Susu ini?
            </h3>
            <div className="text-[#4A5568] dark:text-[#a8b2d1] text-[13px] text-center leading-[1.4] mb-[8px]">
              Jadwal {new Date(selectedSchedule.tanggal_distribusi).toLocaleDateString('id-ID')} akan dihapus secara<br />permanen dari sistem.
            </div>
            <div className="text-[#C53030] dark:text-[#fc8181] text-[12px] text-center mb-[28px] flex items-center justify-center gap-1">
              <span>⚠</span> Mahasiswa tidak akan bisa melihat jadwal ini lagi.
            </div>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
              <button
                onClick={handleDelete}
                className="w-[200px] h-[44px] bg-[#C53030] hover:bg-[#9B2C2C] text-white font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
              >
                Ya, Hapus
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-[160px] h-[44px] bg-[#E2E8F0] dark:bg-[#233554] hover:bg-[#CBD5E0] dark:hover:bg-[#1e2d4a] text-[#718096] dark:text-[#ccd6f6] font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}