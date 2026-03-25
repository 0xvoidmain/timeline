import { useCallback, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { TimelineNav } from "./components/TimelineNav";
import { HomePage } from "./pages/HomePage";

const DEFAULT_YEAR = 2026;
const DEFAULT_CATEGORY = "all";

function AppContent() {
  const { year: yearParam, category: categoryParam } = useParams();
  const navigate = useNavigate();

  const activeYear = Number(yearParam) || DEFAULT_YEAR;
  const activeCategory = categoryParam || DEFAULT_CATEGORY;

  /* Track whether the year change came from the timeline sidebar */
  const [yearSource, setYearSource] = useState<"timeline" | "scroll">("scroll");

  /** Build path from year + category, preserving the current search string */
  const buildPath = useCallback((year: number, category: string) => {
    const search = window.location.search;
    return `/${year}/${category}${search}`;
  }, []);

  /** Ref to debounce rapid scroll-based updates */
  const scrollNavTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleTimelineYearClick = useCallback(
    (year: number) => {
      setYearSource("timeline");
      navigate(buildPath(year, activeCategory));
    },
    [navigate, buildPath, activeCategory],
  );

  const handleScrollYearChange = useCallback(
    (year: number) => {
      setYearSource("scroll");
      clearTimeout(scrollNavTimer.current);
      scrollNavTimer.current = setTimeout(() => {
        navigate(buildPath(year, activeCategory), { replace: true });
      }, 120);
    },
    [navigate, buildPath, activeCategory],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      navigate(buildPath(activeYear, category));
    },
    [navigate, buildPath, activeYear],
  );

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <TimelineNav
        activeYear={activeYear}
        onYearClick={handleTimelineYearClick}
      />
      <HomePage
        activeYear={activeYear}
        yearSource={yearSource}
        onYearChange={handleScrollYearChange}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/:year/:category" element={<AppContent />} />
          <Route
            path="*"
            element={
              <Navigate to={`/${DEFAULT_YEAR}/${DEFAULT_CATEGORY}`} replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export { App };
