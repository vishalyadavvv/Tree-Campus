import React from 'react';
import { Link } from 'react-router-dom';

const CourseProgress = ({ courses }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Enrolled Courses</h3>
        <span className="text-sm text-[#FD5A00] font-semibold">
          {courses.length} courses
        </span>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 hover:border-[#FD5A00]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 text-lg">{course.title}</h4>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                {course.completedLessons}/{course.totalLessons} lessons
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-[#FD5A00]">{course.progress}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#FD5A00] to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Last active: {course.lastActive}
              </span>
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white rounded-lg hover:from-orange-600 hover:to-orange-600 transition-all duration-300 font-semibold text-sm transform hover:scale-105"
              >
                Continue
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseProgress;