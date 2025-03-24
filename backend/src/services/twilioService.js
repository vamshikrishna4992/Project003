import twilio from 'twilio';
import { twilioConfig } from '../config/twilio.js';

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      to: to,  // Phone number to send to
      from: twilioConfig.phoneNumber // Your Twilio phone number
    });
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  const message = `Your OTP is: ${otp}. Valid for 5 minutes.`;
  
  try {
    await sendSMS(phoneNumber, message);
    return otp;
  } catch (error) {
    throw error;
  }
}; 