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

interface Coord {
  x: number;
  y: number;
  flipped?: boolean;
}

export default function AnimatedMascot() {
  const pathname = usePathname();
  const [pose, setPose] = useState<Pose>("hanging");
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false, flipped: false });
  const [walkLegStep, setWalkLegStep] = useState<0 | 1>(0);
  const [climbStep, setClimbStep] = useState<0 | 1>(0);
  const [transitionSpeed, setTransitionSpeed] = useState<string>("0.5s");

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const activeBtnRef = useRef<HTMLElement | null>(null);
  const isRunningRef = useRef(false);

  function clearAll() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    intervalsRef.current.forEach((i) => clearInterval(i));
    intervalsRef.current = [];
    if (activeBtnRef.current) {
      activeBtnRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
      activeBtnRef.current = null;
    }
  }

  // Returns exact screen coordinates for the handle midpoint of #site-logo
  // Logo viewBox is 0 0 56 58, handle midpoint is (33, 29.5)
  // Mascot hand grip center inside its 36x44 box is at (12.8, 4)
  const getLogoGripPos = useCallback((): Coord | null => {
    if (typeof window === "undefined") return null;
    const logo = document.querySelector("#site-logo") as HTMLElement | null;
    if (!logo) return null;
    const rect = logo.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const handleMidX = (33 / 56) * rect.width;
    const handleMidY = (29.5 / 58) * rect.height;
    return {
      x: rect.left + handleMidX - 12.8,
      y: rect.top + handleMidY - 4,
      flipped: false,
    };
  }, []);

  // Finds real DOM elements on the page that serve as physical monkey supports/ledges
  const getPhysicalLedges = useCallback(() => {
    if (typeof window === "undefined") return [];

    const ledges: { name: string; coord: Coord; element?: HTMLElement }[] = [];

    // 1. Logo
    const logoGrip = getLogoGripPos();
    if (logoGrip) {
      ledges.push({ name: "logo", coord: logoGrip });
    }

    // 2. Brand text in header
    const brand = document.querySelector("#site-brand") as HTMLElement | null;
    if (brand) {
      const r = brand.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        ledges.push({
          name: "brand",
          element: brand,
          coord: { x: r.left + 10, y: r.top - 18, flipped: false },
        });
      }
    }

    // 3. Hero transparency pill badge
    const badge = document.querySelector("#hero-transparency-badge") as HTMLElement | null;
    if (badge) {
      const r = badge.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        ledges.push({
          name: "badge",
          element: badge,
          coord: { x: r.left + 30, y: r.top - 36, flipped: false },
        });
      }
    }

    // 4. Hero headline text
    const headline = document.querySelector("#hero-headline, #recent-scans-headline") as HTMLElement | null;
    if (headline) {
      const r = headline.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        ledges.push({
          name: "headline",
          element: headline,
          coord: { x: r.left + 45, y: r.top - 34, flipped: false },
        });
      }
    }

    // 5. Hero Scan Button (the primary target)
    const scanBtn = (document.querySelector("#hero-scan-btn") ||
      document.querySelector("#recent-scan-btn") ||
      document.querySelector("#header-scan-btn") ||
      document.querySelector(".btn-scan")) as HTMLElement | null;

    if (scanBtn) {
      const r = scanBtn.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        ledges.push({
          name: "scan-btn",
          element: scanBtn,
          coord: { x: r.left + 16, y: r.top - 36, flipped: false },
        });
        ledges.push({
          name: "scan-btn-center",
          element: scanBtn,
          coord: { x: r.left + Math.min(80, r.width / 2), y: r.top - 36, flipped: false },
        });
      }
    }

    // 6. Next support: Search Button or search box
    const searchBtn = (document.querySelector("#hero-search-btn") ||
      document.querySelector("#hero-search-box")) as HTMLElement | null;
    if (searchBtn) {
      const r = searchBtn.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        ledges.push({
          name: "search-btn",
          element: searchBtn,
          coord: { x: r.left + 24, y: r.top - 36, flipped: false },
        });
      }
    }

    return ledges;
  }, [getLogoGripPos]);

  // Main monkey choreography routine
  const runMonkeyCycle = useCallback(() => {
    clearAll();
    isRunningRef.current = true;

    const ledges = getPhysicalLedges();
    const logoLedge = ledges.find((l) => l.name === "logo");
    const brandLedge = ledges.find((l) => l.name === "brand");
    const badgeLedge = ledges.find((l) => l.name === "badge");
    const headlineLedge = ledges.find((l) => l.name === "headline");
    const scanBtnLedge = ledges.find((l) => l.name === "scan-btn");
    const scanBtnCenter = ledges.find((l) => l.name === "scan-btn-center");
    const searchBtnLedge = ledges.find((l) => l.name === "search-btn");

    if (!logoLedge || !scanBtnLedge) {
      // Retry if DOM elements are still rendering
      const retry = setTimeout(runMonkeyCycle, 1500);
      timersRef.current.push(retry);
      return;
    }

    // Walking / climbing alternating animation interval
    const stepInterval = setInterval(() => {
      setWalkLegStep((s) => (s === 0 ? 1 : 0));
      setClimbStep((s) => (s === 0 ? 1 : 0));
    }, 160);
    intervalsRef.current.push(stepInterval);

    // =========================================================
    // STEP 1: HANGING ON LOGO HANDLE (2.6s)
    // =========================================================
    setPose("hanging");
    setPos({
      x: logoLedge.coord.x,
      y: logoLedge.coord.y,
      visible: true,
      flipped: false,
    });
    setTransitionSpeed("0.4s");

    // =========================================================
    // STEP 2: REACH OVER TO HEADER BRAND TEXT (500ms)
    // Monkey reaches hand over from logo to the header bar
    // =========================================================
    const t1 = setTimeout(() => {
      if (!isRunningRef.current) return;
      setPose("stepping-down");
      const target = brandLedge?.coord || { x: logoLedge.coord.x + 35, y: logoLedge.coord.y + 12 };
      setPos({ x: target.x, y: target.y, visible: true, flipped: false });
      setTransitionSpeed("0.5s");

      // =========================================================
      // STEP 3: STEP DOWN TO HERO TRANSPARENCY BADGE (550ms)
      // Monkey steps down holding badge ledge
      // =========================================================
      const t2 = setTimeout(() => {
        if (!isRunningRef.current) return;
        setPose("stepping-down");
        const target = badgeLedge?.coord || headlineLedge?.coord || scanBtnLedge.coord;
        setPos({ x: target.x, y: target.y, visible: true, flipped: false });
        setTransitionSpeed("0.55s");

        // =========================================================
        // STEP 4: STEP DOWN TO HERO HEADLINE (550ms)
        // Monkey steps down holding headline top surface
        // =========================================================
        const t3 = setTimeout(() => {
          if (!isRunningRef.current) return;
          setPose("perched");
          const target = headlineLedge?.coord || scanBtnLedge.coord;
          setPos({ x: target.x, y: target.y, visible: true, flipped: false });
          setTransitionSpeed("0.55s");

          // =========================================================
          // STEP 5: STEP DOWN ONTO SCAN BUTTON (550ms)
          // Monkey steps down directly onto the top edge of the scan button!
          // =========================================================
          const t4 = setTimeout(() => {
            if (!isRunningRef.current) return;
            setPose("perched");
            setPos({
              x: scanBtnLedge.coord.x,
              y: scanBtnLedge.coord.y,
              visible: true,
              flipped: false,
            });
            setTransitionSpeed("0.5s");

            // =========================================================
            // STEP 6: WALK ACROSS TOP OF SCAN BUTTON (1.2s)
            // =========================================================
            const t5 = setTimeout(() => {
              if (!isRunningRef.current) return;
              setPose("walking");
              const walkTarget = scanBtnCenter?.coord || { x: scanBtnLedge.coord.x + 45, y: scanBtnLedge.coord.y };
              setPos({
                x: walkTarget.x,
                y: walkTarget.y,
                visible: true,
                flipped: false,
              });
              setTransitionSpeed("1.2s");

              // =========================================================
              // STEP 7: SHOW SCAN BUTTON BY HIS OWN HAND! (3.6s)
              // NO EMOJIS! Monkey crouches, grips edge with left hand,
              // and physically points his right arm and index finger DOWN
              // at the scan button! The button glows with amber highlight.
              // =========================================================
              const t6 = setTimeout(() => {
                if (!isRunningRef.current) return;
                setPose("pointing-hand");
                setTransitionSpeed("0.2s");

                if (scanBtnLedge.element) {
                  scanBtnLedge.element.classList.add("ring-4", "ring-amber-400", "ring-offset-2", "transition-all");
                  activeBtnRef.current = scanBtnLedge.element;
                }

                // =========================================================
                // STEP 8: STEP OVER TO SEARCH BUTTON (SURFACE TO SURFACE)
                // Monkey hops across from scan button to search button
                // =========================================================
                const t7 = setTimeout(() => {
                  if (!isRunningRef.current) return;
                  if (activeBtnRef.current) {
                    activeBtnRef.current.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
                    activeBtnRef.current = null;
                  }

                  const nextLedge = searchBtnLedge?.coord || { x: scanBtnLedge.coord.x + 120, y: scanBtnLedge.coord.y };
                  setPose("walking");
                  setPos({
                    x: nextLedge.x,
                    y: nextLedge.y,
                    visible: true,
                    flipped: false,
                  });
                  setTransitionSpeed("0.9s");

                  // =========================================================
                  // STEP 9: CLIMB UP SURFACE TO SURFACE (HEADLINE LEDGE)
                  // Monkey reaches UP and pulls himself up onto the Headline!
                  // =========================================================
                  const t8 = setTimeout(() => {
                    if (!isRunningRef.current) return;
                    setPose("climbing-up");
                    const target = headlineLedge?.coord || badgeLedge?.coord || logoLedge.coord;
                    setPos({
                      x: target.x,
                      y: target.y,
                      visible: true,
                      flipped: true,
                    });
                    setTransitionSpeed("0.65s");

                    // =========================================================
                    // STEP 10: CLIMB UP TO BADGE LEDGE
                    // Monkey reaches UP and pulls onto Hero Badge
                    // =========================================================
                    const t9 = setTimeout(() => {
                      if (!isRunningRef.current) return;
                      setPose("climbing-up");
                      const target = badgeLedge?.coord || brandLedge?.coord || logoLedge.coord;
                      setPos({
                        x: target.x,
                        y: target.y,
                        visible: true,
                        flipped: true,
                      });
                      setTransitionSpeed("0.65s");

                      // =========================================================
                      // STEP 11: CLIMB UP TO HEADER BAR / BRAND TEXT
                      // Monkey reaches UP to header bar
                      // =========================================================
                      const t10 = setTimeout(() => {
                        if (!isRunningRef.current) return;
                        setPose("climbing-up");
                        const target = brandLedge?.coord || logoLedge.coord;
                        setPos({
                          x: target.x,
                          y: target.y,
                          visible: true,
                          flipped: true,
                        });
                        setTransitionSpeed("0.6s");

                        // =========================================================
                        // STEP 12: SWING ALONG HEADER & CATCH LOGO HANDLE!
                        // Monkey traverses to #site-logo handle, catches it & hangs!
                        // =========================================================
                        const t11 = setTimeout(() => {
                          if (!isRunningRef.current) return;
                          setPose("hanging");
                          const freshLogoGrip = getLogoGripPos();
                          setPos({
                            x: freshLogoGrip?.x ?? logoLedge.coord.x,
                            y: freshLogoGrip?.y ?? logoLedge.coord.y,
                            visible: true,
                            flipped: false,
                          });
                          setTransitionSpeed("0.45s");

                          // Hang at the logo for 3.5s, then start next monkey cycle!
                          const nextLoop = setTimeout(runMonkeyCycle, 3500);
                          timersRef.current.push(nextLoop);
                        }, 600);
                        timersRef.current.push(t11);
                      }, 650);
                      timersRef.current.push(t10);
                    }, 650);
                    timersRef.current.push(t9);
                  }, 950);
                  timersRef.current.push(t8);
                }, 3600); // 3.6s pointing duration
                timersRef.current.push(t7);
              }, 1200);
              timersRef.current.push(t6);
            }, 550);
            timersRef.current.push(t5);
          }, 550);
          timersRef.current.push(t4);
        }, 550);
        timersRef.current.push(t3);
      }, 550);
      timersRef.current.push(t2);
    }, 2600); // 2.6s initial hanging at logo
    timersRef.current.push(t1);
  }, [getPhysicalLedges, getLogoGripPos]);

  useEffect(() => {
    if (pathname !== "/") {
      clearAll();
      isRunningRef.current = false;
      return;
    }

    // Align to logo on mount
    const initTimer = setTimeout(() => {
      const grip = getLogoGripPos();
      if (grip) {
        setPos({ x: grip.x, y: grip.y, visible: true, flipped: false });
      }
      runMonkeyCycle();
    }, 150);
    timersRef.current.push(initTimer);

    function handleResizeOrScroll() {
      if (pose === "hanging") {
        const grip = getLogoGripPos();
        if (grip) {
          setPos((prev) => ({ ...prev, x: grip.x, y: grip.y }));
        }
      }
    }

    window.addEventListener("resize", handleResizeOrScroll, { passive: true });
    window.addEventListener("scroll", handleResizeOrScroll, { passive: true });

    return () => {
      clearAll();
      isRunningRef.current = false;
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [pathname, getLogoGripPos, runMonkeyCycle, pose]);

  if (pathname !== "/" || !pos.visible) return null;

  return (
    <div
      aria-label="JeevanReport Mascot Monkey"
      title="JeevanReport Mascot Monkey climbing ledges to the scan button!"
      onClick={() => runMonkeyCycle()}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 36,
        height: 44,
        zIndex: 9999,
        pointerEvents: "auto",
        cursor: "pointer",
        transition: `left ${transitionSpeed} ease-out, top ${transitionSpeed} cubic-bezier(0.25, 1, 0.5, 1)`,
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
            {/* Shoulder to elbow */}
            <path d="M 20 18 L 24 24" stroke="#2563eb" strokeWidth={3.6} strokeLinecap="round" />
            {/* Elbow to wrist */}
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
                {/* Left Arm extended HIGH UP overhead grasping next hold */}
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

                {/* Right Arm extended HIGH UP overhead grasping next hold */}
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
