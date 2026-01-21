import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { useAITeacher } from "../../hooks/useAITeacher";
import { MessagesList } from "./MessagesList";
import { BoardSettings } from "./BoardSettings";

// Example item placement settings
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

export const ThreeScene = () => {
  const teacher = useAITeacher((state) => state.teacher);
  const classroom = useAITeacher((state) => state.classroom) || "default";

  return (
    <Canvas camera={{ position: [0, 0, 0.0001] }}>
      <CameraManager />
      <Suspense fallback={null}>
        <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
          <Html transform {...itemPlacement[classroom].board} distanceFactor={1}>
            {/* Render board UI components */}
            <MessagesList />
            <BoardSettings />
          </Html>
          <Environment preset="sunset" />
          <ambientLight intensity={0.8} color="pink" />
          <Gltf
            src={`/models/classroom_${classroom}.glb`}
            {...itemPlacement[classroom].classroom}
          />
          <Teacher
            teacher={teacher}
            key={teacher}
            {...itemPlacement[classroom].teacher}
            scale={1.5}
            rotation-y={degToRad(20)}
          />
        </Float>
      </Suspense>
      <Loader />
    </Canvas>
  );
};

// Optional: You can also extract CameraManager to a separate file
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

export default ThreeScene;
