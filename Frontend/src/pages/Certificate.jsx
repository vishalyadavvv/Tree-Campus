import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiAward, FiDownload, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const Certificate = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCertificates();
    }, [user, navigate]);

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

            const cert = certificates.find(c => c._id === certId);
            if (!cert) {
                toast.error('Certificate not found');
                return;
            }

            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [842, 595] // Standard landscape letter size
            });

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

            // ─── NAME ────────────────────────────────────────────────────────────────
            // Based on the template, the name area should be between two lines
            // Top line at approximately 47% of height, bottom line at 57% of height
            const nameY = height * 0.52; // Midpoint between the two lines (centered)
            
            // White out the area where name goes
            doc.setFillColor(255, 255, 255);
            doc.rect(width * 0.25, nameY - 25, width * 0.5, 50, 'F');

            // Add horizontal lines (matching template)
            doc.setDrawColor(170, 170, 170);
            doc.setLineWidth(0.8);
            doc.line(width * 0.25, nameY - 12, width * 0.75, nameY - 12); // top line
            doc.line(width * 0.25, nameY + 12, width * 0.75, nameY + 12); // bottom line

            // Name text
            const name = cert.userName || user?.name || '';
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(26, 37, 47);
            doc.text(name, width / 2, nameY, { align: 'center', baseline: 'middle' });

            // ─── COURSE NAME ────────────────────────────────────────────────────────
            // Course name appears at approximately 63% of height
            const courseY = height * 0.63;
            
            const courseTitle = cert.courseId?.title || cert.courseTitle || 'Online English Speaking Course';
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(26, 37, 47);
            doc.text(courseTitle, width / 2, courseY, { align: 'center', baseline: 'middle' });

            // ─── DATE ────────────────────────────────────────────────────────────────
            // Date appears above the "DATE" label at approximately 14.5% from bottom
            const dateY = height * 0.855; // 100% - 14.5% = 85.5% from top
            
            // Clear area for date
            doc.setFillColor(255, 255, 255);
            doc.rect(width * 0.15, dateY - 10, width * 0.2, 20, 'F');

            const date = new Date(cert.issuedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(26, 37, 47);
            doc.text(date, width * 0.25, dateY, { align: 'center', baseline: 'middle' });

            // ─── CERTIFICATE ID ───────────────────────────────────────────────────────
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`ID: ${cert.certificateNumber}`, width - 20, height - 10, { align: 'right' });

            // Save
            const fileName = `Certificate-${(cert.userName || user?.name || 'User').replace(/\s+/g, '_')}-${cert.certificateNumber || 'cert'}.pdf`;
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
                                <style>{`
                                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
                                `}</style>

                                {/* Certificate Preview */}
                                <div
                                    className="relative w-full bg-white"
                                    style={{ aspectRatio: '842/595' }} // Match PDF dimensions
                                >
                                    {/* Background template */}
                                    <img
                                        src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765345196/certificate_treecampus_page-0001_z38eqj.jpg"
                                        alt="Certificate Template"
                                        className="absolute inset-0 w-full h-full object-contain"
                                        crossOrigin="anonymous"
                                    />

                                    {/* Name - centered between two lines */}
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2"
                                        style={{
                                            top: '52%', // Centered between the two lines
                                            width: '50%',
                                        }}
                                    >
                                        {/* White background to cover template text */}
                                        <div className="absolute inset-0 bg-white" style={{ 
                                            top: '-25px', 
                                            bottom: '-25px',
                                            left: '-10px',
                                            right: '-10px'
                                        }}></div>
                                        
                                        {/* Lines */}
                                        <div className="absolute w-full" style={{ top: '-12px' }}>
                                            <div className="h-[1.5px] bg-gray-300 w-full"></div>
                                        </div>
                                        <div className="absolute w-full" style={{ bottom: '-12px' }}>
                                            <div className="h-[1.5px] bg-gray-300 w-full"></div>
                                        </div>
                                        
                                        {/* Name text */}
                                        <p
                                            className="relative font-bold text-[#1a252f] text-center"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(16px, 3vw, 28px)',
                                                lineHeight: '1.2',
                                            }}
                                        >
                                            {cert.userName || user?.name || ''}
                                        </p>
                                    </div>

                                    {/* Course Name */}
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2"
                                        style={{
                                            top: '63%',
                                            width: '70%',
                                        }}
                                    >
                                        <p
                                            className="relative font-bold text-[#1a252f] text-center"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(12px, 2vw, 18px)',
                                            }}
                                        >
                                            {cert.courseId?.title || cert.courseTitle || 'Online English Speaking Course'}
                                        </p>
                                    </div>

                                    {/* Date */}
                                    <div
                                        className="absolute"
                                        style={{
                                            left: '25%',
                                            top: '85.5%',
                                            transform: 'translateX(-50%)',
                                            width: '20%',
                                        }}
                                    >
                                        {/* White background for date */}
                                        <div className="absolute inset-0 bg-white" style={{ 
                                            top: '-10px', 
                                            bottom: '-10px',
                                            left: '-5px',
                                            right: '-5px'
                                        }}></div>
                                        
                                        <p
                                            className="relative text-[#1a252f] text-center"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(9px, 1.2vw, 13px)',
                                            }}
                                        >
                                            {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    {/* Certificate ID */}
                                    <p 
                                        className="absolute text-gray-400 font-mono"
                                        style={{
                                            bottom: '10px',
                                            right: '20px',
                                            fontSize: 'clamp(8px, 0.9vw, 11px)',
                                            zIndex: 10,
                                        }}
                                    >
                                        ID: {cert.certificateNumber}
                                    </p>
                                </div>

                                {/* Hover overlay */}
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