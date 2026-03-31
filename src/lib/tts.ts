const audioCache = new Map<string, string>();

export async function speakFrench(text: string): Promise<void> {
  const cached = audioCache.get(text);

  if (cached) {
    return playAudioUrl(cached);
  }

  try {
    const url = `/api/tts?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('TTS request failed');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    audioCache.set(text, objectUrl);

    return playAudioUrl(objectUrl);
  } catch {
    return fallbackSpeak(text);
  }
}

function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio playback failed'));
    audio.play().catch(reject);
  });
}

function fallbackSpeak(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}
