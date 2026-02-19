import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-black text-white border border-white/30 rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none hover:border-white transition-all cursor-pointer"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="ml">Malayalam</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="zh">中国人</option>
        <option value="ar">العربية</option>
        <option value="pt">Português</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
