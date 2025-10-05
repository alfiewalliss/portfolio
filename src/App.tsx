import React, { useEffect, useState } from "react";
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

const idNameMap = {
  "52574369": "David Bloomfield",
  "46048265": "Tobi Adekanye",
  "116093133": "Alfie Walliss",
  "52568829": "Sarah Dick",
  "55710489": "Lucy Jones",
  "83786875": "Shannon Honan",
  "135110733": "Ella Ahmed",
  "80395176": "Ellis Tulloch",
};

interface LeaderboardEntry {
  id: string;
  name: string;
  totalDistance: number;
  activityCount: number;
  lastUpdated: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<
    | {
        id: string;
        activities: {
          distance: string;
          date: string;
        }[];
        lastUpdated: string;
      }[]
    | null
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Calculate leaderboard data
  const calculateLeaderboard = (): LeaderboardEntry[] => {
    if (!data) return [];

    return data
      .map((athlete) => {
        const totalDistance = athlete.activities.reduce((sum, activity) => {
          return sum + parseFloat(activity.distance);
        }, 0);

        return {
          id: athlete.id,
          name:
            idNameMap[athlete.id as keyof typeof idNameMap] ||
            `Unknown (${athlete.id})`,
          totalDistance,
          activityCount: athlete.activities.length,
          lastUpdated: athlete.lastUpdated,
        };
      })
      .sort((a, b) => b.totalDistance - a.totalDistance);
  };

  const leaderboard = calculateLeaderboard();

  // Process data for cumulative time series chart
  const processTimeSeriesData = () => {
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
  };

  const timeSeriesData = processTimeSeriesData();

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
          padding: windowWidth <= 768 ? "2rem 0" : "3rem 0",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          marginBottom: windowWidth <= 768 ? "2rem" : "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: windowWidth <= 768 ? "0 1rem" : "0 2rem",
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
                  {leaderboard.map((entry, index) => (
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
                            : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                        border:
                          index < 3
                            ? "none"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "24px",
                        boxShadow:
                          index < 3
                            ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                            : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow =
                          index < 3
                            ? "0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)"
                            : "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow =
                          index < 3
                            ? "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
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
                            fontSize: windowWidth <= 768 ? "1.2rem" : "1.5rem",
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
                              color: index < 3 ? "#2d3748" : "#1a202c",
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
                              color: index < 3 ? "#4a5568" : "#4a5568",
                              marginBottom: "0.5rem",
                              fontWeight: "500",
                            }}
                          >
                            {entry.activityCount} activities
                          </div>
                          <div
                            style={{
                              fontSize:
                                windowWidth <= 768 ? "0.7rem" : "0.8rem",
                              color: index < 3 ? "#3b3a39" : "#718096",
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
                          color: "#2d3748",
                          textAlign: "right",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <div
                          style={{
                            fontSize: windowWidth <= 768 ? "0.8rem" : "0.9rem",
                            fontWeight: "600",
                            opacity: "0.7",
                            marginBottom: "0.25rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
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
                          {entry.totalDistance.toFixed(1)} km
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                        backdropFilter: "blur(10px)",
                      }}
                      formatter={(value: any, name: string) => [
                        `${value.toFixed(1)} km`,
                        name,
                      ]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `Date: ${date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`;
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "1rem",
                        fontSize: "14px",
                      }}
                    />
                    {leaderboard.map((entry, index) => {
                      const colors = [
                        "#00b8a3", // Teal
                        "#00a896", // Darker teal
                        "#20c997", // Light teal
                        "#17a2b8", // Blue teal
                        "#6f42c1", // Purple
                        "#e83e8c", // Pink
                        "#fd7e14", // Orange
                        "#28a745", // Green
                      ];
                      return (
                        <Line
                          key={entry.name}
                          type="linear"
                          dataKey={entry.name}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
