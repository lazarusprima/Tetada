import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const email = formData.get('email') as string;
    const nama = formData.get('nama') as string;
    const avatarFile = formData.get('avatarFile') as File | null;
    let finalAvatar = formData.get('currentAvatarUrl') as string | null;

    if (!userId || !email || !nama) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Upload avatar if a new file is provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop() || 'png';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabaseAdmin.storage
        .from('pfp')
        .upload(`avatars/${fileName}`, avatarFile, { 
          upsert: true,
          contentType: avatarFile.type 
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return NextResponse.json({ error: 'Gagal mengupload foto: ' + uploadError.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('pfp')
        .getPublicUrl(uploadData.path);
        
      finalAvatar = publicUrlData.publicUrl;
    }

    // Upsert into profil_admin
    const { error: upsertError } = await supabaseAdmin.from('profil_admin').upsert({
      id: userId,
      email: email,
      nama: nama,
      avatar_url: finalAvatar
    }, { onConflict: 'id' });

    if (upsertError) {
      console.error('Upsert Error:', upsertError);
      return NextResponse.json({ error: 'Gagal menyimpan profil: ' + upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, avatar_url: finalAvatar, nama: nama });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server: ' + error.message }, { status: 500 });
  }
}
