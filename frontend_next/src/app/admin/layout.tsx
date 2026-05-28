'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [isSettingsClicked, setIsSettingsClicked] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const isSettingsOpen = isSettingsHovered || isSettingsClicked;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsClicked(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      alert('Akses Ditolak: Akun Anda tidak terdaftar sebagai Admin.');
      router.replace('/login');
      return;
    }

    const syncProfile = async (user: any) => {
      const meta = user.user_metadata;
      try {
        const avatar = meta?.avatar_url || 
                       meta?.picture || 
                       user.identities?.[0]?.identity_data?.avatar_url || 
                       user.identities?.[0]?.identity_data?.picture || 
                       null;

        await supabase.from('profil_admin').upsert({
          id: user.id,
          email: user.email,
          nama: meta?.full_name || meta?.name || user.email?.split('@')[0] || 'Admin',
          avatar_url: avatar
        }, { onConflict: 'id' });
      } catch (err) {
        console.error('Error syncing profile:', err);
      }
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoading(false);
        const meta = session.user?.user_metadata;
        setUserAvatar(meta?.avatar_url || meta?.picture || null);
        syncProfile(session.user);
      } else {
        router.replace('/login');
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoading(false);
        const meta = session.user?.user_metadata;
        setUserAvatar(meta?.avatar_url || meta?.picture || null);
        syncProfile(session.user);
      } else {
        router.replace('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      alert('Silakan masukkan email terlebih dahulu.');
      return;
    }
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Undangan berhasil dikirim ke ${inviteEmail}`);
        setIsInviteModalOpen(false);
        setInviteEmail('');
      } else {
        alert(`Gagal mengirim undangan: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saat mengirim undangan:', error);
      alert('Terjadi kesalahan. Silakan coba lagi nanti.');
    }
  };

  const handleLogout = async () => {
    try {
      if (window.confirm("Are you sure you want to log out?")) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Logout error:", error);
          alert("Gagal logout: " + error.message);
        } else {

          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#0a192f] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#173f97]/20 border-t-[#173f97] rounded-full animate-spin mb-4"></div>
        <p className="text-[#6c7d94] dark:text-[#8892b0] font-semibold animate-pulse">Memverifikasi akses...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F4] text-[#08284d] dark:bg-[#0a192f] dark:text-[#ccd6f6] transition-colors duration-300">
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-[#112240] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-[#e5ebf2] dark:border-[#233554] flex justify-between items-center bg-[#f4f7fb]/50 dark:bg-[#0a192f]/50">
              <h3 className="text-lg font-bold text-[#08284d] dark:text-[#ccd6f6] flex items-center gap-2">
                <i className="fa-solid fa-envelope-open-text text-[#173f97] dark:text-[#4a72d1]"></i> Invite Admin
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[#6c7d94] dark:text-[#8892b0] hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors bg-white dark:bg-[#112240] w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-transparent hover:border-[#ef4444]/20"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#6c7d94] dark:text-[#8892b0] mb-5 leading-relaxed">
                Masukkan alamat email atau akun Google yang ingin diundang sebagai Admin. Mereka akan menerima email berisi tautan undangan untuk bergabung.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#08284d] dark:text-[#ccd6f6] mb-2">
                  Email Admin Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fa-regular fa-envelope text-[#6c7d94] dark:text-[#8892b0]"></i>
                  </div>
                  <input
                    type="email"
                    placeholder="nama@gmail.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-[#f4f7fb] dark:bg-[#0a192f] border border-[#e5ebf2] dark:border-[#233554] text-[#08284d] dark:text-[#ccd6f6] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#173f97] focus:border-transparent dark:focus:ring-[#4a72d1] transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#6c7d94] dark:text-[#8892b0] hover:bg-gray-100 dark:hover:bg-[#1e2d4a] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendInvite}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#173f97] hover:bg-[#123175] transition-colors shadow-lg shadow-[#173f97]/20 flex items-center gap-2"
                >
                  Kirim Undangan <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-[280px] md:w-[285px] bg-[#05244d] dark:bg-[#020c1b] p-[28px_18px] text-white flex flex-col shrink-0 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between mb-[34px]">
          <div className="flex items-center gap-[14px]">
            <img src="/assets/logo_tetada.png" className="w-[48px] h-[48px] rounded-full object-cover bg-white" alt="Logo" />
            <div>
              <h2 className="text-[20px] font-bold mb-[4px]">TETADA IPB</h2>
              <p className="text-[13px] text-[#c4d5ea]">Tim Tanggap Darurat IPB</p>
            </div>
          </div>
          <button className="md:hidden text-white text-[24px] hover:text-[#c4d5ea] transition" onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="flex flex-col gap-[10px]">
          <Link href="/admin/dashboard" onClick={() => setIsSidebarOpen(false)} className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/dashboard') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-table-columns w-[20px]"></i> BERANDA
          </Link>
          <Link href="/admin/stok" onClick={() => setIsSidebarOpen(false)} className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/stok') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-apple-whole w-[20px]"></i> BUAH & SUSU
          </Link>
          <Link href="/admin/events" onClick={() => setIsSidebarOpen(false)} className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/events') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-regular fa-calendar w-[20px]"></i> EVENTS
          </Link>
          <Link href="/admin/archive" onClick={() => setIsSidebarOpen(false)} className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/archive') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-regular fa-folder w-[20px]"></i> ARCHIVE
          </Link>
          <Link href="/admin/contact" onClick={() => setIsSidebarOpen(false)} className={`no-underline p-[14px_16px] rounded-[14px] font-semibold flex items-center gap-[12px] transition duration-200 ${pathname.startsWith('/admin/contact') ? 'bg-[#173f97] text-white' : 'text-[#7ea2c8] hover:bg-[#0c3470] hover:text-white'}`}>
            <i className="fa-solid fa-snowflake w-[20px]"></i> EMERGENCY REPORTS
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[64px] bg-white/80 dark:bg-[#112240]/80 backdrop-blur-[12px] flex justify-between items-center px-[32px] border-b border-[#e5ebf2] dark:border-[#233554] shadow-sm sticky top-0 z-[40] transition-colors duration-300">
          <div className="flex items-center gap-[14px]">
            <button
              onClick={handleLogout}
              className="bg-[#939393]/10 dark:bg-[#233554] px-[16px] py-[6px] rounded-[8px] text-[13px] font-semibold cursor-pointer text-[#031F41] dark:text-[#ccd6f6] transition hover:bg-[#939393]/20 dark:hover:bg-[#1e2d4a]"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center gap-[16px] md:gap-[22px] text-[24px] text-[#6c7d94] dark:text-[#8892b0]">
            <i className="fa-regular fa-bell cursor-pointer transition hover:text-[#173f97] dark:hover:text-white" onClick={() => alert("Tidak ada notifikasi baru.")}></i>
            <div
              className="relative"
              ref={settingsRef}
              onMouseEnter={() => setIsSettingsHovered(true)}
              onMouseLeave={() => setIsSettingsHovered(false)}
            >
              <div
                className="py-2"
                onClick={() => setIsSettingsClicked(!isSettingsClicked)}
              >
                <i className={`fa-solid fa-gear cursor-pointer transition ${isSettingsOpen ? 'text-[#173f97] dark:text-white rotate-90' : 'hover:text-[#173f97] dark:hover:text-white hover:rotate-90'} duration-300`}></i>
              </div>
              {isSettingsOpen && (
                <div className="absolute right-0 top-full -mt-2 pt-2 z-50">
                  <div className="w-56 bg-white dark:bg-[#112240] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,.15)] border border-[#e5ebf2] dark:border-[#233554] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-[#e5ebf2] dark:border-[#233554] mb-1">
                      <p className="text-xs font-bold text-[#6c7d94] dark:text-[#8892b0] uppercase tracking-wider">Pengaturan</p>
                    </div>
                    <div
                      className="px-4 py-2.5 hover:bg-[#f4f7fb] dark:hover:bg-[#1e2d4a] cursor-pointer text-sm font-semibold text-[#08284d] dark:text-[#ccd6f6] flex items-center gap-3 transition-colors mx-2 rounded-lg"
                      onClick={() => {
                        setIsSettingsClicked(false);
                        setIsSettingsHovered(false);
                        setIsInviteModalOpen(true);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#eef2f7] dark:bg-[#233554] flex items-center justify-center text-[#173f97] dark:text-[#4a72d1]">
                        <i className="fa-solid fa-user-plus text-xs"></i>
                      </div>
                      Invite Admin
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-[42px] h-[42px] rounded-full overflow-hidden cursor-pointer border-[2px] border-white dark:border-[#233554] shadow-[0_6px_18px_rgba(0,0,0,.12)] bg-cover bg-center bg-no-repeat shrink-0"
                 style={{ backgroundImage: `url('${userAvatar || '/assets/profil.jpg'}')` }}>
            </div>

            <button
              className="md:hidden text-[#08284d] dark:text-[#ccd6f6] text-[24px] p-[6px] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e2d4a] transition ml-[4px]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </header>

        <div className="p-[18px] md:p-[28px_34px] overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}