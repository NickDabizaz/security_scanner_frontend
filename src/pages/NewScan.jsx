import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ShieldAlert, FolderGit, Globe, CheckSquare, Square, AlertCircle, Coins, Lock, GitBranch, Layers } from 'lucide-react';
import ScanProgressModal from '../components/ScanProgressModal';
import { scanService } from '../services/api';
import { passiveWebScanCatalog, repositoryScanCatalog, scanCategorySummary } from '../data/scanCatalog';

export default function NewScan() {
  const [activeTab, setActiveTab] = useState('local'); // 'local', 'github', or 'url'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('grfyn_user') || '{}');
  const isPro = user.plan === 'PRO';
  const isProgressActive = scanProgress && ['SUBMITTING', 'PENDING', 'RUNNING'].includes(scanProgress.status);
  const selectedScanCatalog = activeTab === 'url' ? passiveWebScanCatalog : repositoryScanCatalog;

  useEffect(() => {
    if (!scanProgress?.scanId || !isProgressActive) return undefined;

    let cancelled = false;
    const refreshProgress = async () => {
      try {
        const detail = await scanService.getDetail(scanProgress.scanId);
        if (cancelled) return;

        setScanProgress((current) => ({
          ...current,
          status: detail.status,
          errorMessage: detail.errorMessage,
          findings: detail.findings?.length || 0,
        }));
      } catch (pollError) {
        if (!cancelled) {
          console.error('Failed to refresh scan progress:', pollError.message);
        }
      }
    };

    refreshProgress();
    const interval = window.setInterval(refreshProgress, 1200);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [scanProgress?.scanId, isProgressActive]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Format file tidak valid. Hanya mendukung arsip ZIP (.zip).');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Format file tidak valid. Hanya mendukung arsip ZIP (.zip).');
      }
    }
  };

  const handleLaunchScan = async (e) => {
    e.preventDefault();
    setError('');

    if (!authorized) {
      setError('Anda harus mengonfirmasi persetujuan otoritas scan untuk melanjutkan.');
      return;
    }

    if (activeTab === 'local' && !file) {
      setError('Silakan pilih atau unggah file ZIP repositori terlebih dahulu.');
      return;
    }

    if (activeTab === 'github' && !githubUrl) {
      setError('Silakan masukkan URL repositori publik GitHub target.');
      return;
    }

    if (activeTab === 'url' && !url) {
      setError('Silakan masukkan alamat URL web target.');
      return;
    }

    if (activeTab === 'url' && !isPro) {
      setError('Fitur scan URL web aktif hanya tersedia untuk akun tingkat PRO.');
      return;
    }

    setLoading(true);
    setScanProgress({
      scanId: null,
      status: 'SUBMITTING',
      findings: 0,
      targetName: activeTab === 'local' ? file.name : activeTab === 'github' ? githubUrl : url,
      catalog: selectedScanCatalog,
    });

    try {
      let data;
      if (activeTab === 'local') {
        data = await scanService.createLocalScan(file, true);
      } else if (activeTab === 'github') {
        data = await scanService.createGithubScan(githubUrl, githubBranch, true);
      } else {
        data = await scanService.createUrlScan(url, true);
      }

      // Update user credits in localStorage
      const updatedUser = { ...user, credit: data.remainingCredit };
      localStorage.setItem('grfyn_user', JSON.stringify(updatedUser));

      setScanProgress((current) => ({
        ...current,
        scanId: data.scanId,
        status: data.status,
      }));
    } catch (err) {
      setError(err.message || 'Gagal memulai scan. Periksa sisa kredit atau kredensial Anda.');
      setScanProgress((current) => ({
        ...current,
        status: 'FAILED',
        errorMessage: err.message || 'Gagal memulai scan.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1.5 flex items-center justify-center md:justify-start gap-2.5">
          <Play className="w-7 h-7 text-blue-400 fill-blue-400/20" />
          <span>Inisialisasi Scan Keamanan</span>
        </h1>
        <p className="text-slate-400 text-xs max-w-xl">
          Siapkan wadah pemindaian untuk melakukan audit kode mendalam atau analisis eksposur web pasif.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3 animate-shake">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Selector Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-cyber-800/40 p-1.5 rounded-2xl border border-white/5 mb-6 gap-2">
        <button
          onClick={() => { setActiveTab('local'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
            activeTab === 'local'
              ? 'bg-blue-600/25 text-blue-300 border border-blue-500/25 shadow-glass-accent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit className="w-4 h-4" />
          <span>Berkas ZIP Lokal</span>
        </button>

        <button
          onClick={() => { setActiveTab('github'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
            activeTab === 'github'
              ? 'bg-blue-600/25 text-blue-300 border border-blue-500/25 shadow-glass-accent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>Repositori GitHub</span>
        </button>

        <button
          onClick={() => { setActiveTab('url'); setError(''); }}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-300 relative ${
            activeTab === 'url'
              ? 'bg-blue-600/25 text-blue-300 border border-blue-500/25 shadow-glass-accent'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Alamat URL Web</span>
          {!isPro && (
            <Lock className="w-3.5 h-3.5 text-blue-400" />
          )}
        </button>
      </div>

      {/* Scan Content Containers */}
      <div className="glass-panel p-5 md:p-6 mb-6 relative overflow-hidden">
        {/* Tab 1: Local ZIP Upload */}
        {activeTab === 'local' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">Unggah Arsip Repositori Kode</h2>
              <p className="text-slate-400 text-xs">
                Unggah direktori proyek Anda yang terkompresi dalam bentuk <b>file ZIP</b> (Maks 50MB) untuk mengaudit konfigurasi, kunci rahasia, dependensi, dan celah injeksi kode.
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/5'
                  : file
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-white/10 hover:border-white/20 bg-cyber-900/20'
              }`}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center gap-2.5">
                <FolderGit className={`w-10 h-10 ${file ? 'text-emerald-400' : 'text-blue-400/80 animate-pulse'}`} />
                {file ? (
                  <div>
                    <h4 className="text-white font-bold text-sm max-w-md truncate mx-auto mb-0.5">{file.name}</h4>
                    <p className="text-emerald-400 text-xs font-semibold">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • File ZIP Siap
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold mt-2.5 underline focus:outline-none"
                    >
                      Hapus File
                    </button>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="file-upload-input"
                      className="cursor-pointer text-blue-400 hover:text-blue-300 font-bold hover:underline"
                    >
                      Klik untuk memilih berkas
                    </label>
                    <span className="text-slate-400"> atau seret & jatuhkan berkas ZIP Anda di sini</span>
                    <p className="text-slate-500 text-xxs mt-1.5">
                      Hanya format file ZIP (*.zip) terkompresi standar yang didukung.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub Repository Connection */}
        {activeTab === 'github' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">Hubungkan Repositori Publik GitHub</h2>
              <p className="text-slate-400 text-xs">
                Masukkan URL repositori publik GitHub Anda. Mesin pemindai kami akan secara otomatis mengambil arsip repositori dan menjalankan audit static analysis secara mendalam.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">URL Repositori GitHub</label>
                <input
                  id="github-url-input"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                  <span>Cabang / Target Branch (Default: main)</span>
                </label>
                <input
                  id="github-branch-input"
                  type="text"
                  value={githubBranch}
                  onChange={(e) => setGithubBranch(e.target.value)}
                  placeholder="main"
                  className="w-full glass-input text-xs"
                />
                <span className="text-slate-500 text-[10px] block mt-1">
                  Jika cabang yang ditentukan tidak ada, mesin pemindai otomatis akan mencoba cabang alternatif <code>master</code>.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Online URL Probe */}
        {activeTab === 'url' && (
          <div className="space-y-4 relative min-h-[200px] animate-fadeIn">
            {/* PRO plan lock overlay */}
            {!isPro && (
              <div className="absolute inset-0 bg-cyber-800/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6 rounded-2xl animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-3 shadow-glass-accent">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Akses Kelas PRO Dibutuhkan</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto mb-3">
                  Scan aplikasi web aktif berbasis URL online eksklusif hanya untuk pengguna kelas akun PRO.
                </p>
                <div className="text-slate-500 text-[10px]">
                  Untuk uji coba MVP, ubah langsung tingkat akun (plan) menjadi PRO pada database.
                </div>
              </div>
            )}

            <div className={!isPro ? 'opacity-20 pointer-events-none' : ''}>
              <h2 className="text-lg font-bold text-white mb-0.5">Scan Pasif Aplikasi Web</h2>
              <p className="text-slate-400 text-xs">
                Menguji parameter HTTP aman, SSL handshake, properti keamanan cookie, dan memeriksa eksposur file konfigurasi publik pada port host aktif.
              </p>
              
              <div className="mt-4">
                <label className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Alamat Aplikasi Web</label>
                <input
                  id="target-url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full glass-input text-xs"
                  disabled={!isPro}
                />
                <span className="text-slate-500 text-[10px] block mt-1.5">
                  Format penulisan harus menyertakan protokol secara lengkap: <code>https://domain-target.com</code>
                </span>
              </div>

              {/* Safe Scan notice alerts */}
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-slate-400 text-xs flex gap-2.5 mt-4">
                <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">Perlindungan SSRF & Scan Aman Aktif</span>
                  Mesin pemindai otomatis akan langsung memblokir dan membatalkan permintaan scan yang diarahkan ke IP lokal (localhost, 127.0.0.1) maupun cloud metadata server (169.254.169.254).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 50 Security Scan Coverage Panel */}
      <div className="glass-panel p-5 mb-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>50 Rule Static Repository / 50 Pemeriksaan Source Code</span>
            </h3>
            <p className="text-slate-500 text-[10px] mt-1">
              GitHub dan ZIP dianalisis secara read-only. Kode tidak pernah dijalankan atau diinstal.
            </p>
          </div>
          <span className="shrink-0 self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400">
            Defensive only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {scanCategorySummary.map((category) => (
            <div key={category.title} className="rounded-xl border border-white/5 bg-slate-950/30 p-3">
              <strong className="block text-[10px] uppercase tracking-wider text-blue-300">{category.title}</strong>
              <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">{category.detail}</span>
            </div>
          ))}
        </div>

        <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
          {repositoryScanCatalog.map((check) => (
            <div key={check.id} className="flex gap-2.5 rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-[10px]">
              <span className="font-mono font-bold text-blue-400">{check.id}</span>
              <div>
                <strong className="text-slate-200">{check.title}</strong>
                <span className="ml-2 text-slate-500">{check.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance / Legal Authorization Card */}
      <div className="glass-panel p-5 mb-6 flex items-start gap-3.5">
        <button
          id="consent-checkbox"
          type="button"
          onClick={() => setAuthorized(!authorized)}
          className="shrink-0 p-0.5 rounded-lg hover:bg-white/5 text-blue-400 transition-colors"
        >
          {authorized ? (
            <CheckSquare className="w-5.5 h-5.5 text-blue-500" />
          ) : (
            <Square className="w-5.5 h-5.5 text-slate-500" />
          )}
        </button>

        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5">Persetujuan Otoritas Scan</span>
          Saya menyatakan bahwa aset target adalah milik saya atau saya memiliki izin tertulis yang sah untuk melakukan pemeriksaan. Saya hanya akan memakai hasil scan untuk perbaikan dan pelaporan keamanan, tanpa eksploitasi, gangguan layanan, perubahan data, atau akses yang tidak diizinkan.
        </div>
      </div>

      {/* Pricing / launching footer grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-500 shadow-glass-accent">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider block">Biaya Kredit Pemindaian</span>
            <span className="text-white text-xs font-bold">5 Kredit per analisis</span>
          </div>
        </div>

        <button
          id="launch-scan-btn"
          onClick={handleLaunchScan}
          disabled={loading || !authorized || (activeTab === 'local' && !file) || (activeTab === 'github' && !githubUrl) || (activeTab === 'url' && (!url || !isPro))}
          className="w-full sm:w-auto glass-button min-w-[180px] py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-glass-accent active:scale-95 border border-blue-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Mulai Proses Scan</span>
              <Play className="w-3 h-3 fill-white" />
            </>
          )}
        </button>
      </div>

      {scanProgress && (
        <ScanProgressModal
          key={scanProgress.scanId || scanProgress.targetName}
          scanProgress={scanProgress}
          onAction={() => scanProgress.status === 'FAILED' ? setScanProgress(null) : navigate('/')}
          actionLabel={scanProgress.status === 'FAILED' ? 'Tutup' : scanProgress.status === 'COMPLETED' ? 'Buka Dashboard' : 'Pantau di Dashboard'}
        />
      )}
    </div>
  );
}
