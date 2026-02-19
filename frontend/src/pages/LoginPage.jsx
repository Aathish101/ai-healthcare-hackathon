import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import BrandLogo from '../components/BrandLogo';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError("");
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setError(t('id_required'));
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");
            await axios.post("http://localhost:5000/api/auth/send-otp", { email });
            setShowOtpInput(true);
            setMessage("Security code transmitted.");
        } catch (err) {
            setError(t('transmission_failure'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError(t('code_required'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            if (response.data.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Access denied. Invalid code.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-16 animate-fade-up">
                    <BrandLogo centered={true} />
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 shadow-sm animate-slide-in">
                    {error && (
                        <div className="bg-black text-white px-4 py-3 rounded-2xl mb-8 flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('error_label')}:</span>
                            <p className="text-sm font-bold opacity-80">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-2xl mb-8 flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('status_label')}:</span>
                            <p className="text-sm font-bold">{message}</p>
                        </div>
                    )}

                    <div className="space-y-8">
                        {!showOtpInput ? (
                            <>
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full btn-secondary py-4 group flex items-center justify-center gap-4"
                                >
                                    {loading ? <LoadingSpinner /> :
                                        <>
                                            <svg className="h-5 w-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span className="uppercase text-xs tracking-widest font-black">{t('google_login')}</span>
                                        </>
                                    }
                                </button>
                                <div className="relative flex items-center justify-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                    <span className="absolute px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{t('login_title')}</span>
                                </div>
                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">{t('email_label')}</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field"
                                            placeholder="identifier@aurevia.health"
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full btn-primary py-4 uppercase text-xs tracking-[0.2em]">
                                        {loading ? <LoadingSpinner /> : t('request_code')}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-8">
                                <div className="text-center space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {t('verify_code')}
                                    </p>
                                    <p className="text-sm font-black text-black">
                                        {t('check_email')} <span className="underline">{email}</span>
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="label">{t('digit_key_label')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="input-field text-center text-3xl font-black tracking-[0.5em]"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <button type="button" onClick={() => setShowOtpInput(false)} className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest">
                                        {t('change_id')}
                                    </button>
                                    <button type="button" onClick={handleSendOtp} className="text-[10px] font-black text-black uppercase tracking-widest">
                                        {t('renew_code')}
                                    </button>
                                </div>
                                <button type="submit" disabled={loading} className="w-full btn-primary py-4 uppercase text-xs tracking-[0.2em]">
                                    {loading ? <LoadingSpinner /> : t('nav_authorize')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
                <p className="mt-12 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
                    Bio-Security Protocols Active
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
