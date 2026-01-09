import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Detection from "./pages/Detection";
import Contribute from "./pages/Contribute";
import Simulation from "./pages/Simulation";
import Leaderboard from "./pages/Leaderboard";
import GlobalFloodRiskMap from "./pages/GlobalFloodRiskMap";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { EmergencySOS } from "./components/emergency/EmergencySOS";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/global-flood-map" element={<GlobalFloodRiskMap />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Global Emergency SOS Button */}
          <EmergencySOS />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
