import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiAward, FiDownload, FiArrowRight, FiBookOpen } from 'react-icons/fi';

const Certificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates');
            if (response.data.success) {
                setCertificates(response.data.data);
            } else {
                setError('Failed to fetch certificates');
            }
        } catch (err) {
            console.error('Error fetching certificates:', err);
            setError(err.response?.data?.message || 'Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchCertificates}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                        <p className="mt-2 text-gray-600">View and download your earned certificates</p>
                    </div>
                </div>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {certificates.map((cert) => (
                            <div 
                                key={cert._id} 
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden"
                            >
                                {/* Google Font for Script */}
                                <style>
                                    {`
                                        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap');
                                    `}
                                </style>

                                {/* Certificate Container */}
                                <div className="relative p-8 h-full min-h-[450px] flex flex-col items-center text-center bg-white border border-gray-200">
                                    
                                    {/* Decorative Background Elements (Corners) */}
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#1a2b3c] rounded-br-[100px] z-0"></div>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#1a2b3c] rounded-bl-[100px] z-0">
                                        <div className="absolute top-0 right-0 w-36 h-36 bg-[#fbbf24] rounded-bl-[90px] opacity-20"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#fbbf24] rounded-tr-[80px] z-0">
                                         <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#1a2b3c] rounded-tr-[70px]"></div>
                                    </div>
                                    
                                    {/* Wavy Lines Pattern (SVG) */}
                                    <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
                                         <svg width="100%" height="100%">
                                            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <circle cx="2" cy="2" r="1" className="text-gray-900" fill="currentColor" />
                                            </pattern>
                                            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                                        </svg>
                                    </div>

                                    {/* Logo */}
                                    <div className="absolute top-4 right-4 z-10 w-16 md:w-20">
                                        <img 
                                            src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png" 
                                            alt="Tree Campus Logo" 
                                            className="w-full h-auto drop-shadow-md"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 w-full flex-1 flex flex-col items-center mt-4">
                                        
                                        {/* Header */}
                                        <h1 className="text-5xl md:text-6xl text-[#1a2b3c] mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
                                            Certificate
                                        </h1>
                                        <p className="text-[#1a2b3c] font-semibold text-sm md:text-base uppercase tracking-wider mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Of Achievement from Tree Campus Academy
                                        </p>

                                        {/* Ribbon Banner */}
                                        <div className="relative bg-[#fbbf24] text-[#1a2b3c] py-2 px-8 mb-8 shadow-md transform -skew-x-12">
                                            <p className="font-bold text-xs md:text-sm uppercase tracking-wide transform skew-x-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                This Certificate is Proudly Presented to
                                            </p>
                                            {/* Ribbon Ends (Pseudo-elements simulation) */}
                                            <div className="absolute top-0 left-0 -ml-4 h-full w-4 bg-[#d97706] transform skew-y-12 origin-bottom-right z-[-1]"></div>
                                            <div className="absolute top-0 right-0 -mr-4 h-full w-4 bg-[#d97706] transform -skew-y-12 origin-bottom-left z-[-1]"></div>
                                        </div>

                                        {/* Recipient Name */}
                                        <h2 className="text-3xl md:text-4xl font-bold text-[#d97706] mb-6 border-b-2 border-gray-300 pb-2 px-8 min-w-[60%]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            {cert.userName || 'Student Name'}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-gray-600 content-center text-sm md:text-base mb-2 max-w-md mx-auto leading-relaxed">
                                            has successfully completed the
                                        </p>
                                        <h3 className="text-xl font-bold text-[#1a2b3c] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            {cert.courseId?.title || cert.courseTitle || 'Online English Speaking Course'}
                                        </h3>

                                        {/* Footer: Date & Signature */}
                                        <div className="mt-auto w-full flex justify-between items-end px-8 md:px-12 pb-4">
                                            <div className="text-center">
                                                <p className="text-[#1a2b3c] font-medium border-t border-gray-400 pt-1 px-4 text-sm min-w-[100px]">
                                                    {new Date(cert.issuedAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Date</p>
                                            </div>

                                            <div className="text-center">
                                                {/* Mock Signature */}
                                                <div className="h-8 mb-1 overflow-hidden relative" style={{ minWidth: '120px' }}>
                                                    <span className="text-2xl text-[#1a2b3c] opacity-80" style={{ fontFamily: "'Great Vibes', cursive" }}>Verified</span>
                                                </div>
                                                <p className="text-[#1a2b3c] font-medium border-t border-gray-400 pt-1 px-4 text-sm min-w-[100px]">
                                                    Tree Campus
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Signature</p>
                                            </div>
                                        </div>
                                        
                                        {/* Small ID at bottom */}
                                        <div className="absolute bottom-2 left-0 w-full text-center">
                                            <p className="text-[8px] text-gray-300 font-mono">ID: {cert.certificateNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Overlay for Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm z-20">
                                    <a 
                                        href={cert.certificateUrl || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                    >
                                        <FiDownload className="w-5 h-5 mr-2" />
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto border border-gray-100">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAward className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Complete courses and pass assessments to earn verified certificates. Start your learning journey today!
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            <FiBookOpen className="w-5 h-5 mr-2" />
                            Browse Courses
                            <FiArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificate;
