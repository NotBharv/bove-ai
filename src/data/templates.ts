export interface ScriptTemplate {
  id: string;
  title: string;
  category: 'Nepali Story' | 'Hindi Story' | 'Reels & Shorts' | 'Commercial' | 'Meditation' | 'Motivation' | 'Dialogue';
  language: 'Nepali' | 'Hindi' | 'Hinglish' | 'English';
  recommendedCharacter: string;
  recommendedEmotion: string;
  text: string;
  isDialogue?: boolean;
  dialogueSegments?: {
    speaker: string;
    text: string;
    voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
    style: string;
  }[];
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'nepali-katha-mystery',
    title: 'Himalayan Mystery Village (Nepali Story)',
    category: 'Nepali Story',
    language: 'Nepali',
    recommendedCharacter: 'bove',
    recommendedEmotion: 'dramatic',
    text: 'त्यो हिउँले ढाकिएको पुरानो गाउँमा... <breath> जब साँझ पर्थ्यो, हावाको सुसाइमा एउटा अनौठो आवाज गुञ्जिन्थ्यो। <gasp> गाउँका वृद्धहरू भन्थे, त्यो कुनै साधारण हावा होइन, हजारौं वर्ष पुरानो इतिहासको सुस्केरा हो।',
  },
  {
    id: 'nepali-reel-hook',
    title: 'Viral Video Hook (Nepali Reels & Shorts)',
    category: 'Reels & Shorts',
    language: 'Nepali',
    recommendedCharacter: 'aayush',
    recommendedEmotion: 'energetic',
    text: 'पख्नुहोस्, पख्नुहोस्! <laugh> यदि तपाईं पनि भिडियोको लागि एकदमै प्राकृतिक नेपाली आवाज खोज्दै हुनुहुन्थ्यो भने, Bove AI ले तपाईंको काम एक सेकेन्डमै सजिलो बनाइदिन्छ। हेर्नुहोस् है त!',
  },
  {
    id: 'nepali-motivation',
    title: 'The Summit of Success (Nepali Motivation)',
    category: 'Motivation',
    language: 'Nepali',
    recommendedCharacter: 'bove',
    recommendedEmotion: 'inspirational',
    text: 'जिन्दगीमा कठिनाइहरू आउनु स्वाभाविक हो। <breath> तर ती कठिनाइहरूसँग जुधेर अघि बढ्ने व्यक्ति नै एक दिन सफलताको शिखरमा पुग्छ। आजैबाट आफ्नो सपनाको लागि मिहिनेत सुरु गर्नुहोस्!',
  },
  {
    id: 'nepali-dual-podcast',
    title: 'Bove & Sunita Podcast (Nepali Dual Voice)',
    category: 'Dialogue',
    language: 'Nepali',
    recommendedCharacter: 'bove',
    recommendedEmotion: 'cheerful',
    isDialogue: true,
    text: '',
    dialogueSegments: [
      {
        speaker: 'Bove',
        voiceName: 'Puck',
        style: 'Warm, articulate, authentic Nepali podcast host',
        text: 'नमस्ते सम्पूर्ण श्रोता साथीहरूलाई! <breath> आज हाम्रो स्टुडियोमा सुनिताजी उपस्थित हुनुहुन्छ। सुनिताजी, नेपाली भाषामा नयाँ प्रविधिको विकासलाई कसरी हेर्नुहुन्छ?',
      },
      {
        speaker: 'Sunita',
        voiceName: 'Kore',
        style: 'Sweet, bright, and cheerful Nepali co-host with natural cadence',
        text: '|yeah| बोभजी, साँच्चै भन्नुपर्दा यो एकदमै ठूलो उपलब्धि हो! <laugh> अब जोसुकैले पनि शुद्ध नेपाली र स्पष्ट आवाजमा आफ्नो कन्टेन्ट बनाउन सक्नेछन्।',
      },
    ],
  },
  {
    id: 'bikram-kiran-podcast',
    title: 'Nepali Story & Discourse (Bikram & Kiran)',
    category: 'Dialogue',
    language: 'Nepali',
    recommendedCharacter: 'bikram',
    recommendedEmotion: 'dramatic',
    isDialogue: true,
    text: '',
    dialogueSegments: [
      {
        speaker: 'Bikram',
        voiceName: 'Fenrir',
        style: 'Commanding, resonant Nepali documentary baritone with deliberate pauses',
        text: 'नमस्कार! म विक्रम। <breath> आजको हाम्रो यस गहन संवादमा किरणजी हामीसँग उपस्थित हुनुहुन्छ। किरणजी, नेपाली माटो र यसका कथाहरूलाई कसरी हेर्नुहुन्छ?',
      },
      {
        speaker: 'Kiran',
        voiceName: 'Puck',
        style: 'Warm, soulful, and deeply articulate Nepali storyteller voice',
        text: '|yeah| विक्रमजी, हाम्रो संस्कृति र जीवनका कथाहरू नै हाम्रो पहिचान हुन्। <breath> जब यी आवाजमा गुञ्जिन्छन्, तब हरेक नेपालीको मन छुन्छ।',
      },
    ],
  },
  {
    id: 'kahani-suspense',
    title: 'Untold Midnight Tale (Hindi Suspense)',
    category: 'Hindi Story',
    language: 'Hindi',
    recommendedCharacter: 'kabir',
    recommendedEmotion: 'dramatic',
    text: 'उस रात घड़ी में ठीक बारह बजे थे। <breath> पुरानी हवेली के दरवाजे से एक अजीब सी खड़खड़ाहट सुनाई दी... <gasp> कबीर ने जब मुड़कर देखा, तो वहां कोई नहीं था, सिवाय एक ठंडी हवा के झोंके के।',
  },
  {
    id: 'reel-hook-hinglish',
    title: 'Viral 3-Second Hook (Hinglish)',
    category: 'Reels & Shorts',
    language: 'Hinglish',
    recommendedCharacter: 'ananya',
    recommendedEmotion: 'cheerful',
    text: 'Ruko ruko ruko! <laugh> Agar aap bhi voiceover ke liye pareshan the, toh Bove AI aapki poori life change kar dega. Check this out!',
  },
  {
    id: 'guided-meditation-nepali',
    title: 'Morning Serenity & Meditation (Nepali)',
    category: 'Meditation',
    language: 'Nepali',
    recommendedCharacter: 'srijana',
    recommendedEmotion: 'calm',
    text: 'आफ्ना आँखा विस्तारै बन्द गर्नुहोस्... <breath> आफ्नो मनका सबै चिन्ताहरूलाई बग्ने नदीझैं जान दिनुहोस्। यस वर्तमान क्षणमा तपाईं पूर्ण रूपमा सुरक्षित र शान्त हुनुहुन्छ।',
  },
  {
    id: 'tech-commercial',
    title: 'Global Tech Launch (English)',
    category: 'Commercial',
    language: 'English',
    recommendedCharacter: 'marcus',
    recommendedEmotion: 'energetic',
    text: 'Imagine generating studio-quality voiceovers in Nepali, Hindi, and English in less than three seconds. <breath> No expensive gear. Pure emotion and authentic human cadence.',
  },
];
