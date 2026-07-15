import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { dbService } from '../lib/dbService';

interface LandingPageProps {
  onGetStarted: () => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);

  // Check if user is already logged in
  useEffect(() => {
    const cachedProfile = localStorage.getItem('sales_user_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        if (parsed.email && parsed.isLoggedIn) {
          setExistingUser(parsed);
        }
      } catch (_) {}
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const username = email.split('@')[0];
      const profile = {
        email,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        isLoggedIn: true,
        initials: username.slice(0, 2).toUpperCase()
      };

      localStorage.setItem('sales_user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('sales_user_update'));
      
      // Auto seed default database if empty
      dbService.getOrders();
      setLoading(false);
      onGetStarted();
    }, 650);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const profile = {
        email: 'google.analyst@gmail.com',
        name: 'Google Analyst',
        isLoggedIn: true,
        initials: 'GA'
      };
      localStorage.setItem('sales_user_profile', JSON.stringify(profile));
      window.dispatchEvent(new Event('sales_user_update'));
      
      dbService.getOrders();
      setLoading(false);
      onGetStarted();
    }, 800);
  };

  const handleContinueAsGuest = () => {
    const profile = {
      email: 'guest.session@aerodata.com',
      name: 'Guest User',
      isLoggedIn: false,
      initials: 'GU'
    };
    localStorage.setItem('sales_user_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('sales_user_update'));
    
    dbService.getOrders();
    onGetStarted();
  };

  const handleClearCachedSession = () => {
    localStorage.removeItem('sales_user_profile');
    setExistingUser(null);
  };

  return (
    <div className="relative min-h-screen mesh-gradient-bg overflow-hidden flex items-center justify-center p-4 sm:p-6 text-white font-sans text-center z-10">
      
      {/* Background radial glow lights */}
      <div className="absolute top-[15%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      
      {/* Blueprint dot pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0 opacity-40" />

      {/* Main centered container */}
      <div className="relative max-w-md w-full flex flex-col items-center justify-center space-y-10 z-20 py-12">
        
        {/* Top Section: 2 Magnified Animated Lines */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-bold tracking-widest uppercase animate-slide-up">
            <Sparkles size={12} className="text-purple-400 animate-pulse" />
            <span>Workspace Entry</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-slide-up tracking-tight uppercase leading-none">
            AeroSales
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:250ms] tracking-wide leading-relaxed">
            AI-Powered Sales Analytics & Forecast Dashboard
          </p>
        </div>

        {/* Middle Section: Glass Credentials Login Card */}
        {existingUser ? (
          /* Welcome back card state */
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden group transition-all duration-300 hover:border-white/20 animate-slide-up [animation-fill-mode:forwards] [animation-delay:400ms]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg mb-6 mx-auto group-hover:scale-105 transition-transform duration-300">
              {existingUser.initials || 'RJ'}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Welcome back, {existingUser.name}!</h2>
            <p className="text-slate-400 text-sm leading-relaxed mt-2">
              Your credentials are authenticated. Access your custom dashboards and analytics forecast engines.
            </p>
            
            <div className="text-[9px] uppercase font-mono tracking-wider text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md inline-block mt-3.5 border border-indigo-500/15">
              Profile: {existingUser.email}
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-550/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
              >
                <span>Enter Workspace</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleClearCachedSession}
                className="w-full text-rose-455 hover:text-rose-400 font-bold hover:underline cursor-pointer text-xs py-1"
              >
                Sign in with another account
              </button>
            </div>
          </div>
        ) : (
          /* Form credentials input */
          <form 
            onSubmit={handleLoginSubmit} 
            className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl w-full relative transition-all duration-300 hover:border-white/20 animate-slide-up [animation-fill-mode:forwards] [animation-delay:400ms] space-y-5"
          >
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-455 flex items-center gap-1.5 ml-1">
                  <Mail size={11} className="text-indigo-400" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@company.com"
                  disabled={loading}
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-455 flex items-center gap-1.5 ml-1">
                  <Lock size={11} className="text-indigo-400" /> Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all text-sm font-medium text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Email Sign In CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-600 hover:to-purple-600 text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Divider lines */}
            <div className="flex items-center gap-3 text-slate-550 text-[9px] uppercase font-mono py-1 select-none">
              <div className="h-px bg-white/5 flex-1" />
              <span>or</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            {/* Login with Google Account (Gmail) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              <GoogleIcon />
              <span>Login with Google Account</span>
            </button>

            {/* Continue Without Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                disabled={loading}
                className="text-slate-450 hover:text-white text-xs font-semibold hover:underline transition-colors py-1 inline-flex items-center gap-1 cursor-pointer"
              >
                Continue without login <ArrowRight size={12} className="opacity-60" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
