// client/src/pages/CoursePlayer.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"

const SidebarLesson = ({ lesson, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
      active ? "bg-[#FFF2E8] border-l-4 border-[#FD5A00]" : "hover:bg-gray-50"
    }`}
  >
    <div className="text-sm font-medium text-gray-800">{lesson.title}</div>
  </button>
);

export default function CoursePlayer() {
  const { courseId, dayIndex: dayIndexParam, lessonIndex: lessonIndexParam } = useParams();
  const navigate = useNavigate();

  // If URL provides indices, use them; else default to first lesson
  const dayIndexInit = dayIndexParam ? parseInt(dayIndexParam, 10) : 0;
  const lessonIndexInit = lessonIndexParam ? parseInt(lessonIndexParam, 10) : 0;

  const [dayIndex, setDayIndex] = useState(dayIndexInit);
  const [lessonIndex, setLessonIndex] = useState(lessonIndexInit);

  useEffect(() => {
    // keep url in sync so user can bookmark
    navigate(
      `/course/${courseId || "default"}/player/${dayIndex}/${lessonIndex}`,
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIndex, lessonIndex]);

  const selectedSection = fullSyllabus[dayIndex];
  const selectedLesson = selectedSection?.lessons[lessonIndex] || { title: "No lesson", url: "" };

  // If lesson has no url, show a friendly placeholder
  const iframeSrc = selectedLesson.url && selectedLesson.url.length > 0
    ? selectedLesson.url
    : "https://www.youtube.com/embed/dQw4w9WgXcQ"; // placeholder - replace with real embed links

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-6 bg-white rounded-2xl shadow-md p-4 max-h-[80vh] overflow-auto">
              <div className="mb-4">
                <h3 className="text-lg font-bold">Course Curriculum</h3>
                <p className="text-sm text-gray-500">30 sections • 148 lessons</p>
              </div>

              <div>
                {fullSyllabus.map((section, sIdx) => (
                  <div key={sIdx} className="mb-3">
                    <div className="flex justify-between items-center px-2">
                      <div className="text-sm font-semibold text-gray-700">
                        {section.day}. {section.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {section.lessons.length}
                      </div>
                    </div>

                    <div className="mt-2 space-y-1 px-2">
                      {section.lessons.map((lesson, lIdx) => {
                        const isActive = sIdx === dayIndex && lIdx === lessonIndex;
                        return (
                          <SidebarLesson
                            key={lIdx}
                            lesson={lesson}
                            active={isActive}
                            onClick={() => {
                              setDayIndex(sIdx);
                              setLessonIndex(lIdx);
                              // navigate to URL with indices (this also updates browser history)
                              navigate(`/course/${courseId || "default"}/player/${sIdx}/${lIdx}`);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </aside>

          {/* PLAYER + DETAILS */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-3">{selectedLesson.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedSection?.label} • Lesson {lessonIndex + 1} of {selectedSection?.lessons.length}
              </p>

              {/* Responsive player */}
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  title={selectedLesson.title}
                  src={iframeSrc}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Lesson description or placeholder */}
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  This lesson is part of <strong>{selectedSection?.title}</strong>. Add lesson-specific notes or transcript here.
                </p>
              </div>

              {/* Simple next / prev controls */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    if (lessonIndex > 0) {
                      setLessonIndex(lessonIndex - 1);
                    } else if (dayIndex > 0) {
                      const prevDay = dayIndex - 1;
                      setDayIndex(prevDay);
                      setLessonIndex(fullSyllabus[prevDay].lessons.length - 1);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (lessonIndex < (selectedSection.lessons.length - 1)) {
                      setLessonIndex(lessonIndex + 1);
                    } else if (dayIndex < fullSyllabus.length - 1) {
                      const nextDay = dayIndex + 1;
                      setDayIndex(nextDay);
                      setLessonIndex(0);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-[#FD5A00] text-white hover:opacity-90"
                >
                  Next
                </button>

                <Link to={`/course/${courseId || "default"}`} className="ml-auto text-sm text-gray-500 hover:underline">
                  Back to course
                </Link>
              </div>
            </div>

            {/* Optional transcript / resources */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
              <h4 className="font-semibold mb-3">Resources</h4>
              <p className="text-sm text-gray-600">Add links, attachments or quiz links for this lesson here.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
