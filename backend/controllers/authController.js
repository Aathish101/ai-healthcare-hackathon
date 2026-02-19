
import crypto from 'crypto';

// In-memory store for OTPs (replace with Redis/Database in production)
const otpStore = new Map();

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP with expiration (5 minutes)
        otpStore.set(email, {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        // In a real application, send this via email using Nodemailer/SendGrid
        console.log(`=========================================`);
        console.log(`🔐 OTP for ${email}: ${otp}`);
        console.log(`=========================================`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired' });
        }

        if (Date.now() > storedData.expires) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // OTP verified successfully
        otpStore.delete(email); // Clear OTP after usage

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: 'mock-jwt-token-' + Date.now() // Mock token
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};
