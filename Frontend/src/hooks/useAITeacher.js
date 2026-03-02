import { create } from "zustand";
import { persist } from "zustand/middleware";

async function fetchAIResponse(question, language, history) {
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
  const url = `${baseUrl}/api/ai/teacher/ask`;
  const token = localStorage.getItem('token');
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        question,
        language,
        history,
      }),
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch AI response: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching AI response:", err);
    throw err;
  }
}

export const useAITeacher = create(
  persist(
    (set, get) => ({
      messages: [],
      currentMessage: null,
      teacher: "Nanami",
      language: "English",
      classroom: "default",
      speech: "formal",
      loading: false,
      userInteracted: false,
      isLesson: false,

      setLanguage: (language) => {
        set(() => ({ language }));
      },

      setSpeech: (speech) => {
        set(() => ({ speech }));
      },

      markUserInteracted: () => {
        set(() => ({ userInteracted: true }));
      },

      askAI: async (question) => {
        if (!question) return;

        const { speech, messages, language } = get();

        set(() => ({ loading: true }));
        try {
          const history = messages.flatMap(m => [
            { role: 'user', content: m.question },
            { role: 'assistant', content: m.answer }
          ]);

          const data = await fetchAIResponse(question, language, history);
          
          const message = {
            question,
            answer: data.text,
            audio_text: data.audio_text,
            audio: data.audio, // Base64 audio from server
            visemes: data.visemes, // Visemes from server
            id: messages.length,
            speech,
          };

          set((state) => ({
            currentMessage: message,
            messages: [...state.messages, message],
            loading: false,
          }));

          get().playMessage(message);
        } catch (error) {
          console.error("Error in askAI:", error);
          set(() => ({ loading: false }));
        }
      },

      playMessage: async (message) => {
        set(() => ({ currentMessage: message }));

        if (!get().userInteracted) {
          console.warn("Audio playback is blocked until user interaction.");
          return;
        }

        // If the audio player already exists, simply play/resume it!
        if (message.audioPlayer) {
          // If it reached the end, reset to 0 to replay
          if (message.audioPlayer.currentTime >= message.audioPlayer.duration) {
            message.audioPlayer.currentTime = 0;
          }
          
          // Ensure onended exists in case it was lost
          message.audioPlayer.onended = () => {
            set(() => ({ currentMessage: null }));
          };

          message.audioPlayer.play().catch(e => console.error("Resume failed:", e));
          return;
        }

        // If we have audio data from the single API call, play it
        if (message.audio && !get().isLesson) {
          try {
             // Convert base64 to binary ArrayBuffer to a Blob URL
             const binaryString = window.atob(message.audio);
             const len = binaryString.length;
             const bytes = new Uint8Array(len);
             for (let i = 0; i < len; i++) {
                 bytes[i] = binaryString.charCodeAt(i);
             }
             const audioBlob = new Blob([bytes.buffer], { type: 'audio/mp3' });
             const audioUrl = URL.createObjectURL(audioBlob);

             const audioPlayer = new Audio(audioUrl);

             audioPlayer.onended = () => {
               set(() => ({ currentMessage: null }));
             };

             message.audioPlayer = audioPlayer;
             audioPlayer.play().catch(e => console.error("Audio playback failed strictly during .play():", e));

             set(() => ({
               messages: get().messages.map((m) =>
                 m.id === message.id ? message : m
               ),
               loading: false,
             }));

          } catch (error) {
             console.error("Error setting up audio message playback:", error);
             set(() => ({ loading: false }));
          }
        } else if (!get().isLesson) {
             // Fallback or error state if no audio was returned
             console.warn("No audio data found in message.");
             set(() => ({ loading: false }));
        }
      },

      stopMessage: (message) => {
        if (message && message.audioPlayer) {
          message.audioPlayer.pause();
          // DO NOT set currentTime = 0 here, so we can resume later!
        }
        set(() => ({ currentMessage: null }));
      },

      reset: () => {
        set({
          messages: [],
          currentMessage: null,
          loading: false,
        });
      },
    }),
    {
      name: "ai-teacher-storage",
      partialize: (state) => ({ 
        messages: state.messages, 
        language: state.language,
        classroom: state.classroom 
      }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener(
    "click",
    () => useAITeacher.getState().markUserInteracted(),
    { once: true }
  );
  window.addEventListener(
    "keydown",
    () => useAITeacher.getState().markUserInteracted(),
    { once: true }
  );
}
