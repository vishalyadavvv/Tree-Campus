import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext, useAuth } from '../context/AuthContext';
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
                format: [842, 595]
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
            // White out the original name area on the template
            doc.setFillColor(255, 255, 255);
            doc.rect(width / 2 - 200, height / 2 - 18, 400, 55, 'F');

            // Horizontal lines framing the name
            doc.setDrawColor(170, 170, 170);
            doc.setLineWidth(0.8);
            doc.line(width / 2 - 200, height / 2 - 10, width / 2 + 200, height / 2 - 10); // top
            doc.line(width / 2 - 200, height / 2 + 36, width / 2 + 200, height / 2 + 36); // bottom

            // Name text — perfectly centered between the two lines
            const name = cert.userName || user?.name || '';
            doc.setFontSize(28);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(26, 37, 47);
            // Vertical center between top line (h/2 - 10) and bottom line (h/2 + 36) → midpoint = h/2 + 13
            doc.text(name, width / 2, height / 2 + 18, { align: 'center', baseline: 'middle' });

            // ─── DATE ────────────────────────────────────────────────────────────────
            // The DATE label on the template is at approx x=225 (26% from left), y≈505 (85% from top on 595h)
            // Cover old date if any
            doc.setFillColor(255, 255, 255);
            doc.rect(140, height - 115, 180, 20, 'F');

            const date = new Date(cert.issuedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(26, 37, 47);
            // Place date centered over the DATE label line (~x=225, y=height-100)
            doc.text(date, 225, height - 103, { align: 'center' });

            // ─── CERTIFICATE ID ───────────────────────────────────────────────────────
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`ID: ${cert.certificateNumber}`, width - 20, height - 8, { align: 'right' });

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

                                {/* ── Certificate Preview ── */}
                                <div
                                    id={`certificate-${cert._id}`}
                                    className="relative w-full bg-white"
                                    style={{ aspectRatio: '1000/707' }}
                                >
                                    {/* Background template */}
                                    <img
                                        src="https://res.cloudinary.com/dbbll23jz/image/upload/v1765345196/certificate_treecampus_page-0001_z38eqj.jpg"
                                        alt="Certificate Template"
                                        className="absolute inset-0 w-full h-full object-contain"
                                        crossOrigin="anonymous"
                                    />

                                    {/* ── NAME — perfectly centered between the two horizontal lines ── */}
                                    {/*
                                        The template's two lines sit at roughly 47% and 57% of the height.
                                        Mid-point ≈ 52%. We use flexbox so the text is always centred
                                        vertically AND horizontally regardless of length.
                                    */}
                                    <div
                                        className="absolute"
                                        style={{
                                            top: '47%',
                                            left: '50%',
                                            transform: 'translate(-50%, 0)',
                                            width: '58%',
                                            borderTop: '1.5px solid #aaaaaa',
                                            borderBottom: '1.5px solid #aaaaaa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1.2% 0',
                                        }}
                                    >
                                        <p
                                            className="font-bold text-[#1a252f] text-center leading-tight"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(14px, 2.6vw, 26px)',
                                                margin: 0,
                                            }}
                                        >
                                            {cert.userName || user?.name || ''}
                                        </p>
                                    </div>

                                    {/* ── COURSE NAME ── */}
                                    <div
                                        className="absolute"
                                        style={{
                                            top: '63%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '70%',
                                        }}
                                    >
                                        <p
                                            className="font-bold text-[#1a252f] text-center"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(10px, 1.6vw, 17px)',
                                            }}
                                        >
                                            {cert.courseId?.title || cert.courseTitle || 'Online English Speaking Course'}
                                        </p>
                                    </div>

                                    {/* ── DATE — placed directly above the "DATE" label line ── */}
                                    {/*
                                        The DATE label is at roughly left=23%, bottom=14% of the card.
                                        We position our text just above it so it sits ON the underline.
                                    */}
                                    <div
                                        className="absolute"
                                        style={{
                                            bottom: '14.5%',
                                            left: '23%',
                                            transform: 'translateX(-50%)',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <p
                                            className="font-medium text-[#1a252f]"
                                            style={{
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontSize: 'clamp(8px, 1.1vw, 12px)',
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
                                    <p className="absolute bottom-1 right-3 text-xs text-gray-400 font-mono"
                                       style={{ fontSize: 'clamp(6px, 0.7vw, 9px)' }}>
                                        ID: {cert.certificateNumber}
                                    </p>
                                </div>

                                {/* ── Hover overlay ── */}
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