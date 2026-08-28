import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      id="app-footer"
      className="w-full py-6 mt-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-0 max-w-[1200px] mx-auto border-t border-[#bccac0]/40 text-[#585f6c] text-xs"
    >
      <p className="text-center md:text-left mb-3 md:mb-0 font-normal">
        © 2024 REMUSHA Finance v1.0.0. Peace &amp; Clarity through Stewardship.
      </p>
      <div className="flex gap-6">
        <a 
          href="#support" 
          onClick={(e) => { e.preventDefault(); alert('Hubungi Sekretariat Takmir REMUSHA via email atau kantor masjid.'); }}
          className="hover:text-[#006948] transition-colors"
        >
          Support
        </a>
        <a 
          href="#privacy" 
          onClick={(e) => { e.preventDefault(); alert('Kebijakan Privasi: Data keuangan kas masjid dipublikasikan secara terbuka untuk transparansi amanah umat.'); }}
          className="hover:text-[#006948] transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};
