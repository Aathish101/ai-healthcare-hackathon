
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 mb-6">
                        <img
                            src="https://i.ibb.co/xSkh16zY/Chat-GPT-Image-Feb-18-2026-10-37-07-AM-removebg-preview.png"
                            alt="Aurevia Health"
                            className="h-24 md:h-32 w-auto object-contain"
                        />
                        <span className="text-3xl font-bold text-white">Ayurevia Health</span>
                    </div>
                    <p className="text-sm mb-4">
                        Early Health Risk Prediction Platform
                    </p>
                    <p className="text-xs text-gray-500">
                        © 2026 Ayurevia Health. This platform provides health risk assessments for informational purposes only.
                        Consult with healthcare professionals for medical advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
