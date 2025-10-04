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
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "2rem 0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              margin: "0",
              textAlign: "center",
              color: "#00b8a3",
            }}
          >
            Tech Running Leaderboard
          </h1>
        </div>
      </div>

      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem 2rem" }}
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
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Left Column - Leaderboard */}
            <div style={{ flex: "1", minWidth: "450px" }}>
              {/* Leaderboard Section */}
              <div style={{ marginBottom: "3rem" }}>
                <h2
                  style={{
                    color: "#2d3748",
                    marginBottom: "1.5rem",
                    fontSize: "1.8rem",
                    fontWeight: "600",
                  }}
                >
                  🏆 Distance Leaderboard
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    maxHeight: "calc(500px + 2rem)",
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
                        padding: "1.5rem",
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
                            : "rgba(255, 255, 255, 0.95)",
                        border:
                          index < 3
                            ? "none"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "16px",
                        boxShadow:
                          index < 3
                            ? "0 8px 32px rgba(0, 0, 0, 0.15)"
                            : "0 4px 20px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          index < 3
                            ? "0 12px 40px rgba(0, 0, 0, 0.2)"
                            : "0 8px 32px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          index < 3
                            ? "0 8px 32px rgba(0, 0, 0, 0.15)"
                            : "0 4px 20px rgba(0, 0, 0, 0.1)";
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
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background:
                              index < 3
                                ? "rgba(255, 255, 255, 0.3)"
                                : "rgba(37, 150, 190, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: index < 3 ? "#2d3748" : "#2596be",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color: index < 3 ? "#2d3748" : "#4a5568",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {entry.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: index < 3 ? "#4a5568" : "#718096",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {entry.activityCount} activities
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: index < 3 ? "#3b3a39" : "#a0aec0",
                              fontStyle: "italic",
                            }}
                          >
                            Updated:{" "}
                            {new Date(entry.lastUpdated).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: index < 3 ? "#2d3748" : "#2596be",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            opacity: "0.8",
                          }}
                        >
                          Total Distance
                        </div>
                        {entry.totalDistance.toFixed(1)} km
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Time Series Chart */}
            <div style={{ flex: "1", minWidth: "450px" }}>
              <h2
                style={{
                  color: "#2d3748",
                  marginBottom: "1.5rem",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                }}
              >
                📈 Cumulative Distance Over Time
              </h2>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  height: "500px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
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
                        "#E74C3C", // Dark red
                        "#2ECC71", // Dark green
                        "#3498DB", // Dark blue
                        "#9B59B6", // Dark purple
                        "#F39C12", // Dark orange
                        "#E67E22", // Darker orange
                        "#1ABC9C", // Dark teal
                        "#34495E", // Dark gray
                      ];
                      return (
                        <Line
                          key={entry.name}
                          type="linear"
                          dataKey={entry.name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
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
