import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ZoomMtgEmbedded from '@zoom/meetingsdk/dist/zoomus-websdk-embedded.umd.min.js';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './MeetingRoom.css';
import { Loader2, X } from 'lucide-react';

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
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        if (isMounted) setLoading(true);
        // 1. Get signature from backend
        const response = await api.post(`/live-classes/${id}/signature`, {
          role: 0 // Default to participant
        });

        const { signature, sdkKey, meetingNumber, password, userName } = response.data.data;

        // 2. Init SDK
        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        await client.init({
          zoomAppRoot: meetingContainerRef.current,
          language: 'en-US',
          patchJsMedia: true,
          leaveOnPageUnload: true
        });

        // Clean display name
        let displayName = userName || 'Student';
        displayName = displayName.replace(/[^\w\s-]/gi, '').trim() || 'Attendee';

        // 3. Join Meeting
        await client.join({
          signature,
          sdkKey,
          meetingNumber,
          password: password || '',
          userName: displayName,
          userEmail: '', // Optional
          tk: '' // Optional
        });

        if (isMounted) setLoading(false);
      } catch (error) {
        console.error('Zoom Error:', error);
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
        <h2 className="text-lg font-semibold text-orange-500">Tree Campus Live Session</h2>
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
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-white text-lg">Initializing Secure Meeting Container...</p>
          </div>
        )}
        <div 
          ref={meetingContainerRef} 
          className="w-full h-full"
          style={{ display: loading ? 'none' : 'block' }}
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
