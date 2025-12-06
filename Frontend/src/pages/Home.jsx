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

      <div className="mt-10 px-4">
  <h2 className="text-2xl font-bold mb-5">Our Courses</h2>

  <div className="grid md:grid-cols-3 gap-6">
    {courses?.length > 0 ? (
      courses.slice(0, 3).map((course) => (
        <CourseCard key={course._id} course={course} />
      ))
    ) : (
      <p>No courses available</p>
    )}
  </div>

  {/* ⭐ View All Courses Button (Place Here) */}
  <div className="text-center mt-6">
    <a
      href="/courses"
      className="px-6 py-3 bg-[#FD5A00] text-white rounded-lg hover:bg-blue-700 transition"
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
