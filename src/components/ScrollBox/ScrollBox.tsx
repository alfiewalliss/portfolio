import React, { useEffect, useState } from "react";
import { View } from "./types";
import { ScrollBoxSidebar } from "./ScrollBoxSidebar.tsx";
import { ScrollBoxContent } from "./ScrollBoxContent.tsx";

const views: View[] = [
  { id: 0, content: "View 1 Content", color: "#FFB6C1" },
  { id: 1, content: "View 2 Content", color: "#ADD8E6" },
  { id: 2, content: "View 3 Content", color: "#90EE90" },
];

const ScrollBox: React.FC = () => {
  const [currentView, setCurrentView] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = (e: WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    if (
      (direction === 1 && currentView !== views.length - 1) ||
      (direction === -1 && currentView !== 0) ||
      isScrolling
    ) {
      e.preventDefault();
    }
    if (isScrolling) return;

    setCurrentView((prev) => {
      const newView = prev + direction;
      return Math.min(Math.max(newView, 0), views.length - 1);
    });

    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 1000);
  };

  useEffect(() => {
    const container = document.getElementById("scroll-container");

    const handleWheel = (e: WheelEvent) => {
      const rect = container?.getBoundingClientRect();
      if (
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        handleScroll(e);
      }
    };

    if (container) {
      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isScrolling]);

  return (
    <div
      id="scroll-container"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <ScrollBoxSidebar
        views={views}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <ScrollBoxContent views={views} currentView={currentView} />
    </div>
  );
};

export default ScrollBox;
