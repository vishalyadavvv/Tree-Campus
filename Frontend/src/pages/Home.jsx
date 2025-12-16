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

        setCourses(res.data.courses || res.data.data || res.data || []);

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
      <div className="text-center mb-12">
        <div className="mb-8">
          <h2 className="inline-block px-12 py-5 bg-[#FD5A00] text-white font-semibold rounded-lg hover:bg-[#e55100] transition-colors duration-200">
            Our Courses
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {courses?.length > 0 ? (
            courses.slice(0, 3).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No courses available</p>
          )}
        </div>

        {/* View All Courses Button */}
        <div className="text-center">
          <a
            href="/courses"
            className="inline-block px-8 py-3 bg-[#FD5A00] text-white font-semibold rounded-lg hover:bg-[#e55100] transition-colors duration-200"
          >
            View All Courses
          </a>
        </div>
      </div>

      <GamesSection />
      <SpokeeSection />
      <Testimonials />
    </div>
  );
};

export default Home;