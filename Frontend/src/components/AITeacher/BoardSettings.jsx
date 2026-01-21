import { useAITeacher } from "../../hooks/useAITeacher";
const teachers = ["Nanami", "Naoki"]; // Adding missing teachers constant if needed by the component's commented out section, but actually useAITeacher handles it

export const BoardSettings = ({ setShowPopup }) => {
  const Language = useAITeacher((state) => state.language); 
  const setLanguage = useAITeacher((state) => state.setLanguage);
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-row gap-4 pointer-events-auto">
        <button
          className={`${
            Language === "English" ? "text-white bg-slate-900/80" : "text-white/45 bg-slate-700/60"
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md`}
          onClick={() => setLanguage("English")}>
          English
        </button>
        <button
          className={`${
            Language === "Hindi" ? "text-white bg-slate-900/80" : "text-white/45 bg-slate-700/60"
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md`}
          onClick={() => setLanguage("Hindi")}>
          Hindi
        </button>
        <button
          className={`${
            Language === "English-Hindi" ? "text-white bg-slate-900/80" : "text-white/45 bg-slate-700/60"
          } py-4 px-10 text-4xl rounded-full transition-colors duration-500 backdrop-blur-md`}
          onClick={() => setLanguage("English-Hindi")}>
          English-Hindi
        </button>
      </div>
      
    </div>
  );
};

