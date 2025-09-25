import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/", label: "Tableau de bord" },
  { path: "/clients", label: "Clients" },
  { path: "/dossiers", label: "Dossiers" },
  { path: "/simulateurs", label: "Simulateurs" },
  { path: "/sci-2072", label: "SCI - 2072" },
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
        </div>
      </div>
    </nav>
  );
};