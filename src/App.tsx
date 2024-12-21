import React from "react";
import { motion } from "framer-motion";

const App: React.FC = () => {
  const projects = [
    "Project One",
    "Project Two",
    "Project Three",
    "Project Four",
  ];

  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        margin: 0,
        border: "1px solid red",
        height: "100vh",
      }}
    >
      {/* Header Section */}
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

      {/* Navigation */}
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

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{ marginBottom: "1.5rem", fontSize: "2rem", color: "#007bff" }}
        >
          My Projects
        </h2>
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
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: "1rem",
                backgroundColor: "#282c34",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                {project}
              </h3>
              <p style={{ fontSize: "0.9rem" }}>
                A brief description of {project.toLowerCase()}. This is a
                placeholder for now.
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default App;
