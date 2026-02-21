import { useEffect, useState } from 'react';
import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import GamesSection from '../components/home/GamesSection';
import SpokeeSection from '../components/home/SpokeeSection';
import Testimonials from '../components/home/Testimonials';
import Stats from '../components/home/Stats';
import DownloadApp from '../components/home/DownloadApp';
import CourseCard from '../components/courses/CourseCard';
import api from "../services/api";

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        console.log("Courses API Response: ", res.data);

        let coursesData = res.data.courses || res.data.data || res.data || [];
        
        if (Array.isArray(coursesData)) {
            coursesData = coursesData.sort((a, b) => a.title.localeCompare(b.title));
        }

        setCourses(coursesData);

      } catch (err) {
        console.log("Error fetching courses:", err);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <Stats />
      <DownloadApp />
      <Features />

      {/* Our Courses Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <div className="w-20 h-1.5 bg-[#FD5A00] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {courses?.length > 0 ? (
              courses.slice(0, 3).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No courses available at the moment.</p>
            )}
          </div>

          <div className="text-center">
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#FD5A00] text-white font-bold rounded-xl hover:bg-[#e55100] transition-all duration-300 shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5"
            >
              View All Courses
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <GamesSection />
      <SpokeeSection />
      <Testimonials />
    </div>
  );
};

export default Home;