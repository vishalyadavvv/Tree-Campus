import React, { useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";

export default function SyllabusSidebar({ syllabus, onSelectVideo }) {
  const [openSection, setOpenSection] = useState(0);

  const toggle = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="w-80 bg-white border-r h-screen overflow-y-auto p-4 sticky top-0">
      <h2 className="text-xl font-bold mb-4">Course Syllabus</h2>

      {syllabus.map((day, index) => (
        <div key={index} className="mb-4 border rounded-lg">
          <button
            className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
            onClick={() => toggle(index)}
          >
            <div>
              <p className="font-semibold">{day.day} — {day.title}</p>
              <p className="text-sm text-gray-600">{day.lessonsCount} Lessons</p>
            </div>
            <ChevronDown
              className={`transition-transform ${openSection === index ? "rotate-180" : ""}`}
            />
          </button>

          {openSection === index && (
            <div className="p-3 space-y-2">
              {day.items.map((lesson, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => lesson.videoId && onSelectVideo(lesson.videoId)}
                >
                  <PlayCircle size={18} />
                  <span className="text-sm">{lesson.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
