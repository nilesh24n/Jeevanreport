"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "hanging" | "jumping-to-btn" | "walking-btn" | "hopping-down" | "walking-page" | "climbing";

export default function AnimatedMascot() {
  const [phase, setPhase] = useState<Phase>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false });
  const [walkLegStep, setWalkLegStep] = useState(0); // 0 or 1 for leg animation
  const [climbStep, setClimbStep] = useState(0); // 0 or 1 for hand-over-hand climbing
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
      top: rect.top - 36,
      width: rect.width,
    };
  }, []);

  // Forward references to chain animation functions cleanly
  const startJumpToBtnRef = useRef<() => void>(() => {});
  const startWalkingBtnRef = useRef<() => void>(() => {});
  const startHopDownRef = useRef<() => void>(() => {});
  const startWalkingPageRef = useRef<() => void>(() => {});
  const startClimbingUpRef = useRef<() => void>(() => {});

  // -------------------------------------------------------------
  // 1. REAL PERSON HAND-OVER-HAND CLIMBING UP FROM PAGE TO LOGO
  // -------------------------------------------------------------
  const startClimbingUp = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "climbing";
    setPhase("climbing");

    const grip = getLogoGripPos();
    if (!grip) return;

    // Get current position where mascot is standing down the page
    const currentX = pos.x;
    const currentY = pos.y;
    const targetX = grip.x;
    const targetY = grip.y;

    // Total distance to climb
    const totalDistY = currentY - targetY;
    // Perform 8 realistic hand-over-hand climbing pulls
    const numSteps = 8;
    const stepDuration = 320; // 320ms per climbing pull
    let currentStepIndex = 0;

    // Alternating hand/foot climbing animation (swaps every 160ms)
    const climbInterval = setInterval(() => {
      setClimbStep((s) => (s === 0 ? 1 : 0));
    }, 160);
    intervalsRef.current.push(climbInterval);

    function doClimbStep() {
      if (phaseRef.current !== "climbing") return;

      currentStepIndex++;
      const progress = Math.min(1, currentStepIndex / numSteps);

      // Realistic climbing sway (weight shifts left-right as arms pull)
      const swayOffset = currentStepIndex % 2 === 0 ? 4 : -4;
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
        // Reached the logo! Catch the handle and hang
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

          // Hang at the logo for 3.5 seconds, then jump down to begin the journey again!
          const nextCycleTimer = setTimeout(() => {
            startJumpToBtnRef.current();
          }, 3500);
          timersRef.current.push(nextCycleTimer);
        }, 250);
        timersRef.current.push(finishTimer);
      }
    }

    // Begin first climbing reach
    doClimbStep();
  }, [getLogoGripPos, pos.x, pos.y]);

  startClimbingUpRef.current = startClimbingUp;

  // -------------------------------------------------------------
  // 2. WALKING DOWN THROUGH THE PAGE (From Hero down to lower page)
  // -------------------------------------------------------------
  const startWalkingPage = useCallback(() => {
    phaseRef.current = "walking-page";
    setPhase("walking-page");

    // Natural human leg stride interval (swaps legs every 170ms)
    const legInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
    }, 170);
    intervalsRef.current.push(legInterval);

    // Mascot walks across lower page from left to right, then pauses, then begins climbing!
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    const lowerY = Math.min(typeof window !== "undefined" ? window.innerHeight - 80 : 540, 560);
    const walkRightX = Math.min(screenWidth - 100, pos.x + 220);

    // Stride across to the right
    setPos({
      x: walkRightX,
      y: lowerY,
      visible: true,
      flipped: false,
    });

    // Walk for 3.0 seconds to right
    const walk1 = setTimeout(() => {
      if (phaseRef.current !== "walking-page") return;

      // Turn around and walk slightly left toward the climb line
      const grip = getLogoGripPos();
      const climbBaseX = grip ? grip.x + 30 : pos.x;

      setPos({
        x: climbBaseX,
        y: lowerY,
        visible: true,
        flipped: true,
      });

      // Walk back for 2.6 seconds, then start climbing up!
      const walk2 = setTimeout(() => {
        clearInterval(legInterval);
        startClimbingUpRef.current();
      }, 2600);
      timersRef.current.push(walk2);
    }, 3000);
    timersRef.current.push(walk1);
  }, [getLogoGripPos, pos.x]);

  startWalkingPageRef.current = startWalkingPage;

  // -------------------------------------------------------------
  // 3. HOPPING DOWN FROM THE BUTTON TO LOWER PAGE
  // -------------------------------------------------------------
  const startHopDown = useCallback(() => {
    phaseRef.current = "hopping-down";
    setPhase("hopping-down");

    const btn = getBtnBounds();
    const hopTargetX = btn ? btn.right + 20 : pos.x + 40;
    const hopTargetY = btn ? btn.top + 130 : pos.y + 130;

    // Little jump down off the edge
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
  }, [getBtnBounds, pos.x, pos.y]);

  startHopDownRef.current = startHopDown;

  // -------------------------------------------------------------
  // 4. WALKING ON TOP OF SCAN BUTTON FOR ~3 SECONDS
  // -------------------------------------------------------------
  const startWalkingBtn = useCallback(() => {
    phaseRef.current = "walking-btn";
    setPhase("walking-btn");

    const legInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
    }, 180);
    intervalsRef.current.push(legInterval);

    const bounds = getBtnBounds();
    if (bounds) {
      // Walk across from left side to right side of button
      setPos({
        x: bounds.right,
        y: bounds.top,
        visible: true,
        flipped: false,
      });
    }

    // Walk across button for 2.6s, then hop down to walk the page!
    const btnWalkTimer = setTimeout(() => {
      clearInterval(legInterval);
      startHopDownRef.current();
    }, 2600);
    timersRef.current.push(btnWalkTimer);
  }, [getBtnBounds]);

  startWalkingBtnRef.current = startWalkingBtn;

  // -------------------------------------------------------------
  // 5. JUMP FROM LOGO DOWN TO SCAN BARCODE BUTTON
  // -------------------------------------------------------------
  const startJumpToBtn = useCallback(() => {
    clearAllTimers();
    phaseRef.current = "jumping-to-btn";
    setPhase("jumping-to-btn");

    const bounds = getBtnBounds();
    if (!bounds) {
      // If button not on screen, retry in 2.5s
      const retry = setTimeout(() => startJumpToBtnRef.current(), 2500);
      timersRef.current.push(retry);
      return;
    }

    // Jump and land on left side of the button
    setPos({
      x: bounds.left,
      y: bounds.top,
      visible: true,
      flipped: false,
    });

    // Jump trajectory duration 800ms, then start walking on button
    const jumpTimer = setTimeout(() => {
      startWalkingBtnRef.current();
    }, 800);
    timersRef.current.push(jumpTimer);
  }, [getBtnBounds]);

  startJumpToBtnRef.current = startJumpToBtn;

  // -------------------------------------------------------------
  // INITIAL MOUNT & RESIZE LISTENER
  // -------------------------------------------------------------
  useEffect(() => {
    function alignToLogo() {
      const grip = getLogoGripPos();
      if (grip) {
        setPos({ x: grip.x, y: grip.y, visible: true, flipped: false });
        return true;
      }
      return false;
    }

    // Align to logo on mount
    const initTimer = setTimeout(() => {
      const found = alignToLogo();
      if (!found) {
        const retryTimer = setTimeout(alignToLogo, 200);
        timersRef.current.push(retryTimer);
      }

      // Hang at the logo for 3.0 seconds, then start the journey!
      const firstJump = setTimeout(() => {
        startJumpToBtnRef.current();
      }, 3000);
      timersRef.current.push(firstJump);
    }, 150);
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
  }, [getLogoGripPos]);

  if (!pos.visible) return null;

  const isHanging = phase === "hanging";
  const isJumping = phase === "jumping-to-btn" || phase === "hopping-down";
  const isWalking = phase === "walking-btn" || phase === "walking-page";
  const isClimbing = phase === "climbing";

  // Transition dynamics
  let transitionStyle = "none";
  if (phase === "jumping-to-btn") {
    transitionStyle =
      "left 0.8s cubic-bezier(0.22, 1, 0.36, 1), top 0.8s cubic-bezier(0.34, 1.25, 0.64, 1)";
  } else if (phase === "hopping-down") {
    transitionStyle = "left 0.55s ease-out, top 0.55s cubic-bezier(0.5, 0, 0.75, 1.2)";
  } else if (phase === "walking-btn") {
    transitionStyle = "left 2.6s linear, top 0.2s ease";
  } else if (phase === "walking-page") {
    transitionStyle = "left 2.8s linear, top 0.6s ease";
  } else if (isClimbing) {
    // Smooth, rhythmic climbing pull (takes 320ms per pull)
    transitionStyle = "left 0.32s ease-in-out, top 0.32s cubic-bezier(0.25, 1, 0.5, 1)";
  }

  return (
    <div
      aria-label="JeevanReport Animated Mascot"
      title={
        isClimbing
          ? "Climbing up like a real person to the logo handle!"
          : isWalking
          ? "Exploring and walking through the page! Click to climb."
          : "Hanging from the JeevanReport scanner handle."
      }
      onClick={isWalking ? () => startClimbingUpRef.current() : undefined}
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
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
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

        {/* =================== 3. WALKING THROUGH PAGE POSE =================== */}
        {isWalking && (
          <g id="pose-walking">
            <circle cx="16" cy="11.5" r="6.2" fill="#fed7aa" />
            <path
              d="M 10.5 10.5 C 10 6, 13 4.5, 16 4.5 C 19 4.5, 22 6, 21.5 10.5 C 20 9.2, 18 9.2, 16 10 C 14 9.2, 12 9.2, 10.5 10.5 Z"
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

            {/* Natural Swinging Human Arms (opposing legs) */}
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

        {/* =================== 4. REAL PERSON CLIMBING POSE =================== */}
        {isClimbing && (
          <g id="pose-climbing-real">
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

            {/* Determined Cheerful Grin */}
            <path d="M 14.5 15.6 Q 16 17.2 17.5 15.6" stroke="#9a3412" strokeWidth={1} strokeLinecap="round" fill="none" />
            <ellipse cx="11.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="20.5" cy="14" rx="1.1" ry="0.6" fill="#f43f5e" opacity="0.6" />

            {/* Athletic Torso with Chalk Bag Belt */}
            <path d="M 11 18 C 10 22, 11 25, 13 26 L 19 26 C 21 25, 22 22, 21 18 Z" fill="#2563eb" />
            <line x1="16" y1="18" x2="16" y2="24" stroke="#fbbf24" strokeWidth={1.2} strokeLinecap="round" />
            {/* Chalk bag on back belt */}
            <rect x="14" y="25" width="4" height="3" rx="1" fill="#f59e0b" />

            {/* REALISTIC HAND-OVER-HAND CLIMBING ARMS & LEGS */}
            {climbStep === 0 ? (
              // STROKE A: LEFT ARM REACHES WAY UP OVERHEAD; RIGHT ARM PULLS AT CHEST; LEFT KNEE HIGH
              <>
                {/* Left Arm extended HIGH UP overhead grasping hold */}
                <path d="M 11 18 L 8 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                {/* Left Hand gripping handhold */}
                <circle cx="7.8" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="6.8" y1="2" x2="6.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="8.2" y1="1.8" x2="8.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                {/* Right Arm bent sharply at chest level, pulling climber body up */}
                <path d="M 21 18 Q 24 16 23 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="23" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                {/* Left Leg: Knee bent high near waist, finding new foothold */}
                <path d="M 12 26 L 8 29 L 9 33" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="9" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Right Leg: Extended downward pushing off foothold */}
                <path d="M 19 26 L 22 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="22" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Climbing chalk puff at grip */}
                <circle cx="8" cy="1" r="1.2" fill="#ffffff" opacity={0.7} />
              </>
            ) : (
              // STROKE B: RIGHT ARM REACHES WAY UP OVERHEAD; LEFT ARM PULLS AT CHEST; RIGHT KNEE HIGH
              <>
                {/* Left Arm bent sharply at chest level, pulling climber body up */}
                <path d="M 11 18 Q 8 16 9 11" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                <circle cx="9" cy="9.5" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />

                {/* Right Arm extended HIGH UP overhead grasping hold */}
                <path d="M 21 18 L 24 4" stroke="#2563eb" strokeWidth={3.4} strokeLinecap="round" />
                {/* Right Hand gripping handhold */}
                <circle cx="24.2" cy="2.8" r="2.4" fill="#fed7aa" stroke="#d97706" strokeWidth={0.7} />
                <line x1="23.8" y1="2" x2="23.8" y2="0.5" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />
                <line x1="25.2" y1="1.8" x2="25.2" y2="0.3" stroke="#d97706" strokeWidth={0.7} strokeLinecap="round" />

                {/* Left Leg: Extended downward pushing off foothold */}
                <path d="M 13 26 L 10 34" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="10" cy="35" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Right Leg: Knee bent high near waist, finding new foothold */}
                <path d="M 20 26 L 24 29 L 23 33" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" />
                <ellipse cx="23" cy="34" rx="2.4" ry="1.4" fill="#0f172a" />

                {/* Climbing chalk puff at grip */}
                <circle cx="24" cy="1" r="1.2" fill="#ffffff" opacity={0.7} />
              </>
            )}

            {/* Dynamic Upward Climbing Motion Streaks */}
            <line x1="4" y1="28" x2="4" y2="34" stroke="#f59e0b" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
            <line x1="28" y1="28" x2="28" y2="34" stroke="#f59e0b" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
          </g>
        )}
      </svg>
    </div>
  );
}
