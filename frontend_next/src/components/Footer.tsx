'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#031F41] text-white">
      <div className="w-[92%] max-w-[1280px] mx-auto py-[48px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-[48px] pb-[32px]">
          <div className="max-w-[448px]">
            <h3 className="text-[18px] font-semibold mb-[14px]">TETADA IPB</h3>
            <p className="text-[14px] leading-[23px] text-[rgba(168,218,220,0.6)]">
              Tim Respon Cepat &amp; Layanan Mahasiswa IPB University. Menjamin keamanan, kesehatan, dan kesejahteraan komunitas kampus.
            </p>
          </div>

          <div className="min-w-[200px]">
            <h4 className="text-[14px] font-semibold tracking-[1.4px] uppercase mb-[16px]">Resources</h4>
            <div className="flex flex-col gap-[8px]">
              <a
                href="https://www.ipb.ac.id/id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[rgba(168,218,220,0.6)] hover:text-white transition-colors"
              >
                IPB University
              </a>
              <a
                href="https://kemahasiswaan.ipb.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-[rgba(168,218,220,0.6)] hover:text-white transition-colors"
              >
                Direktorat Kemahasiswaan IPB University
              </a>
            </div>
          </div>

          <div className="min-w-[220px]">
            <h4 className="text-[14px] font-semibold tracking-[1.4px] uppercase mb-[16px]">Our Contact</h4>
            <div className="flex flex-col gap-[12px]">
              <a
                href="https://www.instagram.com/tetadaipb/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] text-[13px] text-[#668F9E] hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                @tetadaipb
              </a>

              <a
                href="https://www.whatsapp.com/channel/0029Vat6bu4K0IBfgco5nC3f"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] text-[13px] text-[#668F9E] hover:text-white transition-colors"
              >
                <svg width="16" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Saluran WhatsApp TETADA
              </a>

              <a
                href="https://www.tiktok.com/@timtanggapdarurat_ipb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] text-[13px] text-[#668F9E] hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.86 4.86 0 01-1.02-.09z"/>
                </svg>
                @timtanggapdarurat_ipb
              </a>

            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-[32px] flex flex-col sm:flex-row justify-between items-center gap-[16px]">
          <p className="text-[12px] text-[rgba(168,218,220,0.4)]">© {new Date().getFullYear()} TETADA IPB. All rights reserved.</p>
          <div className="flex items-center gap-[24px]">
            <a href="https://www.instagram.com/tetadaipb/" target="_blank" rel="noopener noreferrer" className="text-[rgba(168,218,220,0.4)] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.whatsapp.com/channel/0029Vat6bu4K0IBfgco5nC3f" target="_blank" rel="noopener noreferrer" className="text-[rgba(168,218,220,0.4)] hover:text-white transition-colors">
              <svg width="16" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@timtanggapdarurat_ipb" target="_blank" rel="noopener noreferrer" className="text-[rgba(168,218,220,0.4)] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.86 4.86 0 01-1.02-.09z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}