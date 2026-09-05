"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "hanging" | "jumping-to-btn" | "walking" | "jumping-back";

export default function AnimatedMascot() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("hanging");
  const [phase, setPhase] = useState<Phase>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function getLogoPos() {
    const logo = document.querySelector("#site-logo") as HTMLElement | null;
    if (!logo) return null;
    const rect = logo.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height };
  }

  function getBtnPos() {
    const btn = document.querySelector("#hero-scan-btn") as HTMLElement | null;
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top - 28 };
  }

  useEffect(() => {
    const logoPos = getLogoPos();
    if (!logoPos) return;
    setPos({ x: logoPos.x - 14, y: logoPos.y - 8, visible: true, flipped: false });

    function runCycle() {
      clearTimer();

      // Phase 1: hang at logo for 2 seconds
      phaseRef.current = "hanging";
      setPhase("hanging");

      timerRef.current = setTimeout(() => {
        const btnPos = getBtnPos();
        const logoPos2 = getLogoPos();
        if (!btnPos || !logoPos2) { timerRef.current = setTimeout(runCycle, 4000); return; }

        // Phase 2: jump to button
        phaseRef.current = "jumping-to-btn";
        setPhase("jumping-to-btn");
        setPos({ x: btnPos.x - 14, y: btnPos.y, visible: true, flipped: false });

        timerRef.current = setTimeout(() => {
          // Phase 3: walk across button
          phaseRef.current = "walking";
          setPhase("walking");

          const btnEl = document.querySelector("#hero-scan-btn") as HTMLElement | null;
          if (btnEl) {
            const btnRect = btnEl.getBoundingClientRect();
            setPos(p => ({ ...p, x: btnRect.left + 8, y: btnRect.top - 28 }));

            timerRef.current = setTimeout(() => {
              setPos(p => ({ ...p, x: btnRect.right - 8, y: btnRect.top - 28, flipped: true }));

              timerRef.current = setTimeout(() => {
                // Phase 4: jump back to logo
                phaseRef.current = "jumping-back";
                setPhase("jumping-back");
                const finalLogoPos = getLogoPos();
                if (finalLogoPos) {
                  setPos({ x: finalLogoPos.x - 14, y: finalLogoPos.y - 8, visible: true, flipped: false });
                }
                timerRef.current = setTimeout(runCycle, 2500);
              }, 1200);
            }, 600);
          } else {
            timerRef.current = setTimeout(runCycle, 3000);
          }
        }, 700);
      }, 2000);
    }

    // Delay first run until page is settled
    timerRef.current = setTimeout(runCycle, 1500);

    return () => clearTimer();
  }, []);

  // Don't render if logo or scan button not visible
  if (!pos.visible) return null;

  const isWalking = phase === "walking";
  const isJumping = phase === "jumping-to-btn" || phase === "jumping-back";

  return (
    <div
      ref={mascotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 28,
        height: 36,
        zIndex: 9999,
        pointerEvents: "none",
        transition: isJumping
          ? "left 0.6s cubic-bezier(0.34,1.56,0.64,1), top 0.6s cubic-bezier(0.34,1.56,0.64,1)"
          : isWalking
          ? "left 0.8s linear, top 0.3s ease"
          : "none",
        transform: pos.flipped ? "scaleX(-1)" : "scaleX(1)",
      }}
    >
      <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 36 }}>
        {/* Head */}
        <circle cx="14" cy="9" r="7" fill="#fed7aa"/>
        {/* Hair */}
        <path d="M7.5 8.5 C7 4, 10 2.5, 14 2.5 C18 2.5, 21 4, 20.5 8.5 C19 7.2 17 7.2 14 8 C11 7.2 9 7.2 7.5 8.5 Z" fill="#0f172a"/>
        <circle cx="18" cy="4.5" r="1.2" fill="#fbbf24"/>
        {/* Eyes */}
        <circle cx="11.5" cy="9.5" r="1.3" fill="#0f172a"/>
        <circle cx="11.2" cy="9.1" r="0.5" fill="#ffffff"/>
        <circle cx="16.5" cy="9.5" r="1.3" fill="#0f172a"/>
        <circle cx="16.2" cy="9.1" r="0.5" fill="#ffffff"/>
        {/* Cheeks */}
        <ellipse cx="9.5" cy="11.5" rx="1.2" ry="0.7" fill="#f43f5e" opacity="0.55"/>
        <ellipse cx="18.5" cy="11.5" rx="1.2" ry="0.7" fill="#f43f5e" opacity="0.55"/>
        {/* Smile */}
        <path d="M12.5 12 Q14 13.5 15.5 12" stroke="#9a3412" stroke-width="0.9" stroke-linecap="round" fill="none"/>

        {/* Left Shoulder & arm */}
        <path d="M10 15 Q8 16.5 7 18" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
        {/* Left hand (raised up, holding handle when hanging) */}
        {phase === "hanging" || phase === "jumping-to-btn" || phase === "jumping-back" ? (
          <>
            <path d="M10 15 Q9 13 9 10" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="9" cy="9" rx="2.5" ry="1.8" fill="#fed7aa" stroke="#d97706" stroke-width="0.7"/>
            <line x1="8" y1="8" x2="8" y2="9.5" stroke="#d97706" stroke-width="0.5" stroke-linecap="round"/>
            <line x1="9.5" y1="7.8" x2="9.5" y2="9.3" stroke="#d97706" stroke-width="0.5" stroke-linecap="round"/>
          </>
        ) : (
          <>
            <path d="M10 15 Q8 17 7 19" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
            <circle cx="6.5" cy="19.5" r="2.2" fill="#fed7aa" stroke="#d97706" stroke-width="0.6"/>
          </>
        )}

        {/* Body */}
        <path d="M9.5 15 C8.5 19, 9 23, 11 24.5 L17 24.5 C19 23, 19.5 19, 18.5 15 Z" fill="#2563eb"/>
        <line x1="14" y1="15" x2="14" y2="21" stroke="#fbbf24" stroke-width="1" stroke-linecap="round"/>

        {/* Right Shoulder & waving arm */}
        <path d="M18 15 Q20 13.5 22 11" stroke="#2563eb" stroke-width="2.8" stroke-linecap="round"/>
        <circle cx="23.5" cy="9.5" r="2.5" fill="#fed7aa" stroke="#d97706" stroke-width="0.6"/>
        <line x1="23" y1="7.2" x2="23" y2="5.2" stroke="#d97706" stroke-width="0.7" stroke-linecap="round"/>
        <line x1="24.2" y1="6.8" x2="24.6" y2="4.8" stroke="#d97706" stroke-width="0.7" stroke-linecap="round"/>
        <line x1="25.2" y1="7.5" x2="25.9" y2="6" stroke="#d97706" stroke-width="0.7" stroke-linecap="round"/>

        {/* Legs */}
        {isWalking ? (
          <>
            <path d="M12 24 L10 30" stroke="#1d4ed8" stroke-width="2.6" stroke-linecap="round"/>
            <ellipse cx="9.5" cy="31" rx="2.2" ry="1.3" fill="#0f172a"/>
            <path d="M16 24 L18 29" stroke="#1d4ed8" stroke-width="2.6" stroke-linecap="round"/>
            <ellipse cx="18.5" cy="30" rx="2.2" ry="1.3" fill="#0f172a"/>
          </>
        ) : (
          <>
            <rect x="11" y="23.5" width="2.4" height="4.5" rx="1" fill="#1d4ed8"/>
            <ellipse cx="12" cy="28.5" rx="2" ry="1.4" fill="#0f172a"/>
            <path d="M15 23.5 L18 27.5" stroke="#1d4ed8" stroke-width="2.4" stroke-linecap="round"/>
            <ellipse cx="19" cy="28" rx="2" ry="1.4" fill="#0f172a" transform="rotate(-20 19 28)"/>
          </>
        )}
      </svg>
    </div>
  );
}
