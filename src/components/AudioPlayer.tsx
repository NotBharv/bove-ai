import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Sparkles, Sliders, Music, Zap } from 'lucide-react';

interface AudioPlayerProps {
  audioBase64: string | null;
  mimeType?: string;
  title?: string;
  speakerName?: string;
  emotion?: string;
  accent?: string;
  onEnded?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType = 'audio/wav',
  title = 'Generated Voice',
  speakerName,
  emotion,
  accent,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [warmthActive, setWarmthActive] = useState(false);
  const [clarityActive, setClarityActive] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const warmthFilterRef = useRef<BiquadFilterNode | null>(null);
  const clarityFilterRef = useRef<BiquadFilterNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Audio source URL
  const audioSrc = audioBase64 ? `data:${mimeType};base64,${audioBase64}` : null;

  // Initialize Web Audio graph for waveform visualizer & EQ
  const initWebAudio = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Warmth filter (Low Shelf boost around 250Hz)
      const warmthFilter = ctx.createBiquadFilter();
      warmthFilter.type = 'lowshelf';
      warmthFilter.frequency.value = 250;
      warmthFilter.gain.value = warmthActive ? 4 : 0;
      warmthFilterRef.current = warmthFilter;

      // Clarity filter (Peaking filter around 3500Hz)
      const clarityFilter = ctx.createBiquadFilter();
      clarityFilter.type = 'peaking';
      clarityFilter.frequency.value = 3500;
      clarityFilter.Q.value = 1.0;
      clarityFilter.gain.value = clarityActive ? 3.5 : 0;
      clarityFilterRef.current = clarityFilter;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // Connect graph: source -> warmth -> clarity -> analyser -> destination
      source.connect(warmthFilter);
      warmthFilter.connect(clarityFilter);
      clarityFilter.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio initialization note:', e);
    }
  };

  // Update EQ filters
  useEffect(() => {
    if (warmthFilterRef.current) {
      warmthFilterRef.current.gain.value = warmthActive ? 4 : 0;
    }
  }, [warmthActive]);

  useEffect(() => {
    if (clarityFilterRef.current) {
      clarityFilterRef.current.gain.value = clarityActive ? 3.5 : 0;
    }
  }, [clarityActive]);

  // Handle Play/Pause
  const togglePlay = async () => {
    if (!audioRef.current || !audioSrc) return;

    if (!audioContextRef.current) {
      initWebAudio();
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Playback error:', err);
      }
    }
  };

  // Draw waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 48;
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bars) * 0.7;
        const gap = (width / bars) * 0.3;

        for (let i = 0; i < bars; i++) {
          const dataIndex = Math.floor((i / bars) * bufferLength * 0.7);
          const value = dataArray[dataIndex] || 0;
          const barHeight = Math.max(4, (value / 255) * (height - 8));

          const x = i * (barWidth + gap);
          const y = (height - barHeight) / 2;

          // Gradient for animated bars
          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, '#a855f7'); // purple-500
          grad.addColorStop(0.5, '#6366f1'); // indigo-500
          grad.addColorStop(1, '#06b6d4'); // cyan-500

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, 3);
          ctx.fill();
        }
      } else {
        // Idle decorative wave
        const barWidth = (width / bars) * 0.7;
        const gap = (width / bars) * 0.3;
        for (let i = 0; i < bars; i++) {
          const sine = Math.sin((i / bars) * Math.PI * 3);
          const staticHeight = Math.max(4, Math.abs(sine) * 22);
          const x = i * (barWidth + gap);
          const y = (height - staticHeight) / 2;

          ctx.fillStyle = '#334155'; // slate-700
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, staticHeight, 2);
          ctx.fill();
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying]);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onEnded) onEnded();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    if (!audioSrc) return;
    const a = document.createElement('a');
    a.href = audioSrc;
    const cleanSpeaker = (speakerName || 'Voice').replace(/\s+/g, '_');
    const cleanEmotion = (emotion || 'Natural').replace(/\s+/g, '_');
    a.download = `Bove_${cleanSpeaker}_${cleanEmotion}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audioSrc) {
    return (
      <div className="border border-dashed border-zinc-800 bg-zinc-950/60 rounded-2xl p-6 text-center text-zinc-500">
        <Music className="w-8 h-8 mx-auto mb-2 text-zinc-600 animate-pulse" />
        <p className="text-sm font-medium text-zinc-400">Ready to synthesize voice</p>
        <p className="text-xs text-zinc-600 mt-1">Select a character, adjust emotion, and click "Generate Audio"</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-5 shadow-2xl shadow-purple-950/20">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        loop={isLooping}
      />

      {/* Top Header Information */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base tracking-tight">{title}</h3>
              {speakerName && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {speakerName}
                </span>
              )}
              {emotion && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                  {emotion}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
              <span>Studio Master 24kHz WAV</span>
              {accent && <span>• {accent}</span>}
            </p>
          </div>
        </div>

        {/* Studio EQ Toggles & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWarmthActive(!warmthActive)}
            title="Warmth Filter: enhances voice richness & deep bass"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              warmthActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Warmth {warmthActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setClarityActive(!clarityActive)}
            title="Clarity Filter: enhances presence & vocal crispness"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              clarityActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Clarity {clarityActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download WAV
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="relative w-full h-18 bg-zinc-950/80 rounded-xl p-2 border border-zinc-800/80 flex items-center justify-center mb-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={68}
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 via-transparent to-zinc-950/40 pointer-events-none" />
      </div>

      {/* Scrubber & Time */}
      <div className="space-y-1 mb-4">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
        {/* Play / Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            title="Replay from start"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            title="Toggle Loop"
            className={`px-2 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              isLooping
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Loop
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-zinc-950/70 p-1 rounded-xl border border-zinc-800">
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                playbackRate === rate
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
