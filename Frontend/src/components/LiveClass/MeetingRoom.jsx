import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './MeetingRoom.css';
import { Loader2, X } from 'lucide-react';

// Zoom SDK Required CSS
import '@zoom/meetingsdk/dist/css/react-select.css';

const MeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meetingContainerRef = useRef(null);
  const clientRef = useRef(null);
  const isInitialized = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initMeeting = async () => {
      console.log('🚀 initMeeting started. ID:', id);
      console.log('🔍 window.ReactDOM test:', window.ReactDOM?.version, 'createRoot:', !!window.ReactDOM?.createRoot);
      
      if (isInitialized.current) return;
      isInitialized.current = true;

      // Safety timeout: If loading for more than 15 seconds, force show the container
      const timeoutId = setTimeout(() => {
        if (loading && isMounted) {
          console.warn('⚠️ Meeting initialization TIMEOUT reached (15s)');
          setLoading(false); // Force hide the loader
          toast.error('Connect taking too long. Attempting to show meeting regardless...');
        }
      }, 15000);

      try {
        if (isMounted) setLoading(true);
        
        console.log('⏳ Fetching signature from backend...');
        const response = await api.post(`/live-classes/${id}/signature`, {
          role: 0
        });
        console.log('✅ Signature received:', response.data.data.meetingNumber);

        const { signature, sdkKey, meetingNumber, password, userName } = response.data.data;

        console.log('⏳ Calling ZoomMtgEmbedded.createClient()...');
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        console.log('⏳ Calling client.init()...');
        await client.init({
          zoomAppRoot: meetingContainerRef.current,
          language: 'en-US',
          patchJsMedia: true,
          leaveOnPageUnload: true
        });
        console.log('✅ client.init() SUCCESS');

        // FORCE loader to hide here so Zoom can render its internal UI
        // Some Zoom SDK versions hang in join() if the container is hidden/opacity 0
        if (isMounted) {
            console.log('🏁 Early loader exit after init SUCCESS');
            setLoading(false);
        }

        let displayName = userName || 'Student';
        displayName = displayName.replace(/[^\w\s-]/gi, '').trim() || 'Attendee';

        console.log('⏳ Calling client.join() as:', displayName);
        await client.join({
          signature,
          sdkKey,
          meetingNumber,
          password: password || '',
          userName: displayName,
          userEmail: '',
          tk: ''
        });
        console.log('✅ client.join() SUCCESS');

        clearTimeout(timeoutId);
        // Ensure loader is definitely off
        if (isMounted) setLoading(false);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Zoom SDK Error:', error);
        if (isMounted) {
          toast.error(error.message || 'Failed to join meeting');
          navigate('/live-classes');
        }
      }
    };

    if (id) {
      initMeeting();
    }

    return () => {
      isMounted = false;
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      }
    };
  }, [id, navigate]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col meeting-room-wrapper">
      {/* Header */}
      <div className="p-4 bg-gray-900 flex justify-between items-center text-white">
        <h2 className="text-lg font-semibold text-teal-500">Tree Campus Live Session</h2>
        <button 
          onClick={() => navigate('/live-classes')}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          title="Exit Meeting"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Meeting Container */}
      <div className="flex-1 w-full bg-black relative meeting-room-container">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-[10000]">
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
            <p className="text-white text-lg">Initializing Secure Meeting Container...</p>
          </div>
        )}
        <div 
          ref={meetingContainerRef} 
          className="w-full h-full"
        />
      </div>
      
      {/* Footer Info */}
      {!loading && (
        <div className="p-2 bg-gray-900 text-center text-xs text-gray-500">
          Powered by Tree Campus Secure Meeting Integration
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
