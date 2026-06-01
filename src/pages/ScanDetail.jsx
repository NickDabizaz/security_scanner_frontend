import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Calendar, 
  Coins, 
  CheckCircle, 
  Bug, 
  FileCode, 
  Server, 
  Terminal, 
  AlertOctagon,
  ExternalLink,
  Zap,
  BookOpen,
  Copy,
  Printer,
  FileText,
  Activity,
  Download,
  X,
  Check,
  ArrowUp
} from 'lucide-react';
import { scanService } from '../services/api';

// =========================================================================
// 1. DATA PARSING UTILITY FUNCTIONS
// =========================================================================

const parseDescription = (desc) => {
  if (!desc) return { kondisi: '', bahaya: '' };
  
  let kondisi = '';
  let bahaya = '';
  
  const kondisiMarker = '**Kondisi Temuan:**';
  const bahayaMarker = '**Alasan Bahaya:**';
  
  const kondisiIdx = desc.indexOf(kondisiMarker);
  const bahayaIdx = desc.indexOf(bahayaMarker);
  
  if (kondisiIdx !== -1 && bahayaIdx !== -1) {
    if (kondisiIdx < bahayaIdx) {
      kondisi = desc.substring(kondisiIdx + kondisiMarker.length, bahayaIdx).trim();
      bahaya = desc.substring(bahayaIdx + bahayaMarker.length).trim();
    } else {
      bahaya = desc.substring(bahayaIdx + bahayaMarker.length, kondisiIdx).trim();
      kondisi = desc.substring(kondisiIdx + kondisiMarker.length).trim();
    }
  } else if (kondisiIdx !== -1) {
    kondisi = desc.substring(kondisiIdx + kondisiMarker.length).trim();
  } else if (bahayaIdx !== -1) {
    bahaya = desc.substring(bahayaIdx + bahayaMarker.length).trim();
  } else {
    kondisi = desc; // Fallback
  }
  
  return { kondisi, bahaya };
};

const parseRecommendation = (rec) => {
  if (!rec) return { langkah: '', kodeAman: '', bahasaKode: 'javascript' };
  
  let langkah;
  let kodeAman = '';
  let bahasaKode = 'javascript'; // Default fallback
  
  const langkahMarker = '**Langkah Perbaikan:**';
  
  // Look for the Contoh Kode Aman marker dynamically (handles variants)
  let kodeAmanIdx = -1;
  const match = rec.match(/\*\*Contoh [^*]*\*\*:\s*/i);
  if (match) {
    kodeAmanIdx = match.index;
  }
  
  const langkahIdx = rec.indexOf(langkahMarker);
  
  if (langkahIdx !== -1 && kodeAmanIdx !== -1) {
    if (langkahIdx < kodeAmanIdx) {
      langkah = rec.substring(langkahIdx + langkahMarker.length, kodeAmanIdx).trim();
      const codePart = rec.substring(kodeAmanIdx + match[0].length).trim();
      // Parse code block format: ```javascript\n<code>\n```
      const codeBlockMatch = codePart.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        bahasaKode = codeBlockMatch[1] || 'javascript';
        kodeAman = codeBlockMatch[2].trim();
      } else {
        kodeAman = codePart;
      }
    } else {
      const codePart = rec.substring(kodeAmanIdx + match[0].length, langkahIdx).trim();
      const codeBlockMatch = codePart.match(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        bahasaKode = codeBlockMatch[1] || 'javascript';
        kodeAman = codeBlockMatch[2].trim();
      } else {
        kodeAman = codePart;
      }
      langkah = rec.substring(langkahIdx + langkahMarker.length).trim();
    }
  } else if (langkahIdx !== -1) {
    langkah = rec.substring(langkahIdx + langkahMarker.length).trim();
  } else {
    langkah = rec; // Fallback
  }
  
  return { langkah, kodeAman, bahasaKode };
};

const getCweLinkAndId = (cweStr) => {
  if (!cweStr) return null;
  const match = cweStr.match(/CWE-(\d+)/i);
  if (match) {
    const cweId = match[1];
    return {
      id: `CWE-${cweId}`,
      link: `https://cwe.mitre.org/data/definitions/${cweId}.html`
    };
  }
  return null;
};

const generateScanRef = (id, createdAt) => {
  const date = createdAt ? new Date(createdAt) : new Date();
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `SCAN-${yy}${mm}${dd}${id}`;
};

// =========================================================================
// 2. STUNNING TERMINAL-STYLED CODE BLOCK WITH SEQUENTIAL LINE NUMBERS
// =========================================================================

function CyberCodeBlock({ code, title, language, showLineNumbers = true }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!code) return null;
  
  const lines = code.split('\n');
  
  return (
    <div className="bg-[#0b0f19]/90 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden font-mono text-[13px] shadow-lg mb-4 animate-fadeIn">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-white/5 select-none">
        <div className="flex items-center gap-2">
          {/* Terminal mock OS control buttons */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></span>
          </div>
          <span className="text-slate-400 text-xs font-semibold font-sans ml-2">{title || 'source_code'}</span>
          {language && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-blue-400 font-bold uppercase tracking-wider scale-95">
              {language}
            </span>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-200 text-xxs font-bold uppercase transition-all duration-200 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5 active:scale-95"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <FileCode className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="overflow-x-auto p-4 flex leading-relaxed max-h-[350px] scrollbar-thin">
        {showLineNumbers && (
          <div className="text-right text-slate-600 select-none pr-4 border-r border-white/5 font-semibold text-xxs flex flex-col items-end mr-3">
            {lines.map((_, i) => (
              <span key={i} className="h-[20px] leading-[20px]">{i + 1}</span>
            ))}
          </div>
        )}
        <pre className="text-slate-300 flex-1 select-text font-mono text-left text-xs whitespace-pre">
          {lines.map((line, i) => (
            <div key={i} className="h-[20px] leading-[20px] hover:bg-white/5 transition-colors px-1 rounded-sm w-full block">
              <code>{line || ' '}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// =========================================================================
// 3. MAIN SCAN DETAIL PAGE ROUTER
// =========================================================================

export default function ScanDetail() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'
  const [copied, setCopied] = useState(false);
  const [targetCopied, setTargetCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('md'); // 'md' or 'txt'
  const [modalCopied, setModalCopied] = useState(false);
  const [activeOccurrences, setActiveOccurrences] = useState({}); // Stores the active occurrence index per vulnerability title
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchScanDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await scanService.getDetail(id);
        setScan(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve scan report detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchScanDetail();
  }, [id]);

  useEffect(() => {
    if (scan && scan.status === 'FAILED') {
      console.group('%c GRFYN Scanner - Detailed Failure Logs ', 'background: #ef4444; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
      console.error('Scan ID:', scan.id);
      console.error('Target Asset:', scan.targetName);
      console.error('Target Type:', scan.targetType);
      console.error('Failure Message:', scan.errorMessage || 'Unknown execution abort.');
      console.groupEnd();
    }
  }, [scan]);

  // Grouping function: Collapses multiple occurrences of the same type/title into a single structured group
  const groupFindings = (findingsToGroup) => {
    const groups = {};
    findingsToGroup.forEach((finding) => {
      const key = finding.title;
      if (!groups[key]) {
        groups[key] = {
          title: finding.title,
          category: finding.category,
          severity: finding.severity,
          cwe: finding.cwe,
          description: finding.description,
          recommendation: finding.recommendation,
          occurrences: [],
        };
      }
      groups[key].occurrences.push({
        id: finding.id,
        filePath: finding.filePath,
        lineNumber: finding.lineNumber,
        evidence: finding.evidence,
      });
    });
    return Object.values(groups);
  };

  const handleCopyError = () => {
    if (!scan) return;
    const textToCopy = `Scan Failure Report:\nScan ID: ${scan.id}\nTarget: ${scan.targetName}\nType: ${scan.targetType}\nError Message: ${scan.errorMessage || 'Unknown abort.'}\nTimestamp: ${new Date(scan.createdAt).toLocaleString()}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Renders the beautifully structured report content based on desired format
  const generateReportText = (format) => {
    if (!scan) return '';
    const scanRef = generateScanRef(scan.id, scan.createdAt);
    const totalFindings = scan.findings.length;
    const groups = groupFindings(scan.findings);

    if (format === 'md') {
      let md = `# LAPORAN AUDIT KEAMANAN SIBER - GRFYN SECURITY SCANNER\n`;
      md += `========================================================================\n\n`;
      md += `## RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)\n\n`;
      md += `Dokumen ini menyajikan hasil asesmen keamanan formal terhadap kode sumber/infrastruktur yang telah diperiksa menggunakan Grfyn Security Scanner.\n\n`;
      md += `* **Scan Reference Code:** \`${scanRef}\`\n`;
      md += `* **Target Asset / Aset Pemeriksaan:** \`${scan.targetName}\`\n`;
      md += `* **Target Type / Tipe Aset:** \`${scan.targetType === 'LOCAL_REPOSITORY' ? 'ZIP Source Code Repository' : 'Web URL Passive/Active Probes'}\`\n`;
      md += `* **Scan Date / Waktu Scan:** \`${new Date(scan.createdAt).toLocaleString('id-ID', { timeZoneName: 'short' })}\`\n`;
      md += `* **Total Findings / Total Temuan:** \`${totalFindings} Temuan\`\n`;
      md += `* **Credits Spent / Kredit Terpakai:** \`${scan.creditUsed} Credits\`\n\n`;
    
      md += `### STATISTIK TINGKAT ANCAMAN (SEVERITY STATISTIC):\n`;
      md += `| Critical | High | Medium | Low | Info |\n`;
      md += `| :---: | :---: | :---: | :---: | :---: |\n`;
      md += `| ${scan.summary.critical} | ${scan.summary.high} | ${scan.summary.medium} | ${scan.summary.low} | ${scan.summary.info} |\n\n`;
      md += `------------------------------------------------------------------------\n\n`;
    
      md += `## DAFTAR CELAH KEAMANAN TERDISTRIBUSI (VULNERABILITY CATALOG)\n\n`;
      
      groups.forEach((group, index) => {
        const { kondisi, bahaya } = parseDescription(group.description);
        const { langkah, kodeAman } = parseRecommendation(group.recommendation);
        
        md += `### ${index + 1}. ${group.title} [Severity: ${group.severity.toUpperCase()}]\n`;
        md += `* **Category / Kategori:** ${group.category}\n`;
        if (group.cwe) {
          md += `* **CWE Classification / Klasifikasi CWE:** ${group.cwe}\n`;
        }
        md += `* **Total Locations / Jumlah Kejadian:** ${group.occurrences.length} lokasi terdampak\n\n`;
    
        md += `#### A. KONDISI TEMUAN & ANALISIS RISIKO (FINDING & THREAT IMPACT)\n`;
        md += `**Finding Details / Kondisi Temuan:**\n${kondisi || group.description}\n\n`;
        md += `**Threat Impact / Alasan Bahaya (Dampak Risiko Eksploitasi):**\n${bahaya || 'Tidak ada uraian.'}\n\n`;
    
        md += `#### B. LOKASI BUKTI TEMUAN (AFFECTED LOCATIONS & EVIDENCE)\n`;
        group.occurrences.forEach((occ, oIdx) => {
          md += `${oIdx + 1}. File: \`${occ.filePath}\`${occ.lineNumber ? ` (Baris: ${occ.lineNumber})` : ''}\n`;
          if (occ.evidence) {
            md += `   \`\`\`\n   ${occ.evidence.replace(/\n/g, '\n   ')}\n   \`\`\`\n`;
          }
        });
        md += `\n`;
    
        md += `#### C. REKOMENDASI & RENCANA PERBAIKAN (REMEDIATION GUIDE)\n`;
        md += `**Remediation Guide / Langkah Perbaikan (Mitigasi):**\n${langkah || group.recommendation}\n\n`;
        if (kodeAman) {
          md += `**Secure Code Reference / Acuan Kode Aman:**\n`;
          md += `\`\`\`\n${kodeAman}\n\`\`\`\n\n`;
        }
        md += `------------------------------------------------------------------------\n\n`;
      });
    
      md += `*Catatan Hukum: Dokumen laporan asesmen ini bersifat sangat rahasia (CONFIDENTIAL). Informasi yang terkandung di dalamnya ditujukan khusus untuk vendor, pemilik sistem, dan tim pengembang terkait demi kepentingan mitigasi dan pertahanan siber.*`;
      return md;
    } else {
      // Plain text professional email/ticket style
      let txt = `========================================================================\n`;
      txt += ` LAPORAN AUDIT KEAMANAN SIBER - GRFYN SECURITY SCANNER\n`;
      txt += `========================================================================\n\n`;
      txt += `1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)\n\n`;
      txt += `Scan Reference Code : ${scanRef}\n`;
      txt += `Target Asset        : ${scan.targetName}\n`;
      txt += `Target Type         : ${scan.targetType === 'LOCAL_REPOSITORY' ? 'ZIP Source Code Repository' : 'Web URL Passive/Active Probes'}\n`;
      txt += `Scan Date           : ${new Date(scan.createdAt).toLocaleString()}\n`;
      txt += `Total Findings      : ${totalFindings} Temuan\n`;
      txt += `Credits Spent       : ${scan.creditUsed} Credits\n\n`;
      txt += `Statistik Keparahan:\n`;
      txt += ` - CRITICAL : ${scan.summary.critical}\n`;
      txt += ` - HIGH     : ${scan.summary.high}\n`;
      txt += ` - MEDIUM   : ${scan.summary.medium}\n`;
      txt += ` - LOW      : ${scan.summary.low}\n`;
      txt += ` - INFO     : ${scan.summary.info}\n\n`;
      txt += `------------------------------------------------------------------------\n\n`;
      txt += `2. DAFTAR CELAH KEAMANAN TERDISTRIBUSI (VULNERABILITY CATALOG)\n\n`;

      groups.forEach((group, index) => {
        const { kondisi, bahaya } = parseDescription(group.description);
        const { langkah, kodeAman } = parseRecommendation(group.recommendation);

        txt += `${index + 1}. ${group.title} [Severity: ${group.severity.toUpperCase()}]\n`;
        txt += `   Kategori: ${group.category}\n`;
        if (group.cwe) txt += `   CWE     : ${group.cwe}\n`;
        txt += `   Jumlah Kejadian: ${group.occurrences.length} lokasi terdampak\n\n`;

        txt += `   A. Finding Details / Kondisi Temuan:\n`;
        txt += `      ${(kondisi || group.description).replace(/\n/g, '\n      ')}\n\n`;

        txt += `   B. Threat Impact / Alasan Bahaya:\n`;
        txt += `      ${(bahaya || 'Tidak ada uraian.').replace(/\n/g, '\n      ')}\n\n`;

        txt += `   C. Lokasi Terdampak:\n`;
        group.occurrences.forEach((occ, oIdx) => {
          txt += `      [${oIdx + 1}] ${occ.filePath}${occ.lineNumber ? ` (Line: ${occ.lineNumber})` : ''}\n`;
        });
        txt += `\n`;

        txt += `   D. Remediation Guide / Langkah Perbaikan:\n`;
        txt += `      ${(langkah || group.recommendation).replace(/\n/g, '\n      ')}\n\n`;

        if (kodeAman) {
          txt += `   E. Secure Code Reference / Acuan Kode Aman:\n`;
          txt += `      ${kodeAman.replace(/\n/g, '\n      ')}\n\n`;
        }
        txt += `------------------------------------------------------------------------\n\n`;
      });

      txt += `Catatan Hukum: Dokumen laporan asesmen ini bersifat sangat rahasia (CONFIDENTIAL).`;
      return txt;
    }
  };

  const handleCopyFromModal = () => {
    const text = generateReportText(exportFormat);
    navigator.clipboard.writeText(text);
    setModalCopied(true);
    setTimeout(() => setModalCopied(false), 2000);
  };

  const handleDownloadFromModal = () => {
    const text = generateReportText(exportFormat);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scanReferenceCode}.${exportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-slate-400 text-sm">Parsing vulnerability logs...</span>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 inline-block mb-4 shadow-glass-accent animate-bounce">
          <AlertOctagon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied or Report Missing</h2>
        <p className="text-slate-400 text-sm mb-6">{error || 'The requested scan log could not be loaded.'}</p>
        <Link to="/" className="glass-button inline-flex">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const scanReferenceCode = generateScanRef(scan.id, scan.createdAt);

  // Grouped findings filtered by severity
  const filteredFindings = scan.findings.filter(f => 
    filterSeverity === 'ALL' || f.severity.toUpperCase() === filterSeverity
  );
  
  const groupedFindings = groupFindings(filteredFindings);

  const getSeverityColor = (sev) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-400 border border-red-500/25';
      case 'HIGH': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL': return 'CRITICAL';
      case 'HIGH': return 'HIGH';
      case 'MEDIUM': return 'MEDIUM';
      case 'LOW': return 'LOW';
      default: return 'INFO';
    }
  };

  const getDangerPanelStyles = (sev) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-500/5 border-red-500/15 text-red-300/90 hover:border-red-500/25';
      case 'MEDIUM':
        return 'bg-amber-500/5 border-amber-500/15 text-amber-300/90 hover:border-amber-500/25';
      default:
        return 'bg-blue-500/5 border-blue-500/15 text-blue-300/90 hover:border-blue-500/25';
    }
  };

  // Corporate security score grading based on findings
  const getSecurityPostureGrade = () => {
    const { critical, high, medium } = scan.summary;
    if (critical > 0) return { grade: 'F', color: 'text-red-500', desc: 'CRITICAL HAZARD - Kritis, kerentanan berbahaya terdeteksi!' };
    if (high > 0) return { grade: 'D', color: 'text-rose-500', desc: 'HIGH RISK - Risiko tinggi, butuh tindakan remediasi segera!' };
    if (medium > 0) return { grade: 'C', color: 'text-amber-500', desc: 'MEDIUM RISK - Risiko sedang, terdapat celah keamanan.' };
    return { grade: 'A', color: 'text-emerald-400', desc: 'SECURE - Sangat aman, bebas dari celah berbahaya.' };
  };

  const securityPosture = getSecurityPostureGrade();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      
      {/* =========================================================================
          A. INTERACTIVE SCREEN VIEW (HIDDEN ON PRINT)
          ========================================================================= */}
      <div className="print:hidden">
        {/* Back to Dashboard bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-xs font-semibold uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard / Dasbor Operator</span>
          </Link>

          {scan.status === 'COMPLETED' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-white/5 hover:border-white/10 text-xs font-semibold transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-lg animate-fadeIn"
              >
                <Copy className="w-4 h-4" />
                <span>Salin & Unduh / Export Report</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl hover:shadow-glass-accent text-xs font-semibold transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-lg border border-blue-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>Ekspor / Export PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Detail Header */}
        <div className="glass-panel p-5 md:p-6 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  scan.targetType === 'LOCAL_REPOSITORY'
                    ? 'bg-blue-950/50 border border-blue-500/25 text-blue-300'
                    : 'bg-indigo-950/50 border border-indigo-500/25 text-indigo-300'
                }`}>
                  {scan.targetType === 'LOCAL_REPOSITORY' ? 'ZIP Repository' : 'Web URL'}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-semibold ${
                  scan.status === 'COMPLETED' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{scan.status}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-lg md:text-xl font-bold text-white max-w-2xl truncate select-text" title={scan.targetName}>
                  {scan.targetName}
                </h1>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scan.targetName);
                    setTargetCopied(true);
                    setTimeout(() => setTargetCopied(false), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                  title="Salin target scan"
                >
                  {targetCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono select-none">
                <span>Scan Reference Code:</span>
                <span className="text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/15 text-[10px] select-all scale-95 origin-left inline-block">{scanReferenceCode}</span>
              </div>
            </div>

            {/* Quick Metrics Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0 select-none">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block whitespace-nowrap">SCAN DATE</span>
                  <span className="text-slate-500 text-[10px] block -mt-0.5 mb-1.5 whitespace-nowrap">Waktu Scan</span>
                  <span className="text-white text-xs font-mono font-bold block">{new Date(scan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block whitespace-nowrap">CREDITS SPENT</span>
                  <span className="text-slate-500 text-[10px] block -mt-0.5 mb-1.5 whitespace-nowrap">Kredit Terpakai</span>
                  <span className="text-white text-xs font-mono font-bold block">{scan.creditUsed} Credits</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-wider block whitespace-nowrap">TOTAL FINDINGS</span>
                  <span className="text-slate-500 text-[10px] block -mt-0.5 mb-1.5 whitespace-nowrap">Total Temuan</span>
                  <span className="text-white text-xs font-mono font-bold block">{scan.findings.length} findings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* If Scan failed, show description error */}
        {scan.status === 'FAILED' && (
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 text-red-400 mb-8 flex flex-col md:flex-row gap-4 justify-between items-start animate-shake">
            <div className="flex gap-4 items-start">
              <ShieldAlert className="w-8 h-8 shrink-0 text-red-500 mt-1 animate-pulse" />
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Scanning Subprocess Aborted / Proses Gagal</h3>
                <p className="text-sm text-red-300/80 mb-3">
                  The vulnerability analyzer was interrupted. Check the detailed trace in your browser console (F12) or inspect the logs below:
                </p>
                
                {/* Detailed error box */}
                <div className="bg-cyber-900/80 rounded-xl p-4 border border-red-500/20 font-mono text-xs max-w-xl overflow-x-auto text-red-300 mb-3">
                  <code className="whitespace-pre-wrap">{scan.errorMessage || 'Unknown execution abort.'}</code>
                </div>

                <span className="text-slate-500 text-xs italic block">
                  * Note: Credits consumed for this aborted scan have been fully refunded to your balance.
                </span>
              </div>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyError}
              className="w-full md:w-auto glass-button-secondary px-4 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/10 text-red-300 hover:text-red-200 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shrink-0 self-stretch md:self-auto"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>Copy Error Details</span>
                </>
              )}
            </button>
          </div>
        )}

        {scan.status === 'COMPLETED' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left panel: Findings Summary & interactive filters */}
            <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-24 space-y-5">
              <div className="glass-panel p-4 md:p-5 space-y-4">
                
                {/* Executive score banner */}
                <div className="border-b border-white/5 pb-3">
                  <span className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest block mb-1.5 select-none">Asset Security Grade</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-outfit text-xl font-extrabold shadow-lg bg-white/5 border border-white/10 ${securityPosture.color}`}>
                      {securityPosture.grade}
                    </div>
                    <div>
                      <span className={`text-xs font-bold block uppercase tracking-wider ${securityPosture.color}`}>
                        {securityPosture.grade === 'A' ? 'SECURE' : 'VULNERABLE'}
                      </span>
                      <span className="text-slate-400 text-[9px] leading-tight block">{securityPosture.desc}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-extrabold text-white mb-3 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>Severity Breakdown / Tingkat Ancaman</span>
                  </h3>

                  {/* Filtering Lists */}
                  <div className="space-y-1.5">
                    {[
                      { key: 'ALL', label: 'All Findings / Semua Temuan', count: scan.findings.length, color: 'border-slate-800 hover:bg-white/5 text-slate-300' },
                      { key: 'CRITICAL', label: 'Critical Severity / Sangat Kritis', count: scan.summary.critical, color: 'border-red-500/10 text-red-400 bg-red-500/5 hover:bg-red-500/10' },
                      { key: 'HIGH', label: 'High Severity / Tinggi', count: scan.summary.high, color: 'border-rose-500/10 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10' },
                      { key: 'MEDIUM', label: 'Medium Severity / Sedang', count: scan.summary.medium, color: 'border-amber-500/10 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10' },
                      { key: 'LOW', label: 'Low Severity / Rendah', count: scan.summary.low, color: 'border-blue-500/10 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10' },
                      { key: 'INFO', label: 'Info Notes / Catatan Tambahan', count: scan.summary.info, color: 'border-emerald-500/10 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10' },
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => setFilterSeverity(item.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-[10px] font-semibold transition-all duration-300 active:scale-98 ${item.color} ${
                          filterSeverity === item.key ? 'ring-2 ring-blue-500/50 scale-102 border-blue-500/40 bg-blue-500/5' : ''
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="font-mono bg-cyber-900/50 px-1.5 py-0.5 rounded text-[9px]">{item.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right panel: Filtered Grouped Findings listing */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4 select-none">
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span>Log Temuan Kerentanan / Vulnerability Log ({groupedFindings.length})</span>
                </h3>
                <span className="text-slate-400 text-xxs font-semibold tracking-wider uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                  Filter: <b className="text-blue-400">{filterSeverity}</b>
                </span>
              </div>

              {groupedFindings.length === 0 ? (
                <div className="text-center py-20 glass-panel border border-dashed border-white/5 rounded-2xl animate-fadeIn">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-1">Target Clean / Bebas Kerentanan</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Tidak ditemukan celah keamanan yang terdeteksi dengan kategori keparahan <b>{filterSeverity}</b>. Outstanding job!
                  </p>
                </div>
              ) : (
                groupedFindings.map((group, gIdx) => {
                  const { kondisi, bahaya } = parseDescription(group.description);
                  const { langkah, kodeAman, bahasaKode } = parseRecommendation(group.recommendation);
                  const cweInfo = getCweLinkAndId(group.cwe);

                  // Manage active index for this card's occurrences dynamically
                  const activeOccurrenceIndex = activeOccurrences[group.title] || 0;
                  const activeOcc = group.occurrences[activeOccurrenceIndex] || group.occurrences[0];

                  return (
                    <div key={gIdx} className="glass-panel p-5 relative overflow-hidden animate-fadeIn space-y-5 hover:border-white/10 transition-all duration-300">
                      {/* Left severity indicator border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        group.severity.toUpperCase() === 'CRITICAL' ? 'bg-red-500' :
                        group.severity.toUpperCase() === 'HIGH' ? 'bg-rose-500' :
                        group.severity.toUpperCase() === 'MEDIUM' ? 'bg-amber-500' :
                        group.severity.toUpperCase() === 'LOW' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></div>

                      {/* Card Header section */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-white/5">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide inline-block ${getSeverityColor(group.severity)}`}>
                              {getSeverityBadge(group.severity)}
                            </span>
                            
                            {/* CWE MITRE Reference Badge */}
                            {cweInfo && (
                              <a
                                href={cweInfo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 hover:scale-102 transition-all duration-200"
                                title="Buka referensi formal MITRE CWE"
                              >
                                <span>{cweInfo.id}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}

                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-slate-900 border border-white/5 text-slate-400">
                              {group.occurrences.length} KEJADIAN
                            </span>
                          </div>
                          
                          <h4 className="text-base font-extrabold text-white tracking-wide leading-tight">{group.title}</h4>
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Kategori: {group.category}</p>
                        </div>
                      </div>

                      {/* Section 1: Conditions Found (Kondisi Temuan) */}
                      <div className="space-y-2">
                        <span className="text-slate-400 text-xxs font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                          <Terminal className="w-3 h-3 text-blue-400" />
                          <span>Advisory / Analisis Temuan</span>
                        </span>
                        <div className="bg-[#0b0f19]/40 p-3 rounded-xl border border-white/5 text-slate-300 text-xs leading-relaxed">
                          <h5 className="font-bold text-white text-[10px] uppercase mb-1 select-none text-blue-300">Finding Details / Kondisi Temuan:</h5>
                          <p className="whitespace-pre-wrap">{kondisi || group.description}</p>
                        </div>
                      </div>

                      {/* Section 2: Interactive Occurrences Browser */}
                      <div className="space-y-2 border-t border-b border-white/5 py-3">
                        <span className="text-slate-400 text-xxs font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                          <FileCode className="w-3 h-3 text-blue-400" />
                          <span>Lokasi & Bukti Terdampak ({group.occurrences.length})</span>
                        </span>

                        {/* File Tab Selector */}
                        <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
                          {group.occurrences.map((occ, idx) => (
                            <button
                              key={occ.id || idx}
                              type="button"
                              onClick={() => {
                                setActiveOccurrences(prev => ({
                                  ...prev,
                                  [group.title]: idx
                                }));
                              }}
                              className={`flex items-center gap-1 text-[10px] font-mono px-2.5 py-1.5 rounded-lg border transition-all duration-200 select-all shrink-0 active:scale-95 ${
                                activeOccurrenceIndex === idx
                                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                                  : 'bg-cyber-900/40 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {scan.targetType === 'LOCAL_REPOSITORY' ? (
                                <FileCode className="w-3 h-3 text-blue-400" />
                              ) : (
                                <Server className="w-3 h-3 text-indigo-400" />
                              )}
                              <span>
                                {occ.filePath.split('/').pop()}
                                {occ.lineNumber ? `:#L${occ.lineNumber}` : ''}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Interactive Code Evidence Container */}
                        {activeOcc && activeOcc.evidence && (
                          <div className="pt-1.5 animate-fadeIn">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1 select-none">
                              Bukti Kode Kerentanan pada File: <code className="text-blue-400 select-all font-mono text-[10px]">{activeOcc.filePath}</code>
                            </span>
                            <CyberCodeBlock 
                              code={activeOcc.evidence} 
                              title={`Evidence: ${activeOcc.filePath.split('/').pop()}${activeOcc.lineNumber ? `#L${activeOcc.lineNumber}` : ''}`} 
                              language={scan.targetType === 'LOCAL_REPOSITORY' ? 'javascript' : 'http'} 
                              showLineNumbers={true}
                            />
                          </div>
                        )}
                      </div>

                      {/* Section 3: Danger & Threat Rationale (Alasan Bahaya) */}
                      {bahaya && (
                        <div className={`p-3 rounded-xl border transition-all duration-300 ${getDangerPanelStyles(group.severity)}`}>
                          <span className="text-xxs font-bold uppercase tracking-wider flex items-center gap-1 mb-1 select-none">
                            <Zap className="w-3.5 h-3.5 shrink-0" />
                            <span>Threat Impact / Alasan Bahaya (Dampak Risiko)</span>
                          </span>
                          <p className="text-xs leading-relaxed opacity-95">{bahaya}</p>
                        </div>
                      )}

                      {/* Section 4: Remediation Checklist & Safe Code Solution (Langkah Perbaikan) */}
                      <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 space-y-3">
                        <div>
                          <span className="text-blue-400 text-xxs font-bold uppercase tracking-wider flex items-center gap-1 mb-1 select-none">
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span>Remediation Guide / Langkah Perbaikan (Mitigasi)</span>
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{langkah || group.recommendation}</p>
                        </div>
                        
                        {/* Safe Code Block using CyberCodeBlock */}
                        {kodeAman && (
                          <div className="pt-1.5 border-t border-blue-500/5">
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1.5 select-none">
                              Secure Code Example / Contoh Kode Aman:
                            </span>
                            <CyberCodeBlock 
                              code={kodeAman} 
                              title="SECURE_REMEDIATION_REFERENCE" 
                              language={bahasaKode} 
                              showLineNumbers={true}
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          B. CORPORATE PDF REPORT CONTAINER (PRINT PREVIEW STYLED - SCREEN HIDDEN)
          ========================================================================= */}
      <div className="hidden print:block text-slate-900 bg-white p-6 md:p-12 font-sans text-xs leading-relaxed max-w-4xl mx-auto">
        
        {/* Cover Header Cover Sheet Block */}
        <div className="border-4 border-slate-950 p-6 md:p-10 mb-8 rounded-lg relative">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-slate-500 block mb-1">GRFYN SECURITY SCANNER</span>
              <h1 className="text-3xl font-extrabold text-slate-950 tracking-wider">SECURE AUDIT REPORT</h1>
            </div>
            <div className="text-right">
              <span className="text-xxs uppercase font-bold text-slate-400 block">CONFIDENTIAL REPORT</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-950 text-white rounded mt-1 inline-block select-all">{scanReferenceCode}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[11px] mb-6">
            <div>
              <span className="text-slate-500 uppercase font-bold block text-xxs">Target Asset / Aset Pemeriksaan</span>
              <strong className="text-slate-950 block text-[13px] break-all">{scan.targetName}</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block text-xxs">Target Type / Tipe Aset</span>
              <strong className="text-slate-950 block text-[11px]">{scan.targetType === 'LOCAL_REPOSITORY' ? 'ZIP Source Code Repository' : 'Web URL Passive/Active Probes'}</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block text-xxs">Scan Date / Waktu Scan</span>
              <span className="text-slate-900 font-mono block">{new Date(scan.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block text-xxs">Asset Security Grade / Peringkat</span>
              <span className={`font-extrabold text-xs block ${securityPosture.grade === 'A' ? 'text-emerald-600' : 'text-rose-600'}`}>
                GRADE {securityPosture.grade} ({securityPosture.grade === 'A' ? 'SECURE' : 'VULNERABLE'})
              </span>
            </div>
          </div>

          {/* executive posture summary block */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
            <div>
              <strong className="text-slate-950 text-xs block mb-1">Severity Statistics / Statistik Temuan:</strong>
              <div className="flex gap-4 font-mono font-bold text-xxs">
                <span className="text-red-600">CRITICAL: {scan.summary.critical}</span>
                <span className="text-rose-600">HIGH: {scan.summary.high}</span>
                <span className="text-amber-600">MEDIUM: {scan.summary.medium}</span>
                <span className="text-blue-600">LOW: {scan.summary.low}</span>
                <span className="text-emerald-600">INFO: {scan.summary.info}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 uppercase block text-xxs">Assessment Engine</span>
              <strong className="text-slate-950 block">AI Security Analyst (v1.0)</strong>
            </div>
          </div>

          <div className="text-slate-400 text-[9px] mt-6 italic border-t border-slate-100 pt-4 leading-normal">
            Pernyataan Rahasia: Dokumen laporan penilai kerentanan ini mengandung informasi keamanan yang bersifat sangat sensitif dan rahasia (CONFIDENTIAL). Distribusi dibatasi ketat untuk vendor pemilik sistem, administrator keamanan, dan perancang program terkait guna perbaikan kerentanan sistem.
          </div>
        </div>

        {/* Detailed Catalog expanded list for printing (Renders all occurrences sequentially) */}
        <h2 className="text-lg font-bold text-slate-950 uppercase border-b-2 border-slate-900 pb-2 mb-4 tracking-wider">Security Vulnerabilities Catalog / Detail Temuan</h2>
        
        {groupedFindings.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
            <strong>No Vulnerabilities Discovered</strong>
            <p className="text-slate-500 mt-1">Aset dalam kondisi bersih dan aman.</p>
          </div>
        ) : (
          groupedFindings.map((group, index) => {
            const { kondisi, bahaya } = parseDescription(group.description);
            const { langkah, kodeAman } = parseRecommendation(group.recommendation);
            const cweInfo = getCweLinkAndId(group.cwe);

            return (
              <div key={index} className="mb-8 pb-6 border-b border-slate-200 page-break-inside-avoid">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] font-extrabold text-slate-950 leading-tight">
                    {index + 1}. {group.title}
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-slate-950 text-white rounded text-[9px] font-bold uppercase tracking-wider">{group.severity}</span>
                    {cweInfo && <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold font-mono text-slate-700">{cweInfo.id}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xxs text-slate-600 mb-3 font-semibold">
                  <div>Category: <span className="text-slate-900">{group.category}</span></div>
                  <div className="text-right">Total Locations / Jumlah Kejadian: <span className="text-slate-900">{group.occurrences.length} files</span></div>
                </div>

                {/* Conditions Found */}
                <div className="mb-3">
                  <h5 className="font-bold text-slate-950 text-xxs uppercase mb-1">Finding Details / Kondisi Temuan:</h5>
                  <p className="text-slate-700 leading-relaxed text-[11px] whitespace-pre-wrap">{kondisi || group.description}</p>
                </div>

                {/* Threat Rationale */}
                {bahaya && (
                  <div className="mb-4 bg-slate-50 p-2.5 border-l-2 border-slate-950 rounded page-break-inside-avoid">
                    <h5 className="font-bold text-slate-900 text-xxs uppercase mb-1">
                      <span>Threat Impact / Alasan Bahaya (Dampak Risiko Eksploitasi):</span>
                    </h5>
                    <p className="text-slate-800 leading-relaxed text-[10.5px]">{bahaya}</p>
                  </div>
                )}

                {/* Expanded Occurrences Listing - Loop through all occurrences sequentially for printing! */}
                <div className="mb-4 space-y-3">
                  <h5 className="font-bold text-slate-950 text-xxs uppercase mb-1">Affected Locations & Evidence / Lokasi & Bukti Kerentanan:</h5>
                  {group.occurrences.map((occ, oIdx) => (
                    <div key={occ.id || oIdx} className="bg-slate-50 rounded border border-slate-200 overflow-hidden text-xxs font-mono page-break-inside-avoid">
                      <div className="px-3 py-1 bg-slate-200/60 border-b border-slate-200 font-sans font-bold text-slate-700 flex justify-between">
                        <span>Occurrence #{oIdx + 1}: {occ.filePath}</span>
                        {occ.lineNumber && <span className="font-mono text-purple-700">Baris: {occ.lineNumber}</span>}
                      </div>
                      {occ.evidence && (
                        <pre className="p-3 text-slate-800 text-[10px] overflow-x-auto whitespace-pre leading-relaxed select-text bg-white">
                          {occ.evidence}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>

                {/* Remediation Steps */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mt-3">
                  <h5 className="font-bold text-slate-950 text-xxs uppercase mb-1.5">Remediation Guide / Langkah Perbaikan (Mitigasi Rekomendasi):</h5>
                  <p className="text-slate-700 leading-relaxed text-[11px] whitespace-pre-wrap">{langkah || group.recommendation}</p>

                  {/* Remediation Code block */}
                  {kodeAman && (
                    <div className="mt-3 pt-3 border-t border-slate-200 font-mono">
                      <span className="font-sans font-bold text-slate-500 text-[10px] uppercase block mb-1">Secure Code Reference / Acuan Kode Aman:</span>
                      <pre className="bg-white p-3 border border-slate-200 rounded text-slate-900 text-[10px] whitespace-pre overflow-x-auto select-text leading-relaxed">
                        {kodeAman}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Footer assessment signature */}
        <div className="mt-12 pt-6 border-t-2 border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-semibold page-break-inside-avoid">
          <div>GRFYN SECURITY SCANNER &bull; SECURE AUDIT REPORT</div>
          <div className="text-right">APPROVED BY: SYSTEM SECURITY AUDITOR AGENT</div>
        </div>

      </div>

      {/* =========================================================================
          C. ULTRA-PREMIUM REPORT EXPORT MODAL (SCREEN ONLY - HIDDEN ON PRINT)
          ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-[#070a13]/85 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-fadeIn">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative select-none">
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-lg active:scale-95 border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <FileText className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wide">Export Audit Report / Ekspor Laporan</h3>
                <span className="text-slate-500 text-xxs font-mono font-bold block mt-0.5">{scanReferenceCode}</span>
              </div>
            </div>

            {/* Format Picker */}
            <div className="mb-4">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-widest block mb-2">Select Report Format / Tipe File</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportFormat('md')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all duration-300 ${
                    exportFormat === 'md'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>Markdown (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('txt')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all duration-300 ${
                    exportFormat === 'txt'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Plain Text (.txt)</span>
                </button>
              </div>
            </div>

            {/* Live Terminal Preview */}
            <div className="mb-6 flex-1 flex flex-col min-h-[220px]">
              <span className="text-slate-400 text-xxs font-extrabold uppercase tracking-widest block mb-2">Live Report Preview / Tampilan Laporan</span>
              <div className="bg-[#070a13] border border-white/5 rounded-xl p-4 overflow-y-auto max-h-[240px] flex-1 font-mono text-[11px] text-slate-400 leading-normal scrollbar-thin select-text">
                <pre className="whitespace-pre-wrap">{generateReportText(exportFormat)}</pre>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={handleCopyFromModal}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 shadow-md"
              >
                {modalCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard / Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy to Clipboard / Salin Laporan</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadFromModal}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-glass-accent active:scale-95 border border-blue-500/20"
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>Download File (.{exportFormat.toUpperCase()})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Scroll-to-Top Floating Button */}
      {showScrollBtn && (
        <button
          onClick={scrollToTop}
          type="button"
          className="print:hidden fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-fadeIn border border-blue-400/20 flex items-center justify-center cursor-pointer"
          title="Kembali ke Atas / Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}

    </div>
  );
}
