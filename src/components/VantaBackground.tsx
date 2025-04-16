import { useEffect, useRef } from "react";
import FOG, { VantaEffect } from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

interface VantaBackgroundProps {
  children: React.ReactNode;
}

export default function VantaBackground({ children }: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");

    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = FOG({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: isDark ? 0xffffff : 0x0,
        midtoneColor: isDark ? 0x666666 : 0x999999,
        lowlightColor: isDark ? 0x0 : 0xffffff,
        baseColor: isDark ? 0x0 : 0xffffff,
        blurFactor: 0.6,
        speed: 1.0,
        zoom: 0.8,
      });
    }

    // Update colors when dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          if (vantaEffect.current) {
            vantaEffect.current.setOptions({
              highlightColor: isDark ? 0xffffff : 0x0,
              midtoneColor: isDark ? 0x666666 : 0x999999,
              lowlightColor: isDark ? 0x0 : 0xffffff,
              baseColor: isDark ? 0x0 : 0xffffff,
            });
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      <div ref={vantaRef} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
