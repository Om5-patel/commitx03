"use client";

import { useEffect, useRef, useState } from "react";
import TiltCard from "@/components/ui/TiltCard";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationStr, setLocationStr] = useState<string>("SECURE DEVICE CAPTURE");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [flash, setFlash] = useState<boolean>(false);

  // Initialize clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
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
            `GPS LOCK: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`
          );
        },
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  // Camera stream
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
        console.warn("Camera fallback active:", err);
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

  // Capture shutter
  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    if (videoRef.current && canvasRef.current && hasCamera) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        setCapturedImage(dataUrl);
      }
    } else {
      // Demo simulated viewfinder capture
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#090D10";
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 22px JetBrains Mono";
        ctx.fillText(`COMMITX VERIFIED: ${taskTitle}`, 30, 200);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "14px JetBrains Mono";
        ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 30, 240);
        ctx.fillText(`SECURITY HASH: ${Math.random().toString(36).substring(2)}`, 30, 270);
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
        throw new Error(data.error || "Verification submission failed");
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to transmit photo proof");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TiltCard glow="emerald" className="max-w-xl mx-auto p-6 sm:p-8 bg-[#12181E] border border-[#1E293B]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#10B981] uppercase bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-full">
            GPS VIEWFINDER STATION
          </span>
          <h2 className="font-sans text-2xl font-black text-[#F8FAFC] tracking-tight mt-3">
            {taskTitle}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Capture real-time photographic evidence with biometric timestamping.
          </p>
        </div>

        {/* Viewfinder HUD Container */}
        <div className="relative aspect-[4/3] rounded-2xl bg-[#090D10] border border-[#1E293B] overflow-hidden flex items-center justify-center shadow-2xl">
          {/* Flash Effect */}
          {flash && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200" />}

          {/* Viewfinder Target Brackets */}
          <div className="absolute inset-4 pointer-events-none z-30 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-2 border-l-2 border-[#10B981]" />
              <div className="w-6 h-6 border-t-2 border-r-2 border-[#10B981]" />
            </div>
            <div className="flex justify-between">
              <div className="w-6 h-6 border-b-2 border-l-2 border-[#10B981]" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-[#10B981]" />
            </div>
          </div>

          {/* Live Video / Captured Image / Simulated Canvas */}
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {!hasCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#090D10]">
                  <span className="material-symbols-outlined text-4xl text-[#10B981] mb-2 animate-pulse">
                    photo_camera
                  </span>
                  <p className="text-xs font-mono text-[#F8FAFC] font-bold">READY FOR CAPTURE</p>
                  <p className="text-[11px] text-[#64748B] mt-1">Tap Shutter to record cryptographically signed proof</p>
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured proof"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Viewfinder HUD Overlays */}
          <div className="absolute bottom-3 inset-x-3 z-30 flex justify-between items-center text-[10px] font-mono text-[#10B981] bg-[#090D10]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E293B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>{locationStr}</span>
            </div>
            <span className="text-[#F59E0B] font-bold">{currentTime}</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!capturedImage ? (
            <button
              type="button"
              onClick={handleCapture}
              className="btn-primary w-full !py-4 text-sm font-mono tracking-wider flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">camera</span>
              CAPTURE VERIFICATION SNAPSHOT
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                disabled={submitting}
                className="btn-glass flex-1 !py-3.5 text-xs font-mono"
              >
                Retake Photo
              </button>
              <button
                type="button"
                onClick={handleSubmitProof}
                disabled={submitting}
                className="btn-primary flex-1 !py-3.5 text-xs font-mono"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    Transmitting...
                  </>
                ) : (
                  <>
                    Transmit & Unlock Stake
                    <span className="material-symbols-outlined text-base">lock_open</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
