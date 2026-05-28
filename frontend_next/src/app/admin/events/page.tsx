'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Event = {
  id: string;
  nama_event: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  gambar?: string;
  created_at?: string;
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  Aktif:        { label: 'Aktif',        bg: '#d8fff0', color: '#15803d' },
  'Akan Datang':{ label: 'Akan Datang', bg: '#e0f2fe', color: '#0369a1' },
  Selesai:      { label: 'Selesai',      bg: '#F0F2F5', color: '#718096' },
};

function formatTanggal(tanggal: string) {
  if (!tanggal) return '-';
  const d = new Date(tanggal);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('tanggal', { ascending: false });
    if (data) setEvents(data);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filteredEvents = events.filter(e =>
    e.nama_event?.toLowerCase().includes(search.toLowerCase()) ||
    e.deskripsi?.toLowerCase().includes(search.toLowerCase())
  );

  const openDeleteModal = (ev: Event) => {
    setSelectedEvent(ev);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  };
  const handleDelete = async () => {
    if (selectedEvent) {
      const { error } = await supabase.from('events').delete().eq('id', selectedEvent.id);
      if (!error) fetchEvents();
      else alert('Gagal menghapus event: ' + error.message);
      closeDeleteModal();
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">

      <div className="flex flex-col gap-[8px]">
        <h1 className="text-[#031F41] dark:text-white text-[32px] md:text-[40px] font-extrabold leading-none">
          Kelola Event
        </h1>
        <p className="text-[#031F41]/60 dark:text-[#8892b0] font-medium text-[16px] md:text-[18px]">
          Tambah, edit, dan hapus jadwal Event
        </p>
      </div>

      <div className="bg-white dark:bg-[#112240] rounded-[24px] border border-[#E2E8F0] dark:border-[#233554] shadow-sm overflow-hidden flex flex-col mt-[16px]">

        <div className="p-[20px] md:p-[28px_32px] border-b border-[#E2E8F0] dark:border-[#233554] flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-[24px]">
          <h3 className="text-[#1D3557] dark:text-white font-bold text-[16px] md:text-[18px] self-start md:self-center">
            Daftar Jadwal Event
          </h3>
          <div className="flex flex-col sm:flex-row gap-[16px] w-full md:w-auto">
            <div className="relative flex-1 w-full sm:w-[320px]">
              <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#A0AEC0] text-[13px]">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                placeholder="🔍 Cari event..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F0F2F5] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] text-[11.3px] text-[#A0AEC0] dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <Link
              href="/admin/events/tambahevent"
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
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">NAMA EVENT</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">TANGGAL</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">LOKASI</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">STATUS</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">DESKRIPSI</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px]">FILE</th>
                <th className="py-[16px] px-[24px] text-[10.3px] font-bold text-[#718096] dark:text-[#a0aec0] uppercase tracking-[0.5px] w-[140px]">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-[60px] text-[#718096] dark:text-[#8892b0]">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>Memuat data...
                  </td>
                </tr>
              )}
              {!isLoading && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-[60px] text-[#718096] dark:text-[#8892b0]">
                    {search ? 'Tidak ada event yang sesuai pencarian.' : 'Belum ada data event.'}
                  </td>
                </tr>
              )}
              {!isLoading && filteredEvents.map(ev => {
                const statusCfg = STATUS_CONFIG[ev.status] || STATUS_CONFIG['Selesai'];
                return (
                  <tr key={ev.id} className="border-b border-[#E2E8F0] dark:border-[#233554] hover:bg-gray-50/50 dark:hover:bg-[#1e2d4a]/50 transition-colors">
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] text-[#4A5568] dark:text-[#ccd6f6]">{ev.nama_event}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] font-bold text-[#1D3557] dark:text-white/90">{formatTanggal(ev.tanggal)}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] text-[#718096] dark:text-[#a0aec0]">{ev.lokasi}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="inline-block text-[10.3px] font-bold px-[12px] py-[6px] rounded-[50px] text-center min-w-[68px]"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </div>
                    </td>
                    <td className="py-[20px] px-[24px] max-w-[240px]">
                      <div className="text-[12.2px] text-[#4A5568] dark:text-[#8892b0] truncate">{ev.deskripsi}</div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="text-[12.2px] font-bold text-[#1D3557] dark:text-white/90 truncate max-w-[100px]">
                        {ev.gambar ? ev.gambar.split('/').pop() : '-'}
                      </div>
                    </td>
                    <td className="py-[20px] px-[24px]">
                      <div className="flex items-center gap-[8px]">
                        <Link
                          href={`/admin/events/editevent?id=${ev.id}`}
                          className="bg-[#EBF8FF] dark:bg-[#1a365d] text-[#2B6CB0] dark:text-[#63b3ed] text-[10.3px] font-bold px-[12px] py-[6px] rounded-[50px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-center min-w-[57px]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(ev)}
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
          <div>Menampilkan {filteredEvents.length} dari {events.length} kegiatan</div>
          <div className="bg-[#1D3557] text-white w-[34px] h-[31px] flex items-center justify-center rounded-[6px] font-bold cursor-pointer hover:bg-[#031F41] transition-colors">1</div>
        </div>
      </div>

      {isDeleteModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-[560px] bg-white dark:bg-[#112240] rounded-[12px] border-[1.5px] border-[#E2E8F0] dark:border-[#233554] shadow-2xl p-[36px_24px_32px] flex flex-col items-center">
            <button
              onClick={closeDeleteModal}
              className="absolute top-[16px] right-[16px] w-[28px] h-[28px] flex items-center justify-center bg-[#F0F2F5] dark:bg-[#1e2d4a] hover:bg-[#E2E8F0] dark:hover:bg-[#233554] text-[#718096] dark:text-[#8892b0] rounded-[6px] transition-colors"
            >
              <i className="fa-solid fa-xmark text-[13px]"></i>
            </button>
            <div className="w-[56px] h-[56px] rounded-full bg-[#FFF5F5] flex items-center justify-center mb-[16px]">
              <i className="fa-solid fa-trash-can text-[#C53030] text-[22px]"></i>
            </div>
            <h3 className="text-[#C53030] dark:text-[#fc8181] font-bold text-[17px] mb-[10px] text-center">
              Hapus Event ini?
            </h3>
            <div className="text-[#4A5568] dark:text-[#a8b2d1] text-[13px] text-center leading-[1.6] mb-[8px]">
              <span className="font-bold text-[#1D3557] dark:text-white">&ldquo;{selectedEvent.nama_event}&rdquo;</span> akan dihapus secara permanen dari sistem.
            </div>
            <div className="text-[#C53030] dark:text-[#fc8181] text-[12px] text-center mb-[28px] flex items-center justify-center gap-1">
              <span>⚠</span> Mahasiswa tidak akan bisa melihat event ini lagi.
            </div>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center items-center">
              <button
                onClick={handleDelete}
                className="w-[180px] h-[44px] bg-[#C53030] hover:bg-[#9B2C2C] text-white font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
              >
                Ya, Hapus
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-[140px] h-[44px] bg-[#E2E8F0] dark:bg-[#233554] hover:bg-[#CBD5E0] dark:hover:bg-[#1e2d4a] text-[#718096] dark:text-[#ccd6f6] font-bold text-[13px] rounded-[8px] transition-colors flex items-center justify-center"
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