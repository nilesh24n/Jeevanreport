"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

type Phase =
  | "hanging"
  | "jumping-to-btn"
  | "walking-btn"
  | "indicating-btn"
  | "hopping-down"
  | "walking-page"
  | "climbing";

export default function AnimatedMascot() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false });
  const [walkLegStep, setWalkLegStep] = useState<0 | 1>(0);
  const [climbStep, setClimbStep] = useState<0 | 1>(0);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [showArrow, setShowArrow] = useState(false);

  const phaseRef = useRef<Phase>("hanging");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const highlightedBtnRef = useRef<HTMLElement | null>(null);

  function clearAllTimers() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    intervalsRef.current.forEach((i) => clearInterval(i));
    intervalsRef.current = [];
    if (highlightedBtnRef.current) {
      highlightedBtnRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
      highlightedBtnRef.current = null;
    }
  }

  // Returns exact screen coordinates for the handle midpoint of #site-logo
  // Logo viewBox is 0 0 56 58, handle midpoint is (33, 29.5)
  // Mascot hand grip center inside its 32x42 box is at (11.8, 5)
  const getLogoGripPos = useCallback(() => {
    if (typeof window === "undefined") return null;
    const logo = document.querySelector("#site-logo") as HTMLElement | null;
    if (!logo) return null;
    const rect = logo.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const handleMidX = (33 / 56) * rect.width;
    const handleMidY = (29.5 / 58) * rect.height;
    return {
      x: rect.left + handleMidX - 11.8,
      y: rect.top + handleMidY - 5,
    };
  }, []);

  // Returns button coordinates for the mascot to stand on top of any active scan button
  const getScanBtnBounds = useCallback(() => {
    if (typeof window === "undefined") return null;
    const candidates = [
      document.querySelector("#hero-scan-btn"),
      document.querySelector("#recent-scan-btn"),
      document.querySelector("#header-scan-btn"),
      document.querySelector(".btn-scan"),
      document.querySelector("#fab-scan-btn"),
    ] as (HTMLElement | null)[];

    for (const btn of candidates) {
      if (btn) {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return {
            element: btn,
            left: rect.left + 16,
            center: rect.left + rect.width / 2 - 16,
            right: rect.right - 36,
            top: rect.top - 40,
            width: rect.width,
          };
        }
      }
    }

    // Default fallback position if no button exists
    return {
      element: null,
      left: window.innerWidth / 2 - 80,
      center: window.innerWidth / 2 - 16,
      right: window.innerWidth / 2 + 60,
      top: 220,
      width: 160,
    };
  }, []);

  // Forward references to cycle animation stages cleanly
  const startJumpToBtnRef = useRef<() => void>(() => {});
  const startWalkingBtnRef = useRef<() => void>(() => {});
  const startIndicatingBtnRef = useRef<() => void>(() => {});
  const startHopDownRef = useRef<() => void>(() => {});
  const startWalkingPageRef = useRef<() => void>(() => {});
  const startClimbingUpRef = useRef<() => void>(() => {});

  // -------------------------------------------------------------
  // 1. CLIMBING UP HAND-OVER-HAND BACK TO LOGO
  // -------------------------------------------------------------
  const startClimbingUp = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "climbing";
    setPhase("climbing");
    setSpeechBubble(null);
    setShowArrow(false);

    const grip = getLogoGripPos();
    if (!grip) return;

    const currentX = pos.x;
    const currentY = pos.y;
    const targetX = grip.x;
    const targetY = grip.y;

    const totalDistY = currentY - targetY;
    const numSteps = 8;
    const stepDuration = 320;
    let currentStepIndex = 0;

    const climbInterval = setInterval(() => {
      setClimbStep((s) => (s === 0 ? 1 : 0));
    }, 160);
    intervalsRef.current.push(climbInterval);

    function doClimbStep() {
      if (phaseRef.current !== "climbing") return;

      currentStepIndex++;
      const progress = Math.min(1, currentStepIndex / numSteps);
      const swayOffset = currentStepIndex % 2 === 0 ? 5 : -5;
      const nextX = currentX + (targetX - currentX) * progress + (progress < 0.95 ? swayOffset : 0);
      const nextY = currentY - totalDistY * progress;

      setPos({
        x: nextX,
        y: nextY,
        visible: true,
        flipped: false,
      });

      if (progress < 1) {
        const nextTimer = setTimeout(doClimbStep, stepDuration);
        timersRef.current.push(nextTimer);
      } else {
        // Reached logo handle! Grasp handle and hang
        const finishTimer = setTimeout(() => {
          clearInterval(climbInterval);
          phaseRef.current = "hanging";
          setPhase("hanging");

          const finalGrip = getLogoGripPos();
          setPos({
            x: finalGrip?.x ?? targetX,
            y: finalGrip?.y ?? targetY,
            visible: true,
            flipped: false,
          });

          // Hang at the logo for 3.5 seconds, then begin the next journey!
          const nextCycleTimer = setTimeout(() => {
            startJumpToBtnRef.current();
          }, 3500);
          timersRef.current.push(nextCycleTimer);
        }, 250);
        timersRef.current.push(finishTimer);
      }
    }

    doClimbStep();
  }, [getLogoGripPos, pos.x, pos.y]);

  startClimbingUpRef.current = startClimbingUp;

  // -------------------------------------------------------------
  // 2. WALKING & EXPLORING THE PAGE
  // -------------------------------------------------------------
  const startWalkingPage = useCallback(() => {
    phaseRef.current = "walking-page";
    setPhase("walking-page");
    setSpeechBubble(null);
    setShowArrow(false);

    const legInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
    }, 170);
    intervalsRef.current.push(legInterval);

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const lowerY = Math.min(typeof window !== "undefined" ? window.innerHeight - 80 : 540, 560);
    const walkRightX = Math.min(screenWidth - 100, pos.x + 200);

    // Stride across to the right
    setPos({
      x: walkRightX,
      y: lowerY,
      visible: true,
      flipped: false,
    });

    // Walk for 2.8 seconds to the right
    const walk1 = setTimeout(() => {
      if (phaseRef.current !== "walking-page") return;

      const grip = getLogoGripPos();
      const climbBaseX = grip ? grip.x + 24 : pos.x;

      // Turn around and walk toward the climb-up vertical line
      setPos({
        x: climbBaseX,
        y: lowerY,
        visible: true,
        flipped: true,
      });

      // Walk back for 2.4 seconds, then start climbing back to the logo!
      const walk2 = setTimeout(() => {
        clearInterval(legInterval);
        startClimbingUpRef.current();
      }, 2400);
      timersRef.current.push(walk2);
    }, 2800);
    timersRef.current.push(walk1);
  }, [getLogoGripPos, pos.x]);

  startWalkingPageRef.current = startWalkingPage;

  // -------------------------------------------------------------
  // 3. HOPPING DOWN FROM SCAN BUTTON
  // -------------------------------------------------------------
  const startHopDown = useCallback(() => {
    phaseRef.current = "hopping-down";
    setPhase("hopping-down");
    setSpeechBubble(null);
    setShowArrow(false);

    if (highlightedBtnRef.current) {
      highlightedBtnRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
      highlightedBtnRef.current = null;
    }

    const bounds = getScanBtnBounds();
    const hopTargetX = bounds ? bounds.right + 24 : pos.x + 40;
    const hopTargetY = bounds ? bounds.top + 130 : pos.y + 130;

    setPos({
      x: hopTargetX,
      y: hopTargetY,
      visible: true,
      flipped: false,
    });

    const hopTimer = setTimeout(() => {
      startWalkingPageRef.current();
    }, 550);
    timersRef.current.push(hopTimer);
  }, [getScanBtnBounds, pos.x, pos.y]);

  startHopDownRef.current = startHopDown;

  // -------------------------------------------------------------
  // 4. INDICATING THE SCAN BUTTON (Points down, speech bubble, pulse)
  // -------------------------------------------------------------
  const startIndicatingBtn = useCallback(() => {
    phaseRef.current = "indicating-btn";
    setPhase("indicating-btn");
    setSpeechBubble("Scan barcode here! 📸");
    setShowArrow(true);

    const bounds = getScanBtnBounds();
    if (bounds?.element) {
      bounds.element.classList.add("ring-4", "ring-amber-400", "ring-offset-2", "transition-all");
      highlightedBtnRef.current = bounds.element;
    }

    // Stop and indicate for 3.2 seconds, then hop down to walk the page
    const indicateTimer = setTimeout(() => {
      startHopDownRef.current();
    }, 3200);
    timersRef.current.push(indicateTimer);
  }, [getScanBtnBounds]);

  startIndicatingBtnRef.current = startIndicatingBtn;

  // -------------------------------------------------------------
  // 5. WALKING ON TOP OF SCAN BUTTON
  // -------------------------------------------------------------
  const startWalkingBtn = useCallback(() => {
    phaseRef.current = "walking-btn";
    setPhase("walking-btn");
    setSpeechBubble(null);
    setShowArrow(false);

    const legInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
    }, 180);
    intervalsRef.current.push(legInterval);

    const bounds = getScanBtnBounds();
    if (bounds) {
      // Walk from left to center of the button
      setPos({
        x: bounds.center,
        y: bounds.top,
        visible: true,
        flipped: false,
      });
    }

    // Walk for 2.0s to center, then start indicating!
    const walkTimer = setTimeout(() => {
      clearInterval(legInterval);
      startIndicatingBtnRef.current();
    }, 2000);
    timersRef.current.push(walkTimer);
  }, [getScanBtnBounds]);

  startWalkingBtnRef.current = startWalkingBtn;

  // -------------------------------------------------------------
  // 6. JUMP FROM LOGO DOWN TO SCAN BUTTON
  // -------------------------------------------------------------
  const startJumpToBtn = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "jumping-to-btn";
    setPhase("jumping-to-btn");
    setSpeechBubble(null);
    setShowArrow(false);

    const bounds = getScanBtnBounds();
    if (!bounds) {
      const retry = setTimeout(() => startJumpToBtnRef.current(), 2500);
      timersRef.current.push(retry);
      return;
    }

    // Jump arc lands on left side of the scan button
    setPos({
      x: bounds.left,
      y: bounds.top,
      visible: true,
      flipped: false,
    });

    const jumpTimer = setTimeout(() => {
      startWalkingBtnRef.current();
    }, 780);
    timersRef.current.push(jumpTimer);
  }, [getScanBtnBounds]);

  startJumpToBtnRef.current = startJumpToBtn;

  // -------------------------------------------------------------
  // MOUNT & RESIZE LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    if (pathname !== "/") return;

    function alignToLogo() {
      const grip = getLogoGripPos();
      if (grip) {
        setPos({ x: grip.x, y: grip.y, visible: true, flipped: false });
        return true;
      }
      return false;
    }

    const initTimer = setTimeout(() => {
      const found = alignToLogo();
      if (!found) {
        const retryTimer = setTimeout(alignToLogo, 250);
        timersRef.current.push(retryTimer);
      }

      // Hang and wave at the logo for 2.8 seconds, then begin the jump!
      const firstJump = setTimeout(() => {
        startJumpToBtnRef.current();
      }, 2800);
      timersRef.current.push(firstJump);
    }, 120);
    timersRef.current.push(initTimer);

    function handleScrollOrResize() {
      if (phaseRef.current === "hanging") {
        const grip = getLogoGripPos();
        if (grip) {
          setPos((prev) => ({ ...prev, x: grip.x, y: grip.y, visible: true }));
        }
      }
    }

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      clearAllTimers();
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [getLogoGripPos, pathname]);

  // Only render on landing page
  if (pathname !== "/" || !pos.visible) return null;

  const isHanging = phase === "hanging";
  const isJumping = phase === "jumping-to-btn" || phase === "hopping-down";
  const isWalking = phase === "walking-btn" || phase === "walking-page";
  const isIndicating = phase === "indicating-btn";
  const isClimbing = phase === "climbing";

  // Transition dynamics
  let transitionStyle = "none";
  if (phase === "jumping-to-btn") {
    transitionStyle =
      "left 0.78s cubic-bezier(0.22, 1, 0.36, 1), top 0.78s cubic-bezier(0.34, 1.25, 0.64, 1)";
  } else if (phase === "hopping-down") {
    transitionStyle = "left 0.55s ease-out, top 0.55s cubic-bezier(0.5, 0, 0.75, 1.2)";
  } else if (phase === "walking-btn") {
    transitionStyle = "left 2.0s linear, top 0.2s ease";
  } else if (phase === "walking-page") {
    transitionStyle = "left 2.6s linear, top 0.6s ease";
  } else if (isClimbing) {
    transitionStyle = "left 0.32s ease-in-out, top 0.32s cubic-bezier(0.25, 1, 0.5, 1)";
  }

  function handleMascotClick() {
    if (phase === "hanging") {
      startJumpToBtnRef.current();
    } else if (isWalking || isIndicating) {
      startClimbingUpRef.current();
    }
  }

  return (
    <div
      aria-label="JeevanReport Animated Mascot"
      title={
        isClimbing
          ? "Climbing up hand-over-hand to the logo handle!"
          : isIndicating
          ? "Pointing out the scan button! Click to climb."
          : isWalking
          ? "Exploring the page! Click to climb."
          : "Hanging from the JeevanReport scanner handle."
      }
      onClick={handleMascotClick}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 32,
        height: 42,
        zIndex: 9999,
        pointerEvents: isHanging || isWalking || isIndicating ? "auto" : "none",
        cursor: "pointer",
        transition: transitionStyle,
        transform: pos.flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <div
          className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-amber-300 bg-amber-50/95 px-2.5 py-1 text-[11px] font-bold text-espresso shadow-lg backdrop-blur-sm pointer-events-none animate-bounce"
          style={{ animationDuration: "1.2s", transform: pos.flipped ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)" }}
        >
          <div className="flex items-center gap-1.5">
            <span>📸</span>
            <span>{speechBubble}</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-amber-300" />
        </div>
      )}

      {/* Indicator Arrow */}
      {showArrow && (
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-base animate-bounce"
          style={{ animationDuration: "0.6s", transform: pos.flipped ? "translateX(-50%) scaleX(-1)" : "translateX(-50%)" }}
        >
          👇
        </div>
      )}

      <svg
        viewBox="0 0 32 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 32,
          height: 42,
          overflow: "visible",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.18))",
        }}
      >
        {/* =================== 1. HANGING ON LOGO POSE =================== */}
        {isHanging && (
          <g id="pose-hanging">
            {/* Left Arm grasping handle of logo */}
            <path d="M 10 18 L 11.8 6.5" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
            <path
              d="M 9.5 8 L 9.5 3 C 9.5 1.5, 14 1.5, 14 3 L 14 8 Z"
              fill="#fed7aa"
              stroke="#d97706"
              strokeWidth={0.8}
            />
            <line x1="11" y1="2.5" x2="11" y2="6.5" stroke="#d97706" strokeWidth={0.6} strokeLinecap="round" />
            <line x1="12.5" y1="2.5" x2="12.5" y2="6.5" stroke="#d97706" strokeWidth={0.6} strokeLinecap="round" />

            {/* Blue Hoodie Body */}
            <path d="M 10 19 C 9 23, 10 26, 12 27 L 17 27 C 19 26, 20 23, 19 19 Z" fill="#2563eb" />
            <line x1="14.5" y1="19" x2="14.5" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Dangling Kicking Legs */}
            <rect x="11" y="26.5" width="2.4" height="4.5" rx="1" fill="#1d4ed8" />
            <ellipse cx="12" cy="31.5" rx="2" ry="1.4" fill="#0f172a" />
            <path d="M 15.5 26.5 L 18.5 30.5" stroke="#1d4ed8" strokeWidth={2.4} strokeLinecap="round" />
            <ellipse cx="19.5" cy="31" rx="2" ry="1.4" fill="#0f172a" transform="rotate(-20 19.5 31)" />

            {/* Chibi Head */}
            <circle cx="15" cy="13.5" r="6.2" fill="#fed7aa" />
            <path
              d="M 9.5 12.5 C 9 8, 12 6.5, 15 6.5 C 18 6.5, 21 8, 20.5 12.5 C 19 11.2, 17 11.2, 15 12 C 13 11.2, 11 11.2, 9.5 12.5 Z"
              fill="#0f172a"
            />
            <circle cx="18.5" cy="8.5" r="1.1" fill="#fbbf24" />

            {/* Eyes */}
            <circle cx="13" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="12.7" cy="13.6" r="0.45" fill="#ffffff" />
            <circle cx="17" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="16.7" cy="13.6" r="0.45" fill="#ffffff" />

            {/* Cheeks & Smile */}
            <ellipse cx="11.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="18.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <path d="M 14 16.2 Q 15 17.4 16 16.2" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Right Arm Waving */}
            <path d="M 18 19 Q 21 16 24 12" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="25" cy="10" r="2.6" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
            <line x1="24.2" y1="8" x2="24.2" y2="5.5" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />
            <line x1="25.5" y1="7.5" x2="25.9" y2="5.2" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />

            {/* Sparkle */}
            <path d="M 29 4.5 Q 30.2 6.5 29 8.5" stroke="#fbbf24" strokeWidth={0.9} strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* =================== 2. JUMPING / HOPPING POSE =================== */}
        {isJumping && (
          <g id="pose-jumping">
            <circle cx="16" cy="12" r="6.2" fill="#fed7aa" />
            <path
              d="M 10.5 11 C 10 6.5, 13 5, 16 5 C 19 5, 22 6.5, 21.5 11 C 20 9.8, 18 9.8, 16 10.5 C 14 9.8, 12 9.8, 10.5 11 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="7" r="1.1" fill="#fbbf24" />

            {/* Wide Happy Eyes & Smile */}
            <circle cx="14" cy="12.5" r="1.3" fill="#0f172a" />
            <circle cx="13.7" cy="12" r="0.5" fill="#ffffff" />
            <circle cx="18" cy="12.5" r="1.3" fill="#0f172a" />
            <circle cx="17.7" cy="12" r="0.5" fill="#ffffff" />
            <path d="M 14.5 14.5 Q 16 17 17.5 14.5 Z" fill="#9a3412" />

            {/* Hoodie */}
            <path d="M 11 17 C 10 21, 11 24, 13 25 L 19 25 C 21 24, 22 21, 21 17 Z" fill="#2563eb" />
            <line x1="16" y1="17" x2="16" y2="23" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Arms up in air */}
            <path d="M 11 18 Q 8 13 6 8" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="5" cy="7" r="2.3" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />
            <path d="M 21 18 Q 24 13 26 8" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="27" cy="7" r="2.3" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Tucked jumping legs */}
            <path d="M 12 25 Q 9 29 12 31" stroke="#1d4ed8" strokeWidth={2.8} strokeLinecap="round" />
            <ellipse cx="12" cy="32" rx="2" ry="1.4" fill="#0f172a" />
            <path d="M 20 25 Q 23 29 20 31" stroke="#1d4ed8" strokeWidth={2.8} strokeLinecap="round" />
            <ellipse cx="20" cy="32" rx="2" ry="1.4" fill="#0f172a" />
          </g>
        )}

        {/* =================== 3. WALKING POSE =================== */}
        {isWalking && (
          <g id="pose-walking">
            <circle cx="16" cy="11.5" r="6" fill="#fed7aa" />
            <path
              d="M 10.5 10.5 C 10 6.5, 13 4.5, 16 4.5 C 19 4.5, 22 6.5, 21.5 10.5 C 20 9.5, 18 9.5, 16 10 C 14 9.5, 12 9.5, 10.5 10.5 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="6.5" r="1.1" fill="#fbbf24" />

            {/* Happy Walking Eyes & Smile */}
            <circle cx="14" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="13.7" cy="11.6" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="17.7" cy="11.6" r="0.45" fill="#ffffff" />
            <path d="M 14.8 14 Q 16 15.2 17.2 14" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Hoodie */}
            <path d="M 11 16.5 C 10 20.5, 11 23.5, 13 24.5 L 19 24.5 C 21 23.5, 22 20.5, 21 16.5 Z" fill="#2563eb" />
            <line x1="16" y1="16.5" x2="16" y2="22" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Natural Swinging Human Arms & Legs */}
            {walkLegStep === 0 ? (
              <>
                {/* Left arm forward */}
                <path d="M 11 17 Q 8 20 7 24" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                <circle cx="6.5" cy="24.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                {/* Right arm back */}
                <path d="M 21 17 Q 24 19 25 22" stroke="#2563eb" strokeWidth={2.8} strokeLinecap="round" />
                <circle cx="25.5" cy="22.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                {/* Legs: Left forward, Right back */}
                <path d="M 13 24.5 L 9.5 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="9" cy="33.2" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22 31" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23" cy="32" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            ) : (
              <>
                {/* Left arm back */}
                <path d="M 11 17 Q 9 20 10 24" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />
                <circle cx="10.2" cy="24.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                {/* Right arm forward */}
                <path d="M 21 17 Q 24 15 25 19" stroke="#2563eb" strokeWidth={2.8} strokeLinecap="round" />
                <circle cx="25.5" cy="19.5" r="2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.5} />
                {/* Legs: Right forward, Left back */}
                <path d="M 13 24.5 L 11 31" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="10.5" cy="32" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22.5 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23.5" cy="33.2" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            )}
          </g>
        )}

        {/* =================== 4. INDICATING / POINTING POSE =================== */}
        {isIndicating && (
          <g id="pose-indicating">
            {/* Chibi Head looking down-forward at the button */}
            <circle cx="16" cy="12" r="6.2" fill="#fed7aa" />
            <path
              d="M 10.5 11 C 10 6.5, 13 5, 16 5 C 19 5, 22 6.5, 21.5 11 C 20 9.8, 18 9.8, 16 10.5 C 14 9.8, 12 9.8, 10.5 11 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="7" r="1.1" fill="#fbbf24" />

            {/* Enthusiastic Big Eyes looking down at button */}
            <circle cx="14" cy="13" r="1.3" fill="#0f172a" />
            <circle cx="14" cy="13.5" r="0.5" fill="#ffffff" />
            <circle cx="18" cy="13" r="1.3" fill="#0f172a" />
            <circle cx="18" cy="13.5" r="0.5" fill="#ffffff" />
            <ellipse cx="11.5" cy="15" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="20.5" cy="15" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <path d="M 14.5 15.5 Q 16 17.5 17.5 15.5 Z" fill="#9a3412" />

            {/* Hoodie */}
            <path d="M 11 17 C 10 21, 11 24, 13 25 L 19 25 C 21 24, 22 21, 21 17 Z" fill="#2563eb" />
            <line x1="16" y1="17" x2="16" y2="23" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* BOTH ARMS POINTING DOWN ENTHUSIASTICALLY AT BUTTON */}
            {/* Left Arm pointing down */}
            <path d="M 11 18 L 8 28" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
            <circle cx="7.5" cy="29" r="2.2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />
            <line x1="7.5" y1="29.5" x2="7.5" y2="33.5" stroke="#d97706" strokeWidth={1} strokeLinecap="round" />

            {/* Right Arm pointing down */}
            <path d="M 21 18 L 24 28" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
            <circle cx="24.5" cy="29" r="2.2" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />
            <line x1="24.5" y1="29.5" x2="24.5" y2="33.5" stroke="#d97706" strokeWidth={1} strokeLinecap="round" />

            {/* Sturdy standing legs on top of button */}
            <rect x="11.5" y="25" width="2.6" height="6" rx="1" fill="#1d4ed8" />
            <ellipse cx="12.5" cy="31.8" rx="2.5" ry="1.5" fill="#0f172a" />
            <rect x="18" y="25" width="2.6" height="6" rx="1" fill="#1d4ed8" />
            <ellipse cx="19.5" cy="31.8" rx="2.5" ry="1.5" fill="#0f172a" />

            {/* Sparkles around pointing hands */}
            <circle cx="4" cy="33" r="1.2" fill="#fbbf24" />
            <circle cx="28" cy="33" r="1.2" fill="#fbbf24" />
          </g>
        )}

        {/* =================== 5. REAL PERSON CLIMBING POSE =================== */}
        {isClimbing && (
          <g id="pose-climbing">
            {/* Chibi Head Tilted Back Looking Straight UP at Handhold */}
            <circle cx="16" cy="13" r="6.2" fill="#fed7aa" />

            {/* Cap Tilted Back */}
            <path
              d="M 10 11.5 C 10 6.5, 13 4.5, 16 4.5 C 19 4.5, 22 6.5, 22 11.5 C 20.5 10.2, 18 10.2, 16 10.8 C 14 10.2, 11.5 10.2, 10 11.5 Z"
              fill="#0f172a"
            />
            <circle cx="16" cy="6.2" r="1.2" fill="#fbbf24" />

            {/* Eyes looking UP at reaching hands */}
            <circle cx="13.5" cy="11.8" r="1.3" fill="#0f172a" />
            <circle cx="13.5" cy="11.1" r="0.5" fill="#ffffff" />
            <circle cx="18.5" cy="11.8" r="1.3" fill="#0f172a" />
            <circle cx="18.5" cy="11.1" r="0.5" fill="#ffffff" />

            {/* Grin */}
            <path d="M 14.5 15.6 Q 16 17.2 17.5 15.6" stroke="#9a3412" strokeWidth={1} strokeLinecap="round" fill="none" />
            <ellipse cx="11.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="20.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />

            {/* Athletic Torso with Chalk Bag */}
            <path d="M 11 18 C 10 22, 11 25, 13 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />
            <rect x="14" y="25" width="4" height="3" rx="1" fill="#f59e0b" />

            {/* Alternating Hand-over-hand Climbing Arms & Legs */}
            {climbStep === 0 ? (
              <>
                {/* Left Arm extended HIGH UP overhead grasping hold */}
                <path d="M 11 18 L 8 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="7.8" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="6.8" y1="2" x2="6.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="8.2" y1="1.8" x2="8.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                {/* Right Arm bent sharply at chest level pulling up */}
                <path d="M 21 18 Q 24 16 23 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="23" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                {/* Left Leg: Knee bent high near waist */}
                <path d="M 12 26 L 8 29 L 9 33" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="9" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Right Leg: Extended downward pushing off */}
                <path d="M 19 26 L 22 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="22" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />

                <circle cx="8" cy="1" r="1.2" fill="#ffffff" opacity={0.7} />
              </>
            ) : (
              <>
                {/* Left Arm bent sharply at chest level pulling up */}
                <path d="M 11 18 Q 8 16 9 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="9" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                {/* Right Arm extended HIGH UP overhead grasping hold */}
                <path d="M 21 18 L 24 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="24.2" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="23.8" y1="2" x2="23.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="25.2" y1="1.8" x2="25.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                {/* Left Leg: Extended downward pushing off */}
                <path d="M 13 26 L 10 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="10" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Right Leg: Knee bent high near waist */}
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
