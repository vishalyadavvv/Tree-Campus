import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  if (!course) return null; // Prevent rendering if course is undefined

  const levelColors = {
    alllevels:'bg-green-100 text-green-700',
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700'
  };

  const levelLabels = {
    alllevels:'All Levels',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100/50 overflow-hidden h-full">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course?.thumbnail || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400'}
          alt={course?.title || 'Course'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {course?.level && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
              {levelLabels[course.level] || course.level}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-[#FD5A00] text-white rounded-full text-xs font-semibold">
            {course?.price || 'Free'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#FD5A00] transition-colors">
          {course?.title || 'Untitled Course'}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">
          {course?.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-500 flex items-center">
            <svg className="w-3.5 h-3.5 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {(course?.enrollmentCount || course?.totalEnrollments || 0).toLocaleString()} students
          </span>
          <div className="flex items-center text-xs font-medium text-gray-500">
             <svg className="w-3.5 h-3.5 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course?.duration || 'N/A'}
          </div>
        </div>



        <Link
          to={`/courses/${course?._id}`}
          className="block w-full py-2.5 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white text-center rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-bold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Learning Free
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
