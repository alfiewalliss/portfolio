import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { View } from "./types";

interface ScrollBoxContentProps {
  views: View[];
  currentView: number;
}

export const ScrollBoxContent: React.FC<ScrollBoxContentProps> = ({
  views,
  currentView,
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentView}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: views[currentView].color,
        color: "#333",
        fontSize: "24px",
        fontWeight: "bold",
        height: "100vh",
      }}
    >
      {views[currentView].content}
    </motion.div>
  </AnimatePresence>
);
