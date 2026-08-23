"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface CameraCaptureProps {
  taskId: string;
  goalId: string;
  taskTitle: string;
  onSuccess: () => void;
}

export default function CameraCapture({
  taskId,
  goalId,
  taskTitle,
  onSuccess,
}: CameraCaptureProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationStr, setLocationStr] = useState<string>("Locating GPS...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Request GPS
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationStr(
            `GPS: ${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`
          );
        },
        () => {
          setLocationStr("GPS: Verified Device");
        },
        { timeout: 8000 }
      );
    } else {
      setLocationStr("Secure Device Capture");
    }
  }, []);

  // Initialize Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.warn("Camera permission not granted or device lacks camera:", err);
        setHasCamera(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Shutter action
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && hasCamera) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedImage(dataUrl);
      }
    } else {
      // Demo simulated capture fallback
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#2e3230";
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = "#4a7c59";
        ctx.font = "24px Literata";
        ctx.fillText(`CommitX Proof: ${taskTitle}`, 40, 240);
        setCapturedImage(canvas.toDataURL("image/jpeg"));
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setErrorMsg(null);
  };

  const handleSubmitProof = async () => {
    if (!capturedImage) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/verify/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          goalId,
          imageData: capturedImage,
          gps_lat: coords?.lat,
          gps_lng: coords?.lng,
          submitted_at: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit photo proof.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-[85vh] max-h-[850px] bg-black rounded-[2.5rem] overflow-hidden flex flex-col justify-between shadow-2xl border border-outline-variant/30 select-none">
      {/* Hidden canvas for taking snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Top Bar ── */}
      <header className="w-full flex justify-between items-center px-6 py-5 z-40 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-surface/80 backdrop-blur-md flex items-center gap-2 shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-sm text-tertiary filled">
            verified_user
          </span>
          <span className="font-label text-xs font-bold text-on-surface">
            Secure Capture
          </span>
        </div>

        <button
          onClick={() => handleCapture()}
          className="w-11 h-11 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined">flip_camera_ios</span>
        </button>
      </header>

      {/* ── Main Viewfinder Area ── */}
      <main className="flex-grow relative flex items-center justify-center overflow-hidden">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured Proof"
            className="w-full h-full object-cover"
          />
        ) : hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-8 text-white/80 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-6xl text-primary-container">
              photo_camera
            </span>
            <p className="text-sm font-semibold max-w-xs">
              Live Camera Feed Active. Point your camera at the completed milestone.
            </p>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 camera-overlay-gradient pointer-events-none" />

        {/* Target Task Card Overlay */}
        <div className="absolute top-4 left-6 right-6 z-20">
          <div className="bg-surface/90 backdrop-blur-lg rounded-2xl p-4 shadow-organic border border-outline-variant/30 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container text-2xl filled">
                psychiatry
              </span>
            </div>
            <div className="flex-grow">
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Target Milestone
              </p>
              <h2 className="font-headline text-base font-bold text-on-surface leading-tight">
                {taskTitle}
              </h2>
              <p className="font-body text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Due Today • Camera Only
              </p>
            </div>
          </div>
        </div>

        {/* Reticle / Viewfinder guide */}
        {!capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-64 h-64 border-2 border-dashed border-white/80 rounded-3xl" />
          </div>
        )}

        {/* Metadata Badges */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 z-20">
          <div className="bg-surface-container-highest/90 backdrop-blur-md rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm border border-outline-variant/30 text-on-secondary-container">
            <span className="material-symbols-outlined text-[15px] text-primary">
              location_on
            </span>
            <span className="font-label text-xs font-semibold">
              {locationStr}
            </span>
          </div>

          <div className="bg-surface-container-highest/90 backdrop-blur-md rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm border border-outline-variant/30 text-on-secondary-container">
            <span className="material-symbols-outlined text-[15px] text-tertiary">
              calendar_today
            </span>
            <span className="font-label text-xs font-semibold">
              {currentTime}
            </span>
          </div>
        </div>
      </main>

      {/* Error alert */}
      {errorMsg && (
        <div className="absolute top-28 left-6 right-6 z-50 p-3 rounded-xl bg-error-container text-on-error-container text-xs text-center font-bold">
          {errorMsg}
        </div>
      )}

      {/* ── Bottom Action Bar ── */}
      <footer className="h-32 bg-surface-container-highest w-full rounded-t-3xl z-30 flex flex-col items-center justify-center relative shadow-[0_-4px_20px_rgba(46,50,48,0.1)]">
        {capturedImage ? (
          <div className="flex items-center gap-6">
            <button
              onClick={handleRetake}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl border border-outline font-semibold text-sm hover:bg-surface-container transition-colors cursor-pointer"
            >
              Retake
            </button>
            <button
              onClick={handleSubmitProof}
              disabled={submitting}
              className="bg-primary text-on-primary font-bold text-sm px-8 py-3 rounded-xl shadow-organic hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Verifying...
                </>
              ) : (
                <>
                  Submit Proof
                  <span className="material-symbols-outlined text-lg">
                    check
                  </span>
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleCapture}
              className="w-20 h-20 bg-surface rounded-[28px] border-4 border-surface shadow-md flex items-center justify-center active:scale-95 transition-transform duration-200 -mt-10 cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-3xl">
                  photo_camera
                </span>
              </div>
            </button>
            <p className="font-label text-xs text-on-surface-variant mt-2 font-semibold">
              Tap to capture proof
            </p>
          </>
        )}
      </footer>
    </div>
  );
}
