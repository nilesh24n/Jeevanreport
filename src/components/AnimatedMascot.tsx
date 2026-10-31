"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type Pose =
  | "hanging"
  | "stepping-down"
  | "perched"
  | "walking"
  | "pointing-hand"
  | "climbing-up";

interface TargetResult {
  x: number;
  y: number;
  el?: HTMLElement;
}

export default function AnimatedMascot() {
  const pathname = usePathname();
  const [pose, setPose] = useState<Pose>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false });
  const [walkLegStep, setWalkLegStep] = useState<0 | 1>(0);
  const [climbStep, setClimbStep] = useState<0 | 1>(0);
  const [transitionMs, setTransitionMs] = useState(400);

  const mountedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const limbIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeHighlightedElRef = useRef<HTMLElement | null>(null);

  // Helper to query element coordinates relative to viewport (matches position: fixed)
  const getLogoGrip = useCallback((): TargetResult | null => {
    if (typeof window === "undefined") return null;
    const logo = document.querySelector("#site-logo") as HTMLElement | null;
    if (!logo) return null;
    const rect = logo.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const handleMidX = (33 / 56) * rect.width;
    const handleMidY = (29.5 / 58) * rect.height;
    return {
      x: Math.round(rect.left + handleMidX - 12.8),
      y: Math.round(rect.top + handleMidY - 4),
      el: logo,
    };
  }, []);

  const getElementTop = useCallback(
    (selector: string, xOffset = 0, yOffset = -36): TargetResult | null => {
      if (typeof window === "undefined") return null;
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: Math.round(rect.left + xOffset),
        y: Math.round(rect.top + yOffset),
        el,
      };
    },
    []
  );

  const getScanBtnTop = useCallback(
    (xOffset = 16, yOffset = -36): TargetResult | null => {
      return (
        getElementTop("#hero-scan-btn", xOffset, yOffset) ||
        getElementTop("#recent-scan-btn", xOffset, yOffset) ||
        getElementTop("#header-scan-btn", xOffset, yOffset) ||
        getElementTop(".btn-scan", xOffset, yOffset)
      );
    },
    [getElementTop]
  );

  useEffect(() => {
    if (pathname !== "/") {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (limbIntervalRef.current) clearInterval(limbIntervalRef.current);
      if (activeHighlightedElRef.current) {
        activeHighlightedElRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
        activeHighlightedElRef.current = null;
      }
      return;
    }

    mountedRef.current = true;

    // Toggle limb strides for natural walking/climbing
    limbIntervalRef.current = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
      setClimbStep((s) => (s === 0 ? 1 : 0));
    }, 170);

    // Sequence of physical ledges from logo down to scan button and back up
    const STEPS = [
      // 0. Hang on Logo Handle
      {
        name: "hang-logo",
        pose: "hanging" as Pose,
        duration: 2500,
        transitionMs: 400,
        flipped: false,
        getTarget: () => getLogoGrip(),
      },
      // 1. Step to Header Brand Text
      {
        name: "step-brand",
        pose: "stepping-down" as Pose,
        duration: 500,
        transitionMs: 450,
        flipped: false,
        getTarget: () => {
          const grip = getLogoGrip();
          return getElementTop("#site-brand", 10, -20) || (grip ? { x: grip.x + 40, y: grip.y + 10 } : null);
        },
      },
      // 2. Step down to Hero Transparency Badge
      {
        name: "step-badge",
        pose: "stepping-down" as Pose,
        duration: 550,
        transitionMs: 500,
        flipped: false,
        getTarget: () =>
          getElementTop("#hero-transparency-badge", 25, -36) ||
          getElementTop("#hero-headline", 35, -34) ||
          getScanBtnTop(16, -36),
      },
      // 3. Step down to Hero Headline Ledge
      {
        name: "step-headline",
        pose: "perched" as Pose,
        duration: 550,
        transitionMs: 500,
        flipped: false,
        getTarget: () =>
          getElementTop("#hero-headline, #recent-scans-headline", 35, -34) ||
          getScanBtnTop(16, -36),
      },
      // 4. Step down directly onto Scan Button Ledge
      {
        name: "step-scan-btn",
        pose: "perched" as Pose,
        duration: 550,
        transitionMs: 500,
        flipped: false,
        getTarget: () => getScanBtnTop(16, -36),
      },
      // 5. Walk across top of Scan Button
      {
        name: "walk-scan-btn",
        pose: "walking" as Pose,
        duration: 1000,
        transitionMs: 900,
        flipped: false,
        getTarget: () => getScanBtnTop(52, -36),
      },
      // 6. Point at Scan Button with HIS OWN HAND (no emojis)
      {
        name: "point-scan-btn",
        pose: "pointing-hand" as Pose,
        duration: 3600,
        transitionMs: 200,
        flipped: false,
        getTarget: () => getScanBtnTop(52, -36),
        onEnter: (el?: HTMLElement) => {
          if (el) {
            el.classList.add("ring-4", "ring-amber-400", "ring-offset-2", "transition-all");
            activeHighlightedElRef.current = el;
          }
        },
        onLeave: (el?: HTMLElement) => {
          if (el) {
            el.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
          }
          if (activeHighlightedElRef.current) {
            activeHighlightedElRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
            activeHighlightedElRef.current = null;
          }
        },
      },
      // 7. Hop over to Search Button (surface-to-surface)
      {
        name: "hop-search-btn",
        pose: "walking" as Pose,
        duration: 850,
        transitionMs: 750,
        flipped: false,
        getTarget: () =>
          getElementTop("#hero-search-btn", 28, -36) ||
          getElementTop("#hero-search-box", 28, -36) ||
          getScanBtnTop(120, -36),
      },
      // 8. Climb up to Headline Ledge
      {
        name: "climb-headline",
        pose: "climbing-up" as Pose,
        duration: 650,
        transitionMs: 600,
        flipped: true,
        getTarget: () =>
          getElementTop("#hero-headline, #recent-scans-headline", 55, -34) ||
          getLogoGrip(),
      },
      // 9. Climb up to Transparency Badge Ledge
      {
        name: "climb-badge",
        pose: "climbing-up" as Pose,
        duration: 650,
        transitionMs: 600,
        flipped: true,
        getTarget: () =>
          getElementTop("#hero-transparency-badge", 35, -36) ||
          getElementTop("#site-brand", 15, -20) ||
          getLogoGrip(),
      },
      // 10. Climb up to Header Brand Text Ledge
      {
        name: "climb-brand",
        pose: "climbing-up" as Pose,
        duration: 550,
        transitionMs: 500,
        flipped: true,
        getTarget: () =>
          getElementTop("#site-brand", 20, -20) ||
          getLogoGrip(),
      },
      // 11. Catch Logo Handle and Hang
      {
        name: "catch-logo",
        pose: "hanging" as Pose,
        duration: 500,
        transitionMs: 450,
        flipped: false,
        getTarget: () => getLogoGrip(),
      },
    ];

    function executeStep(stepIndex: number) {
      if (!mountedRef.current) return;

      const step = STEPS[stepIndex];
      const target = step.getTarget();

      if (target) {
        setPos({
          x: target.x,
          y: target.y,
          visible: true,
          flipped: step.flipped,
        });
        setPose(step.pose);
        setTransitionMs(step.transitionMs);
        step.onEnter?.(target.el);
      }

      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        step.onLeave?.(target?.el);
        const nextIndex = (stepIndex + 1) % STEPS.length;
        executeStep(nextIndex);
      }, step.duration);
    }

    // Initialize alignment to logo, then start loop
    const initTimer = setTimeout(() => {
      const grip = getLogoGrip();
      if (grip) {
        setPos({ x: grip.x, y: grip.y, visible: true, flipped: false });
        executeStep(0);
      } else {
        // Retry shortly if DOM elements are still settling
        timerRef.current = setTimeout(() => executeStep(0), 200);
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (limbIntervalRef.current) clearInterval(limbIntervalRef.current);
      if (activeHighlightedElRef.current) {
        activeHighlightedElRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
        activeHighlightedElRef.current = null;
      }
    };
  }, [pathname, getLogoGrip, getElementTop, getScanBtnTop]);

  if (pathname !== "/" || !pos.visible) return null;

  return (
    <div
      aria-label="JeevanReport Mascot Monkey"
      title="JeevanReport Mascot Monkey climbing ledges to point at the scan button!"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 36,
        height: 44,
        zIndex: 9999,
        pointerEvents: "auto",
        cursor: "pointer",
        transition: `left ${transitionMs}ms ease-out, top ${transitionMs}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        transform: pos.flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      <svg
        viewBox="0 0 36 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 36,
          height: 44,
          overflow: "visible",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.22))",
        }}
      >
        {/* ============================================================== */}
        {/* 1. POSE: HANGING FROM LOGO HANDLE                              */}
        {/* ============================================================== */}
        {pose === "hanging" && (
          <g id="pose-hanging">
            {/* Left Arm grasping handle of logo */}
            <path d="M 12 18 L 12.8 4.5" stroke="#2563eb" strokeWidth={3.5} strokeLinecap="round" />
            <path
              d="M 10.5 6 L 10.5 1.5 C 10.5 0.5, 15 0.5, 15 1.5 L 15 6 Z"
              fill="#fed7aa"
              stroke="#d97706"
              strokeWidth={0.8}
            />
            <line x1="12" y1="1" x2="12" y2="4.5" stroke="#d97706" strokeWidth={0.6} strokeLinecap="round" />
            <line x1="13.5" y1="1" x2="13.5" y2="4.5" stroke="#d97706" strokeWidth={0.6} strokeLinecap="round" />

            {/* Blue Hoodie Body */}
            <path d="M 11 19 C 10 23, 11 26, 13 27 L 18 27 C 20 26, 21 23, 20 19 Z" fill="#2563eb" />
            <line x1="15.5" y1="19" x2="15.5" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Dangling Legs */}
            <rect x="12" y="26.5" width="2.4" height="5" rx="1" fill="#1d4ed8" />
            <ellipse cx="13" cy="32" rx="2" ry="1.4" fill="#0f172a" />
            <path d="M 16.5 26.5 L 19.5 31" stroke="#1d4ed8" strokeWidth={2.4} strokeLinecap="round" />
            <ellipse cx="20.5" cy="31.5" rx="2" ry="1.4" fill="#0f172a" transform="rotate(-20 20.5 31.5)" />

            {/* Chibi Monkey Head */}
            <circle cx="16" cy="13.5" r="6.2" fill="#fed7aa" />
            <path
              d="M 10.5 12.5 C 10 8, 13 6.5, 16 6.5 C 19 6.5, 22 8, 21.5 12.5 C 20 11.2, 18 11.2, 16 12 C 14 11.2, 12 11.2, 10.5 12.5 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="8.5" r="1.1" fill="#fbbf24" />

            {/* Expressive Eyes looking down */}
            <circle cx="14" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="13.7" cy="13.6" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="17.7" cy="13.6" r="0.45" fill="#ffffff" />

            {/* Rosy Cheeks & Cheerful Smile */}
            <ellipse cx="12.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="19.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <path d="M 15 16.2 Q 16 17.4 17 16.2" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Right Arm Waving */}
            <path d="M 19 19 Q 22 16 25 12" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="26" cy="10" r="2.6" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
            <line x1="25.2" y1="8" x2="25.2" y2="5.5" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />
            <line x1="26.5" y1="7.5" x2="26.9" y2="5.2" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />
            <path d="M 30 4.5 Q 31.2 6.5 30 8.5" stroke="#fbbf24" strokeWidth={0.9} strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. POSE: STEPPING DOWN (Monkey reaching down to lower ledge)  */}
        {/* ============================================================== */}
        {pose === "stepping-down" && (
          <g id="pose-stepping-down">
            {/* Upper Left Arm holding onto the upper ledge */}
            <path d="M 12 18 L 9 5" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
            <circle cx="8.5" cy="4" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

            {/* Body leaning down */}
            <path d="M 11 18 C 10 22, 12 25, 14 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Upper Leg braced */}
            <path d="M 13 26 L 10 32" stroke="#1d4ed8" strokeWidth={2.8} strokeLinecap="round" />
            <ellipse cx="9.5" cy="33" rx="2.2" ry="1.4" fill="#0f172a" />

            {/* Lower Right Leg EXTENDING DOWN touching lower support ledge */}
            <path d="M 19 26 L 24 38" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="25" cy="39" rx="2.4" ry="1.4" fill="#0f172a" />

            {/* Lower Right Arm reaching down to feel the lower ledge */}
            <path d="M 20 18 Q 23 24 25 31" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="25.5" cy="32" r="2.2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Head tilted down looking at foothold */}
            <circle cx="16" cy="13" r="6" fill="#fed7aa" />
            <path
              d="M 10.5 12 C 10 8, 13 6.5, 16 6.5 C 19 6.5, 22 8, 21.5 12 C 20 11, 18 11, 16 11.5 C 14 11, 12 11, 10.5 12 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="8" r="1.1" fill="#fbbf24" />

            {/* Eyes looking straight down */}
            <circle cx="14" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="14" cy="14.5" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="18" cy="14.5" r="0.45" fill="#ffffff" />
            <path d="M 15 16 Q 16 17 17 16" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. POSE: PERCHED / BALANCING ON A BUTTON OR LEDGE SURFACE      */}
        {/* ============================================================== */}
        {pose === "perched" && (
          <g id="pose-perched">
            {/* Monkey crouched low on the ledge with bent knees */}
            {/* Left Leg bent deep on surface */}
            <path d="M 12 25 L 8 30 L 9 36" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="9" cy="37" rx="2.4" ry="1.4" fill="#0f172a" />

            {/* Right Leg bent deep on surface */}
            <path d="M 20 25 L 24 30 L 23 36" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="23" cy="37" rx="2.4" ry="1.4" fill="#0f172a" />

            {/* Low crouched hoodie torso */}
            <path d="M 11 18 C 10 22, 11 25, 13 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Hands touching ledge for monkey balance */}
            <path d="M 11 19 L 6 28" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
            <circle cx="5.5" cy="29" r="2.2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />
            <path d="M 21 19 L 26 28" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
            <circle cx="26.5" cy="29" r="2.2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Head looking forward alert */}
            <circle cx="16" cy="12" r="6.2" fill="#fed7aa" />
            <path
              d="M 10.5 11 C 10 6.5, 13 5, 16 5 C 19 5, 22 6.5, 21.5 11 C 20 9.8, 18 9.8, 16 10.5 C 14 9.8, 12 9.8, 10.5 11 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="7" r="1.1" fill="#fbbf24" />

            {/* Eyes */}
            <circle cx="14" cy="12.5" r="1.2" fill="#0f172a" />
            <circle cx="13.7" cy="12.2" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="12.5" r="1.2" fill="#0f172a" />
            <circle cx="17.7" cy="12.2" r="0.45" fill="#ffffff" />
            <path d="M 14.5 14.5 Q 16 16.2 17.5 14.5" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. POSE: SCAMPERING / WALKING ALONG THE BUTTON LEDGE           */}
        {/* ============================================================== */}
        {pose === "walking" && (
          <g id="pose-walking">
            <circle cx="16" cy="11.5" r="6" fill="#fed7aa" />
            <path
              d="M 10.5 10.5 C 10 6.5, 13 4.5, 16 4.5 C 19 4.5, 22 6.5, 21.5 10.5 C 20 9.5, 18 9.5, 16 10 C 14 9.5, 12 9.5, 10.5 10.5 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="6.5" r="1.1" fill="#fbbf24" />

            {/* Eyes & Smile */}
            <circle cx="14" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="13.7" cy="11.6" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="17.7" cy="11.6" r="0.45" fill="#ffffff" />
            <path d="M 14.8 14 Q 16 15.2 17.2 14" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Torso */}
            <path d="M 11 16.5 C 10 20.5, 11 23.5, 13 24.5 L 19 24.5 C 21 23.5, 22 20.5, 21 16.5 Z" fill="#2563eb" />
            <line x1="16" y1="16.5" x2="16" y2="22" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Agile Monkey Strides across button top */}
            {walkLegStep === 0 ? (
              <>
                <path d="M 11 17 Q 8 20 7 25" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                <circle cx="6.5" cy="25.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                <path d="M 21 17 Q 24 19 25 23" stroke="#2563eb" strokeWidth={2.8} strokeLinecap="round" />
                <circle cx="25.5" cy="23.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                <path d="M 13 24.5 L 9.5 33" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="9" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23" cy="33" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            ) : (
              <>
                <path d="M 11 17 Q 9 20 10 25" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                <circle cx="10.2" cy="25.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                <path d="M 21 17 Q 24 15 25 20" stroke="#2563eb" strokeWidth={2.8} strokeLinecap="round" />
                <circle cx="25.5" cy="20.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                <path d="M 13 24.5 L 11 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="10.5" cy="33" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22.5 33" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23.5" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            )}
          </g>
        )}

        {/* ============================================================== */}
        {/* 5. POSE: SHOWING THE SCAN BUTTON WITH HIS OWN HAND!            */}
        {/* (NO EMOJIS! Monkey crouches, grips button with left hand,      */}
        {/*  extends right arm down and points right at the button!)       */}
        {/* ============================================================== */}
        {pose === "pointing-hand" && (
          <g id="pose-pointing-hand">
            {/* Crouched legs gripping top of button */}
            <path d="M 12 25 L 8 29 L 9 35" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="9" cy="36" rx="2.4" ry="1.4" fill="#0f172a" />

            <path d="M 19 25 L 21 30 L 20 35" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="20" cy="36" rx="2.4" ry="1.4" fill="#0f172a" />

            {/* Torso leaning forward over button edge */}
            <path d="M 11 18 C 10 22, 11 25, 13 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Left Arm firmly holding onto button edge for monkey support */}
            <path d="M 11 19 L 6 26" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
            <circle cx="5.5" cy="27" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
            <line x1="5.5" y1="27" x2="5.5" y2="29.5" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />

            {/* Head tilted down looking right at where his hand is pointing */}
            <circle cx="16" cy="11.5" r="6" fill="#fed7aa" />
            <path
              d="M 10.5 10.5 C 10 6.5, 13 4.5, 16 4.5 C 19 4.5, 22 6.5, 21.5 10.5 C 20 9.5, 18 9.5, 16 10 C 14 9.5, 12 9.5, 10.5 10.5 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="6.5" r="1.1" fill="#fbbf24" />

            {/* Eyes looking straight DOWN at the button */}
            <circle cx="14" cy="12" r="1.3" fill="#0f172a" />
            <circle cx="14" cy="12.6" r="0.5" fill="#ffffff" />
            <circle cx="18" cy="12" r="1.3" fill="#0f172a" />
            <circle cx="18" cy="12.6" r="0.5" fill="#ffffff" />

            {/* Cheerful Open Smile & Rosy Cheek */}
            <ellipse cx="11.5" cy="14" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="20.5" cy="14" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <path d="M 14.5 14.5 Q 16 16.5 17.5 14.5 Z" fill="#9a3412" />

            {/* ========================================================== */}
            {/* RIGHT ARM FULLY EXTENDED DOWN POINTING DIRECTLY AT BUTTON  */}
            {/* ========================================================== */}
            <path d="M 20 18 L 24 24" stroke="#2563eb" strokeWidth={3.6} strokeLinecap="round" />
            <path d="M 24 24 L 26 31" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />

            {/* Hand Palm */}
            <circle cx="26" cy="32" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Tucked fingers */}
            <ellipse cx="24.5" cy="32.5" rx="1.3" ry="1.6" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />

            {/* EXTENDED POINTING INDEX FINGER pointing directly down at button */}
            <line x1="26" y1="32" x2="26" y2="40" stroke="#d97706" strokeWidth={1.8} strokeLinecap="round" />
            <line x1="26" y1="32" x2="26" y2="39.5" stroke="#fed7aa" strokeWidth={1.2} strokeLinecap="round" />

            {/* Clean SVG Vector Target Pulse at Fingertip (NO EMOJIS!) */}
            <circle cx="26" cy="41" r="2.5" fill="none" stroke="#f59e0b" strokeWidth={1.2}>
              <animate attributeName="r" values="2;5;8" dur="0.9s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.5;0" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="26" cy="41" r="1.5" fill="#f59e0b" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 6. POSE: CLIMBING UP (Hand-over-hand pulling up ledge-to-ledge)*/}
        {/* ============================================================== */}
        {pose === "climbing-up" && (
          <g id="pose-climbing-up">
            {/* Head tilted straight UP looking at next hold */}
            <circle cx="16" cy="13" r="6.2" fill="#fed7aa" />
            <path
              d="M 10 11.5 C 10 6.5, 13 4.5, 16 4.5 C 19 4.5, 22 6.5, 22 11.5 C 20.5 10.2, 18 10.2, 16 10.8 C 14 10.2, 11.5 10.2, 10 11.5 Z"
              fill="#0f172a"
            />
            <circle cx="16" cy="6.2" r="1.2" fill="#fbbf24" />

            {/* Eyes looking UP */}
            <circle cx="13.5" cy="11.8" r="1.3" fill="#0f172a" />
            <circle cx="13.5" cy="11.1" r="0.5" fill="#ffffff" />
            <circle cx="18.5" cy="11.8" r="1.3" fill="#0f172a" />
            <circle cx="18.5" cy="11.1" r="0.5" fill="#ffffff" />

            <path d="M 14.5 15.6 Q 16 17.2 17.5 15.6" stroke="#9a3412" strokeWidth={1} strokeLinecap="round" fill="none" />
            <ellipse cx="11.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="20.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />

            {/* Athletic Torso with chalk belt */}
            <path d="M 11 18 C 10 22, 11 25, 13 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />
            <rect x="14" y="25" width="4" height="3" rx="1" fill="#f59e0b" />

            {/* Alternating Hand-over-hand Climbing Arms & Legs */}
            {climbStep === 0 ? (
              <>
                <path d="M 11 18 L 8 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="7.8" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="6.8" y1="2" x2="6.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="8.2" y1="1.8" x2="8.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                <path d="M 21 18 Q 24 16 23 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="23" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                <path d="M 12 26 L 8 29 L 9 33" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="9" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />

                <path d="M 19 26 L 22 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="22" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />
                <circle cx="8" cy="1" r="1.2" fill="#ffffff" opacity={0.7} />
              </>
            ) : (
              <>
                <path d="M 11 18 Q 8 16 9 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="9" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                <path d="M 21 18 L 24 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="24.2" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="23.8" y1="2" x2="23.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="25.2" y1="1.8" x2="25.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                <path d="M 13 26 L 10 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="10" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />

                <path d="M 20 26 L 24 29 L 23 33" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="23" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />
                <circle cx="24" cy="1" r="1.2" fill="#ffffff" opacity={0.7} />
              </>
            )}

            {/* Motion Streaks */}
            <line x1="4" y1="28" x2="4" y2="34" stroke="#f59e0b" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
            <line x1="28" y1="28" x2="28" y2="34" stroke="#f59e0b" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
          </g>
        )}
      </svg>
    </div>
  );
}
