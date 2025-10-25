import React, { useEffect, useState, memo, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Add CSS keyframes for emergency pulsing animation
const emergencyPulseKeyframes = `
  @keyframes emergencyPulse {
    0% {
      box-shadow: 0 20px 40px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 0, 0, 0.6), 0 0 25px rgba(255, 0, 0, 0.5);
    }
    50% {
      box-shadow: 0 25px 50px rgba(255, 0, 0, 0.7), 0 0 0 2px rgba(255, 0, 0, 0.9), 0 0 40px rgba(255, 0, 0, 0.8);
    }
    100% {
      box-shadow: 0 20px 40px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 0, 0, 0.6), 0 0 25px rgba(255, 0, 0, 0.5);
    }
  }
`;

const idNameMap = {
  "52574369": "David Bloomfield",
  "46048265": "Tobi Adekanye",
  "116093133": "Alfie Walliss",
  "52568829": "Sarah Dick",
  "55710489": "Lucy Jones",
  "83786875": "Shannon Honan",
  "80395176": "Ellis Tulloch",
};

// Custom tooltip component that sorts entries by distance (highest first)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Sort payload by value in descending order (highest distance first)
    const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          fontSize: "12px",
          padding: "8px 12px",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#2d3748" }}>
          {new Date(label).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
          })}
        </p>
        {sortedPayload.map((entry, index) => (
          <p
            key={entry.dataKey}
            style={{
              margin: "4px 0",
              color: entry.color,
              fontWeight: "500",
            }}
          >
            <span style={{ fontWeight: "600" }}>{entry.name}:</span>{" "}
            {entry.value.toFixed(1)} km
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Memoized chart component to prevent unnecessary re-renders
const TimeSeriesChart = memo(
  ({
    timeSeriesData,
    leaderboard,
  }: {
    timeSeriesData: any[];
    leaderboard: any[];
  }) => {
    console.log("TimeSeriesChart rendering");
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#4a5568" }}
            angle={-30}
            textAnchor="end"
            height={100}
            interval="preserveStartEnd"
            stroke="#718096"
          />
          <YAxis
            label={{
              value: "Cumulative Distance (km)",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: "#4a5568",
                fontSize: "14px",
              },
            }}
            tick={{ fontSize: 12, fill: "#4a5568" }}
            stroke="#718096"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "0.5rem",
              fontSize: "11px",
              fontWeight: "500",
            }}
          />
          {leaderboard.map((entry, index) => {
            const colors = [
              "#00b8a3", // Primary teal
              "#dc3545", // High contrast red
              "#007bff", // High contrast blue
              "#6f42c1", // High contrast purple
              "#fd7e14", // High contrast orange
              "#28a745", // High contrast green
              "#e83e8c", // High contrast pink
              "#17a2b8", // High contrast cyan
            ];
            return (
              <Line
                key={entry.name || entry.id}
                type="linear"
                dataKey={entry.name || entry.id}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: colors[index % colors.length],
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 8,
                  fill: colors[index % colors.length],
                  strokeWidth: 3,
                  stroke: "#fff",
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
                }}
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    );
  }
);

TimeSeriesChart.displayName = "TimeSeriesChart";

// Separate component for countdown timer to prevent main component re-renders
const CountdownTimer = memo(() => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Calculate time remaining until October 31st midnight
  const calculateTimeRemaining = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const october31st = new Date(currentYear, 9, 31, 11, 59, 59, 999); // October is month 9 (0-indexed)

    // If October 31st has passed this year, target next year
    const targetDate =
      october31st > now
        ? october31st
        : new Date(currentYear + 1, 9, 31, 23, 59, 59, 999);

    const timeDiff = targetDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // Update countdown timer every second
  useEffect(() => {
    const updateTimer = () => {
      const newTimeRemaining = calculateTimeRemaining();
      setTimeRemaining((prevTime) => {
        // Only update if the time has actually changed
        if (
          prevTime.days !== newTimeRemaining.days ||
          prevTime.hours !== newTimeRemaining.hours ||
          prevTime.minutes !== newTimeRemaining.minutes ||
          prevTime.seconds !== newTimeRemaining.seconds
        ) {
          return newTimeRemaining;
        }
        return prevTime;
      });
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        margin: "1rem auto 0 0",
        textAlign: "center",
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        borderRadius: "16px",
        padding: "1rem",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: windowWidth <= 768 ? "0.5rem" : "1.5rem",
          flexWrap: windowWidth <= 768 ? "nowrap" : "wrap",
          overflow: windowWidth <= 768 ? "hidden" : "visible",
        }}
      >
        {[
          { label: "Days", value: timeRemaining.days },
          { label: "Hours", value: timeRemaining.hours },
          { label: "Minutes", value: timeRemaining.minutes },
          { label: "Seconds", value: timeRemaining.seconds },
        ].map((item, index) => (
          <div
            key={item.label}
            style={{
              textAlign: "center",
              minWidth: windowWidth <= 768 ? "50px" : "80px",
              flex: windowWidth <= 768 ? "1" : "none",
            }}
          >
            <div
              style={{
                fontSize: windowWidth <= 768 ? "1.5rem" : "2.5rem",
                fontWeight: "800",
                color: "#2d3748",
                lineHeight: "1",
                marginBottom: "0.25rem",
                background: "linear-gradient(135deg, #00b8a3 0%, #007bff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {item.value.toString().padStart(2, "0")}
            </div>
            <div
              style={{
                fontSize: windowWidth <= 768 ? "0.6rem" : "0.8rem",
                fontWeight: "500",
                color: "#718096",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

CountdownTimer.displayName = "CountdownTimer";

const App: React.FC = () => {
  console.log("App component rendering");
  const [data, setData] = useState<
    | {
        id: string;
        activities: {
          distance: string;
          date: string;
          time: number;
        }[];
        lastUpdated: string;
      }[]
    | null
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Inject CSS animation only once when component mounts
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Check if the style already exists to avoid duplicates
      const existingStyle = document.getElementById(
        "emergency-pulse-animation"
      );
      if (!existingStyle) {
        const style = document.createElement("style");
        style.id = "emergency-pulse-animation";
        style.textContent = emergencyPulseKeyframes;
        document.head.appendChild(style);
      }
    }
  }, []); // Empty dependency array means this runs only once

  // Helper function to format time in hours and minutes
  const formatTime = (totalMinutes: number): string => {
    // Ensure we're working with a proper number
    const minutes = Math.floor(Number(totalMinutes) || 0);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  // Memoize leaderboard calculation
  const leaderboard = useMemo(() => {
    if (!data) return [];

    return data
      .map((athlete) => {
        const totalDistance = athlete.activities.reduce((sum, activity) => {
          return sum + parseFloat(activity.distance);
        }, 0);

        const totalTime = athlete.activities.reduce((sum, activity) => {
          const timeValue = Number(activity.time) || 0;
          return sum + timeValue;
        }, 0);

        return {
          id: athlete.id,
          name: idNameMap[athlete.id as keyof typeof idNameMap] || null,
          totalDistance,
          totalTime,
          activityCount: athlete.activities.length,
          lastUpdated: athlete.lastUpdated,
        };
      })
      .sort((a, b) => b.totalDistance - a.totalDistance)
      .filter((r) => r.name !== null);
  }, [data]);

  // Memoize time series data calculation
  const timeSeriesData = useMemo(() => {
    if (!data) return [];

    // Get all unique dates from all activities
    const allDates = new Set<string>();
    data.forEach((athlete) => {
      athlete.activities.forEach((activity) => {
        // Extract just the date part (YYYY-MM-DD) to avoid time duplicates
        const dateOnly = new Date(activity.date).toISOString().split("T")[0];
        allDates.add(dateOnly);
      });
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create cumulative time series data
    const timeSeriesData = sortedDates.map((date, dateIndex) => {
      // Date is already in YYYY-MM-DD format, so we can use it directly
      const dayData: any = { date };

      data.forEach((athlete) => {
        const athleteName =
          idNameMap[athlete.id as keyof typeof idNameMap] ||
          `Unknown (${athlete.id})`;

        // Calculate cumulative distance up to this date
        const activitiesUpToDate = athlete.activities.filter((activity) => {
          const activityDateOnly = new Date(activity.date)
            .toISOString()
            .split("T")[0];
          return activityDateOnly <= date;
        });
        const cumulativeDistance = activitiesUpToDate.reduce(
          (sum, activity) => sum + parseFloat(activity.distance),
          0
        );
        dayData[athleteName] = cumulativeDistance;
      });

      return dayData;
    });

    return timeSeriesData;
  }, [data]);

  // Memoize chart props to prevent unnecessary re-renders
  const chartProps = useMemo(
    () => ({
      timeSeriesData,
      leaderboard,
    }),
    [timeSeriesData, leaderboard]
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from Firebase endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://us-central1-techrunningalfie.cloudfunctions.net/api/data"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        setData(result);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: windowWidth <= 768 ? "1.5rem 0" : "1.5rem 0 0 0",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          marginBottom: "0.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: windowWidth <= 768 ? "0 1rem" : "0 2rem 0 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: windowWidth <= 768 ? "2rem" : "3rem",
              fontWeight: "800",
              margin: "0",
              textAlign: "center",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
              color: "#00b8a3",
            }}
          >
            Tech Running Leaderboard
          </h1>

          {/* Countdown Timer */}
          <CountdownTimer />

          <div
            style={{
              width: "60px",
              height: "4px",
              margin: "1rem auto 0",
              borderRadius: "2px",
            }}
          />
        </div>
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(0, 168, 150, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: windowWidth <= 768 ? "0 1rem 2rem" : "0 2rem 2rem",
        }}
      >
        {data?.length === 0 ? (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "3rem",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p style={{ fontSize: "1.2rem", color: "#666", margin: "0" }}>
              No data available
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: windowWidth <= 768 ? "1.5rem" : "2rem",
              flexWrap: "wrap",
              flexDirection: windowWidth <= 768 ? "column" : "row",
            }}
          >
            {/* Left Column - Leaderboard */}
            <div
              style={{
                flex: "1",
                minWidth: windowWidth <= 768 ? "100%" : "450px",
              }}
            >
              {/* Leaderboard Section */}
              <div style={{ marginBottom: "3rem" }}>
                <h2
                  style={{
                    color: "#1a202c",
                    marginBottom: windowWidth <= 768 ? "1.5rem" : "2rem",
                    fontSize: windowWidth <= 768 ? "1.5rem" : "2rem",
                    fontWeight: "700",
                    letterSpacing: "-0.01em",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                    }}
                  >
                    🏆 Distance Leaderboard
                  </span>
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: windowWidth <= 768 ? "0.75rem" : "1rem",
                    padding: windowWidth <= 768 ? "1rem" : "2rem",
                    maxHeight:
                      windowWidth <= 768 ? "calc(400px)" : "calc(500px)",
                    overflow: "scroll",
                  }}
                >
                  {leaderboard.map((entry, index) => {
                    const isLastPlace = index === leaderboard.length - 1;
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: windowWidth <= 768 ? "1.25rem" : "2rem",
                          background:
                            index < 3
                              ? `linear-gradient(135deg, ${
                                  index === 0
                                    ? "#FFD700"
                                    : index === 1
                                    ? "#C0C0C0"
                                    : "#CD7F32"
                                } 0%, ${
                                  index === 0
                                    ? "#FFA500"
                                    : index === 1
                                    ? "#A8A8A8"
                                    : "#B8860B"
                                } 100%)`
                              : isLastPlace
                              ? "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
                              : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                          border:
                            index < 3
                              ? "none"
                              : isLastPlace
                              ? "2px solid #FF0000"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "24px",
                          boxShadow:
                            index < 3
                              ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                              : isLastPlace
                              ? "0 20px 40px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 0, 0, 0.6), 0 0 25px rgba(255, 0, 0, 0.5)"
                              : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(20px)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          cursor: "pointer",
                          animation: isLastPlace
                            ? "emergencyPulse 1.5s ease-in-out infinite"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-8px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            index < 3
                              ? "0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                              : isLastPlace
                              ? "0 32px 64px rgba(255, 0, 0, 0.5), 0 0 0 1px rgba(255, 0, 0, 0.7), 0 0 35px rgba(255, 0, 0, 0.6)"
                              : "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            index < 3
                              ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                              : isLastPlace
                              ? "0 20px 40px rgba(255, 0, 0, 0.4), 0 0 0 1px rgba(255, 0, 0, 0.6), 0 0 25px rgba(255, 0, 0, 0.5)"
                              : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)";
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: windowWidth <= 768 ? "44px" : "56px",
                              height: windowWidth <= 768 ? "44px" : "56px",
                              borderRadius: "50%",
                              background:
                                index < 3
                                  ? "rgba(255, 255, 255, 0.4)"
                                  : "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize:
                                windowWidth <= 768 ? "1.2rem" : "1.5rem",
                              fontWeight: "800",
                              color: "#2d3748",
                              boxShadow:
                                index < 3
                                  ? "0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                                  : "0 8px 24px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                              border:
                                index < 3
                                  ? "2px solid rgba(255, 255, 255, 0.3)"
                                  : "2px solid rgba(102, 126, 234, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize:
                                  windowWidth <= 768 ? "1.1rem" : "1.4rem",
                                fontWeight: "700",
                                color:
                                  index < 3
                                    ? "#2d3748"
                                    : isLastPlace
                                    ? "#ffffff"
                                    : "#1a202c",
                                marginBottom: "0.5rem",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {entry.name}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  windowWidth <= 768 ? "0.8rem" : "0.9rem",
                                color:
                                  index < 3
                                    ? "#4a5568"
                                    : isLastPlace
                                    ? "#ffcccc"
                                    : "#4a5568",
                                marginBottom: "0.25rem",
                                fontWeight: "500",
                              }}
                            >
                              {entry.activityCount} activities
                            </div>
                            <div
                              style={{
                                fontSize:
                                  windowWidth <= 768 ? "0.7rem" : "0.8rem",
                                color:
                                  index < 3
                                    ? "#4a5568"
                                    : isLastPlace
                                    ? "#ffaaaa"
                                    : "#4a5568",
                                marginBottom: "0.5rem",
                                fontWeight: "500",
                              }}
                            >
                              Total time: {formatTime(entry.totalTime)}
                            </div>
                            <div
                              style={{
                                fontSize:
                                  windowWidth <= 768 ? "0.7rem" : "0.8rem",
                                color:
                                  index < 3
                                    ? "#3b3a39"
                                    : isLastPlace
                                    ? "#ffaaaa"
                                    : "#718096",
                                fontStyle: "italic",
                                fontWeight: "400",
                              }}
                            >
                              Updated:{" "}
                              {new Date(entry.lastUpdated).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: windowWidth <= 768 ? "1.4rem" : "1.8rem",
                            fontWeight: "800",
                            color: isLastPlace ? "#ffffff" : "#2d3748",
                            textAlign: "right",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                windowWidth <= 768 ? "0.8rem" : "0.9rem",
                              fontWeight: "600",
                              opacity: isLastPlace ? "0.9" : "0.7",
                              marginBottom: "0.25rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: isLastPlace ? "#ffcccc" : "inherit",
                            }}
                          >
                            Total Distance
                          </div>
                          <div
                            style={{
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                            }}
                          >
                            {entry.totalDistance.toFixed(2)} km
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Time Series Chart */}
            <div
              style={{
                flex: "1",
                minWidth: windowWidth <= 768 ? "100%" : "450px",
              }}
            >
              <h2
                style={{
                  color: "#1a202c",
                  marginBottom: windowWidth <= 768 ? "1.5rem" : "2rem",
                  fontSize: windowWidth <= 768 ? "1.5rem" : "2rem",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  📈 Cumulative Distance Over Time
                </span>
              </h2>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                  borderRadius: "24px",
                  padding: windowWidth <= 768 ? "1.5rem" : "2rem",
                  boxShadow:
                    "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  height: windowWidth <= 768 ? "400px" : "500px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <TimeSeriesChart {...chartProps} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
