import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ScrollAnimatedSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.8 }}
      style={{
        height: "200px",
        margin: "50px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#282c34",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2>I'm Animated on Scroll!</h2>
    </motion.div>
  );
};

export default ScrollAnimatedSection;
