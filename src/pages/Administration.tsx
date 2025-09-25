import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import AdministrationUtilisateurs from "./administration/Utilisateurs";
import AdministrationGroupes from "./administration/Groupes";
import AdministrationProfils from "./administration/Profils";
import AdministrationStructure from "./administration/VotreStructure";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const adminTabs = [
  { path: "/administration/utilisateurs", label: "Utilisateurs", end: false },
  { path: "/administration/groupes", label: "Groupes", end: false },
  { path: "/administration/profils", label: "Profils", end: false },
  { path: "/administration/votre-structure", label: "Votre structure", end: false },
];

export default function Administration() {
  const location = useLocation();
  
  // Redirect to utilisateurs by default
  if (location.pathname === "/administration") {
    window.history.replaceState(null, "", "/administration/utilisateurs");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Administration</h1>
      
      <div className="flex items-center justify-between border-b">
        <div className="flex space-x-8">
          {adminTabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "py-4 px-1 border-b-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-nav-active text-nav-active"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>Exporter & Importer</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Exporter les données</DropdownMenuItem>
            <DropdownMenuItem>Importer les données</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Routes>
        <Route path="/utilisateurs" element={<AdministrationUtilisateurs />} />
        <Route path="/groupes" element={<AdministrationGroupes />} />
        <Route path="/profils" element={<AdministrationProfils />} />
        <Route path="/votre-structure" element={<AdministrationStructure />} />
        <Route path="/" element={<AdministrationUtilisateurs />} />
      </Routes>
    </div>
  );
}