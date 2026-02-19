import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <footer className="bg-black text-white py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

        <div className="mb-10 group">
          <BrandLogo isDark={true} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 w-full max-w-4xl">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('nav_head')}</h5>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_index_footer')}</Link>
              <Link to="/dashboard" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_portal_footer')}</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('protocol_head')}</h5>
            <div className="flex flex-col gap-2">
              <Link to="/assessment" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_audit_footer')}</Link>
              <Link to="/results" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_analytics_footer')}</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('security_head')}</h5>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">ISO 27001</span>
              <span className="text-xs font-bold text-gray-400 uppercase">HIPAA Compliant</span>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('legal_head')}</h5>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_terms_footer')}</Link>
              <Link to="/privacy" className="text-xs font-bold hover:text-gray-400 transition-colors uppercase">{t('nav_privacy_footer')}</Link>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">
          © {new Date().getFullYear()} Aurevia Health Integrity Labs
        </p>

        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest leading-loose max-w-3xl border-t border-white/5 pt-8">
          {t('footer_disclaimer')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
