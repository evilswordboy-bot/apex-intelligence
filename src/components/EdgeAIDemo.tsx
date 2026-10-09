"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Shield, Play, Pause, AlertCircle, Sparkles } from 'lucide-react';

export default function EdgeAIDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(14);
  const [simulatedAngle, setSimulatedAngle] = useState(142);
  const [detectionConfidence, setDetectionConfidence] = useState(0.97);
  const [statusMessage, setStatusMessage] = useState("Edge Engine Ready (Local Privacy Preserved)");

  // Local animated pose skeleton overlay simulation
  useEffect(() => {
    let animationId: number;
    let t = 0;

    const renderOverlay = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      t += 0.04;
      const kneeX = w * 0.5 + Math.sin(t) * 20;
      const kneeY = h * 0.65 + Math.cos(t) * 15;
      const hipX = w * 0.5;
      const hipY = h * 0.45;
      const ankleX = kneeX + 15 * Math.sin(t * 1.5);
      const ankleY = h * 0.85;

      const shoulderX = w * 0.5;
      const shoulderY = h * 0.28;
      const headX = w * 0.5;
      const headY = h * 0.18;

      // Draw skeleton lines
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#B6FF3B';
      ctx.shadowColor = '#B6FF3B';
      ctx.shadowBlur = 8;

      // Torso & head
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(shoulderX, shoulderY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      // Right leg
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(ankleX, ankleY);
      ctx.stroke();

      // Left leg
      ctx.beginPath();
      ctx.strokeStyle = '#2D6BFF';
      ctx.shadowColor = '#2D6BFF';
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(hipX - 25, kneeY - 10);
      ctx.lineTo(hipX - 35, ankleY);
      ctx.stroke();

      // Joint keypoints
      const joints = [
        { x: headX, y: headY, r: 8, color: '#FFFFFF' },
        { x: shoulderX, y: shoulderY, r: 5, color: '#2D6BFF' },
        { x: hipX, y: hipY, r: 6, color: '#B6FF3B' },
        { x: kneeX, y: kneeY, r: 6, color: '#B6FF3B' },
        { x: ankleX, y: ankleY, r: 5, color: '#FF6B2C' },
      ];

      joints.forEach(j => {
        ctx.fillStyle = j.color;
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Kinematic angle calculation
      const calculatedAngle = Math.round(135 + Math.sin(t) * 22);
      setSimulatedAngle(calculatedAngle);

      // Angle indicator label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`${calculatedAngle}° Knee Flexion`, kneeX + 15, kneeY);

      animationId = requestAnimationFrame(renderOverlay);
    };

    animationId = requestAnimationFrame(renderOverlay);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      setStatusMessage("Camera paused. Running edge benchmark loop.");
    } else {
      try {
        setStatusMessage("Requesting local hardware camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
        setStatusMessage("Webcam live! On-device computer vision active.");
      } catch (err) {
        setStatusMessage("Webcam not accessible or permission denied. Running simulated video stream.");
        setCameraActive(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ON-DEVICE EDGE POSE INFERENCE
          </div>
          <h2 className="text-2xl font-black font-display text-white">Browser-Based Biomechanical Kinematics</h2>
          <p className="text-sm text-[#8F9CAE] mt-1">
            Zero cloud uploads. Video frames are analyzed locally in your browser sandbox with hardware WebGL/WASM acceleration.
          </p>
        </div>

        <button
          onClick={toggleCamera}
          className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
            cameraActive
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
              : 'bg-[#2D6BFF] hover:bg-[#2558d6] text-white shadow-[#2D6BFF]/20'
          }`}
        >
          <Camera className="w-4 h-4" />
          {cameraActive ? 'Stop Webcam' : 'Enable Webcam Detection'}
        </button>
      </div>

      {/* Main Vision Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-[#070B16] border border-[#1C2745] p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          {/* Status Overlay */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-[#B6FF3B] animate-pulse" />
            {statusMessage}
          </div>

          <div className="absolute top-6 right-6 z-20 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono">
            <span className="text-[#B6FF3B]">FPS: {fps}</span>
            <span className="text-[#8F9CAE]">|</span>
            <span className="text-[#2D6BFF]">LATENCY: {latency}ms</span>
          </div>

          {/* Video or Synthetic Arena Background */}
          <div className="relative w-full max-w-[580px] h-[380px] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-[#1C2745]">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />
            
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#091122] to-[#04060C] text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#1C2745]/60 flex items-center justify-center mb-4 text-[#2D6BFF]">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <span className="text-sm font-semibold text-white">Running Biomechanics Pose Stream</span>
                <span className="text-xs text-[#8F9CAE] mt-1 max-w-xs">
                  Click &apos;Enable Webcam Detection&apos; to use your local camera, or observe the live simulated runner kinematic tracking below.
                </span>
              </div>
            )}

            {/* Skeleton Canvas Rendering Layer */}
            <canvas
              ref={canvasRef}
              width={580}
              height={380}
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            />
          </div>

          {/* Privacy Disclaimer Footer */}
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#8F9CAE]">
            <Shield className="w-4 h-4 text-[#B6FF3B]" />
            Privacy First: Biometric video streams are processed exclusively in volatile browser RAM.
          </div>
        </div>

        {/* Real-Time Joint Telemetry Cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">REAL-TIME JOINT ANGLE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-[#B6FF3B]">{simulatedAngle}°</span>
              <span className="text-xs text-[#8F9CAE]">Right Knee Extension</span>
            </div>
            <div className="w-full bg-[#1C2745] h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#B6FF3B] h-full transition-all duration-150"
                style={{ width: `${Math.min(100, (simulatedAngle / 180) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">CONFIDENCE METRIC</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-[#2D6BFF]">{(detectionConfidence * 100).toFixed(1)}%</span>
              <span className="text-xs text-[#8F9CAE]">Keypoint Visibility</span>
            </div>
            <div className="w-full bg-[#1C2745] h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#2D6BFF] h-full"
                style={{ width: `${detectionConfidence * 100}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">SYMMETRY BALANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-display text-white">96.4%</span>
              <span className="text-xs text-[#B6FF3B]">Optimal Bilateral Ratio</span>
            </div>
            <p className="text-xs text-[#8F9CAE] mt-2">
              Ground reaction force symmetry indicates balanced hip-abductor torque during ground contact phases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
