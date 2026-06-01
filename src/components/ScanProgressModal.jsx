import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, ListChecks, LoaderCircle, ShieldCheck } from 'lucide-react';

export default function ScanProgressModal({ scanProgress, onAction, actionLabel }) {
  const progressCatalog = scanProgress.catalog;
  const isProgressActive = ['SUBMITTING', 'PENDING', 'RUNNING'].includes(scanProgress.status);
  const [completedChecks, setCompletedChecks] = useState(scanProgress.status === 'COMPLETED' ? progressCatalog.length : 0);
  const activeCheckRef = useRef(null);
  const visibleCompletedChecks = scanProgress.status === 'COMPLETED' ? progressCatalog.length : completedChecks;

  useEffect(() => {
    if (!isProgressActive) return undefined;

    const interval = window.setInterval(() => {
      setCompletedChecks((current) => Math.min(current + 1, progressCatalog.length - 1));
    }, 180);

    return () => window.clearInterval(interval);
  }, [isProgressActive, progressCatalog.length]);

  useEffect(() => {
    activeCheckRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [visibleCompletedChecks]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-cyber-950/85 p-4 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="scan-progress-title">
      <div className="glass-panel w-full max-w-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
        <div className="border-b border-white/5 bg-slate-950/50 p-5">
          <div className="flex items-start gap-3">
            <div className={`rounded-xl border p-2.5 ${
              scanProgress.status === 'COMPLETED'
                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                : scanProgress.status === 'FAILED'
                ? 'border-red-500/25 bg-red-500/10 text-red-400'
                : 'border-blue-500/25 bg-blue-500/10 text-blue-400'
            }`}>
              {scanProgress.status === 'COMPLETED' ? (
                <ShieldCheck className="h-5 w-5" />
              ) : scanProgress.status === 'FAILED' ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 id="scan-progress-title" className="text-sm font-extrabold text-white">
                  {scanProgress.status === 'COMPLETED'
                    ? 'Scan selesai diproses'
                    : scanProgress.status === 'FAILED'
                    ? 'Scan tidak dapat dilanjutkan'
                    : 'Proses scan sedang berjalan'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {visibleCompletedChecks}/{progressCatalog.length} kontrol
                </span>
              </div>
              <p className="mt-1 truncate text-[10px] font-mono text-slate-400" title={scanProgress.targetName}>
                {scanProgress.targetName}
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                scanProgress.status === 'FAILED' ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
              }`}
              style={{ width: `${Math.round((visibleCompletedChecks / progressCatalog.length) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                Pemeriksaan defensif read-only
              </span>
            </div>
            <span className="text-[9px] text-slate-500">Scroll untuk melihat seluruh daftar</span>
          </div>

          <div className="max-h-[340px] space-y-1.5 overflow-y-auto pr-1">
            {progressCatalog.map((check, index) => {
              const isComplete = scanProgress.status === 'COMPLETED' || index < visibleCompletedChecks;
              const isCurrent = isProgressActive && index === visibleCompletedChecks;

              return (
                <div
                  key={check.id}
                  ref={isCurrent ? activeCheckRef : null}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors ${
                    isCurrent
                      ? 'border-blue-500/30 bg-blue-500/10'
                      : isComplete
                      ? 'border-emerald-500/10 bg-emerald-500/5'
                      : 'border-white/5 bg-slate-950/30'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : isCurrent ? (
                    <LoaderCircle className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-400" />
                  ) : (
                    <Clock3 className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                  )}
                  <span className="w-5 shrink-0 font-mono text-[9px] font-bold text-slate-500">{check.id}</span>
                  <div className="min-w-0 flex-1">
                    <strong className={`block truncate text-[10px] ${isCurrent ? 'text-blue-200' : isComplete ? 'text-slate-300' : 'text-slate-500'}`}>
                      {check.title}
                    </strong>
                    <span className="block truncate text-[9px] text-slate-600">{check.detail}</span>
                  </div>
                  <span className={`shrink-0 text-[8px] font-bold uppercase tracking-wider ${
                    isComplete ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-slate-600'
                  }`}>
                    {isComplete ? 'selesai' : isCurrent ? 'memeriksa' : 'antri'}
                  </span>
                </div>
              );
            })}
          </div>

          {scanProgress.status === 'FAILED' && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-[10px] leading-relaxed text-red-300">
              {scanProgress.errorMessage || 'Scan gagal diproses. Silakan periksa target dan coba kembali.'}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-relaxed text-slate-500">
              Scanner hanya membaca arsip atau response target untuk pelaporan keamanan. Tidak ada eksploitasi atau perubahan data.
            </p>
            <button
              type="button"
              onClick={onAction}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-600 px-4 py-2.5 text-[10px] font-bold text-white transition-colors hover:bg-blue-500"
            >
              <span>{actionLabel}</span>
              {scanProgress.status !== 'FAILED' && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
