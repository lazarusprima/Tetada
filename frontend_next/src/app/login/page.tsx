'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', title: string, message: string }>({ show: false, type: 'success', title: '', message: '' });

  const showToast = (title: string, message: string, type: 'success' | 'error') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showToast('Password Incorrect', 'Try Again', 'error');
      return;
    }

    showToast('Login Successful', 'Welcome Admin', 'success');

    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen relative flex flex-col bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(6,36,77,.82), rgba(6,36,77,.88)), url('/assets/homepage_tetada.jpg')` }}>
      
      
      <header className="bg-[#06244d] py-[14px] shadow-[0_8px_24px_rgba(0,0,0,.18)] relative z-10">
        <div className="w-[92%] max-w-[1600px] mx-auto flex items-center justify-between gap-[20px] md:flex-row flex-col md:items-center items-start">
          
          <div className="flex items-center gap-[12px]">
            <img src="/assets/logo_tetada.jpeg" alt="Logo TETADA" className="w-[44px] h-[44px] md:w-[44px] md:h-[44px] rounded-full object-cover shrink-0" />
            <div className="flex flex-col">
              <h2 className="text-white text-[16px] md:text-[18px] leading-[1.1] font-bold">TETADA IPB</h2>
              <p className="text-[#c5d5e6] text-[10px] md:text-[11px] mt-[2px]">Tim Tanggap Darurat IPB University</p>
            </div>
          </div>

          <Link href="/" className="md:self-auto self-end text-white bg-white/5 px-[20px] py-[12px] rounded-full text-[14px] transition duration-200 hover:bg-white/10 no-underline">
            ← Kembali
          </Link>

        </div>
      </header>

      
      <section className="flex-1 flex justify-center items-center p-[20px] md:p-[40px] relative z-10">
        <div className="w-full max-w-[520px] rounded-[24px] md:rounded-[30px] p-[34px] md:p-[48px] border border-white/50 shadow-[0_30px_60px_rgba(0,0,0,.18),0_12px_25px_rgba(0,0,0,.08),inset_0_2px_0_rgba(255,255,255,.95),inset_0_-8px_18px_rgba(0,0,0,.03)]"
             style={{ background: `linear-gradient(145deg, #f8fafc, #eef2f6)` }}>
          
          <img src="/assets/logo_tetada.jpeg" alt="Logo Admin" className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full object-cover block mx-auto mb-[18px]" />
          
          <h1 className="text-center text-[38px] md:text-[54px] font-bold text-[#06244d] mb-[10px]">Login Admin</h1>
          <p className="text-center text-[#59708a] text-[15px] mb-[34px]">Masuk untuk mengelola sistem TETADA IPB</p>

          <form onSubmit={handleLogin}>
            <label className="block mt-[18px] mb-[10px] font-bold text-[#06244d] text-[15px]">Email Admin</label>
            <input 
              type="email" 
              placeholder="Masukkan email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none bg-[#f8fafc] p-[18px] rounded-[14px] text-[15px] outline-none text-[#08284d] placeholder-[#8fa0b2] shadow-[inset_0_2px_6px_rgba(0,0,0,.04),inset_0_-2px_4px_rgba(255,255,255,.9),0_8px_16px_rgba(0,0,0,.04)] focus:shadow-[inset_0_2px_6px_rgba(0,0,0,.04),0_0_0_3px_rgba(6,36,77,.12),0_10px_18px_rgba(0,0,0,.05)] transition-shadow"
            />

            <label className="block mt-[18px] mb-[10px] font-bold text-[#06244d] text-[15px]">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none bg-[#f8fafc] p-[18px] pr-[50px] rounded-[14px] text-[15px] outline-none text-[#08284d] placeholder-[#8fa0b2] shadow-[inset_0_2px_6px_rgba(0,0,0,.04),inset_0_-2px_4px_rgba(255,255,255,.9),0_8px_16px_rgba(0,0,0,.04)] focus:shadow-[inset_0_2px_6px_rgba(0,0,0,.04),0_0_0_3px_rgba(6,36,77,.12),0_10px_18px_rgba(0,0,0,.05)] transition-shadow"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-[18px] top-1/2 -translate-y-1/2 text-[#5b6f86] hover:text-[#06244d] text-[18px] transition">
                <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>

            <button type="submit" className="w-full mt-[30px] border-none bg-[#06244d] text-white p-[18px] rounded-[14px] text-[20px] font-bold cursor-pointer shadow-[0_14px_24px_rgba(6,36,77,.25)] hover:bg-[#0a356d] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200">
              Log In
            </button>
          </form>

        </div>
      </section>

      
      <div className={`fixed top-[16px] left-[16px] right-[16px] md:top-[24px] md:left-auto md:right-[24px] z-[9999] min-w-auto md:min-w-[280px] max-w-none md:max-w-[360px] p-[18px_20px] rounded-[16px] text-white shadow-[0_18px_40px_rgba(0,0,0,.18)] flex flex-col gap-[6px] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-[20px] opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`}>
        <strong className="text-[16px]">{toast.title}</strong>
        <span className="text-[14px] opacity-95">{toast.message}</span>
      </div>

    </main>
  );
}
