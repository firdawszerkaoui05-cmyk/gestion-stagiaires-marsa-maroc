import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitApplication from "./pages/SubmitApplication";
import Dashboard from "./pages/Dashboard";
import StagiaireDashboard from "./pages/StagiaireDashboard";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidature" element={<SubmitApplication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ma-candidature" element={<StagiaireDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
