import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import TruckManagement from "@/pages/TruckManagement";
import RankingManagement from "@/pages/RankingManagement";
import ViolationManagement from "@/pages/ViolationManagement";
import DisplayScreen from "@/pages/DisplayScreen";
import SettingsPage from "@/pages/SettingsPage";

function AppContent() {
  const location = useLocation();
  const isDisplayPage = location.pathname === '/display';

  return (
    <div className="min-h-screen">
      {!isDisplayPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trucks" element={<TruckManagement />} />
        <Route path="/ranking" element={<RankingManagement />} />
        <Route path="/violations" element={<ViolationManagement />} />
        <Route path="/display" element={<DisplayScreen />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
