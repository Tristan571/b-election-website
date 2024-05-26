import React, { useState } from 'react';
import axios from 'axios';

export const OTPComponent = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOTP] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async () => {
        try {
            await axios.post('/api/sendOTP', { phoneNumber });
            setMessage('OTP sent successfully');
        } catch (error) {
            setMessage('Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post('/api/verifyOTP', { phoneNumber, code: otp });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Invalid OTP');
        }
    };

    return (
        <div>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={handleSendOTP}>Send OTP</button>

            <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
            <button onClick={handleVerifyOTP}>Verify OTP</button>

            <p>{message}</p>
        </div>
    );
};

