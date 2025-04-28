
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, SwitchCamera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: string) => void;
}

export function CameraView({ isOpen, onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Check for multiple cameras when component mounts
  useEffect(() => {
    async function checkCameraCount() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (err) {
        console.error("Error checking camera count:", err);
      }
    }
    
    checkCameraCount();
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera not supported in this browser.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First try the preferred facing mode
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err);
          });
          setIsLoading(false);
        };
      }
      
      toast({
        title: "Camera access granted",
        description: "You can now capture your bill.",
      });
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      // Try with a more generic constraint if the specific one failed
      if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(e => console.error("Error playing video:", e));
              setIsLoading(false);
            };
          }
          
          toast({
            title: "Camera access granted",
            description: "Using default camera settings.",
          });
          return;
        } catch (fallbackErr) {
          console.error("Fallback camera access failed:", fallbackErr);
        }
      }

      let errorMessage = "Could not access camera.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera is in use by another application.";
      } else if (err.name === "SecurityError") {
        errorMessage = "Camera access blocked due to security restrictions.";
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    onCapture(imageData);
    onClose();
    
    toast({
      title: "Image captured",
      description: "Processing your bill...",
    });
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-center text-slate-600">Initializing camera...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 flex items-center gap-2 py-6">
              <CameraOff className="h-6 w-6" />
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="relative w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  {hasMultipleCameras && (
                    <Button
                      onClick={switchCamera}
                      variant="secondary"
                      className="mr-2"
                    >
                      <SwitchCamera className="h-4 w-4 mr-1" />
                      Switch Camera
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-slate-500 mb-2 mt-1">
                Position your bill clearly in the frame
              </div>
              <Button 
                onClick={handleCapture}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture Bill
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
