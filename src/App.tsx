import React from "react";
import { motion } from "framer-motion";
import ScrollBox from "./components/ScrollBox/ScrollBox.tsx";
import ScrollAnimatedSection from "./components/ScrollAnimatedSection.tsx";

const App: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        margin: 0,
      }}
    >
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          padding: "1rem",
          textAlign: "center",
          backgroundColor: "#007bff",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Welcome to My Portfolio
      </motion.header>

      <motion.nav
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          backgroundColor: "#333",
        }}
      >
        {["Home", "About", "Projects", "Contact"].map((item, index) => (
          <motion.a
            key={index}
            href={`#${item.toLowerCase()}`}
            whileHover={{ scale: 1.2, color: "#007bff" }}
            whileTap={{ scale: 0.9 }}
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            {item}
          </motion.a>
        ))}
      </motion.nav>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          padding: "0 2rem 2rem 2rem",
          textAlign: "center",
          overflow: "scroll",
        }}
      >
        <motion.div
          style={{
            marginBottom: "1.5rem",
            fontSize: "2rem",
            color: "#007bff",
            height: "calc(100vh - 123px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          My Projects
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.3 },
            },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        />
        <ScrollBox />
        <ScrollAnimatedSection />
        <ScrollAnimatedSection />
        <ScrollAnimatedSection />
        <ScrollAnimatedSection />
      </motion.section>
    </div>
  );
};

export default App;
