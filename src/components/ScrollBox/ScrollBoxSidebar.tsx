import React from "react";
import { motion } from "framer-motion";
import { View } from "./types";

interface ScrollBoxSidebarProps {
  views: View[];
  currentView: number;
  setCurrentView: (id: number) => void;
}

export const ScrollBoxSidebar: React.FC<ScrollBoxSidebarProps> = ({
  views,
  currentView,
  setCurrentView,
}) => (
  <div
    style={{
      width: "50px",
      background: "#333",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    }}
  >
    {views.map((view) => (
      <motion.div
        key={view.id}
        onClick={() => setCurrentView(view.id)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: "10px",
          height: "10px",
          margin: "10px 0",
          borderRadius: "50%",
          background: currentView === view.id ? "#fff" : "#666",
          cursor: "pointer",
        }}
      />
    ))}
  </div>
);
