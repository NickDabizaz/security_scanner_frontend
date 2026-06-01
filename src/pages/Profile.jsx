import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Mail, 
  Calendar, 
  Coins, 
  Database, 
  CheckCircle, 
  CreditCard,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  X
} from 'lucide-react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('grfyn_user') || '{}');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handlePurchaseCredits = () => {
    setBillingLoading(true);
    setTimeout(() => {
      setBillingLoading(false);
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setShowBillingModal(false);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 select-none">
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left animate-fadeIn">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center justify-center md:justify-start gap-3">
          <User className="w-8 h-8 text-purple-400" />
          <span>Operator Profile / Profil Operator</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Operator credentials, active security licenses, and billing node status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
        {/* Left Card: Main user metadata */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel p-6 text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

            <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyber-900 border border-white/5 text-purple-400 my-4 shadow-glass">
              <User className="w-12 h-12" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{user.username}</h3>
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Security Level: {user.role ?? 'OPERATOR'}
            </p>

            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
              user.plan === 'PRO' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glass-accent' 
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {user.plan ?? 'FREE'} MEMBER
            </span>
          </div>

          {/* Credits Summary Card */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Coins className="w-4.5 h-4.5 text-amber-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block whitespace-nowrap">CREDIT BALANCE</span>
                <span className="text-slate-500 text-[10px] block -mt-0.5 whitespace-nowrap">Saldo Kredit</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2 select-text">
              <span className="text-4xl font-black text-white font-mono">{user.credit ?? 0}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Credits Available</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Every common security scan operation consumes exactly 5 credits from this balance.
            </p>
          </div>
        </div>

        {/* Right Card: Authorization details & instructions */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-3">
              <span className="text-slate-200 text-xs font-extrabold uppercase tracking-wider block whitespace-nowrap">CLEARANCE CREDENTIALS</span>
              <span className="text-slate-500 text-[10px] block -mt-0.5 whitespace-nowrap">Kredensial Akses</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-500 text-xxs font-semibold uppercase tracking-wider block">Registered Email</span>
                  <span className="text-slate-200 font-mono select-text">{user.email || 'operator@grfyn.com'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-500 text-xxs font-semibold uppercase tracking-wider block">Enlisted Date / Tanggal Terdaftar</span>
                  <span className="text-slate-200 font-mono select-text">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '01 Juni 2026'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Shield className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="text-slate-500 text-xxs font-semibold uppercase tracking-wider block mb-0.5">Authorized Environment / Node Server</span>
                  <span className="text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/15 text-xxs inline-block select-text">
                    GRFYN-SECURE-SANDBOX-API
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgraded Commercial Billing & License Portal */}
          <div className="glass-panel p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-200 text-xs font-extrabold uppercase tracking-wider block whitespace-nowrap">SUBSCRIPTION & BILLING</span>
                  <span className="text-slate-500 text-[10px] block -mt-0.5 whitespace-nowrap">Layanan & Langganan</span>
                </div>
              </div>
              <span className="text-purple-400 text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/15 whitespace-nowrap shrink-0">
                Enterprise Active
              </span>
            </div>
            
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Langganan Anda dikelola secara formal menggunakan portal pembayaran terenkripsi pihak ketiga kami. Kredensial dan limitasi akun Anda diatur otomatis berdasarkan lisensi yang berlaku.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors min-w-0">
                <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block whitespace-nowrap">LICENSE TIER</span>
                <span className="text-slate-500 text-[9px] block -mt-0.5 mb-2 whitespace-nowrap">Tingkat Lisensi</span>
                <strong className="text-slate-200 text-xs flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                  <span>Pro Corporate</span>
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors min-w-0">
                <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider block whitespace-nowrap">BILLING CYCLE</span>
                <span className="text-slate-500 text-[9px] block -mt-0.5 mb-2 whitespace-nowrap">Siklus Tagihan</span>
                <strong className="text-slate-200 text-xs block whitespace-nowrap">Monthly / Bulanan</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBillingModal(true)}
                className="flex-1 glass-button py-2.5 text-xs font-bold transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Manage Subscriptions / Kelola Langganan</span>
              </button>

              <a
                href="mailto:support@grfyn.com"
                className="flex-1 glass-button-secondary py-2.5 text-xs font-bold transition-all duration-300 active:scale-95 border border-white/10 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Sales / Hubungi Sales</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment / Billing simulation modal */}
      {showBillingModal && (
        <div className="fixed inset-0 z-50 bg-[#070a13]/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative select-none">
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowBillingModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-lg active:scale-95 border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 my-4">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 my-2">
                <CreditCard className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">Stripe Billing Gateway Simulator</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                Anda diarahkan ke gateway pembayaran terenkripsi untuk mengelola paket langganan Anda. Klik tombol di bawah untuk menyimulasikan pembelian token/kredit keamanan.
              </p>

              {purchaseSuccess ? (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Kredit Berhasil Ditambahkan / Upgrade Success!</span>
                </div>
              ) : (
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={billingLoading}
                    onClick={handlePurchaseCredits}
                    className="w-full glass-button py-3 text-xs font-bold transition-all duration-300 hover:shadow-glass-accent active:scale-95 border border-purple-500/20 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {billingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        <span>Processing Simulation...</span>
                      </span>
                    ) : (
                      <span>Simulate Add Credit / Beli 500 Kredit (Simulasi)</span>
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
