"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface FoodTip {
  tag: string;
  tagColor: string;
  icon: string;
  fact: string;
  actionText?: string;
  actionHref?: string;
}

const FOOD_TIPS: FoodTip[] = [
  {
    tag: "Palm Oil Watch",
    tagColor: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "🌴",
    fact: "Over 65% of popular biscuits & instant noodles use cheap hydrogenated palm oil. Always check the fat source!",
    actionText: "Search Biscuits",
    actionHref: "/categories/snacks",
  },
  {
    tag: "Sneaky Sugars",
    tagColor: "bg-rose-100 text-rose-800 border-rose-300",
    icon: "🍬",
    fact: "'No Added Sugar' labels often conceal Maltodextrin, Dextrose, or Invert Syrup that spike blood sugar just as fast.",
    actionText: "Scan Label",
    actionHref: "/scan",
  },
  {
    tag: "Shrinkflation Alert",
    tagColor: "bg-purple-100 text-purple-800 border-purple-300",
    icon: "📉",
    fact: "Brands quietly shrink 100g packs to 85g while charging the exact same price. We track pack weight changes daily!",
    actionText: "View Shrinkflation",
    actionHref: "/shrinkflation",
  },
  {
    tag: "Clean Label Rule",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "🌿",
    fact: "Gold Standard Rule: If your grandmother wouldn't recognize an ingredient on the box, think twice before eating it.",
    actionText: "Browse Top Rated",
    actionHref: "/products",
  },
  {
    tag: "Ultra-Processed (UPF)",
    tagColor: "bg-red-100 text-red-800 border-red-300",
    icon: "⚠️",
    fact: "Emulsifiers like INS 471 and INS 472 can alter gut microbiota. Check the JeevanReport Trust Score before buying.",
    actionText: "Our Methodology",
    actionHref: "/methodology",
  },
  {
    tag: "Baby Food Alert",
    tagColor: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "🍼",
    fact: "Several cereal powders marketed for toddlers contain up to 30% added refined sugars. Keep little ones safe!",
    actionText: "Baby Care Panel",
    actionHref: "/categories/dairy",
  },
];

export default function AnimatedMascot() {
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [droneMood, setDroneMood] = useState<"happy" | "scanning" | "curious" | "winking">("curious");

  // Eye pupil tracking relative to drone center
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const droneRef = useRef<HTMLDivElement>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse coordinates to let Byte's glowing LED eyes follow the cursor
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!droneRef.current || isScanning || isMinimized) return;
      const rect = droneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1) {
        setEyeOffset({ x: 0, y: 0 });
        return;
      }

      // Max eye travel distance inside visor
      const maxOffset = 3.2;
      const normalizedX = (dx / distance) * Math.min(maxOffset, distance / 40);
      const normalizedY = (dy / distance) * Math.min(maxOffset, distance / 40);

      setEyeOffset({ x: normalizedX, y: normalizedY });
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isScanning, isMinimized]);

  // Periodic autonomous mood shifts (Byte winks or looks happy)
  useEffect(() => {
    const moodInterval = setInterval(() => {
      if (isScanning || showSpeechBubble) return;
      const moods: Array<"happy" | "curious" | "winking"> = ["curious", "happy", "winking", "curious"];
      const nextMood = moods[Math.floor(Math.random() * moods.length)];
      setDroneMood(nextMood);

      setTimeout(() => {
        setDroneMood("curious");
      }, 2200);
    }, 8000);

    return () => clearInterval(moodInterval);
  }, [isScanning, showSpeechBubble]);

  // Interactive Trigger: Click Byte to do a 360 barrel-roll, fire scanner beam, and reveal Food Detective Tip
  const triggerDroneAction = useCallback(() => {
    if (isScanning) return;

    setIsSpinning(true);
    setIsScanning(true);
    setDroneMood("scanning");

    // Barrel roll spin
    setTimeout(() => {
      setIsSpinning(false);
    }, 700);

    // Laser scan wave lasts 1.4s
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => {
      setIsScanning(false);
      setDroneMood("happy");
      setShowSpeechBubble(true);
      // Pick next food tip
      setTipIndex((prev) => (prev + 1) % FOOD_TIPS.length);
    }, 1300);
  }, [isScanning]);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % FOOD_TIPS.length);
  };

  if (!mounted) return null;

  const currentTip = FOOD_TIPS[tipIndex];

  return (
    <>
      {/* 1. FULL-SCREEN HOLOGRAPHIC SCANNER GRID (Fired when Byte is clicked) */}
      {isScanning && (
        <div
          className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)",
          }}
        >
          {/* Sweeping Neon Green Laser Beam */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#10b981]"
            style={{
              animation: "scannerSweep 1.3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />
          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>
      )}

      {/* 2. COMPACT MINIMIZED REST BADGE (If user toggled minimize) */}
      {isMinimized ? (
        <button
          onClick={() => {
            setIsMinimized(false);
            setDroneMood("happy");
          }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-emerald-400 shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-emerald-400 hover:text-white"
          title="Wake up Byte (Your Health Detective Drone)"
          aria-label="Wake up Byte Mascot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span>🤖 Byte (Detective)</span>
        </button>
      ) : (
        /* 3. FULL FLOATING "BYTE" DRONE COMPANION */
        <div
          ref={droneRef}
          className="fixed z-[9999] select-none"
          style={{
            bottom: "28px",
            right: "24px",
            filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.18))",
          }}
        >
          {/* A. SPEECH BUBBLE / FOOD DETECTIVE INTEL CARD */}
          {showSpeechBubble && (
            <div
              className="absolute bottom-[96px] right-0 w-[300px] sm:w-[340px] rounded-2xl border border-latte bg-white/95 p-4 shadow-2xl backdrop-blur-lg transition-all animate-in fade-in zoom-in-95 duration-200"
              style={{
                fontFamily: "inherit",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-latte pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                    🤖
                  </span>
                  <div>
                    <div className="text-xs font-bold text-espresso flex items-center gap-1.5">
                      Byte Detective Intel
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-espresso/50">JeevanReport AI Scanner</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="rounded p-1 text-[11px] text-espresso/40 hover:bg-latte hover:text-espresso"
                    title="Minimize Byte"
                  >
                    Minimize
                  </button>
                  <button
                    onClick={() => setShowSpeechBubble(false)}
                    className="rounded p-1 text-espresso/40 hover:bg-latte hover:text-espresso"
                    title="Close tip"
                    aria-label="Close tip"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tag & Fact Content */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${currentTip.tagColor}`}
                  >
                    <span>{currentTip.icon}</span>
                    <span>{currentTip.tag}</span>
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-espresso/85 font-medium">{currentTip.fact}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-latte pt-2.5">
                <button
                  onClick={nextTip}
                  className="inline-flex items-center gap-1 rounded-lg bg-latte px-2.5 py-1.5 text-[11px] font-semibold text-espresso hover:bg-latte-dark transition-colors"
                >
                  <span>Next Fact</span>
                  <span>💡</span>
                </button>

                {currentTip.actionHref && (
                  <Link
                    href={currentTip.actionHref}
                    onClick={() => setShowSpeechBubble(false)}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    <span>{currentTip.actionText ?? "Explore"}</span>
                    <span>→</span>
                  </Link>
                )}
              </div>

              {/* Speech bubble pointer arrow */}
              <div
                className="absolute -bottom-2 right-9 h-4 w-4 rotate-45 border-b border-r border-latte bg-white"
                style={{ zIndex: -1 }}
              />
            </div>
          )}

          {/* B. HOVER GREETING TOOLTIP (When speech bubble is closed) */}
          {!showSpeechBubble && hovered && (
            <div className="absolute bottom-[86px] right-2 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-150">
              <span className="text-emerald-400">⚡ Click me:</span> Scan page & get food intel!
              <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-slate-900/90" />
            </div>
          )}

          {/* C. DRONE CHASSIS & SVG AVATAR (Interactive & Animated) */}
          <div
            onClick={triggerDroneAction}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="button"
            tabIndex={0}
            aria-label="Byte the AI Health Detective Mascot"
            className="group relative cursor-pointer outline-none"
            style={{
              width: "78px",
              height: "78px",
              animation: isSpinning
                ? "droneBarrelRoll 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
                : "droneFloatingHover 3.2s ease-in-out infinite",
            }}
          >
            {/* Outer Pulsing Halo / Scanner Ring */}
            <div
              className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                isScanning
                  ? "bg-emerald-500/30 scale-125 animate-ping"
                  : hovered
                  ? "bg-brand-500/20 scale-110"
                  : "bg-brand-500/10 scale-100"
              }`}
            />

            {/* HIGH-RES SVG OF BYTE (THE SCANNER COMPANION DRONE) */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative h-full w-full overflow-visible transition-transform duration-200 group-hover:scale-105"
            >
              <defs>
                {/* Ceramic White Body Gradient */}
                <linearGradient id="chassisGrad" x1="20" y1="20" x2="80" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Dark Curved Visor Glass Gradient */}
                <linearGradient id="visorGrad" x1="25" y1="36" x2="75" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="60%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#090d16" />
                </linearGradient>

                {/* Neon Emerald Glowing Eyes Filter */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Anti-Gravity Energy Ring Gradient */}
                <linearGradient id="ringGrad" x1="10" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>

                {/* Ion Thruster Glow */}
                <linearGradient id="ionGlow" x1="50" y1="78" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 1. ION THRUSTER BEAMS (Bottom propulsion flame) */}
              <g id="thrusters" opacity={isScanning ? 1 : 0.85}>
                {/* Left Thruster Jet */}
                <ellipse cx="37" cy="80" rx="4" ry="2" fill="#0f172a" />
                <path d="M 33 81 Q 37 94 41 81 Z" fill="url(#ionGlow)">
                  <animate attributeName="d" dur="0.4s" repeatCount="indefinite" values="M 33 81 Q 37 94 41 81 Z; M 34 81 Q 37 90 40 81 Z; M 33 81 Q 37 94 41 81 Z" />
                </path>

                {/* Right Thruster Jet */}
                <ellipse cx="63" cy="80" rx="4" ry="2" fill="#0f172a" />
                <path d="M 59 81 Q 63 94 67 81 Z" fill="url(#ionGlow)">
                  <animate attributeName="d" dur="0.4s" repeatCount="indefinite" values="M 59 81 Q 63 94 67 81 Z; M 60 81 Q 63 90 66 81 Z; M 59 81 Q 63 94 67 81 Z" />
                </path>
              </g>

              {/* 2. REAR PROPULSION / FLOATING HOVER RING */}
              <ellipse
                cx="50"
                cy="52"
                rx="42"
                ry="16"
                stroke="url(#ringGrad)"
                strokeWidth={isScanning ? 3.5 : 2.5}
                strokeDasharray={isScanning ? "6 3" : "none"}
                fill="none"
                opacity={0.8}
              >
                {isScanning && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 52"
                    to="360 50 52"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>

              {/* 3. ANTENNA & STATUS SATELLITE BEACON */}
              <line x1="50" y1="23" x2="50" y2="10" stroke="#94a3b8" strokeWidth={2.4} strokeLinecap="round" />
              {/* Antenna Top Beacon Light */}
              <circle
                cx="50"
                cy="9"
                r={isScanning ? 4.2 : 3.4}
                fill={isScanning ? "#10b981" : "#06b6d4"}
                filter="url(#neonGlow)"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur={isScanning ? "0.3s" : "1.6s"}
                  repeatCount="indefinite"
                />
              </circle>

              {/* 4. MAIN CHASSIS (Sleek Round Aerodynamic Body) */}
              <ellipse cx="50" cy="50" rx="31" ry="29" fill="url(#chassisGrad)" stroke="#e2e8f0" strokeWidth={1.5} />

              {/* Top Highlight on Body */}
              <path
                d="M 28 36 C 35 27, 65 27, 72 36"
                stroke="#ffffff"
                strokeWidth={2.2}
                strokeLinecap="round"
                opacity={0.8}
                fill="none"
              />

              {/* Side Accent Jet Fins */}
              <path d="M 19 46 C 14 47, 13 54, 19 56 Z" fill="#2563eb" />
              <path d="M 81 46 C 86 47, 87 54, 81 56 Z" fill="#2563eb" />

              {/* 5. BLACK CURVED CYBER VISOR */}
              <path
                d="M 26 43 C 26 35, 74 35, 74 43 C 74 57, 26 57, 26 43 Z"
                fill="url(#visorGrad)"
                stroke="#0284c7"
                strokeWidth={1.2}
              />

              {/* Visor Glass Reflection Arc */}
              <path
                d="M 29 41 C 36 38, 64 38, 71 41"
                stroke="#38bdf8"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.4}
                fill="none"
              />

              {/* 6. DYNAMIC DIGITAL LED EYES & EXPRESSIONS */}
              {isScanning ? (
                /* SCANNER MODE: RADAR BEAM SWEEP INSIDE VISOR */
                <g id="scanner-eyes" filter="url(#neonGlow)">
                  {/* Left Scan Matrix */}
                  <rect x="34" y="44" width="12" height="4" rx="2" fill="#10b981" />
                  {/* Right Scan Matrix */}
                  <rect x="54" y="44" width="12" height="4" rx="2" fill="#10b981" />
                  {/* Sweeping Laser Beam in Visor */}
                  <line x1="28" y1="46" x2="72" y2="46" stroke="#34d399" strokeWidth={1.8}>
                    <animate attributeName="y1" values="40;52;40" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="40;52;40" dur="0.6s" repeatCount="indefinite" />
                  </line>
                </g>
              ) : droneMood === "happy" ? (
                /* HAPPY MODE: CUTE CURVED EYE ARCS ^ ^ */
                <g id="happy-eyes" filter="url(#neonGlow)">
                  <path
                    d="M 35 47 Q 40 40 45 47"
                    stroke="#10b981"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 55 47 Q 60 40 65 47"
                    stroke="#10b981"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Rosy Cheeks */}
                  <circle cx="33" cy="51" r="2.2" fill="#f43f5e" opacity={0.6} />
                  <circle cx="67" cy="51" r="2.2" fill="#f43f5e" opacity={0.6} />
                </g>
              ) : droneMood === "winking" ? (
                /* WINKING MOOD */
                <g id="winking-eyes" filter="url(#neonGlow)">
                  {/* Left Eye Open */}
                  <circle cx={40 + eyeOffset.x} cy={46 + eyeOffset.y} r="3.2" fill="#06b6d4" />
                  <circle cx={39 + eyeOffset.x} cy={45 + eyeOffset.y} r="1.1" fill="#ffffff" />
                  {/* Right Eye Winking Line */}
                  <path d="M 55 46 Q 60 49 65 46" stroke="#06b6d4" strokeWidth={2.4} strokeLinecap="round" fill="none" />
                </g>
              ) : (
                /* CURIOUS MODE: LED EYES TRACKING CURSOR */
                <g id="curious-eyes" filter="url(#neonGlow)">
                  {/* Left Eye */}
                  <ellipse
                    cx={40 + eyeOffset.x}
                    cy={46 + eyeOffset.y}
                    rx="3.6"
                    ry="4.2"
                    fill="#06b6d4"
                  />
                  {/* Pupil Highlight */}
                  <circle cx={38.8 + eyeOffset.x} cy={44.8 + eyeOffset.y} r="1.3" fill="#ffffff" />

                  {/* Right Eye */}
                  <ellipse
                    cx={60 + eyeOffset.x}
                    cy={46 + eyeOffset.y}
                    rx="3.6"
                    ry="4.2"
                    fill="#06b6d4"
                  />
                  {/* Pupil Highlight */}
                  <circle cx={58.8 + eyeOffset.x} cy={44.8 + eyeOffset.y} r="1.3" fill="#ffffff" />
                </g>
              )}

              {/* 7. JEEVANREPORT BRAND CHEST BADGE */}
              <circle cx="50" cy="67" r="4.5" fill="#2563eb" />
              {/* Little scanner barcode lines on chest */}
              <line x1="47.5" y1="65" x2="47.5" y2="69" stroke="#ffffff" strokeWidth={1} strokeLinecap="round" />
              <line x1="50" y1="64.5" x2="50" y2="69.5" stroke="#fbbf24" strokeWidth={1} strokeLinecap="round" />
              <line x1="52.5" y1="65" x2="52.5" y2="69" stroke="#ffffff" strokeWidth={1} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* 4. KEYFRAME STYLES FOR DRONE HOVER, BARREL ROLL & LASER SWEEP */}
      <style jsx global>{`
        @keyframes droneFloatingHover {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }

        @keyframes droneBarrelRoll {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          40% {
            transform: translateY(-20px) rotate(180deg) scale(1.15);
          }
          80% {
            transform: translateY(-6px) rotate(340deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(360deg) scale(1);
          }
        }

        @keyframes scannerSweep {
          0% {
            top: 0%;
            opacity: 0.2;
          }
          50% {
            top: 50%;
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0.2;
          }
        }
      `}</style>
    </>
  );
}
