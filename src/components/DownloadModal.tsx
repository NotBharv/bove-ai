import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FolderArchive,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  Github,
  FileCode,
  Sparkles,
  ShieldCheck,
  Eye,
  Search,
  Code,
  FileText,
  CheckCircle2,
  FolderGit2,
  Settings,
  Cpu,
  Loader2,
  PackageCheck,
  FileCheck,
  AlertCircle,
  HelpCircle,
  ArrowDownToLine,
} from 'lucide-react';
import { downloadSingleZip } from '../utils/downloadZip';

interface ProjectFile {
  id: string;
  path: string;
  category: 'backend' | 'frontend' | 'components' | 'data' | 'config' | 'scripts' | 'docs';
  title: string;
  desc: string;
  sizeBytes?: number;
  sizeFormatted?: string;
  downloadUrl: string;
  rawUrl: string;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  // Default directly to single clean ZIP as requested by user!
  const [activeTab, setActiveTab] = useState<'single-zip' | 'github' | 'normal-files'>('single-zip');
  const [githubUsername, setGithubUsername] = useState('bbharey');
  const [repoName, setRepoName] = useState('bove-ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ path: string; content: string } | null>(null);

  // Download state for feedback
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState<string>('');

  // Load project files list
  useEffect(() => {
    if (!isOpen) return;
    setLoadingFiles(true);
    fetch('/api/project-files')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.files) {
          setFiles(data.files);
        }
      })
      .catch((err) => {
        console.error('Failed to load project files:', err);
      })
      .finally(() => {
        setLoadingFiles(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : '';
  const zipDownloadUrl = `${currentHost}/download-zip`;
  const repoUrl = `https://github.com/${githubUsername.trim() || 'bbharey'}/${repoName.trim() || 'bove-ai'}.git`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadZip = async () => {
    await downloadSingleZip((state, msg) => {
      setDownloadState(state);
      if (msg) setDownloadMessage(msg);
      if (state === 'success') {
        setTimeout(() => {
          setDownloadState('idle');
        }, 5000);
      }
    });
  };

  const handleBase64FallbackDownload = async () => {
    setDownloadState('downloading');
    setDownloadMessage('Preparing direct base64 download...');
    try {
      const res = await fetch('/api/download-zip-base64');
      const data = await res.json();
      if (data && data.base64) {
        const byteCharacters = atob(data.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'bove-ai.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 2000);
        setDownloadState('success');
        setDownloadMessage('bove-ai.zip downloaded via fallback!');
        setTimeout(() => setDownloadState('idle'), 5000);
      } else {
        throw new Error('No base64 data returned');
      }
    } catch (err: any) {
      console.error('Base64 download error:', err);
      setDownloadState('error');
      setDownloadMessage('Failed. Opening direct browser download link...');
      window.open('/download-zip', '_blank');
    }
  };

  const handleCopyFileContent = async (file: ProjectFile) => {
    try {
      setCopiedId(`copying-${file.id}`);
      const res = await fetch(`/api/download-file?file=${encodeURIComponent(file.path)}&format=json`);
      const data = await res.json();
      if (data && data.content) {
        await navigator.clipboard.writeText(data.content);
        setCopiedId(file.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch (err) {
      console.error('Failed to copy file content:', err);
      setCopiedId(null);
    }
  };

  const handlePreviewFile = async (file: ProjectFile) => {
    if (previewFile && previewFile.path === file.path) {
      setPreviewFile(null);
      return;
    }
    try {
      const res = await fetch(`/api/download-file?file=${encodeURIComponent(file.path)}&format=json`);
      const data = await res.json();
      if (data && data.content) {
        setPreviewFile({ path: file.path, content: data.content });
      }
    } catch (err) {
      console.error('Failed to preview file:', err);
    }
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'backend', label: 'Backend' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'components', label: 'Components' },
    { id: 'data', label: 'Voices & Presets' },
    { id: 'scripts', label: 'GitHub Scripts' },
    { id: 'config', label: 'Configs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-zinc-800/80 bg-gradient-to-r from-purple-950/60 via-zinc-900/70 to-emerald-950/50">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 font-black text-2xl shrink-0">
                <FolderArchive className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                  <span>Download Project ZIP</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Just 1 Single ZIP • No Nested Folders
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  सिधै १ वटा clean ZIP फाइल (<code className="text-emerald-300">bove-ai.zip</code>) — फोल्डर भित्र फोल्डर छैन!
                </p>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('single-zip')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'single-zip'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Single 1 ZIP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('github')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'github'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Setup</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('normal-files')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'normal-files'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Normal Files</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-950/60 border border-purple-400/30">
                  {files.length || 29}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(94vh-140px)]">
          {/* TAB 1: SINGLE CLEAN ZIP (PRIMARY FOCUS) */}
          {activeTab === 'single-zip' && (
            <div className="space-y-5">
              {/* Main Prominent 1-Click ZIP Download Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/30 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready for 1-Click Download</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      bove-ai.zip
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                      यो <strong>एक मात्रै सिङ्गो ZIP फाइल</strong> हो। extract गर्दा कुनै extra भित्री फोल्डर हुन्न —{' '}
                      <code className="text-emerald-300">server.ts</code>, <code className="text-emerald-300">package.json</code>,{' '}
                      <code className="text-emerald-300">src/</code> सिधै root मा खुल्छन्।
                    </p>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <div className="text-2xl font-mono font-black text-white">~171 KB</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Clean Root Structure</div>
                  </div>
                </div>

                {/* Key Guarantees Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-zinc-200">Just 1 Clean ZIP (No nest)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-zinc-200">No folder inside folder</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-zinc-200">Full Code + Express + React</span>
                  </div>
                </div>

                {/* Status Alert if downloading / completed */}
                {downloadState !== 'idle' && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-3 transition-all ${
                      downloadState === 'downloading'
                        ? 'bg-purple-950/50 border-purple-500/40 text-purple-200'
                        : downloadState === 'success'
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/50 border-red-500/40 text-red-200'
                    }`}
                  >
                    {downloadState === 'downloading' && <Loader2 className="w-4 h-4 animate-spin text-purple-400 shrink-0" />}
                    {downloadState === 'success' && <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {downloadState === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    <div className="flex-1">
                      <span>{downloadMessage || 'Processing your request...'}</span>
                    </div>
                  </div>
                )}

                {/* Primary Huge Download Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={downloadState === 'downloading'}
                    className="flex-1 py-4 px-6 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer transform active:scale-[0.99]"
                  >
                    {downloadState === 'downloading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Downloading bove-ai.zip...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-5 h-5" />
                        <span>Download bove-ai.zip (Click Here)</span>
                      </>
                    )}
                  </button>

                  {/* Fallback button if browser sandbox blocks standard blob */}
                  <button
                    type="button"
                    onClick={handleBase64FallbackDownload}
                    className="py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    title="If browser blocked the main button, this bypasses the iframe via Base64"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Instant Fallback</span>
                  </button>
                </div>

                {/* Direct Link & Copy Tools */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 truncate max-w-md">
                    <span>Direct URL:</span>
                    <a
                      href="/download-zip"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline truncate"
                    >
                      {zipDownloadUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(zipDownloadUrl, 'zip-link')}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] font-semibold"
                    >
                      {copiedId === 'zip-link' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <a
                      href="/download-zip"
                      download="bove-ai.zip"
                      className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Browser</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Exact Files Verified inside bove-ai.zip */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>यस ZIP भित्र रहेका फाइलहरू (Root Structure Verified)</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">No wrapper folder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono text-zinc-300">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-purple-400 font-bold">📄</span>
                    <span>server.ts (Backend API)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">📦</span>
                    <span>package.json & lock</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-blue-400 font-bold">⚛️</span>
                    <span>src/App.tsx</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-amber-400 font-bold">🎨</span>
                    <span>src/components/</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-teal-400 font-bold">🎙️</span>
                    <span>src/data/characters.ts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-rose-400 font-bold">⚙️</span>
                    <span>vite.config.ts & tsconfig</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-indigo-400 font-bold">🚀</span>
                    <span>push-to-github.sh/.bat</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-zinc-400 font-bold">🔒</span>
                    <span>.env.example & README.md</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">🌐</span>
                    <span>vercel.json & render.yaml</span>
                  </div>
                </div>
              </div>

              {/* How to run after download */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>डाउनलोड गरेपछि चलाउने २ कमाण्डहरू (How to Run):</span>
                </h4>
                <div className="p-3 bg-black/80 rounded-xl border border-zinc-800 font-mono text-xs space-y-1">
                  <p className="text-zinc-400"># 1. Open terminal in extracted folder & install:</p>
                  <p className="text-purple-300 font-bold">npm install</p>
                  <p className="text-zinc-400 mt-2"># 2. Start the AI voice server & frontend:</p>
                  <p className="text-emerald-400 font-bold">npm run dev</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB SETUP & DIRECT INTEGRATION */}
          {activeTab === 'github' && (
            <div className="space-y-5">
              {/* GitHub Repo Setup Box */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        GitHub Repository Setup (गिटहबमा राख्ने तरिका)
                      </h3>
                      <p className="text-xs text-zinc-400">
                        आफ्नो GitHub Username हाल्नुहोस् — कमाण्डहरू आफैँ तयार हुन्छन्
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                  >
                    <span>Create Repo on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      GitHub Username / Account:
                    </label>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="e.g. bbharey"
                      className="w-full px-3.5 py-2 bg-black/60 border border-zinc-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      Repository Name:
                    </label>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="e.g. bove-ai"
                      className="w-full px-3.5 py-2 bg-black/60 border border-zinc-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Target Repo URL preview */}
                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30 flex items-center justify-between text-xs font-mono text-purple-300">
                  <span className="truncate">Remote: {repoUrl}</span>
                  <button
                    onClick={() => copyToClipboard(repoUrl, 'repo-url')}
                    className="ml-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {copiedId === 'repo-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Option A: Terminal Commands */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Method 1: 1-Click Terminal Push Commands</span>
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `git remote add origin ${repoUrl}\ngit branch -M main\ngit push -u origin main`,
                        'git-push-cmds'
                      )
                    }
                    className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedId === 'git-push-cmds' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Commands Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black/80 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5 overflow-x-auto">
                  <p className="text-zinc-500"># 1. Add your GitHub repository remote:</p>
                  <p className="text-emerald-400 font-bold">git remote add origin {repoUrl}</p>
                  <p className="text-zinc-500 mt-2"># 2. Set default branch to main:</p>
                  <p className="text-purple-300">git branch -M main</p>
                  <p className="text-zinc-500 mt-2"># 3. Push all code to GitHub:</p>
                  <p className="text-amber-300 font-bold">git push -u origin main</p>
                </div>
              </div>

              {/* Option B: 1-Click Push Script */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>Mac / Linux / Git Bash</span>
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      <code className="text-purple-300">push-to-github.sh</code>
                    </p>
                  </div>
                  <a
                    href="/api/download-file?file=push-to-github.sh&download=1"
                    download="push-to-github.sh"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>Download .sh</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                      <Settings className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Windows PC (.bat)</span>
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      <code className="text-emerald-300">push-to-github.bat</code>
                    </p>
                  </div>
                  <a
                    href="/api/download-file?file=push-to-github.bat&download=1"
                    download="push-to-github.bat"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download .bat</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NORMAL FILES BROWSER */}
          {activeTab === 'normal-files' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search file (e.g., server.ts, App.tsx, package.json)..."
                    className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === c.id
                          ? 'bg-zinc-700 text-white font-bold'
                          : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Preview Drawer if opened */}
              {previewFile && (
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-purple-400" />
                      <span className="font-mono text-xs font-bold text-white">{previewFile.path}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        Live Preview
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(previewFile.content, `preview-${previewFile.path}`)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
                      >
                        {copiedId === `preview-${previewFile.path}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy All</span>
                          </>
                        )}
                      </button>
                      <a
                        href={`/api/download-file?file=${encodeURIComponent(previewFile.path)}&download=1`}
                        download
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                      <button
                        onClick={() => setPreviewFile(null)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <pre className="max-h-72 overflow-y-auto p-3 rounded-xl bg-black/80 font-mono text-[11px] text-zinc-300 leading-relaxed border border-zinc-800/80">
                    {previewFile.content}
                  </pre>
                </div>
              )}

              {/* Files Table List */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40 divide-y divide-zinc-800/80">
                {loadingFiles ? (
                  <div className="p-8 text-center text-xs text-zinc-400">Loading project files...</div>
                ) : filteredFiles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">No files found matching your search.</div>
                ) : (
                  filteredFiles.map((file) => {
                    const ext = file.path.split('.').pop() || 'file';
                    const isPreviewing = previewFile?.path === file.path;

                    return (
                      <div
                        key={file.id}
                        className="p-3 sm:p-4 hover:bg-zinc-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="mt-0.5 p-2 rounded-xl bg-zinc-800/80 text-zinc-300 font-mono text-[10px] uppercase font-bold shrink-0 border border-zinc-700/60">
                            {ext}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition-colors truncate">
                                {file.path}
                              </span>
                              {file.sizeFormatted && (
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  ({file.sizeFormatted})
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate max-w-md sm:max-w-lg">
                              {file.desc}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePreviewFile(file)}
                            className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isPreviewing
                                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                                : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 border-zinc-700/60'
                            }`}
                            title="Preview file content"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyFileContent(file)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition-colors cursor-pointer"
                            title="Copy code directly to clipboard"
                          >
                            {copiedId === file.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : copiedId === `copying-${file.id}` ? (
                              <span>Loading...</span>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <a
                            href={file.downloadUrl}
                            download={file.path.split('/').pop()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                            title="Direct download normal unzipped file"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>१००% सफा ZIP — कुनै विज्ञापन वा पासवर्ड छैन • सिधै Extract गर्नुहोस्</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download bove-ai.zip</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              बन्द गर्नुहोस् (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
