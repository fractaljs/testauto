export async function textToSpeech(
  text: string,
  callback?: () => void
): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not found');
    }

    const voiceId = "pNInz6obpgDQGcFmaJgB"; // Rachel voice ID
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (callback) {
        callback();
      }
    };

    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      URL.revokeObjectURL(audioUrl);
      if (callback) {
        callback();
      }
    };

    await audio.play();
  } catch (error) {
    console.error('Text-to-speech error:', error);
    if (callback) {
      callback();
    }
    throw error;
  }
}