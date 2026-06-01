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
  
  
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [editAdminName, setEditAdminName] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [welcomeModal, setWelcomeModal] = useState<string | null>(null);
  const [isFullViewAvatarOpen, setIsFullViewAvatarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isAccountModalOpen) {
      setEditAdminName(adminName);
      setPreviewAvatar(userAvatar);
      setEditUserAvatar(null);
    }
  }, [isAccountModalOpen, adminName, userAvatar]);
  
  interface AppNotification {
    id: number;
    message: string;
    time: Date;
    read: boolean;
  }
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

  const adminNameRef = useRef(adminName);
  useEffect(() => { adminNameRef.current = adminName; }, [adminName]);

  const settingsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isSettingsOpen = isSettingsHovered || isSettingsClicked;

  const addManualNotification = async (message: string) => {
    const newNotif = { id: Date.now(), message, time: new Date(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    setToastNotification(newNotif);
    setTimeout(() => { setToastNotification(null); }, 5000);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      supabase.from('notifikasi').insert([{ admin_id: session.user.id, message }]).then();
    }
  };

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase.from('notifikasi').select('*').order('created_at', { ascending: false }).limit(30);
      if (data) {
        setNotifications(data.map((n: any) => ({
          id: n.id,
          message: n.message,
          time: new Date(n.created_at),
          read: true
        })));
      }
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsClicked(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileUpdate = async () => {
    setIsUpdatingAccount(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not logged in');

      let finalAvatar = previewAvatar;
      
      if (editUserAvatar) {
        const fileExt = editUserAvatar.name.split('.').pop();
        const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('gambar')
          .upload(`avatars/${fileName}`, editUserAvatar, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('gambar')
          .getPublicUrl(uploadData.path);
        finalAvatar = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from('profil_admin').upsert({
        id: session.user.id,
        email: session.user.email,
        nama: editAdminName,
        avatar_url: finalAvatar
      }, { onConflict: 'id' });

      if (error) throw error;

      setAdminName(editAdminName);
      setUserAvatar(finalAvatar);
      setIsAccountModalOpen(false);
      addManualNotification("Anda telah berhasil memperbarui profil akun.");

    } catch (err: any) {
      alert('Gagal mengupdate profil: ' + err.message);
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error=')) {
      alert('Akses Ditolak: Akun Anda tidak terdaftar sebagai Admin.');
      router.replace('/login');
      return;
    }

    const syncProfile = async (user: any) => {
      try {
        const { data: existing, error: selectErr } = await supabase.from('profil_admin').select('*').eq('id', user.id).maybeSingle();
        if (selectErr) console.error("Error get profil:", selectErr);
        
        let finalName = '';
        let finalAvatar = null;

        if (existing) {
          finalName = existing.nama;
          finalAvatar = existing.avatar_url;
        } else {
          const meta = user.user_metadata;
          finalAvatar = meta?.avatar_url || meta?.picture || user.identities?.[0]?.identity_data?.avatar_url || user.identities?.[0]?.identity_data?.picture || null;
          finalName = meta?.full_name || meta?.name || user.email?.split('@')[0] || 'Admin';
          
          await supabase.from('profil_admin').upsert({
            id: user.id,
            email: user.email,
            nama: finalName,
            avatar_url: finalAvatar
          }, { onConflict: 'id' });
        }
        
        setAdminName(finalName);
        setAdminEmail(user.email || '');
        setUserAvatar(finalAvatar);
        
        if (!sessionStorage.getItem('hasWelcomed')) {
          setWelcomeModal(`Selamat datang, ${finalName}!`);
          sessionStorage.setItem('hasWelcomed', 'true');
          setTimeout(() => {
            setWelcomeModal(null);
          }, 3500);
        }
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

  useEffect(() => {
    const channel = supabase.channel('admin-broadcasts');

    channel.on('broadcast', { event: 'admin_action' }, (payload) => {
      addManualNotification(payload.payload.message);
    }).subscribe();

    const handleAppNotify = (e: any) => {
      if (e.detail) {
        addManualNotification(`Anda ${e.detail}`);
        
        channel.send({
          type: 'broadcast',
          event: 'admin_action',
          payload: { message: `${adminNameRef.current} ${e.detail}` }
        });
      }
    };
    window.addEventListener('app-notify', handleAppNotify);

    const dbChannel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        let tableName = payload.table;
        if (tableName === 'profil_admin') return;

        let actionStr = '';
        if (payload.eventType === 'INSERT') actionStr = 'ditambahkan ke';
        else if (payload.eventType === 'UPDATE') actionStr = 'diperbarui di';
        else if (payload.eventType === 'DELETE') actionStr = 'dihapus dari';
        
        if (tableName === 'archive_kegiatan') tableName = 'Archive';
        else if (tableName === 'events') tableName = 'Event';
        else if (tableName === 'stok') tableName = 'Stok';
        else if (tableName === 'jadwal_distribusi') tableName = 'Jadwal Distribusi';
        else if (tableName === 'stok_buah_susu') tableName = 'Stok Buah & Susu';
        else if (tableName === 'contact_messages') tableName = 'Laporan Darurat';

        const msg = `Sistem: Data baru saja ${actionStr} tabel ${tableName}.`;
        addManualNotification(msg);
      })
      .subscribe();
      
    return () => { 
      window.removeEventListener('app-notify', handleAppNotify);
      supabase.removeChannel(channel); 
      supabase.removeChannel(dbChannel); 
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
        window.dispatchEvent(new CustomEvent('app-notify', { detail: `telah mengundang admin baru dengan email: ${inviteEmail}` }));
        setIsInviteModalOpen(false);
        setInviteEmail('');
      } else {
        alert(`Gagal mengirim undangan: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saat mengirim undangan:', error);
      alert('Terjadi kesalahan saat mengirim undangan.');
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
          sessionStorage.removeItem('hasWelcomed');
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
            <div className="relative" ref={notifRef}>
              <div className="relative cursor-pointer" onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNotifications(prev => prev.map(n => ({...n, read: true})));
                }}>
                <i className={`fa-regular fa-bell transition ${showNotifications ? 'text-[#173f97] dark:text-white' : 'hover:text-[#173f97] dark:hover:text-white'}`}></i>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-3 z-50">
                  <div className="w-80 bg-white dark:bg-[#112240] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,.15)] border border-[#e5ebf2] dark:border-[#233554] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#e5ebf2] dark:border-[#233554] bg-[#f4f7fb]/50 dark:bg-[#0a192f]/50 flex justify-between items-center">
                      <p className="text-sm font-bold text-[#08284d] dark:text-[#ccd6f6]">Notifikasi</p>
                      <button 
                        onClick={() => { setNotifications([]); setShowNotifications(false); }}
                        className="text-xs text-[#173f97] dark:text-[#4a72d1] hover:underline font-semibold"
                      >
                        Bersihkan
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-[#6c7d94] dark:text-[#8892b0]">
                          Tidak ada notifikasi baru.
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-4 border-b border-[#e5ebf2] dark:border-[#233554] hover:bg-[#f4f7fb] dark:hover:bg-[#1e2d4a] transition-colors">
                            <p className="text-sm text-[#08284d] dark:text-[#ccd6f6] mb-1">{notif.message}</p>
                            <p className="text-[10px] text-[#6c7d94] dark:text-[#8892b0]">{notif.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                        setIsAccountModalOpen(true);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#eef2f7] dark:bg-[#233554] flex items-center justify-center text-[#173f97] dark:text-[#4a72d1]">
                        <i className="fa-solid fa-user-pen text-xs"></i>
                      </div>
                      Pengaturan Akun
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

            <div className="w-[42px] h-[42px] rounded-full overflow-hidden cursor-pointer border-[2px] border-white dark:border-[#233554] shadow-[0_6px_18px_rgba(0,0,0,.12)] bg-cover bg-center bg-no-repeat shrink-0 transition-transform hover:scale-105"
                 onClick={() => setIsFullViewAvatarOpen(true)}
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

      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-md flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-[#112240] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-[#e5ebf2] dark:border-[#233554] flex justify-between items-center bg-[#f4f7fb]/50 dark:bg-[#0a192f]/50">
              <h3 className="text-lg font-bold text-[#08284d] dark:text-[#ccd6f6] flex items-center gap-2">
                <i className="fa-solid fa-user-gear text-[#173f97] dark:text-[#4a72d1]"></i> Pengaturan Akun
              </h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-[#6c7d94] dark:text-[#8892b0] hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors bg-white dark:bg-[#112240] w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-transparent hover:border-[#ef4444]/20"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="relative w-[80px] h-[80px] rounded-full border-4 border-[#f4f7fb] dark:border-[#233554] shadow-md bg-cover bg-center bg-no-repeat mb-3 cursor-pointer group"
                  style={{ backgroundImage: `url('${previewAvatar || '/assets/profil.jpg'}')` }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-camera text-white"></i>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditUserAvatar(file);
                      setPreviewAvatar(URL.createObjectURL(file));
                    }
                  }}
                />
                <p className="text-xs font-semibold text-[#166534] dark:text-[#22c55e] bg-[#dcfce7] dark:bg-[#14532d] px-3 py-1 rounded-full flex items-center gap-1 mt-1 border border-[#bbf7d0] dark:border-[#166534]">
                  Admin
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#08284d] dark:text-[#ccd6f6] mb-2">Nama Admin</label>
                <input
                  type="text"
                  value={editAdminName}
                  onChange={(e) => setEditAdminName(e.target.value)}
                  className="w-full bg-white dark:bg-[#0a192f] border border-[#e5ebf2] dark:border-[#233554] text-[#08284d] dark:text-[#ccd6f6] rounded-xl px-4 py-3 focus:outline-none focus:border-[#173f97] transition-colors"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#08284d] dark:text-[#ccd6f6] mb-2">Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  disabled
                  className="w-full bg-[#f4f7fb] dark:bg-[#0a192f] border border-[#e5ebf2] dark:border-[#233554] text-[#6c7d94] dark:text-[#8892b0] rounded-xl px-4 py-3 opacity-70 cursor-not-allowed"
                />
              </div>
              <div className="flex justify-between gap-3 pt-2 border-t border-[#e5ebf2] dark:border-[#233554] pt-4">
                <button
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#6c7d94] bg-[#f4f7fb] hover:bg-[#e5ebf2] dark:bg-[#1e2d4a] dark:text-[#ccd6f6] dark:hover:bg-[#233554] transition-colors flex-1"
                >
                  Batal
                </button>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingAccount || !editAdminName.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#173f97] hover:bg-[#123175] transition-colors shadow-lg shadow-[#173f97]/20 flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdatingAccount ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastNotification && (
        <div className="fixed top-20 right-6 z-[110] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="bg-white dark:bg-[#112240] border-l-4 border-[#173f97] dark:border-[#4a72d1] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex items-start gap-3 max-w-sm">
            <div className="mt-0.5 text-[#173f97] dark:text-[#4a72d1]">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#08284d] dark:text-[#ccd6f6]">Notifikasi Baru</h4>
              <p className="text-sm text-[#6c7d94] dark:text-[#8892b0] mt-1">{toastNotification.message}</p>
            </div>
            <button 
              onClick={() => setToastNotification(null)}
              className="text-[#6c7d94] hover:text-[#ef4444] transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      {welcomeModal && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none animate-in slide-in-from-top-8 fade-in duration-500">
          <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center justify-center border border-[#e5ebf2]/50 dark:border-[#233554]/50">
            <h2 className="text-sm md:text-base font-extrabold text-[#08284d] dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {welcomeModal}
            </h2>
          </div>
        </div>
      )}

      {isFullViewAvatarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[300] backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFullViewAvatarOpen(false)}>
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setIsFullViewAvatarOpen(false)}
          >
            <i className="fa-solid fa-xmark text-3xl"></i>
          </button>
          <div 
            className="w-full max-w-[400px] aspect-square rounded-full md:rounded-3xl shadow-2xl bg-cover bg-center bg-no-repeat border-4 border-white/20 animate-in zoom-in-95 duration-200"
            style={{ backgroundImage: `url('${userAvatar || '/assets/profil.jpg'}')` }}
            onClick={(e) => e.stopPropagation()}
          ></div>
        </div>
      )}

    </div>
  );
}