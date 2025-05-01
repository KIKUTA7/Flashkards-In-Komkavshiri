
import React, { useRef, useEffect } from 'react';
import { detectGesture } from '../utils/handGestureDetection';
import { Timer } from 'lucide-react';

interface CameraProps {
  onGestureDetected: (gesture: string | null) => void;
  isEnabled: boolean;
  cooldownActive?: boolean;
  cooldownSeconds?: number;
}

const Camera: React.FC<CameraProps> = ({ 
  onGestureDetected, 
  isEnabled, 
  cooldownActive = false,
  cooldownSeconds = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      if (!isEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: 640,
            height: 480,
            facingMode: 'user',
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || !videoRef.current) return;

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        detectGesture(videoRef.current, onGestureDetected);
      }
    }, 300); // Detect gesture every 300ms

    return () => clearInterval(interval);
  }, [isEnabled, onGestureDetected]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={isEnabled ? "w-64 h-48 fixed bottom-4 right-4 rounded-lg border-2 border-gray-400 bg-black" : "hidden"}
        style={{ zIndex: 50 }}
      />
      {cooldownActive && isEnabled && (
        <div className="fixed bottom-56 right-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-md flex items-center border border-amber-300">
          <Timer className="mr-2 h-4 w-4" />
          <span className="font-semibold">Waiting: {cooldownSeconds}s</span>
        </div>
      )}
    </div>
  );
};

export default Camera;
