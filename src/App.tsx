import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { TimelineNav } from "./components/TimelineNav";
import { HomePage } from "./pages/HomePage";

function App() {
  const [activeYear, setActiveYear] = useState(2026);
  /* Track whether the year change came from the timeline sidebar */
  const [yearSource, setYearSource] = useState<"timeline" | "scroll">("scroll");

  const handleTimelineYearClick = useCallback((year: number) => {
    setYearSource("timeline");
    setActiveYear(year);
  }, []);

  const handleScrollYearChange = useCallback((year: number) => {
    setYearSource("scroll");
    setActiveYear(year);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <TimelineNav
          activeYear={activeYear}
          onYearClick={handleTimelineYearClick}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                activeYear={activeYear}
                yearSource={yearSource}
                onYearChange={handleScrollYearChange}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export { App };
