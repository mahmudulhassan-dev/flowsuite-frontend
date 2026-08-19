'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { api } from '../../../lib/api';
import { Mail, Lock, Phone, Key, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  
  // General status states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError(null);
    setOtpMessage(null);
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post<{ success: boolean; message: string }>('/api/v1/auth/phone/send-otp', {
        phone: phoneNumber.trim()
      });
      setOtpSent(true);
      setOtpMessage(data.message);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post<{ user: any; token: string }>('/api/v1/auth/phone/verify-otp', {
        phone: phoneNumber.trim(),
        code: code.trim()
      });
      localStorage.setItem('fs_token', data.token);
      window.location.href = '/panel';
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (platform: string) => {
    setError(null);
    setLoading(true);
    try {
      const emailLocal = `${platform.toLowerCase()}-tester@flowsuite.com`;
      const fullName = `${platform} Developer`;
      const uid = `social_uid_${platform.toLowerCase()}_123456`;
      
      const data = await api.post<{ user: any; token: string }>('/api/v1/auth/social-login', {
        email: emailLocal,
        fullName,
        platform,
        uid
      });
      
      localStorage.setItem('fs_token', data.token);
      window.location.href = '/panel';
    } catch (err: any) {
      setError(err.message || `Login with ${platform} failed`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      
      <Card className="w-full max-w-md bg-slate-900/60 border-slate-800/80 backdrop-blur-2xl shadow-2xl rounded-[32px] overflow-hidden border">
        <CardHeader className="space-y-2 text-center pt-8 pb-5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-500/20">
            FS
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white mt-2">Welcome back</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Choose your preferred authentication method to enter your user panel
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Method Tab Switcher */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800/50">
            <button
              type="button"
              onClick={() => { setMethod('email'); setError(null); }}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'email' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMethod('phone'); setError(null); }}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'phone' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10' : 'text-slate-400 hover:text-slate-300'}`}
            >
              Phone OTP Sign In
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {otpMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{otpMessage}</span>
            </div>
          )}

          {/* EMAIL METHOD */}
          {method === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-slate-950 border-slate-800 focus:border-purple-500 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-slate-950 border-slate-800 focus:border-purple-500 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5 mt-2"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : <><span className="ml-2">Login to Dashboard</span> <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          {/* PHONE OTP METHOD */}
          {method === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <Input
                      type="tel"
                      placeholder="+880 1XXX XXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-11 bg-slate-950 border-slate-800 focus:border-purple-500 rounded-xl text-sm"
                      disabled={otpSent && loading}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-4 rounded-xl border border-slate-800 font-semibold transition-all"
                    disabled={loading}
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </Button>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Verification Code</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="pl-11 bg-slate-950 border-slate-800 focus:border-purple-500 rounded-xl text-sm"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : <><span className="ml-2">Verify and Log In</span> <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Social Logins Divider */}
          <div className="relative my-6 text-center">
            <span className="bg-slate-900 px-3.5 py-1 border border-slate-800/80 rounded-full text-[10px] uppercase font-bold tracking-wider text-slate-500 relative z-10">
              Or continue with
            </span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800/60 -z-10" />
          </div>

          {/* Social Logins Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center py-2.5 px-3 border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Sign in with Google"
              disabled={loading}
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.92 3.04c.94-2.82 3.58-4.96 6.69-4.96z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.6-.22-2.36H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.57l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.59z"/>
                <path fill="#FBBC05" d="M5.31 10.6c-.24-.72-.37-1.5-.37-2.3s.13-1.58.37-2.3L1.39 2.96C.5 4.77 0 6.82 0 9s.5 4.23 1.39 6.04l3.92-3.04C5.18 11.28 5.18 10.92 5.31 10.6z"/>
                <path fill="#34A853" d="M12 17.04c-3.11 0-5.75-2.14-6.69-4.96l-3.92 3.04C3.37 20.33 7.35 23 12 23c2.98 0 5.67-1 7.69-2.73l-3.7-2.87c-1.07.72-2.43 1.64-3.99 1.64z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="flex items-center justify-center py-2.5 px-3 border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Sign in with Facebook"
              disabled={loading}
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center py-2.5 px-3 border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Sign in with Apple"
              disabled={loading}
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.05-2.029.03-3.897 1.18-4.937 3.002-2.1 3.678-.54 9.117 1.5 12.076 1.002 1.449 2.176 3.067 3.738 3.007 1.503-.06 2.074-.969 3.889-.969 1.802 0 2.33.969 3.89.939 1.602-.03 2.628-1.469 3.612-2.909 1.138-1.666 1.604-3.275 1.63-3.365-.05-.03-3.136-1.205-3.167-4.789-.03-2.996 2.457-4.436 2.574-4.509-1.401-2.058-3.56-2.296-4.32-2.352-1.742-.14-3.447 1.05-3.447 1.05zM15.485 3.82c.767-.932 1.282-2.226 1.141-3.52-1.11.045-2.457.738-3.255 1.67-.687.794-1.29 2.1-1.121 3.375 1.238.096 2.467-.601 3.235-1.525z"/>
              </svg>
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-0 pb-8">
          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-bold transition-all">
              Sign up free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
