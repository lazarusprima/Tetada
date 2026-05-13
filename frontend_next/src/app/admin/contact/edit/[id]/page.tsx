'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    wa: '',
    status: 'Aktif'
  });

  useEffect(() => {
    if (!id) return;

    const fetchContactData = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            phone: data.phone || '',
            wa: data.wa || '',
            status: data.status || 'Aktif'
          });
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        alert('Gagal mengambil data kontak: ' + error.message);
      } finally {
        setFetching(false);
      }
    };

    fetchContactData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .update({
          name: formData.name,
          description: formData.description,
          phone: formData.phone,
          wa: formData.wa,
          status: formData.status
        })
        .eq('id', id);

      if (error) throw error;
      
      alert('Kontak darurat berhasil diperbarui!');
      router.push('/admin/contact');
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert('Gagal memperbarui kontak: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-[40px] h-[40px] border-[3px] border-[#E2E8F0] dark:border-[#233554] border-t-[#2B6CB0] dark:border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px] w-full max-w-[1047px] mx-auto pb-[50px]">
      
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-[8px]">
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[22px] leading-[28px] text-[#1D3557] dark:text-white transition-colors">
            Edit Kontak Darurat
          </h1>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[13px] leading-[16px] text-[#457B9D] dark:text-[#93c5fd] transition-colors">
            Ubah informasi instansi, nomor telepon, dan status aktif
          </p>
        </div>
        
        <Link 
          href="/admin/contact"
          className="flex items-center justify-center bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#4A5568] dark:text-white hover:bg-gray-200 dark:hover:bg-[#1e2d4a] transition-colors"
        >
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        
        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm transition-colors">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] leading-[18px] text-[#1D3557] dark:text-white border-b border-[#E2E8F0] dark:border-[#233554] pb-[16px] transition-colors">
            Informasi Instansi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                Nama Instansi *
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                placeholder="Contoh: Poliklinik IPB"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                Status *
              </label>
              <div className="relative">
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white appearance-none outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
                <span className="absolute right-[16px] top-[50%] -translate-y-1/2 text-[#A0AEC0] pointer-events-none">▾</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300 flex justify-between">
              <span>Deskripsi / Peran *</span>
              <span className="font-normal text-[#A0AEC0]">{formData.description?.length || 0} / 200 karakter</span>
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={200}
              rows={3}
              className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#4A5568] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 resize-none transition-colors"
              placeholder="Contoh: Fasilitas Kesehatan Penanganan Darurat"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[16px] p-[32px] flex flex-col gap-[24px] shadow-sm transition-colors">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] leading-[18px] text-[#1D3557] dark:text-white border-b border-[#E2E8F0] dark:border-[#233554] pb-[16px] transition-colors">
            Detail Kontak
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                No. Telepon *
              </label>
              <input 
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                placeholder="Contoh: 0251-862-XXXX"
              />
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[11px] leading-[14px] text-[#4A5568] dark:text-gray-300">
                WhatsApp *
              </label>
              <input 
                type="text"
                name="wa"
                value={formData.wa}
                onChange={handleChange}
                required
                className="w-full bg-[#F8FAFC] dark:bg-[#0a192f] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] px-[16px] py-[12px] font-['Plus_Jakarta_Sans',sans-serif] text-[12px] text-[#1D3557] dark:text-white outline-none focus:border-[#2B6CB0] dark:focus:border-blue-500 transition-colors"
                placeholder="Contoh: 628123456789"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-[16px] mt-[16px]">
          <Link 
            href="/admin/contact"
            className="flex items-center justify-center bg-[#F0F2F5] dark:bg-[#112240] border border-[#E2E8F0] dark:border-[#233554] rounded-[8px] w-[131px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-[#718096] dark:text-white hover:bg-gray-200 dark:hover:bg-[#1e2d4a] transition-colors"
          >
            Batal
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-[#222375] dark:bg-[#173f97] rounded-[8px] w-[168px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] text-white hover:bg-[#10114a] dark:hover:bg-[#1e4eb8] transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
