import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { TimelineNav } from "./components/TimelineNav";
import { HomePage } from "./pages/HomePage";

function AppLayout() {
  return (
    <>
      <Navbar />
      <TimelineNav />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path=":year" element={<HomePage />} />
            <Route path=":year/:category" element={<HomePage />} />
            <Route path=":year/:category/:slug" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export { App };
