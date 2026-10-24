export type GeminiVoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export type LanguageAccent = 'Nepali' | 'Hindi' | 'Hinglish' | 'Indian-English' | 'US-English' | 'UK-English';

export type EmotionType = 
  | 'neutral'
  | 'cheerful'
  | 'dramatic'
  | 'whisper'
  | 'energetic'
  | 'calm'
  | 'intense'
  | 'inspirational'
  | 'sad'
  | 'sarcastic';

export type EmotionIntensity = 'subtle' | 'moderate' | 'high' | 'extreme';

export interface CharacterPreset {
  id: string;
  name: string;
  languageCategory: 'nepali' | 'hindi' | 'english';
  gender: 'male' | 'female';
  voiceName: GeminiVoiceName;
  age: string;
  accent: LanguageAccent;
  defaultEmotion: EmotionType;
  title: string;
  description: string;
  tags: string[];
  avatarGradient: string;
  sampleText: {
    nepali?: string;
    hindi: string;
    hinglish: string;
    english: string;
  };
}

export interface DialogueSegment {
  id: string;
  speaker: string;
  voiceName: GeminiVoiceName;
  accent: LanguageAccent;
  emotion: EmotionType;
  text: string;
}

export interface GeneratedAudioItem {
  id: string;
  title: string;
  text: string;
  audioBase64: string;
  mimeType: string;
  createdAt: number;
  speaker: string;
  voiceName: GeminiVoiceName;
  emotion: EmotionType;
  accent: LanguageAccent;
  isDialogue?: boolean;
  durationSeconds?: number;
}
