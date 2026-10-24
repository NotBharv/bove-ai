import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS } from './data/characters';
import { SCRIPT_TEMPLATES, ScriptTemplate } from './data/templates';
import {
  CharacterPreset,
  EmotionType,
  EmotionIntensity,
  LanguageAccent,
  DialogueSegment,
  GeneratedAudioItem,
} from './types';
import { Navbar } from './components/Navbar';
import { EmotionControls } from './components/EmotionControls';
import { AudioPlayer } from './components/AudioPlayer';
import { ScriptEnhancerModal } from './components/ScriptEnhancerModal';
import { CharacterModal } from './components/CharacterModal';
import { CreatorModal } from './components/CreatorModal';
import { DialogueStudio } from './components/DialogueStudio';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SubscriptionModal } from './components/SubscriptionModal';
import { DownloadModal } from './components/DownloadModal';
import { getApiUrl } from './config';
import {
  Sparkles,
  Zap,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Settings2,
  Layers,
  Volume2,
  Users,
  ChevronRight,
  User,
  Crown,
  Download,
} from 'lucide-react';

export default function App() {
  // Navigation & mode
  const [activeTab, setActiveTab] = useState<'single' | 'dialogue'>('single');
  const [isEnhancerOpen, setIsEnhancerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // User Generation Count & Live Community Stats
  const [userGenerations, setUserGenerations] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bove_user_generations');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [liveStats, setLiveStats] = useState({
    totalGenerations: 54892,
    activeCreatorsNow: 148,
    voicesToday: 1420,
  });

  // Fetch live usage data from server
  useEffect(() => {
    const fetchStats = () => {
      fetch(getApiUrl('/api/stats'))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setLiveStats({
              totalGenerations: data.totalGenerations || 54892,
              activeCreatorsNow: data.activeCreatorsNow || 148,
              voicesToday: data.voicesToday || 1420,
            });
          }
        })
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Subscription plan (All users get VIP Free during launch)
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'studio'>(() => {
    try {
      return (localStorage.getItem('bove_user_plan') as any) || 'pro';
    } catch {
      return 'pro';
    }
  });

  const handleSelectPlan = (plan: 'free' | 'pro' | 'studio') => {
    setUserPlan(plan);
    try {
      localStorage.setItem('bove_user_plan', plan);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  // Single Voice State
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterPreset>(CHARACTERS[0]);
  const [selectedAccent, setSelectedAccent] = useState<LanguageAccent>('Nepali');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('neutral');
  const [emotionIntensity, setEmotionIntensity] = useState<EmotionIntensity>('moderate');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<'deep' | 'medium' | 'high'>('medium');
  const [customStylePrompt, setCustomStylePrompt] = useState<string>('');
  const [showAdvancedStyle, setShowAdvancedStyle] = useState<boolean>(false);

  // Script Text
  const [scriptText, setScriptText] = useState<string>(
    'नमस्ते, म बोभ! <breath> Bove AI मा यहाँहरू सबैलाई हार्दिक स्वागत छ। कुनै पनि शब्दलाई एकदमै स्वाभाविक र मन छुने आवाजमा बदल्नुहोस्।'
  );

  // Dialogue Studio State
  const [speaker1, setSpeaker1] = useState<string>('Bove');
  const [speaker2, setSpeaker2] = useState<string>('Sunita');
  const [dialogueSegments, setDialogueSegments] = useState<DialogueSegment[]>([
    {
      id: '1',
      speaker: 'Bove',
      voiceName: 'Puck',
      accent: 'Nepali',
      emotion: 'cheerful',
      text: 'Welcome to Bove AI! <breath> Today Sunita joins us in the studio. Sunita, how do you see the future of realistic voice generation?',
    },
    {
      id: '2',
      speaker: 'Sunita',
      voiceName: 'Kore',
      accent: 'Nepali',
      emotion: 'cheerful',
      text: '|yeah| Bove, it is genuinely unbelievable! <laugh> High quality voices in Nepali, Hindi, and English with zero friction.',
    },
  ]);

  // Generation & Audio Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAudio, setActiveAudio] = useState<{
    audioBase64: string;
    mimeType: string;
    title: string;
    speakerName: string;
    emotion: string;
    accent: string;
  } | null>(null);

  // Sample playback for character cards
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);

  // History & Saved clips
  const [historyItems, setHistoryItems] = useState<GeneratedAudioItem[]>(() => {
    try {
      const saved = localStorage.getItem('bove_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('bove_history', JSON.stringify(historyItems.slice(0, 30)));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [historyItems]);

  // Handle character selection
  const handleSelectCharacter = (char: CharacterPreset) => {
    setSelectedCharacter(char);
    setSelectedAccent(char.accent);
    setSelectedEmotion(char.defaultEmotion);
  };

  // Insert vocal bursts or tags into script editor at cursor position
  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setScriptText((prev) => prev + ' ' + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = scriptText.substring(0, start) + tag + scriptText.substring(end);
    setScriptText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  // Insert tag into dialogue turn
  const handleInsertDialogueBurst = (index: number, burst: string) => {
    const next = [...dialogueSegments];
    next[index] = {
      ...next[index],
      text: next[index].text + (next[index].text ? ' ' : '') + burst,
    };
    setDialogueSegments(next);
  };

  // Preview character sample line
  const handlePlayCharacterSample = async (char: CharacterPreset) => {
    if (playingSampleId === char.id) {
      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
      }
      setPlayingSampleId(null);
      return;
    }

    try {
      setPlayingSampleId(char.id);
      let sampleText = char.sampleText.nepali || char.sampleText.hindi;
      if (selectedAccent === 'Nepali') sampleText = char.sampleText.nepali || char.sampleText.hindi;
      if (selectedAccent === 'Hindi') sampleText = char.sampleText.hindi;
      if (selectedAccent === 'Hinglish') sampleText = char.sampleText.hinglish;
      if (selectedAccent === 'Indian-English' || selectedAccent === 'US-English' || selectedAccent === 'UK-English') {
        sampleText = char.sampleText.english;
      }

      const res = await fetch(getApiUrl('/api/generate-voice'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voiceName: char.voiceName,
          emotion: char.defaultEmotion,
          accent: selectedAccent,
          speakerName: char.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to preview voice');

      if (sampleAudioRef.current) {
        sampleAudioRef.current.pause();
      }

      const audio = new Audio(`data:${data.mimeType};base64,${data.audioBase64}`);
      sampleAudioRef.current = audio;
      audio.onended = () => setPlayingSampleId(null);
      await audio.play();
    } catch (err: any) {
      console.error('Sample play error:', err);
      setPlayingSampleId(null);
    }
  };

  // Main Voice Generation Trigger
  const handleGenerateVoice = async () => {
    if (activeTab === 'single' && !scriptText.trim()) {
      setError('Please write or select a script to generate voice.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let requestBody: any = {};

      if (activeTab === 'single') {
        requestBody = {
          text: scriptText.trim(),
          voiceName: selectedCharacter.voiceName,
          emotion: selectedEmotion,
          emotionIntensity,
          accent: selectedAccent,
          speakerName: selectedCharacter.name,
          speed,
          pitch,
          customStyle: showAdvancedStyle ? customStylePrompt : '',
          isDialogue: false,
        };
      } else {
        requestBody = {
          isDialogue: true,
          dialogueSegments,
        };
      }

      const res = await fetch(getApiUrl('/api/generate-voice'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize speech audio');
      }

      // Increment personal and live community usage counter
      setUserGenerations((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('bove_user_generations', next.toString());
        } catch (e) {}
        return next;
      });

      setLiveStats((prev) => ({
        ...prev,
        totalGenerations: prev.totalGenerations + 1,
        voicesToday: prev.voicesToday + 1,
      }));

      const newAudioItem: GeneratedAudioItem = {
        id: Math.random().toString(36).substring(7),
        title: activeTab === 'single' ? `${selectedCharacter.name} - ${selectedEmotion}` : `${speaker1} & ${speaker2} Dialogue`,
        text: activeTab === 'single' ? scriptText : dialogueSegments.map((s) => `${s.speaker}: ${s.text}`).join('\n'),
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/wav',
        createdAt: Date.now(),
        speaker: activeTab === 'single' ? selectedCharacter.name : `${speaker1} & ${speaker2}`,
        voiceName: selectedCharacter.voiceName,
        emotion: selectedEmotion,
        accent: selectedAccent,
        isDialogue: activeTab === 'dialogue',
      };

      setActiveAudio({
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/wav',
        title: newAudioItem.title,
        speakerName: newAudioItem.speaker,
        emotion: selectedEmotion,
        accent: selectedAccent,
      });

      setHistoryItems((prev) => [newAudioItem, ...prev]);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Error communicating with voice generation model');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply script template
  const handleSelectTemplate = (template: ScriptTemplate) => {
    if (template.isDialogue && template.dialogueSegments) {
      setActiveTab('dialogue');
      setDialogueSegments(
        template.dialogueSegments.map((d) => ({
          id: Math.random().toString(36).substring(7),
          speaker: d.speaker,
          voiceName: d.voiceName,
          accent: 'Nepali',
          emotion: 'cheerful',
          text: d.text,
        }))
      );
      if (template.dialogueSegments[0]) setSpeaker1(template.dialogueSegments[0].speaker);
      if (template.dialogueSegments[1]) setSpeaker2(template.dialogueSegments[1].speaker);
    } else {
      setActiveTab('single');
      setScriptText(template.text);
      const recChar = CHARACTERS.find((c) => c.id === template.recommendedCharacter);
      if (recChar) {
        setSelectedCharacter(recChar);
      }
      if (template.language === 'Nepali') setSelectedAccent('Nepali');
      if (template.language === 'Hindi') setSelectedAccent('Hindi');
      if (template.language === 'Hinglish') setSelectedAccent('Hinglish');
      if (template.language === 'English') setSelectedAccent('Indian-English');
      if (template.recommendedEmotion) setSelectedEmotion(template.recommendedEmotion as EmotionType);
    }
  };

  // Keyboard shortcut Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerateVoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scriptText, selectedCharacter, selectedEmotion, selectedAccent, speed, pitch, activeTab, dialogueSegments]);

  // Copy script text
  const copyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.max(1, Math.round(wordCount / 2.5));

  // Quick select characters for easy 1-click switcher
  const quickCharacters = [
    CHARACTERS.find((c) => c.id === 'bove') || CHARACTERS[0],
    CHARACTERS.find((c) => c.id === 'sunita') || CHARACTERS[1],
    CHARACTERS.find((c) => c.id === 'bikram') || CHARACTERS[2],
    CHARACTERS.find((c) => c.id === 'kiran') || CHARACTERS[3],
    CHARACTERS.find((c) => c.id === 'aarav') || CHARACTERS[4],
    CHARACTERS.find((c) => c.id === 'priya') || CHARACTERS[5],
    CHARACTERS.find((c) => c.id === 'marcus') || CHARACTERS[6],
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyItems.length}
        onOpenEnhancer={() => setIsEnhancerOpen(true)}
        onSelectTemplate={handleSelectTemplate}
        onOpenCreator={() => setIsCreatorOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        userGenerations={userGenerations}
        activeCreators={liveStats.activeCreatorsNow}
      />

      {/* Main Clean Split-Studio Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        {/* Live Creator Activity & Free Launch VIP Strip */}
        <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-zinc-950 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs text-zinc-300">
            {/* Live Online Dot */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="font-semibold text-white">
                <span className="font-mono tabular-nums text-emerald-400 font-bold">{liveStats.activeCreatorsNow}</span> Creators Online Now
              </span>
            </div>

            <span className="text-zinc-600 hidden sm:inline" aria-hidden="true">•</span>

            {/* Total Generated */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Total Generated:</span>
              <span className="font-mono tabular-nums text-purple-300 font-bold">{liveStats.totalGenerations.toLocaleString()}+</span>
            </div>

            <span className="text-zinc-600 hidden md:inline" aria-hidden="true">•</span>

            {/* Personal count */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span>Your Generations:</span>
              <span className="font-mono tabular-nums text-amber-300 font-bold">{userGenerations}</span>
              <span className="text-[10px] text-emerald-400 font-medium">(Unlimited Free)</span>
            </div>
          </div>

          {/* Quick Actions: Free VIP & Download ZIP */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs mr-1">
              <span className="text-zinc-500 line-through decoration-rose-500 font-medium">$10/mo</span>
              <span className="text-emerald-400 font-extrabold">$0 Free</span>
            </div>
            <button
              onClick={() => setIsSubscriptionOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Pass</span>
            </button>
            <button
              onClick={() => setIsDownloadOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              title="Download Full Project ZIP"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>
        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 flex items-start gap-3 text-red-200 text-xs shadow-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300">Notice</p>
              <p className="mt-0.5 text-red-300/90">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white text-xs px-2 py-1 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Studio View */}
        {activeTab === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Voice & Emotion Control Deck (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Active Character Card with Quick Switcher */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Active Voice Persona
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCharacterModalOpen(true)}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Browse All 26 Voices</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Selected Character Preview Box */}
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedCharacter.avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow shrink-0`}
                    >
                      {selectedCharacter.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm truncate">{selectedCharacter.name}</h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 uppercase">
                          {selectedCharacter.languageCategory}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{selectedCharacter.title}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayCharacterSample(selectedCharacter)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      playingSampleId === selectedCharacter.id
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingSampleId === selectedCharacter.id ? 'Playing' : 'Sample'}</span>
                  </button>
                </div>

                {/* Quick Avatar Switcher Row */}
                <div>
                  <div className="text-[11px] text-zinc-500 mb-1.5 font-medium">Quick Select Popular Voices:</div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickCharacters.map((char) => {
                      const isSelected = selectedCharacter.id === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => handleSelectCharacter(char)}
                          title={`${char.name} (${char.title})`}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600/25 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/50'
                              : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-gradient-to-br ${char.avatarGradient} flex items-center justify-center text-[9px] text-white font-bold`}
                          >
                            {char.name.charAt(0)}
                          </div>
                          <span>{char.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Emotion & Delivery Matrix */}
              <EmotionControls
                emotion={selectedEmotion}
                onEmotionChange={setSelectedEmotion}
                intensity={emotionIntensity}
                onIntensityChange={setEmotionIntensity}
                accent={selectedAccent}
                onAccentChange={setSelectedAccent}
                speed={speed}
                onSpeedChange={setSpeed}
                pitch={pitch}
                onPitchChange={setPitch}
                onInsertTag={handleInsertTag}
              />
            </div>

            {/* Right Column: Script Stage & Audio Player (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Script Box */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Script Studio
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-400">
                      {selectedAccent}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyScript}
                      className="px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => setIsEnhancerOpen(true)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-purple-400" />
                      AI Humanizer
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Enter or paste text in Nepali, Hindi, or English... Click vocal burst buttons on the left to insert natural breathing pauses and laughter."
                    rows={7}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 font-sans leading-relaxed resize-y shadow-inner"
                  />
                </div>

                {/* Script Counters & Shortcuts */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-2 pt-1 border-t border-zinc-800/80 font-mono">
                  <div className="flex items-center gap-3">
                    <span>{scriptText.length} chars</span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span className="text-purple-400">Est: ~{estimatedSeconds}s</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans">
                    Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Enter</kbd>
                  </div>
                </div>

                {/* Advanced Style Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedStyle(!showAdvancedStyle)}
                    className="text-xs text-zinc-500 hover:text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Custom Vocal Style Prompt {showAdvancedStyle ? '(Expanded)' : '(Optional prompt)'}</span>
                  </button>
                  {showAdvancedStyle && (
                    <div className="mt-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 animate-fade-in">
                      <label className="text-[11px] text-zinc-400">
                        Direct custom delivery instructions:
                      </label>
                      <input
                        type="text"
                        value={customStylePrompt}
                        onChange={(e) => setCustomStylePrompt(e.target.value)}
                        placeholder="e.g., Warm Kathmandu radio presenter style with cheerful cadence"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Main Primary Action Button */}
              <button
                type="button"
                onClick={handleGenerateVoice}
                disabled={isGenerating || !scriptText.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Realistic Audio...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    <span>Generate Realistic Voice ({selectedCharacter.name})</span>
                  </>
                )}
              </button>

              {/* Embedded Player Station */}
              <AudioPlayer
                audioBase64={activeAudio?.audioBase64 || null}
                mimeType={activeAudio?.mimeType || 'audio/wav'}
                title={activeAudio?.title || 'Master Audio Preview'}
                speakerName={activeAudio?.speakerName}
                emotion={activeAudio?.emotion}
                accent={activeAudio?.accent}
              />
            </div>
          </div>
        ) : (
          /* Dual-Speaker Screenplay Mode */
          <div className="max-w-4xl mx-auto space-y-5">
            <DialogueStudio
              segments={dialogueSegments}
              onSegmentsChange={setDialogueSegments}
              speaker1={speaker1}
              onSpeaker1Change={setSpeaker1}
              speaker2={speaker2}
              onSpeaker2Change={setSpeaker2}
              onInsertBurst={handleInsertDialogueBurst}
            />

            {/* Generate Dialogue Button */}
            <button
              type="button"
              onClick={handleGenerateVoice}
              disabled={isGenerating || dialogueSegments.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Multi-Speaker Conversation...</span>
                </>
              ) : (
                <>
                  <Layers className="w-5 h-5" />
                  <span>Generate Dual-Speaker Screenplay ({speaker1} & {speaker2})</span>
                </>
              )}
            </button>

            {/* Audio Station */}
            <AudioPlayer
              audioBase64={activeAudio?.audioBase64 || null}
              mimeType={activeAudio?.mimeType || 'audio/wav'}
              title={activeAudio?.title || 'Master Dialogue Preview'}
              speakerName={activeAudio?.speakerName}
              emotion={activeAudio?.emotion}
              accent={activeAudio?.accent}
            />
          </div>
        )}
      </main>

      {/* Character Browsing Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        characters={CHARACTERS}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={handleSelectCharacter}
        onPlaySample={handlePlayCharacterSample}
        playingSampleId={playingSampleId}
        selectedAccent={selectedAccent}
      />

      {/* AI Script Enhancer Modal */}
      <ScriptEnhancerModal
        isOpen={isEnhancerOpen}
        onClose={() => setIsEnhancerOpen(false)}
        currentText={scriptText}
        onApply={(enhanced) => setScriptText(enhanced)}
      />

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950/80 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight">Bove<span className="text-purple-400"> AI</span></span>
            <span className="text-zinc-700">•</span>
            <span>Studio Voice Engine for Nepali, Hindi & English</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            <button
              onClick={() => setIsDownloadOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsSubscriptionOpen(true)}
              className="text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Plans & Pricing</span>
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsCreatorOpen(true)}
              className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              About Studio
            </button>
            <span className="text-zinc-700">•</span>
            <span>© 2026 Bove AI Studio. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Complete Project Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      {/* Subscription & Pricing Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlan={userPlan}
        onSelectPlan={handleSelectPlan}
        userGenerations={userGenerations}
      />

      {/* Verified Founder & Creator Profile Modal */}
      <CreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onSelectAudio={(item) => {
          setActiveAudio({
            audioBase64: item.audioBase64,
            mimeType: item.mimeType,
            title: item.title,
            speakerName: item.speaker,
            emotion: item.emotion,
            accent: item.accent,
          });
          setIsHistoryOpen(false);
        }}
        onDeleteItem={(id) => setHistoryItems((prev) => prev.filter((i) => i.id !== id))}
        onClearAll={() => setHistoryItems([])}
      />
    </div>
  );
}

