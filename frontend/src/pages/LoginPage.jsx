
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";



const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

   
const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    setError('');

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    console.log("Login Result:", result);

    if (result.user) {
      navigate("/dashboard");
    }

  } catch (error) {
    console.error("Login Error:", error);
    setError(error.code + " - " + error.message);
  } finally {
    setLoading(false);
  }
};
const handleSendOtp = async (e) => {
  e.preventDefault();

  if (!email) {
    setError("Please enter your email address");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    await axios.post(
      "http://localhost:5000/api/auth/send-otp",
      { email }
    );

    setShowOtpInput(true);
    setMessage("OTP sent successfully!");
  } catch (err) {
    setError("Failed to send OTP");
  } finally {
    setLoading(false);
  }
};

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP');
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
            console.error('Verify OTP error:', err);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <img
                        src="https://i.ibb.co/xSkh16zY/Chat-GPT-Image-Feb-18-2026-10-37-07-AM-removebg-preview.png"
                        alt="Aurevia Health"
                        className="h-16 w-auto"
                    />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <button
                        onClick={() => navigate('/')}
                        className="font-medium text-medical-blue hover:text-blue-500"
                    >
                        return to home
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {message}
                        </div>
                    )}

                    <div className="space-y-6">
                        {!showOtpInput ? (
                            <>
                                <div>
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading} // Disable if loading
                                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue"
                                    >
                                        {loading ? <span className="loader"></span> :
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <path
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        fill="#4285F4"
                                                    />
                                                    <path
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        fill="#34A853"
                                                    />
                                                    <path
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                                        fill="#FBBC05"
                                                    />
                                                    <path
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        fill="#EA4335"
                                                    />
                                                </svg>
                                                Sign in with Google
                                            </div>
                                        }
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or verify with Email
                                        </span>
                                    </div>
                                </div>

                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medical-blue focus:border-medical-blue sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue disabled:opacity-50"
                                        >
                                            {loading ? <LoadingSpinner /> : 'Send OTP'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Enter the OTP sent to <strong>{email}</strong>
                                    </p>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        One-Time Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medical-blue focus:border-medical-blue sm:text-sm tracking-widest text-center text-xl"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowOtpInput(false)}
                                        className="text-sm font-medium text-medical-blue hover:text-blue-500"
                                    >
                                        Change Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                        Resend OTP
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue disabled:opacity-50"
                                    >
                                        {loading ? <LoadingSpinner /> : 'Verify & Continue'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
