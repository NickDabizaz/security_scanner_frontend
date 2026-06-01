import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  SearchCode, 
  Terminal, 
  CheckCircle, 
  Coins, 
  ExternalLink,
  Lock,
  Cpu,
  Layers,
  FileCode,
  Globe
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-cyber-900 text-slate-100 flex flex-col font-sans overflow-x-hidden select-none">
      
      {/* 1. GLASSMORPHIC NAVBAR */}
      <nav className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-white/5 border border-white/10">
              <img src="/grfyn_logo.png" className="w-8 h-8 rounded-lg shrink-0" alt="GRFYN Logo" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-lg font-mono text-white block">GRFYN</span>
              <span className="text-blue-400 text-xxs block font-semibold -mt-1 uppercase tracking-widest">Scanner</span>
            </div>
          </div>

          {/* Quick Menus */}
          <div className="hidden md:flex items-center gap-6 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#top10" className="hover:text-blue-400 transition-colors">Top 10 Flaws</a>
            <a href="#tiers" className="hover:text-blue-400 transition-colors">Security Tiers</a>
            <a href="#terms" className="hover:text-blue-400 transition-colors">API Docs</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white text-xs font-semibold px-4 py-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all duration-300">
              Sign In / Masuk
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-blue-500/20 active:scale-95 transition-all duration-300 hover:shadow-glass-accent">
              Register / Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO CHAMBER */}
      <header className="relative py-24 md:py-32 px-4 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -top-20 left-1/4 w-[300px] h-[300px] bg-emerald-500/3 rounded-full blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/15 text-blue-400 text-xxs font-extrabold uppercase tracking-wider mb-6 animate-fadeIn">
          <Shield className="w-3.5 h-3.5" />
          <span>Bilingual Cybersecurity Analyzer Node</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mb-6 font-sans animate-fadeIn">
          Enterprise Vulnerability Analysis <br className="hidden md:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Pemeriksaan Celah Keamanan Skala Bisnis
          </span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed mb-10 animate-fadeIn">
          Audit and harden your applications instantly. Upload static code ZIP repositories or passive probe online URLs. Enriched concurrently with OpenRouter AI security advisories, clean remediations, and secure code samples.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
          <Link to="/register" className="glass-button px-8 py-3.5 font-bold text-sm shadow-xl hover:shadow-glass-accent flex items-center gap-2">
            <SearchCode className="w-4 h-4" />
            <span>Daftar Sekarang / Register Free</span>
          </Link>
          <Link to="/login" className="glass-button-secondary px-8 py-3.5 font-bold text-sm border border-white/10 hover:bg-white/10">
            <span>Masuk Terminal / Sign In</span>
          </Link>
        </div>
      </header>

      {/* 3. KEY FEATURES ROOM */}
      <section id="features" className="py-20 bg-slate-950/40 border-t border-white/5 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Core Assessment Engines</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Mesin Pemeriksa Kerentanan Utama</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-6 hover-card-trigger relative overflow-hidden">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 inline-block mb-5">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Static ZIP Code Audit</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Scan your code archives recursively for hardcoded secrets, OS command injections, unsafe SQL concatenations, and vulnerable libraries with local Zip-Slip directory shields.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 hover-card-trigger relative overflow-hidden">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 inline-block mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Passive Web Probing</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Audit live URLs for secure cookie attributes, HSTS flags, CORS wildcard misconfigurations, CSP headers, and probe for exposed staging backups and administrative panel leaks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6 hover-card-trigger relative overflow-hidden">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 inline-block mb-5">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Powered Enrichment</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Raw findings are enriqued by elite OpenRouter AI agents, generating deep mitigation guides, threat risk scores, and beautiful secure code blocks in standard Indonesian/English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TOP 10 AUDIT FLAS CATALOG */}
      <section id="top10" className="py-20 max-w-7xl mx-auto px-4 md:px-8 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Vulnerabilities Audited</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">10 Jenis Kerentanan & Celah yang Diperiksa</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { id: '01', title: 'SQL Injection', cwe: 'CWE-89', desc: 'Raw database query concatenations.' },
            { id: '02', title: 'Remote Code Exec', cwe: 'CWE-95', desc: 'Dynamic eval evaluations.' },
            { id: '03', title: 'Secrets Leakage', cwe: 'CWE-798', desc: 'Hardcoded API tokens, keys.' },
            { id: '04', title: 'OS Command Inj.', cwe: 'CWE-78', desc: 'Unchecked subprocess shells.' },
            { id: '05', title: 'CORS Wildcard', cwe: 'CWE-942', desc: 'Permissive cross-origin access.' },
            { id: '06', title: 'Cookie Flags Leak', cwe: 'CWE-614', desc: 'Insecure cookie configurations.' },
            { id: '07', title: 'Exposed Env Files', cwe: 'CWE-538', desc: 'Bocoran file rahasia .env.' },
            { id: '08', title: 'Git / SFTP Leak', cwe: 'CWE-200', desc: 'Exposed repository configs.' },
            { id: '09', title: 'Staging Backups', cwe: 'CWE-538', desc: 'Exposed backups and config archives.' },
            { id: '10', title: 'Monitoring Paths', cwe: 'CWE-489', desc: 'Active diagnostics portals.' }
          ].map((v, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-bold text-slate-500 font-mono block mb-1">CWE ID: {v.cwe}</span>
              <strong className="text-white text-xs block mb-1">{v.title}</strong>
              <p className="text-slate-400 text-[10px] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING & TIERS */}
      <section id="tiers" className="py-20 bg-slate-950/40 border-t border-white/5 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Honest Tiers & Licensing</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Lisensi Layanan Transparan & Gratis Mencoba</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="glass-panel p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-slate-500 text-xxs font-extrabold tracking-widest uppercase block mb-1">Standard Node</span>
                <h3 className="text-xl font-bold text-white mb-4">FREE OPERATOR</h3>
                <div className="text-3xl font-black text-white font-mono mb-4">
                  0 Cr <span className="text-xs text-slate-500 font-sans font-medium">/ 5 Credits Default</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Cocok untuk uji coba awal. Dapatkan 5 token kredit awal gratis untuk mengecek kerentanan static ZIP repositori Anda secara instan.
                </p>
              </div>
              <ul className="text-xxs text-slate-400 space-y-2 mb-6">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 1 Initial Scan Allowed</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Static ZIP Analysis</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Standard Mitigation Guide</li>
              </ul>
              <Link to="/register" className="w-full glass-button-secondary py-2 text-center text-xs font-bold rounded-lg block border border-white/10 hover:bg-white/5">
                Mulai Uji Coba Gratis
              </Link>
            </div>

            {/* Pro tier */}
            <div className="glass-panel p-6 border-blue-500/20 bg-blue-600/5 relative overflow-hidden flex flex-col justify-between shadow-glass-accent">
              <div className="absolute right-0 top-0 bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[8px] px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>
              <div>
                <span className="text-blue-400 text-xxs font-extrabold tracking-widest uppercase block mb-1">Enterprise Tier</span>
                <h3 className="text-xl font-bold text-white mb-4">PRO OPERATOR</h3>
                <div className="text-3xl font-black text-white font-mono mb-4">
                  PRO <span className="text-xs text-slate-400 font-sans font-medium">/ 1000 Credits Auto-seeded</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  Didesain untuk kebutuhan tim auditor pengembang. Akses penuh untuk pemeriksaan web URL, static fuzzer, dan pengayaan laporan AI Analyst secara paralel tanpa hambatan.
                </p>
              </div>
              <ul className="text-xxs text-slate-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Unlimited Scan Access</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Active Web Probes & Fuzzing</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> OpenRouter AI Analyst Enrichment</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Print-to-PDF Professional Reports</li>
              </ul>
              <Link to="/register" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 text-center text-xs font-bold rounded-lg block border border-blue-500/20 shadow-lg hover:shadow-glass-accent">
                Daftar Akun PRO Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950/40 select-none py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/grfyn_logo.png" className="w-5 h-5 rounded" alt="GRFYN Logo" />
            <div className="text-left text-[9px] font-medium uppercase tracking-wider text-slate-500 font-sans">
              © 2026 GRFYN Security Scanner &bull; Terminal Operator Portal &bull; All logs encrypted
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/15 text-emerald-400 text-[9px] font-bold tracking-wider scale-95">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>SECURE SYSTEM CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
