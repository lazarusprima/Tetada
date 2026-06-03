import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    // Generate temporary password
    const tempPassword = 'TetadaAdmin' + Math.random().toString(36).substring(2, 8) + '!';

    // Buat user di Auth secara langsung
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: tempPassword,
    });

    if (error) {
      // Jika user sudah terdaftar di auth, jadikan admin dengan meng-upsert profil_admin
      if (error.message.toLowerCase().includes('already') || error.status === 422) {
        const { data: usersData, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
        if (getUserError) {
          return NextResponse.json({ error: getUserError.message }, { status: 400 });
        }
        const existingUser = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          const { error: profileError } = await supabaseAdmin.from('profil_admin').upsert({
            id: existingUser.id,
            email: email,
            nama: email.split('@')[0],
          }, { onConflict: 'email' });

          if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 400 });
          }

          return NextResponse.json({ 
            success: true, 
            message: 'User sudah terdaftar sebelumnya, berhasil ditambahkan sebagai Admin.', 
            isExisting: true 
          });
        }
      }
      console.error('Error membuat user:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Masukkan ke profil_admin untuk user baru
    const { error: profileError } = await supabaseAdmin.from('profil_admin').upsert({
      id: data.user.id,
      email: email,
      nama: email.split('@')[0],
    }, { onConflict: 'email' });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, tempPassword });
  } catch (err: any) {
    console.error('Terjadi kesalahan server:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}