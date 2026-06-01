import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Play, History, ArrowUpRight, AlertTriangle, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { scanService, authService } from '../services/api';

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeLogTab, setActiveLogTab] = useState('active'); // 'active' or 'historical'
  const [scanToDelete, setScanToDelete] = useState(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch scan history
      const scanData = await scanService.getHistory();
      setScans(scanData.data || []);
      
      // Refresh current user data (to keep credits accurate)
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData.user);
      localStorage.setItem('grfyn_user', JSON.stringify(userData.user));
    } catch (err) {
      setError(err.message || 'Gagal terhubung dengan konsol keamanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchData();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const confirmDelete = async () => {
    if (!scanToDelete) return;
    try {
      setError('');
      setLoading(true);
      await scanService.deleteScan(scanToDelete.id);
      setScanToDelete(null);
      fetchData(); // reload
    } catch (err) {
      setError(err.message || 'Gagal menghapus scan.');
      setScanToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = async (scanId) => {
    try {
      setLoading(true);
      setError('');
      const data = await scanService.rescan(scanId);
      
      // Update user credits
      const user = JSON.parse(localStorage.getItem('grfyn_user') || '{}');
      const updatedUser = { ...user, credit: data.remainingCredit };
      localStorage.setItem('grfyn_user', JSON.stringify(updatedUser));
      
      fetchData(); // reload
    } catch (err) {
      setError(err.message || 'Gagal memulai scan ulang.');
    } finally {
      setLoading(false);
    }
  };

  // Compute metric calculations
  const totalScans = scans.length;
  const completedScans = scans.filter(s => s.status === 'COMPLETED').length;
  const failedScans = scans.filter(s => s.status === 'FAILED').length;
  const pendingScans = scans.filter(s => s.status === 'PENDING' || s.status === 'RUNNING').length;
  const totalFindings = scans.reduce((acc, curr) => acc + (curr.totalFindings || 0), 0);

  // Filter scans based on active vs historical log tab
  const displayedScans = scans.filter(scan => {
    if (activeLogTab === 'historical') {
      return scan.status === 'HISTORICAL';
    } else {
      return scan.status !== 'HISTORICAL';
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 select-none">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-blue-400" />
            <span>Terminal Operator Scan</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Kendalikan, jalankan, dan analisis hasil scan kerentanan kode repositori serta situs web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="glass-button-secondary p-2.5 rounded-xl hover:bg-white/10 active:scale-95 disabled:opacity-50 border border-white/5"
            title="Refresh Terminal"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link to="/scan/new" className="glass-button py-2.5 px-4 bg-blue-600 hover:bg-blue-500 shadow-lg border border-blue-500/20 hover:shadow-glass-accent text-xs font-bold flex items-center gap-2 rounded-xl">
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Mulai Scan Baru</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3 animate-shake">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Operator stats container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
        {/* Card 1: User & Plan */}
        <div className="glass-panel p-5 flex flex-col justify-between hover-card-trigger min-h-[120px]">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block">Tipe Akun</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
              currentUser?.plan === 'PRO' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-glass-accent' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
            }`}>
              {currentUser?.plan ?? 'FREE'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-mono select-text truncate max-w-full" title={currentUser?.username}>{currentUser?.username || 'Operator'}</h3>
            <p className="text-slate-500 text-[10px] mt-0.5">Profil Akses Terdaftar</p>
          </div>
        </div>

        {/* Card 2: Credits Remaining */}
        <div className="glass-panel p-5 flex flex-col justify-between hover-card-trigger min-h-[120px]">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block">Sisa Kredit</span>
            </div>
            <span className="text-amber-500 text-[9px] font-extrabold tracking-wider bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/15 whitespace-nowrap shrink-0">5 Kredit/Scan</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-400 font-mono select-text">{currentUser?.credit ?? 0}</h3>
            <p className="text-slate-500 text-[10px] mt-0.5">Kredit Siap Digunakan</p>
          </div>
        </div>

        {/* Card 3: Scans Activity */}
        <div className="glass-panel p-5 flex flex-col justify-between hover-card-trigger min-h-[120px]">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block">Scan Dijalankan</span>
            </div>
            <span className="text-blue-400 text-[9px] font-extrabold tracking-wider bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/15 whitespace-nowrap shrink-0">{pendingScans} Aktif</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 select-text">
              <h3 className="text-2xl font-black text-white font-mono">{totalScans}</h3>
              <span className="text-slate-400 text-[10px]">total scan</span>
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5 flex gap-2">
              <span className="text-emerald-400">{completedScans} sukses</span>
              <span>•</span>
              <span className="text-red-400">{failedScans} gagal</span>
            </div>
          </div>
        </div>

        {/* Card 4: Vulnerabilities Flagged */}
        <div className="glass-panel p-5 flex flex-col justify-between hover-card-trigger min-h-[120px]">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block">Temuan Kerentanan</span>
            </div>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${totalFindings > 0 ? 'text-blue-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white font-mono select-text">{totalFindings}</h3>
            <p className="text-slate-500 text-[10px] mt-0.5">Total Temuan Keamanan</p>
          </div>
        </div>
      </div>

      {/* Scans list dashboard segment */}
      <div className="glass-panel p-5 md:p-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 border-b border-white/5 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-200 text-xs font-extrabold uppercase tracking-wider block">Log Operasi Scan</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-cyber-900/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveLogTab('active')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                activeLogTab === 'active'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              History ({scans.filter(s => s.status !== 'HISTORICAL').length})
            </button>
            <button
              onClick={() => setActiveLogTab('historical')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                activeLogTab === 'historical'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Arsip ({scans.filter(s => s.status === 'HISTORICAL').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-400 text-xs">Membaca data scan...</span>
          </div>
        ) : displayedScans.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            {activeLogTab === 'active' ? (
              <>
                <h3 className="text-white font-semibold text-sm mb-1">Riwayat Scan Kosong</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
                  Belum ada repositori atau URL yang dipindai. Jalankan pemindaian pertama Anda untuk melihat history.
                </p>
                <Link to="/scan/new" className="glass-button bg-blue-600 hover:bg-blue-500 shadow-lg border border-blue-500/20 hover:shadow-glass-accent inline-flex py-2 px-3.5 rounded-lg text-xs font-bold gap-2">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Mulai Scan Pertama</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-white font-semibold text-sm mb-1">Arsip Kosong</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Belum ada riwayat lama yang diarsipkan. Arsip otomatis tersimpan saat Anda melakukan 'Scan Ulang' pada target.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <div className="inline-block min-w-full align-middle px-5 md:px-6">
              <table className="min-w-full divide-y divide-white/5">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider text-left border-b border-white/5">
                    <th scope="col" className="py-3 pr-4">Target Scan</th>
                    <th scope="col" className="py-3 pr-4">Tipe Scan</th>
                    <th scope="col" className="py-3 pr-4">Temuan</th>
                    <th scope="col" className="py-3 pr-4">Status</th>
                    <th scope="col" className="py-3 pr-4">Waktu Mulai</th>
                    <th scope="col" className="py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {displayedScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-medium text-white max-w-[180px] truncate select-text" title={scan.targetName}>
                        {scan.targetName}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                          scan.targetType === 'LOCAL_REPOSITORY'
                            ? 'bg-blue-950/40 border-blue-500/20 text-blue-300'
                            : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
                        }`}>
                          {scan.targetType === 'LOCAL_REPOSITORY' ? 'Repo ZIP' : 'Scan URL'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono font-bold select-text">
                        {scan.status === 'COMPLETED' || scan.status === 'HISTORICAL' ? (
                          <span className={scan.totalFindings > 0 ? 'text-blue-400' : 'text-emerald-400'}>
                            {scan.totalFindings} temuan
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                          scan.status === 'COMPLETED'
                            ? 'text-emerald-400'
                            : scan.status === 'FAILED'
                            ? 'text-red-400'
                            : scan.status === 'HISTORICAL'
                            ? 'text-slate-500'
                            : 'text-blue-400'
                        }`}>
                          {scan.status === 'PENDING' && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                          )}
                          {scan.status === 'RUNNING' && (
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                          )}
                          {scan.status === 'HISTORICAL' ? 'HISTORICAL / ARSIP' : scan.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 font-mono select-text text-xxs">
                        {new Date(scan.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(scan.status === 'COMPLETED' || scan.status === 'HISTORICAL') ? (
                            <>
                              <Link
                                to={`/scan/${scan.id}`}
                                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40 px-2.5 py-1.5 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 active:scale-95 text-[10px]"
                                title="Periksa hasil temuan scan"
                              >
                                <span>Periksa</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>
                              
                              <button
                                onClick={() => handleRescan(scan.id)}
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/40 px-2.5 py-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 text-[10px] cursor-pointer"
                                title="Jalankan pemindaian ulang pada target ini"
                              >
                                <span>Scan Ulang</span>
                              </button>
                            </>
                          ) : scan.status === 'FAILED' ? (
                            <>
                              <Link
                                to={`/scan/${scan.id}`}
                                className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-all duration-300 border border-red-500/20 hover:border-red-400/40 px-2.5 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 active:scale-95 text-[10px]"
                                title="Lihat detail kesalahan gagal scan"
                              >
                                <span>Detail Gagal</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>
                              
                              <button
                                onClick={() => handleRescan(scan.id)}
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-all duration-300 border border-emerald-500/20 hover:border-emerald-400/40 px-2.5 py-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-95 text-[10px] cursor-pointer"
                                title="Jalankan pemindaian ulang pada target ini"
                              >
                                <span>Scan Ulang</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-xxs italic flex items-center justify-end gap-1 select-none">
                              <div className="w-2.5 h-2.5 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin"></div>
                              <span>Menganalisis...</span>
                            </span>
                          )}

                          {scan.status !== 'PENDING' && scan.status !== 'RUNNING' && (
                            <button
                              onClick={() => setScanToDelete(scan)}
                              className="inline-flex items-center p-1.5 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-400/40 rounded-lg bg-red-500/5 hover:bg-red-500/10 active:scale-95 text-[10px] cursor-pointer"
                              title="Hapus pemindaian secara permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Custom Glassmorphic Confirmation Modal */}
      {scanToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-6 text-center shadow-2xl relative border border-red-500/20 shadow-red-500/5 hover-card-trigger">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4 animate-bounce">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            
            <h3 className="text-base font-extrabold text-white mb-2">
              Hapus Pemindaian Permanen
            </h3>
            
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus hasil pemindaian untuk{' '}
              <span className="text-red-400 font-mono font-bold select-text break-all">
                {scanToDelete.targetName}
              </span>{' '}
              secara permanen dari basis data? Tindakan ini tidak dapat dibatalkan.
            </p>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setScanToDelete(null)}
                className="px-4 py-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-500 border border-red-500/20 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 text-xs font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
