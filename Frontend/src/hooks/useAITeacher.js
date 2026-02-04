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
          const history = messages.map(m => ({
            user: m.question,
            assistant: m.answer
          }));

          const data = await fetchAIResponse(question, language, history);
          
          const message = {
            question,
            answer: data.text,
            audio_text: data.audio_text,
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

        if (message.audioPlayer && message.audioPlayer.paused) {
          message.audioPlayer.play();
          return;
        }

        if (!get().isLesson) {
          set(() => ({ loading: true }));
          try {
            const token = localStorage.getItem('token');
            const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
            const ttsUrl = `${baseUrl}/api/ai/teacher/tts?teacher=${get().teacher}&text=${encodeURIComponent(
              message.audio_text
            )}&language=${get().language}`;
            const audioRes = await fetch(
              ttsUrl,
              {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
              }
            );
            if (!audioRes.ok) {
              const errorData = await audioRes.json().catch(() => ({}));
              throw new Error(errorData.error || `Error fetching TTS: ${audioRes.status}`);
            }

            const visemesHeader = audioRes.headers.get("Visemes");
            if (!visemesHeader) throw new Error("Visemes header not found.");
            const visemes = JSON.parse(atob(visemesHeader));

            const audioBlob = await audioRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioPlayer = new Audio(audioUrl);

            audioPlayer.onended = () => {
              set(() => ({ currentMessage: null }));
            };

            message.visemes = visemes;
            message.audioPlayer = audioPlayer;
            audioPlayer.play();

            set(() => ({
              messages: get().messages.map((m) =>
                m.id === message.id ? message : m
              ),
              loading: false,
            }));
          } catch (error) {
            console.error("Error in playMessage:", error);
            set(() => ({ loading: false }));
          }
        }
      },

      stopMessage: (message) => {
        if (!message || !message.audioPlayer) {
          return;
        }
        message.audioPlayer.pause();
        message.audioPlayer.currentTime = 0;
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
