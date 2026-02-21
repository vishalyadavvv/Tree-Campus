import { useAITeacher } from "../../hooks/useAITeacher";
const teachers = ["Nanami", "Naoki"]; // Adding missing teachers constant if needed by the component's commented out section, but actually useAITeacher handles it

export const BoardSettings = ({ setShowPopup }) => {
  const Language = useAITeacher((state) => state.language); 
  const setLanguage = useAITeacher((state) => state.setLanguage);
  return (
    <div className="flex flex-col gap-2 pointer-events-auto items-end">
      <button
        className={`${
          Language === "English" ? "text-white bg-slate-900/80 border-blue-500" : "text-white/70 bg-gray-800/90 border-transparent"
        } py-2 px-4 text-sm md:text-base rounded-xl transition-all duration-300 backdrop-blur-md cursor-pointer border hover:bg-slate-700 shadow-xl`}
        onClick={(e) => { e.stopPropagation(); setLanguage("English"); }}>
        Eng
      </button>
      <button
        className={`${
          Language === "Hindi" ? "text-white bg-slate-900/80 border-blue-500" : "text-white/70 bg-gray-800/90 border-transparent"
        } py-2 px-4 text-sm md:text-base rounded-xl transition-all duration-300 backdrop-blur-md cursor-pointer border hover:bg-slate-700 shadow-xl`}
        onClick={(e) => { e.stopPropagation(); setLanguage("Hindi"); }}>
        Hin
      </button>
      <button
        className={`${
          Language === "English-Hindi" ? "text-white bg-slate-900/80 border-blue-500" : "text-white/70 bg-gray-800/90 border-transparent"
        } py-2 px-4 text-sm md:text-base rounded-xl transition-all duration-300 backdrop-blur-md cursor-pointer border hover:bg-slate-700 shadow-xl`}
        onClick={(e) => { e.stopPropagation(); setLanguage("English-Hindi"); }}>
        Eng-Hin
      </button>
    </div>
  );
};

