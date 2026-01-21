"use client"; 

import { useAITeacher } from "../../hooks/useAITeacher";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, button, useControls } from "leva";
import { Suspense, useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { BoardSettings } from "./BoardSettings";
import { MessagesList } from "./MessagesList";
import { Teacher } from "./Teacher";
import { TypingBox } from "./TypingBox";
import { useNavigate } from "react-router-dom";

const itemPlacement = {
  default: {
    classroom: {
      position: [0.2, -1.8, -2],
    },
    teacher: {
      position: [-1, -1.8, -3],
    },
    board: {
      position: [0.45, 0.3, -6],
    },
  },
};

export const Experience = () => {
  const teacher = useAITeacher((state) => state.teacher);
  const askAI = useAITeacher((state) => state.askAI);
  const classroom = useAITeacher((state) => state.classroom);
  const [showTypingField, setShowTypingField] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

const handleBack = () => {
    useAITeacher.getState().reset(); // Clear chat state for fresh start
    sessionStorage.removeItem("greetingSent");
    navigate("/dashboard");
  };

  // Auto-greeting removed to prevent unsolicited AI responses.


  return (
    <div className="relative w-full h-full"> 
      <div className="z-10 absolute bottom-24 w-full flex justify-center pointer-events-none">
        <TypingBox
          showTypingField={showTypingField}
        />
      </div>

      {/* Settings Toggle Button */}
      <button
        className="absolute top-35 right-4 md:right-8 p-2 md:p-3 bg-gray-800/90 text-white rounded-xl shadow-2xl z-[70] backdrop-blur-md border border-white/20 hover:bg-gray-700 hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
        onClick={() => setShowPopup(true)}
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="md:w-7 md:h-7 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

{/* Popup Modal */}
{showPopup && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-lg z-[100]">
    <div
      className="relative bg-white/10 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl 
      w-96 md:w-[28rem] text-center border border-white/20"
    >
       {/* Close Button */}
       <button
        className="absolute top-3 right-3 text-white text-2xl font-bold 
        hover:text-red-500 transition-colors duration-300 
        bg-transparent p-0 border-none cursor-pointer hover:bg-transparent"
        onClick={() => setShowPopup(false)}
      >
        ✖
      </button>

      {/* Toggle Section */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b-[5px] border-blue-500 pb-3">
        <span className="text-lg font-semibold text-white">Enable Input Field</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={showTypingField}
            onChange={() => setShowTypingField(!showTypingField)}
          />
          <div
            className={`w-14 h-8 rounded-full transition-all duration-300 ${
              showTypingField ? "bg-green-400" : "bg-gray-500"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${
                showTypingField ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
          <span
            className={`ml-2 text-sm font-semibold ${
              showTypingField ? "text-green-400" : "text-gray-400"
            }`}
          >
            {showTypingField ? "On" : "Off"}
          </span>
        </label>
      </div>

      {/* Exit Button */}
      <button
        className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-700 
        transition-all duration-300 w-full shadow-md text-lg"
        onClick={handleBack}
      >
        Exit
      </button>
    </div>
  </div>
)}





      
      {/* Show the Leva panel here */}
      <Leva hidden />
      
      {/* Only render Loader on client to avoid hydration mismatch */}
      {mounted && <Loader />}
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
        }}
      >
        <CameraManager />

        <Suspense>
          <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
            <Html
              transform
              {...itemPlacement[classroom].board}
              distanceFactor={1}
            >
              {!showPopup && (
                <>
                <MessagesList />
                <BoardSettings setShowPopup={setShowPopup} />
                </>
              )}
              
            </Html>
            <Environment preset="sunset" />
            <ambientLight intensity={0.8} color="pink" />

            <Gltf
              src={`/models/classroom_${classroom}.glb`}
              {...itemPlacement[classroom].classroom}
            />
            <Teacher
              key={teacher}
              {...itemPlacement[classroom].teacher}
              scale={1.5}
              rotation-y={degToRad(20)}
            />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

const CAMERA_POSITIONS = {
  default: [0, 6.123233995736766e-21, 0.0001],
  loading: [
    0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058,
  ],
  speaking: [0, -1.6481333940859815e-7, 0.00009999846226827279],

  mobileDefault: [0.0000036891791593946404, 0.0000039337346866935065, 0.00009985447255153167],
};

const CAMERA_ZOOMS = {
  default: 1.5,
  loading: 1.8,
  speaking: 2.1204819420055387,

   // Mobile Default Zoom
   mobileDefault: 0.6239784084873344,
};
 
const CameraManager = () => {
  const controls = useRef();
  const loading = useAITeacher((state) => state.loading);
  const currentMessage = useAITeacher((state) => state.currentMessage);

  const [isMobile, setIsMobile] = useState(false);
  const [cameraData, setCameraData] = useState({ position: [], zoom: 1 });

  useEffect(() => {
    // Detect if the screen size is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this width for mobile breakpoint
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (controls.current) {
      // Adjust camera position for mobile screens
      if (isMobile) {
        controls.current.camera.position.set(-4, 3, 5); 
        controls.current?.setPosition(...CAMERA_POSITIONS.mobileDefault, true);
        controls.current.camera.fov = 60; // Wider FOV for mobile
        // Set zoom levels for mobile
        controls.current.minZoom = 0.6; // Closer zoom on mobile
        controls.current.maxZoom = 2;
        controls.current.zoomTo(CAMERA_ZOOMS.mobileDefault);
      } else {
        controls.current.camera.position.set(0, 3, 5); // Adjusted for desktop view
        controls.current.camera.fov = 60; // Default field of view for desktop
        // Set zoom levels for desktop
        controls.current.zoomTo(CAMERA_ZOOMS.default);

        controls.current.minZoom = 1;
        controls.current.maxZoom = 3;
      }
      controls.current.update();
    }
  }, [isMobile]);

  useEffect(() => {
    if (loading) {
      if (isMobile) {
        controls.current?.setPosition(0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058, true);
        controls.current?.zoomTo(1.3560873957863966, true);
      } else {
        controls.current?.setPosition(...CAMERA_POSITIONS.loading, true);
        controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
      }
    } else if (currentMessage) {
      if (isMobile) {
        controls.current?.setPosition(0.0000036891791593946404,0.0000039337346866935065,0.00009985447255153167, true);
        controls.current?.zoomTo(0.6239784084873344, true);
      } else {
        controls.current?.setPosition(...CAMERA_POSITIONS.speaking, true);
        controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
      }
    }
  }, [loading]);

  useEffect(() => {
    // Update the cameraData whenever the controls change
    if (controls.current) {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      setCameraData({ position: [...position], zoom });
    }
  }, []);

  // Handle clicking the button to log camera position
  const handleGetCameraPosition = () => {
    if (controls.current) {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      console.log("Camera Position:", position);
      console.log("Camera Zoom:", zoom);
    }
  };

  useControls("Camera Settings", {
    getCameraPosition: button(handleGetCameraPosition),
  });

  return (
    <CameraControls
      ref={controls}
      minZoom={isMobile ? 0.6 : 1} // Default zoom for mobile will be 0.7, else 1 for desktop
      maxZoom={isMobile ? 2 : 3}
      polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      mouseButtons={{
        left: 1, // ACTION.ROTATE
        wheel: 16, // ACTION.ZOOM
      }}
      touches={{
        one: 32, // ACTION.TOUCH_ROTATE
        two: 512, // ACTION.TOUCH_ZOOM
      }}
    />
  );
};

// Preload the GLTF model
useGLTF.preload("/models/classroom_default.glb");
