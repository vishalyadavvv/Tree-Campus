import 'regenerator-runtime/runtime'; // Needed for async/await in some environments
import { useState, useRef, useEffect, useCallback,useLayoutEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// This import is external and assumed to resolve in your environment.
// No modifications are made to this import path based on your request.
import { useAITeacher } from "../../hooks/useAITeacher";

export const TypingBox = ({ showTypingField = true }) => {
  // Cache Buster: 2026-01-21 15:52
  // Destructuring askAI and loading from your external useAITeacher hook
  const { askAI, loading, language } = useAITeacher(); 

  const [question, setQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', message: '' });
  const [mutedHint, setMutedHint] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // useSpeechRecognition hook provides transcript, resetTranscript, and browserSupportsSpeechRecognition
  const { transcript, resetTranscript, browserSupportsSpeechRecognition, listening } = useSpeechRecognition();
  // useRef for direct DOM access to the textarea element
  const textareaRef = useRef(null);
  const recordingRef = useRef(false);
  const langRef = useRef("en-IN");

  // Sync ref with state
  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);

  // AUTO-RESTARTER: If mic stops but we are still in "recording" mode, restart it.
  useEffect(() => {
    let timeout;
    if (isRecording && !listening && browserSupportsSpeechRecognition) {
      console.log("Mic quiet. Attempting Auto-Restart in 300ms...");
      timeout = setTimeout(() => {
        if (recordingRef.current && !listening) {
          SpeechRecognition.startListening({ 
            continuous: true, 
            language: langRef.current,
            interimResults: true
          }).catch(err => console.error("Auto-restart failed:", err));
        }
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [isRecording, listening, browserSupportsSpeechRecognition]);

  // Effect to manage speech recognition transcript and question state
  useEffect(() => {
    console.log("Mic Debug:", { listening, isRecording, transcriptLength: transcript.length, transcript: transcript.slice(-20) });
    if (isRecording || listening) {
      setQuestion(transcript);
      autoResize();
    }
  }, [transcript, isRecording, listening]); // Dependencies ensure this runs when transcript or recording state changes

  // Effect to handle Volume Meter
  useEffect(() => {
    if (listening) {
      startVolumeMeter();
    } else {
      stopVolumeMeter();
    }
    return () => stopVolumeMeter();
  }, [listening]);

  const startVolumeMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setVolume(average);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.error("Volume meter error:", err);
    }
  };

  const stopVolumeMeter = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setVolume(0);
  };

  // Effect for initial auto-resize and handling potential external changes to the question (e.g., via props)
  useEffect(() => {
    autoResize();
  }, [question]); // Re-run autoResize if the question state changes

  // Callback to display temporary feedback messages to the user
  const showFeedback = useCallback((type, message) => {
    setFeedbackMessage({ type, message });
    // Clear the message after a set duration (4 seconds)
    setTimeout(() => setFeedbackMessage({ type: '', message: '' }), 4000);
  }, []);


  // Function to start speech recording
  const startRecording = async () => {
    // Check if the browser supports speech recognition
    if (!browserSupportsSpeechRecognition) {
      showFeedback("error", "Speech recognition is not supported by your browser. Please use Chrome or Edge.");
      return;
    }

    // Determine recognition language based on teacher settings
    let recognitionLanguage = language === "Hindi" || language === "English-Hindi" ? "hi-IN" : "en-IN";
    langRef.current = recognitionLanguage;

    // Start listening for speech
    try {
      console.log("Attempting to start listening with language:", recognitionLanguage);
      
      // Clear any previous transcript and set recording state
      resetTranscript();
      setIsRecording(true);

      // (Native listeners removed in favor of useEffect restarter)


      await SpeechRecognition.startListening({ 
        continuous: true, 
        language: recognitionLanguage,
        interimResults: true
      });
      
    } catch (e) {
      console.error("Mic start error:", e);
      showFeedback("error", "Could not start microphone. Check permissions.");
      setIsRecording(false);
    }
  };

  // Function to stop speech recording and process the transcript
  const stopRecording = async () => {
    console.log("Stopping recording. Current transcript:", transcript);
    setIsRecording(false); // Set recording state to false
    SpeechRecognition.stopListening(); // Stop the speech recognition service
    
    // Use the transcript available at this moment
    const trimmedTranscript = transcript.trim();
    console.log("Final trimmed transcript to ask:", trimmedTranscript);
    
    if (trimmedTranscript) {
      await ask(trimmedTranscript); // Call the ask function with the captured speech
    } else {
      showFeedback("info", "No speech detected. Please try again.");
    }
    
    setQuestion("");
    setTimeout(() => {
      resetTranscript();
    }, 100);
  };

  // Function to dynamically resize the textarea based on its content
function autoResize() {
  const ta = textareaRef.current;
  if (!ta) return;

  // reset to auto so scrollHeight shrinks when text is deleted
  ta.style.height = "auto";

  // measure the full height of the content
  const scrollH = ta.scrollHeight;

  // cap at 80px
  const max = 80;

  ta.style.height = `${Math.min(scrollH, max)}px`;
  ta.style.overflowY = scrollH > max ? "auto" : "hidden";
}

useLayoutEffect(() => {
  autoResize();
}, [question]);

useLayoutEffect(() => {
  if (isRecording) {
    setQuestion(transcript);
    // no need to call autoResize here separately,
    // because the question update will trigger the above useLayoutEffect
  }
}, [transcript, isRecording]);


  // Handler for textarea content changes
  const handleChange = (e) => {
    setQuestion(e.target.value); // Update the question state
    // autoResize is implicitly handled by the useEffect watching the 'question' state
  };

  // Handler for keyboard key presses in the textarea
  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift, prevent new line and submit the question
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(question);
    }
  };

  // Function to send the question to the AI
  const ask = async (questionText) => {
    // Prevent sending empty questions or if already loading
    if (!questionText.trim() || loading) {
        if (!questionText.trim()) showFeedback("error", "Please enter a message.");
        return;
    }
    try {
      await askAI(questionText); // Call the AI teacher's askAI function
      setQuestion(""); // Clear the input field after successful submission
      resetTranscript(); // Clear speech recognition transcript
    } catch (error) {
      console.error("Error while asking AI:", error); // Log any errors
      showFeedback("error", "Failed to get AI response. Please try again."); // Show error feedback
    }
  };

  return (
    <div
  className={`
    pointer-events-auto
    relative z-20 flex flex-col items-center justify-center
    bg-gradient-to-br from-gray-700/60 via-gray-800/60 to-gray-900/60
    p-4 md:p-6 backdrop-blur-md rounded-xl border border-gray-600/40 shadow-2xl
    transition-all duration-300
    ${showTypingField 
       ? "w-full max-w-3xl" 
       : "w-30"} 
    mx-auto mb-4 md:mb-6 
  `}
>
      {/* Feedback Message Display */}
      {feedbackMessage.message && (
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm md:text-base shadow-md
            ${feedbackMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
            ${feedbackMessage.type === 'info' ? 'bg-blue-500 text-white' : ''}
            opacity-95 transition-opacity duration-300 z-50 whitespace-nowrap`}
        >
          {feedbackMessage.message}
        </div>
      )}

      {/* Conditional rendering for the full typing field */}
      {showTypingField && (
        <div className="flex flex-row items-center w-full gap-3"> {/* items-end aligns elements to the bottom of the flex container */}
          {/* Mic Button */}
          <button
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200
              ${listening ? "bg-red-500 hover:bg-red-600 animate-pulse-mic" : "bg-gray-700 hover:bg-gray-600"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${listening ? 'focus:ring-red-400' : 'focus:ring-gray-400'}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading} // Disable if AI is loading
            aria-label={listening ? "Stop recording" : "Start recording"} // Accessibility label
          >
            {listening ? (
              // Mic icon when recording (active/pulsing)
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor" // Uses the button's text color
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                />
                <circle cx="12" cy="17" r="3" fill="currentColor" />
              </svg>
            ) : (
              // Mic icon when not recording (standby)
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor" // Uses the button's text color
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12M12 17C9.79086 17 8 15.2091 8 13V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V13C16 15.2091 14.2091 17 12 17Z"
                />
              </svg>
            )}
          </button>


{/* Auto-resizing Textarea */}
<div className="relative flex-grow">
  <textarea
    ref={textareaRef}
    value={question}
    onChange={handleChange}
    onInput={autoResize}
    onKeyDown={handleKeyDown}
    disabled={loading}
    placeholder={listening ? "Listening…" : "Ask a question?"}
    className="
      box-border
      w-full
      bg-white/10 p-3 rounded-xl text-white placeholder-gray-300
      shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400
      resize-none overflow-hidden
      h-[48px] max-h-[80px]
    "
  />
  {listening && (
    <div className="absolute left-0 -top-6 w-full text-center flex flex-col items-center">
      {/* Audio Level Meter */}
      <div className="w-24 h-1 bg-gray-600 rounded-full mb-1 overflow-hidden relative">
        <div 
          className="h-full bg-green-400 transition-all duration-75"
          style={{ width: `${Math.min(volume * 2, 100)}%` }}
        />
        {volume < 5 && listening && (
          <div className="absolute inset-0 bg-red-500/30 animate-pulse" />
        )}
      </div>
      <p className="text-blue-300 text-[10px] md:text-xs truncate italic animate-pulse bg-gray-900/40 rounded-full px-2 py-1 inline-block">
        {volume < 5 && listening && !transcript ? "⚠️ Whisper detected. Speak louder!" : (transcript ? `Hearing: "${transcript}"` : "Listening... Speak now")}
      </p>
    </div>
  )}
</div>

          {/* Ask Button */}
          <button
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200
              ${!question.trim() || loading ? "bg-blue-700/50 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-400`}
            onClick={() => ask(question)} // Submit question on click
            disabled={!question.trim() || loading} // Disable if input is empty or loading
            aria-label="Ask AI" // Accessibility label
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor" // Uses the button's text color
              className="w-6 h-6"
            >
              <path
                d="M12.0004 18.5816V12.5M12.7976 18.754L15.8103 19.7625C17.4511 20.3118 18.2714 20.5864 18.7773 20.3893C19.2166 20.2182 19.5499 19.8505 19.6771 19.3965C19.8236 18.8737 19.4699 18.0843 18.7624 16.5053L14.2198 6.36709C13.5279 4.82299 13.182 4.05094 12.7001 3.81172C12.2814 3.60388 11.7898 3.60309 11.3705 3.80958C10.8878 4.04726 10.5394 4.8182 9.84259 6.36006L5.25633 16.5082C4.54325 18.086 4.18671 18.875 4.33169 19.3983C4.4576 19.8528 4.78992 20.2216 5.22888 20.394C5.73435 20.5926 6.55603 20.3198 8.19939 19.7744L11.2797 18.752C11.5614 18.6585 11.7023 18.6117 11.8464 18.5933C11.9742 18.5769 12.1036 18.5771 12.2314 18.5938C12.3754 18.6126 12.5162 18.6597 12.7976 18.754Z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Conditional rendering for the microphone-only field */}
      {!showTypingField && (
        <div className="flex flex-col items-center w-full">
          {transcript && !loading && (
            <div className="mt-2 mb-4 p-3 bg-white/10 text-white rounded-lg shadow max-h-32 overflow-y-auto w-full text-center">
              <span className="text-sm italic text-gray-300">{transcript}</span>
            </div>
          )}
          <button
            className={`!px-0 !py-0 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300
              ${listening ? "bg-red-500 hover:bg-red-600 animate-pulse-mic" : "bg-blue-600 hover:bg-blue-700"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${listening ? 'focus:ring-red-400' : 'focus:ring-blue-400'}`}
            onClick={isRecording ? stopRecording : startRecording} // Toggle recording
            disabled={loading} // Disable if AI is loading
            aria-label={listening ? "Stop recording" : "Start recording"}
          >
            {listening ? (
              // Larger mic icon for the microphone-only mode when recording
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z"
                />
                <circle cx="12" cy="17" r="3" fill="currentColor" />
              </svg>
            ) : (
              // Larger mic icon for the microphone-only mode when not recording
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path
                  d="M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12M12 17C9.79086 17 8 15.2091 8 13V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V13C16 15.2091 14.2091 17 12 17Z"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center pt-4 text-white text-sm">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          AI is thinking...
        </div>
      )}

      {/* Global styles for the pulse animation (can be moved to a global CSS file if preferred) */}
      <style>{`
        @keyframes pulse-mic {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-pulse-mic {
          animation: pulse-mic 1.5s infinite;
        }
      `}</style>
    </div>
  );
};
