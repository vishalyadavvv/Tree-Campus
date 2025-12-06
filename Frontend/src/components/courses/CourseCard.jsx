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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative">
        <img
          src={course?.thumbnail || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400'}
          alt={course?.title || 'Course'}
          className="w-full h-48 object-cover"
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

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {course?.title || 'Untitled Course'}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {course?.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-gray-700 font-semibold">
              {course?.rating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {(course?.enrollmentCount || course?.totalEnrollments || 0).toLocaleString()} students
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{course?.totalLessons || course?.lessons || 0} lessons</span>
          <span>{course?.duration || 'N/A'}</span>
        </div>

        {course?.features?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-orange-50 text-[#FD5A00] rounded-lg text-xs font-medium border border-orange-100"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/courses/${course?._id}`}
          className="block w-full py-3 bg-gradient-to-r from-[#FD5A00] to-orange-500 text-white text-center rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
