import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { path: "/", label: "Tableau de bord" },
  { path: "/clients", label: "Clients" },
  { path: "/dossiers", label: "Dossiers" },
  { path: "/simulateurs", label: "Simulateurs" },
  { path: "/sci-2072", label: "SCI - 2072" },
];

const administrationItems = [
  { path: "/administration/utilisateurs", label: "Utilisateurs" },
  { path: "/administration/groupes", label: "Groupes" },
  { path: "/administration/profils", label: "Profils" },
  { path: "/administration/votre-structure", label: "Votre structure" },
];

export const Navigation = () => {
  return (
    <nav className="bg-white border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "py-4 px-1 border-b-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-nav-active text-nav-active"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-1 py-4 px-1 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                <span>Administration</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {administrationItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <NavLink
                    to={item.path}
                    className="w-full cursor-pointer"
                  >
                    {item.label}
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};