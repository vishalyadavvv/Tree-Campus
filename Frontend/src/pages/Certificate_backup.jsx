import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiAward, FiDownload, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';

const Certificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
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

    const handleDownloadCertificate = async (certId) => {
        try {
            setDownloading(certId);
            
            // Find the certificate element by ID
            const certificateElement = document.getElementById(`certificate-${certId}`);
            
            if (!certificateElement) {
                toast.error('Certificate element not found');
                return;
            }

            // Use dom-to-image-more to capture the certificate (supports modern CSS)
            const dataUrl = await domtoimage.toPng(certificateElement, {
                quality: 1,
                bgcolor: '#ffffff',
                filter: (node) => {
                    // Filter out the hover overlay (has z-20 and backdrop-blur classes)
                    if (node.className && typeof node.className === 'string') {
                        return !(node.className.includes('z-20') && node.className.includes('backdrop-blur'));
                    }
                    return true;
                }
            });

            // Load the image to get its actual dimensions
            const img = new Image();
            img.src = dataUrl;
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });
            
            // Create PDF in landscape orientation with A4 size
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // A4 landscape dimensions in mm
            const pdfWidth = 297;
            const pdfHeight = 210;
            
            // Calculate dimensions to fit the certificate on the page with margins
            const margin = 10;
            const availableWidth = pdfWidth - (2 * margin);
            const availableHeight = pdfHeight - (2 * margin);
            
            // Calculate scaling to fit while maintaining aspect ratio
            const imgAspectRatio = img.width / img.height;
            const pageAspectRatio = availableWidth / availableHeight;
            
            let finalWidth, finalHeight, xOffset, yOffset;
            
            if (imgAspectRatio > pageAspectRatio) {
                // Image is wider - fit to width
                finalWidth = availableWidth;
                finalHeight = availableWidth / imgAspectRatio;
                xOffset = margin;
                yOffset = margin + (availableHeight - finalHeight) / 2;
            } else {
                // Image is taller - fit to height
                finalHeight = availableHeight;
                finalWidth = availableHeight * imgAspectRatio;
                xOffset = margin + (availableWidth - finalWidth) / 2;
                yOffset = margin;
            }
            
            pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
            
            // Get certificate data for filename
            const cert = certificates.find(c => c._id === certId);
            const fileName = `Certificate-${cert?.userName?.replace(/\s+/g, '_') || 'TreeCampus'}-${cert?.certificateNumber || 'cert'}.pdf`;
            
            // Download the PDF
            pdf.save(fileName);
            
            toast.success('Certificate downloaded successfully!');
        } catch (error) {
            console.error('Error downloading certificate:', error);
            toast.error('Failed to download certificate. Please try again.');
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
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
                        className="bg-[#115E59] text-white px-6 py-2 rounded-lg hover:bg-[#0F766E] transition-colors"
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
                                {/* Google Fonts for Professional Look */}
                                <style>
                                    {`
                                        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800&display=swap');
                                    `}
                                </style>

                                {/* Professional Certificate Container */}
                                <div id={`certificate-${cert._id}`} className="relative w-full aspect-[16/11] bg-gradient-to-br from-[#2c3e50] to-[#1a252f] overflow-hidden">
                                    
                                    {/* Top Orange Triangle */}
                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[120px] border-t-[#f59e0b] border-l-[120px] border-l-transparent z-10"></div>
                                    
                                    {/* Bottom Left Orange Curve */}
                                    <div className="absolute bottom-0 left-0 w-40 h-40 z-10">
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <path d="M 0 100 Q 50 50 100 100 L 0 100 Z" fill="#f59e0b"/>
                                        </svg>
                                    </div>
                                    
                                    {/* Main Curved White Area */}
                                    <div className="absolute inset-0 z-20">
                                        <svg viewBox="0 0 1000 700" className="w-full h-full" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" style={{stopColor: '#f8f9fa', stopOpacity: 1}} />
                                                    <stop offset="100%" style={{stopColor: '#e9ecef', stopOpacity: 1}} />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 50 80 Q 300 50 500 70 Q 700 50 950 80 L 950 550 Q 700 580 500 560 Q 300 580 50 550 Z" 
                                                  fill="url(#whiteGradient)" />
                                        </svg>
                                    </div>
                                    
                                    {/* Decorative Lines - Top Left */}
                                    <div className="absolute top-8 left-8 w-32 h-32 z-30 opacity-10">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="absolute h-px bg-gray-800" 
                                                 style={{
                                                     width: `${(12 - i) * 8}px`,
                                                     top: `${i * 3}px`,
                                                     transform: `rotate(-45deg)`
                                                 }}></div>
                                        ))}
                                    </div>
                                    
                                    {/* Decorative Lines - Bottom Right */}
                                    <div className="absolute bottom-8 right-8 w-32 h-32 z-30 opacity-10">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="absolute h-px bg-gray-800"
                                                 style={{
                                                     width: `${(12 - i) * 8}px`,
                                                     bottom: `${i * 3}px`,
                                                     right: 0,
                                                     transform: `rotate(-45deg)`
                                                 }}></div>
                                        ))}
                                    </div>
                                    
                                    {/* Top Right Logo Badge */}
                                    <div className="absolute top-12 right-12 z-40 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-[#f59e0b] flex items-center justify-center">
                                                <div className="w-20 h-28 bg-white rounded-lg flex items-center justify-center p-2 shadow-lg">
                                                    <img 
                                                        src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png" 
                                                        alt="Tree Campus"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Left Logo Badge */}
                                    <div className="absolute top-1/2 left-8 z-40 -translate-y-1/2">
                                        <div className="relative">
                                            <div className="w-28 h-28 rounded-full bg-[#f59e0b] flex items-center justify-center">
                                                <div className="w-24 h-32 bg-white rounded-lg flex items-center justify-center p-2 shadow-lg">
                                                    <img 
                                                        src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765170258/tree_logo_ek4uw3.png" 
                                                        alt="Tree Campus"
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Certificate Content */}
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-16">
                                        
                                        {/* Title */}
                                        <h1 className="text-7xl text-[#1a252f] mb-2" 
                                            style={{ fontFamily: "'Great Vibes', cursive" }}>
                                            Certificate
                                        </h1>
                                        
                                        <p className="text-lg font-bold text-[#1a252f] mb-8 tracking-wide"
                                           style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Of Achievement from Tree Campus Academy
                                        </p>
                                        
                                        {/* Yellow Ribbon */}
                                        <div className="relative mb-8">
                                            <svg width="500" height="60" viewBox="0 0 500 60">
                                                <defs>
                                                    <filter id="shadow">
                                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                                                    </filter>
                                                </defs>
                                                <path d="M 20 30 L 60 10 L 440 10 L 480 30 L 440 50 L 60 50 Z" 
                                                      fill="#f59e0b" filter="url(#shadow)"/>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <p className="text-base font-bold text-[#1a252f] tracking-wider"
                                                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    This Certificate is Proudly Presented to
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Recipient Name */}
                                        <div className="w-96 pb-2 mb-6">
                                            <h2 className="text-4xl font-bold text-[#1a252f] text-center"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                {cert.userName || 'Student Name'}
                                            </h2>
                                        </div>
                                        
                                        {/* Course Description */}
                                        <p className="text-lg font-bold text-[#1a252f] mb-8 text-center max-w-2xl"
                                           style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            has successfully completed 3 months Online English Speaking Course
                                        </p>
                                        
                                        {/* Footer: Date and Signature */}
                                        <div className="flex justify-center gap-32 w-full max-w-2xl">
                                            <div className="flex flex-col items-center">
                                                <div className="w-40 border-t-2 border-gray-400 pt-2">
                                                    <p className="text-sm font-medium text-[#1a252f] text-center"
                                                       style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                        {new Date(cert.issuedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest"
                                                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    DATE
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-col items-center">
                                                <div className="w-40 border-t-2 border-gray-400 pt-2 flex flex-col items-center">
                                                    <p className="text-2xl text-[#1a252f] mb-1" 
                                                       style={{ fontFamily: "'Great Vibes', cursive" }}>
                                                        Verified
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest"
                                                   style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                    SIGNATURE
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Certificate ID */}
                                        <p className="absolute bottom-4 right-4 text-xs text-gray-400 font-mono">
                                            ID: {cert.certificateNumber}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Overlay for Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm z-20">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDownloadCertificate(cert._id);
                                        }}
                                        disabled={downloading === cert._id}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloading === cert._id ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <FiDownload className="w-5 h-5 mr-2" />
                                                Download PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto border border-gray-100">
                        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiAward className="w-10 h-10 text-teal-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Complete courses and pass assessments to earn verified certificates. Start your learning journey today!
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
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