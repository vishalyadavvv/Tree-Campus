// client/src/pages/Home.jsx
import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CourseOverview from '../components/home/CourseOverview';
import GamesSection from '../components/home/GamesSection';
import SpokeeSection from '../components/home/SpokeeSection';
// import DownloadApp from '../components/home/DownloadApp';
import Testimonials from '../components/home/Testimonials';
import Stats from '../components/home/Stats';
import DownloadApp from '../components/home/DownloadApp';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Stats />
      <DownloadApp />
      
      <Features />
      <CourseOverview />
      <GamesSection />
      <SpokeeSection />
      <Testimonials />
      
    </div>
  );
};

export default Home;