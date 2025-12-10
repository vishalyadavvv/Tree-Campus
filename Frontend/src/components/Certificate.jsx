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
            
            // Get certificate data
            const cert = certificates.find(c => c._id === certId);
            
            if (!cert) {
                toast.error('Certificate not found');
                return;
            }

            // Create PDF
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [842, 595]
            });

            // Load certificate template image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = 'https://res.cloudinary.com/dbbll23jz/image/upload/v1765345196/certificate_treecampus_page-0001_z38eqj.jpg';
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();

            // Add template image
            doc.addImage(img, 'JPEG', 0, 0, width, height);

            // Configure text styles
            doc.setTextColor(26, 37, 47); // Dark color matching template
            
            // Student Name
            doc.setFontSize(32);
            doc.setFont('helvetica', 'bold');
            const name = cert.userName || 'Student Name';
            doc.text(name, width / 2, height / 2 + 10, { align: 'center' });

            // Course Name
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            const courseName = cert.courseId?.title || cert.courseTitle || 'Course';
            doc.text(courseName, width / 2, height / 2 + 65, { align: 'center' });
            
            // Date
            const date = new Date(cert.issuedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(date, 225, height - 90);

            // Certificate ID (small text bottom right)
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`ID: ${cert.certificateNumber}`, width - 120, height - 15);

            // Download
            const fileName = `Certificate-${cert.userName?.replace(/\s+/g, '_') || 'TreeCampus'}-${cert.certificateNumber || 'cert'}.pdf`;
            doc.save(fileName);
            
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
                                {/* Google Fonts for Professional Look */}
                                <style>
                                    {`
                                        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800&display=swap');
                                    `}
                                </style>

                                {/* Professional Certificate with Template Image */}
                                <div id={`certificate-${cert._id}`} className="relative w-full bg-white" style={{ aspectRatio: '1000/700' }}>
                                    
                                    {/* Certificate Template Background Image */}
                                    <img 
                                        src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765345196/certificate_treecampus_page-0001_z38eqj.jpg"
                                        alt="Certificate Template"
                                        className="absolute inset-0 w-full h-full object-contain"
                                        crossOrigin="anonymous"
                                    />
                                    
                                    {/* Text Overlays */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '5%' }}>
                                        
                                        {/* Student Name - Positioned in the blank line area */}
                                        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%' }}>
                                            <h2 className="text-xl font-bold text-[#1a252f] text-center border-b-2 border-gray-400 pb-2"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                {cert.userName || 'Student Name'}
                                            </h2>
                                        </div>
                                        
                                        {/* Course Name - Below the "3 months" text */}
                                        <div className="absolute" style={{ top: '68%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }}>
                                            <p className=" font-bold text-[#1a252f] text-center"
                                               style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                {cert.courseId?.title || cert.courseTitle || 'Online English Speaking Course'}
                                            </p>
                                        </div>
                                        
                                        {/* Date - Bottom Left */}
                                        <div className="absolute" style={{ bottom: '15%', left: '27%' }}>
                                            <p className="text-base font-medium text-[#1a252f] text-center"
                                               style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                                {new Date(cert.issuedAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                        
                                        {/* Certificate ID - Small text at bottom */}
                                        <p className="absolute bottom-2 right-4 text-xs text-gray-500 font-mono">
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
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-full transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
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