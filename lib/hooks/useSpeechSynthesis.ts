import { useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
  isSpeaking: () => boolean;
  isSupported: boolean;
}

export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const {
    rate = 1,
    pitch = 1,
    volume = 1,
    voice = null,
  } = options;

  const synthesis = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (isSupported) {
      synthesis.current = window.speechSynthesis;
    }
    
    return () => {
      if (synthesis.current) {
        synthesis.current.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthesis.current || !text.trim()) return;

    synthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      utteranceRef.current = null;
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error);
      utteranceRef.current = null;
      onEnd?.();
    };

    utteranceRef.current = utterance;
    synthesis.current.speak(utterance);
  }, [rate, pitch, volume, voice]);

  const cancel = useCallback(() => {
    if (synthesis.current) {
      synthesis.current.cancel();
      utteranceRef.current = null;
    }
  }, []);

  const isSpeaking = useCallback(() => {
    return synthesis.current ? synthesis.current.speaking : false;
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
  };
};