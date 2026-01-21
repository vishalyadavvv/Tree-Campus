import { useAITeacher } from "../../hooks/useAITeacher";
import { useRef, useState, useEffect } from "react";
import { marked } from "marked";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const stopMessage = useAITeacher((state) => state.stopMessage);
  const { currentMessage } = useAITeacher();
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();
  
  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const [storedQuestion, setStoredQuestion] = useState(null);

  useEffect(() => {
    if (currentMessage?.question) {
      if (currentMessage.question === 'Welcome Greeting to the user'){
        currentMessage.question = null;
      }
      if (currentMessage.question !== '' || null){
        setStoredQuestion(currentMessage.question);
      }
      
    }
  }, [currentMessage?.question]);

  return (
    <div
      className={`${
        classroom === "default"
          ? "w-[1288px] h-[676px]"
          : "w-[2528px] h-[856px]"
      } p-8 flex flex-col space-y-8 bg-transparent opacity-80`}
      ref={container}
    >
      {storedQuestion && (
        <h2 className="text-3xl font-bold text-white mb-4">{storedQuestion}</h2>
      )}
      {latestMessage ? (
        <div className="flex-grow flex items-center gap-3 overflow-y-auto">
          <p
            className="text-4xl inline-block px-4 mt-4 rounded-sm font-bold text-stone-50 flex-grow font-noto-sans-devanagari"
            dangerouslySetInnerHTML={{
              __html: marked.parse(latestMessage.answer)
            }}
          />

{currentMessage === latestMessage ? (
            <button
              className="text-white bg-transparent"
              onClick={() => stopMessage(latestMessage)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                />
              </svg>
            </button>
          ) : (
            <button
              className="text-white/65 bg-transparent"
              onClick={() => playMessage(latestMessage)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="h-full w-full grid place-content-center text-center">
          <h2 className="text-8xl font-bold text-white/90 italic">
            AI ENGLISH TEACHER
            <br />
            <br />
            English Learning Class
          </h2>
        </div>
      )}
    </div>
  );
};
