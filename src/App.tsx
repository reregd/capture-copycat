import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Dossiers from "./pages/Dossiers";
import DossierFamille from "./pages/DossierFamille";
import DossierPatrimoine from "./pages/DossierPatrimoine";
import DossierFiscalite from "./pages/DossierFiscalite";
import DossierPrevoyance from "./pages/DossierPrevoyance";
import DossierTransmission from "./pages/DossierTransmission";
import DossierStrategies from "./pages/DossierStrategies";
import DossierSimulations from "./pages/DossierSimulations";
import DossierRetraite from "./pages/DossierRetraite";
import Simulateurs from "./pages/Simulateurs";
import SimulateurAssuranceVie from "./pages/SimulateurAssuranceVie";
import SimulateurProfilInvestisseur from "./pages/SimulateurProfilInvestisseur";
import SimulateurCredit from "./pages/SimulateurCredit";
import SimulateurImmobilier from "./pages/SimulateurImmobilier";
import SCI2072 from "./pages/SCI2072";
import Administration from "./pages/Administration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientProfile />} />
            <Route path="/dossiers" element={<Dossiers />} />
            <Route path="/dossiers/:dossierId" element={<DossierFamille />} />
            <Route path="/simulateurs" element={<Simulateurs />} />
            <Route path="/simulateur-assurance-vie" element={<SimulateurAssuranceVie />} />
            <Route path="/simulateur-profil-investisseur" element={<SimulateurProfilInvestisseur />} />
            <Route path="/simulateur-credit" element={<SimulateurCredit />} />
            <Route path="/simulateur-immobilier" element={<SimulateurImmobilier />} />
            <Route path="/sci-2072" element={<SCI2072 />} />
            <Route path="/administration/*" element={<Administration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
