"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "hanging" | "jumping-to-btn" | "walking" | "jumping-back";

export default function AnimatedMascot() {
  const [phase, setPhase] = useState<Phase>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false, isMoving: false });
  const [walkLegStep, setWalkLegStep] = useState(0); // 0 or 1 for leg animation
  const phaseRef = useRef<Phase>("hanging");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  function clearAllTimers() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    intervalsRef.current.forEach((i) => clearInterval(i));
    intervalsRef.current = [];
  }

  // Returns exact screen coordinates for the handle midpoint of #site-logo
  // Logo viewBox is 0 0 56 58, handle midpoint is (33, 29.5)
  // Mascot hand grip center inside its 32x42 box is at (11.8, 5)
  const getLogoGripPos = useCallback(() => {
    const logo = document.querySelector("#site-logo") as HTMLElement | null;
    if (!logo) return null;
    const rect = logo.getBoundingClientRect();
    const handleMidX = (33 / 56) * rect.width;
    const handleMidY = (29.5 / 58) * rect.height;
    return {
      x: rect.left + handleMidX - 11.8,
      y: rect.top + handleMidY - 5,
    };
  }, []);

  // Returns button coordinates for the mascot to stand on top of #hero-scan-btn
  const getBtnBounds = useCallback(() => {
    const btn = document.querySelector("#hero-scan-btn") as HTMLElement | null;
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return {
      left: rect.left + 16,
      right: rect.right - 36,
      top: rect.top - 34,
      width: rect.width,
    };
  }, []);

  // Jump from button back to logo
  const triggerJumpBack = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "jumping-back";
    setPhase("jumping-back");

    const grip = getLogoGripPos();
    if (grip) {
      setPos({ x: grip.x, y: grip.y, visible: true, flipped: false, isMoving: true });
    }

    const t = setTimeout(() => {
      phaseRef.current = "hanging";
      setPhase("hanging");
      setPos((prev) => ({ ...prev, isMoving: false }));

      // Hang at logo for 3 seconds, then jump again
      const nextJump = setTimeout(() => {
        startJumpToBtn();
      }, 3000);
      timersRef.current.push(nextJump);
    }, 850);
    timersRef.current.push(t);
  }, [getLogoGripPos]);

  // Start walking back and forth along the top of the button for 3 minutes (180 seconds)
  const startWalkingLoop = useCallback(() => {
    phaseRef.current = "walking";
    setPhase("walking");

    // Leg stride animation interval (swaps legs every 180ms while walking)
    const legInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
    }, 180);
    intervalsRef.current.push(legInterval);

    let walkDirection: "right" | "left" = "right";

    function stepWalk() {
      if (phaseRef.current !== "walking") return;
      const bounds = getBtnBounds();
      if (!bounds) return;

      const targetX = walkDirection === "right" ? bounds.right : bounds.left;
      const targetFlipped = walkDirection === "left";

      setPos((prev) => ({
        x: targetX,
        y: bounds.top,
        visible: true,
        flipped: targetFlipped,
        isMoving: true,
      }));

      // Time to cross the button (~3.2 seconds)
      const crossTimer = setTimeout(() => {
        if (phaseRef.current !== "walking") return;

        // Brief pause at the edge (400ms), then turn around
        walkDirection = walkDirection === "right" ? "left" : "right";
        const pauseTimer = setTimeout(() => {
          if (phaseRef.current !== "walking") return;
          stepWalk();
        }, 400);
        timersRef.current.push(pauseTimer);
      }, 3200);
      timersRef.current.push(crossTimer);
    }

    // Begin first cross
    stepWalk();

    // The user requested: "reduce the walking time to 30 sec only" (30 seconds = 30,000 ms)
    const thirtySecTimer = setTimeout(() => {
      triggerJumpBack();
    }, 30000);
    timersRef.current.push(thirtySecTimer);
  }, [getBtnBounds, triggerJumpBack]);

  // Jump from logo down to scan barcode button
  const startJumpToBtn = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "jumping-to-btn";
    setPhase("jumping-to-btn");

    const bounds = getBtnBounds();
    if (!bounds) {
      // If button not on screen, retry in 3 seconds
      const retry = setTimeout(startJumpToBtn, 3000);
      timersRef.current.push(retry);
      return;
    }

    // Land on left side of button
    setPos({ x: bounds.left, y: bounds.top, visible: true, flipped: false, isMoving: true });

    // Jump duration 850ms, then start 3-minute walking loop
    const t = setTimeout(() => {
      startWalkingLoop();
    }, 850);
    timersRef.current.push(t);
  }, [getBtnBounds, startWalkingLoop]);

  // Initial positioning & cycle trigger on mount
  useEffect(() => {
    // Initial mount: position mascot at the middle of the scanner handle
    function alignToLogo() {
      const grip = getLogoGripPos();
      if (grip) {
        setPos({ x: grip.x, y: grip.y, visible: true, flipped: false, isMoving: false });
      }
    }

    // Wait 150ms for initial DOM layout to settle
    const initTimer = setTimeout(() => {
      alignToLogo();

      // Hang at the logo for 2.5 seconds, then leap to the button
      const firstJump = setTimeout(() => {
        startJumpToBtn();
      }, 2500);
      timersRef.current.push(firstJump);
    }, 150);
    timersRef.current.push(initTimer);

    // Keep position updated if window resizes or scrolls
    function handleScrollOrResize() {
      if (phaseRef.current === "hanging") {
        const grip = getLogoGripPos();
        if (grip) {
          setPos((prev) => ({ ...prev, x: grip.x, y: grip.y, visible: true }));
        }
      } else if (phaseRef.current === "walking") {
        const bounds = getBtnBounds();
        if (bounds) {
          setPos((prev) => ({ ...prev, y: bounds.top }));
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
  }, [getLogoGripPos, getBtnBounds, startJumpToBtn]);

  if (!pos.visible) return null;

  const isHanging = phase === "hanging";
  const isJumping = phase === "jumping-to-btn" || phase === "jumping-back";
  const isWalking = phase === "walking";

  // Transition dynamics
  let transitionStyle = "none";
  if (isJumping) {
    transitionStyle =
      "left 0.85s cubic-bezier(0.22, 1, 0.36, 1), top 0.85s cubic-bezier(0.34, 1.25, 0.64, 1)";
  } else if (isWalking) {
    transitionStyle = "left 3.2s linear, top 0.2s ease";
  }

  return (
    <div
      aria-label="JeevanReport Animated Mascot"
      title={isWalking ? "Mascot walking on Scan button! Click me to jump back to logo anytime, or wait for the 30-second stroll." : undefined}
      onClick={isWalking ? triggerJumpBack : undefined}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 32,
        height: 42,
        zIndex: 9999,
        pointerEvents: isWalking ? "auto" : "none",
        cursor: isWalking ? "pointer" : "default",
        transition: transitionStyle,
        transform: pos.flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      <svg
        viewBox="0 0 32 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 32,
          height: 42,
          overflow: "visible",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
        }}
      >
        {/* =================== HANGING POSE =================== */}
        {isHanging && (
          <g id="pose-hanging">
            {/* Left Arm from shoulder (10, 18) up to hand (12, 6) */}
            <path d="M 10 18 L 11.8 6.5" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />

            {/* Left Hand wrapping over middle of slanted scanner handle */}
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

            {/* Dark Cap with Golden Star Pin */}
            <path
              d="M 9.5 12.5 C 9 8, 12 6.5, 15 6.5 C 18 6.5, 21 8, 20.5 12.5 C 19 11.2, 17 11.2, 15 12 C 13 11.2, 11 11.2, 9.5 12.5 Z"
              fill="#0f172a"
            />
            <circle cx="18.5" cy="8.5" r="1.1" fill="#fbbf24" />

            {/* Expressive Eyes */}
            <circle cx="13" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="12.7" cy="13.6" r="0.45" fill="#ffffff" />
            <circle cx="17" cy="14" r="1.2" fill="#0f172a" />
            <circle cx="16.7" cy="13.6" r="0.45" fill="#ffffff" />

            {/* Rosy Cheeks */}
            <ellipse cx="11.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="18.5" cy="16" rx="1" ry="0.6" fill="#f43f5e" opacity="0.6" />

            {/* Smile */}
            <path d="M 14 16.2 Q 15 17.4 16 16.2" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Right Arm from shoulder (18, 19) reaching up to WAVE */}
            <path d="M 18 19 Q 21 16 24 12" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />

            {/* Waving Palm and Fingers */}
            <circle cx="25" cy="10" r="2.6" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
            <line x1="24.2" y1="8" x2="24.2" y2="5.5" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />
            <line x1="25.5" y1="7.5" x2="25.9" y2="5.2" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />
            <line x1="26.8" y1="8.2" x2="27.6" y2="6.2" stroke="#d97706" strokeWidth={0.8} strokeLinecap="round" />

            {/* Gold Sparkles */}
            <path d="M 29 4.5 Q 30.2 6.5 29 8.5" stroke="#fbbf24" strokeWidth={0.9} strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* =================== JUMPING POSE =================== */}
        {isJumping && (
          <g id="pose-jumping">
            {/* Chibi Head */}
            <circle cx="16" cy="12" r="6.2" fill="#fed7aa" />

            {/* Cap with Star */}
            <path
              d="M 10.5 11 C 10 6.5, 13 5, 16 5 C 19 5, 22 6.5, 21.5 11 C 20 9.8, 18 9.8, 16 10.5 C 14 9.8, 12 9.8, 10.5 11 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="7" r="1.1" fill="#fbbf24" />

            {/* Eyes open wide with joy */}
            <circle cx="14" cy="12.5" r="1.3" fill="#0f172a" />
            <circle cx="13.7" cy="12" r="0.5" fill="#ffffff" />
            <circle cx="18" cy="12.5" r="1.3" fill="#0f172a" />
            <circle cx="17.7" cy="12" r="0.5" fill="#ffffff" />

            {/* Big Joyful Open Smile */}
            <path d="M 14.5 14.5 Q 16 17 17.5 14.5 Z" fill="#9a3412" />

            {/* Hoodie Body */}
            <path d="M 11 17 C 10 21, 11 24, 13 25 L 19 25 C 21 24, 22 21, 21 17 Z" fill="#2563eb" />
            <line x1="16" y1="17" x2="16" y2="23" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Left Arm raised up in mid-air */}
            <path d="M 11 18 Q 8 13 6 8" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="5" cy="7" r="2.3" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Right Arm raised up in mid-air */}
            <path d="M 21 18 Q 24 13 26 8" stroke="#2563eb" strokeWidth={3.2} strokeLinecap="round" />
            <circle cx="27" cy="7" r="2.3" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />

            {/* Tucked jumping legs */}
            <path d="M 12 25 Q 9 29 12 31" stroke="#1d4ed8" strokeWidth={2.8} strokeLinecap="round" />
            <ellipse cx="12" cy="32" rx="2" ry="1.4" fill="#0f172a" />
            <path d="M 20 25 Q 23 29 20 31" stroke="#1d4ed8" strokeWidth={2.8} strokeLinecap="round" />
            <ellipse cx="20" cy="32" rx="2" ry="1.4" fill="#0f172a" />
          </g>
        )}

        {/* =================== WALKING POSE =================== */}
        {isWalking && (
          <g id="pose-walking">
            {/* Chibi Head */}
            <circle cx="16" cy="11.5" r="6.2" fill="#fed7aa" />

            {/* Cap with Star */}
            <path
              d="M 10.5 10.5 C 10 6, 13 4.5, 16 4.5 C 19 4.5, 22 6, 21.5 10.5 C 20 9.2, 18 9.2, 16 10 C 14 9.2, 12 9.2, 10.5 10.5 Z"
              fill="#0f172a"
            />
            <circle cx="19.5" cy="6.5" r="1.1" fill="#fbbf24" />

            {/* Eyes */}
            <circle cx="14" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="13.7" cy="11.6" r="0.45" fill="#ffffff" />
            <circle cx="18" cy="12" r="1.2" fill="#0f172a" />
            <circle cx="17.7" cy="11.6" r="0.45" fill="#ffffff" />

            {/* Cheerful Smile */}
            <path d="M 14.8 14 Q 16 15.2 17.2 14" stroke="#9a3412" strokeWidth={0.8} strokeLinecap="round" fill="none" />

            {/* Hoodie Body */}
            <path d="M 11 16.5 C 10 20.5, 11 23.5, 13 24.5 L 19 24.5 C 21 23.5, 22 20.5, 21 16.5 Z" fill="#2563eb" />
            <line x1="16" y1="16.5" x2="16" y2="22" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />

            {/* Left Arm swinging naturally */}
            <path
              d={walkLegStep === 0 ? "M 11 17 Q 8 20 7 23" : "M 11 17 Q 9 20 10 24"}
              stroke="#2563eb"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle
              cx={walkLegStep === 0 ? 6.5 : 10.2}
              cy={walkLegStep === 0 ? 23.5 : 24.5}
              r={2}
              fill="#fed7aa"
              stroke="#d97706"
              strokeWidth={0.5}
            />

            {/* Right Arm waving slightly as he walks */}
            <path d="M 21 17 Q 24 14 26 10" stroke="#2563eb" strokeWidth={2.8} strokeLinecap="round" />
            <circle cx="27" cy="9" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.6} />
            <line x1="26.5" y1="7" x2="26.5" y2="4.8" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
            <line x1="27.8" y1="6.8" x2="28.2" y2="4.6" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

            {/* Active Walking Legs (alternating stride) */}
            {walkLegStep === 0 ? (
              // Step A: Left leg forward, Right leg back
              <>
                <path d="M 13 24.5 L 9.5 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="9" cy="33.2" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22 31" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23" cy="32" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            ) : (
              // Step B: Right leg forward, Left leg back
              <>
                <path d="M 13 24.5 L 11 31" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="10.5" cy="32" rx="2.4" ry="1.4" fill="#0f172a" />
                <path d="M 19 24.5 L 22.5 32" stroke="#1d4ed8" strokeWidth={2.6} strokeLinecap="round" />
                <ellipse cx="23.5" cy="33.2" rx="2.4" ry="1.4" fill="#0f172a" />
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
