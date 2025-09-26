import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, User, FileText, Calculator, TrendingUp, Shield, Users, Target, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
  closable?: boolean;
}

interface TabBrowserProps {
  children: React.ReactNode;
}

export function TabBrowser({ children }: TabBrowserProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  // Fonction pour générer un titre et une icône basés sur la route
  const getTabInfo = (path: string): { title: string; icon: React.ReactNode } => {
    if (path.startsWith("/clients/")) {
      return {
        title: "Romain alexandre antoine...",
        icon: <User className="h-4 w-4" />
      };
    }

    if (path.match(/^\/dossiers\/[^\/]+$/) && !path.includes("/famille")) {
      return {
        title: "Dossier",
        icon: <FolderOpen className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/famille")) {
      return {
        title: "Famille",
        icon: <Users className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/patrimoine")) {
      return {
        title: "Patrimoine & Budget",
        icon: <TrendingUp className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/fiscalite")) {
      return {
        title: "Fiscalité",
        icon: <Calculator className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/prevoyance")) {
      return {
        title: "Prévoyance",
        icon: <Shield className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/transmission")) {
      return {
        title: "Transmission",
        icon: <Users className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/strategies")) {
      return {
        title: "Stratégies",
        icon: <Target className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/simulations")) {
      return {
        title: "Simulations",
        icon: <Calculator className="h-4 w-4" />
      };
    }

    if (path.includes("/dossiers/") && path.includes("/retraite")) {
      return {
        title: "Retraite",
        icon: <FileText className="h-4 w-4" />
      };
    }

    // Route par défaut
    return {
      title: "Nouvelle page",
      icon: <FileText className="h-4 w-4" />
    };
  };

  // Ajouter ou activer un onglet
  const addOrActivateTab = (path: string) => {
    const existingTab = tabs.find(tab => tab.path === path);

    if (existingTab) {
      // Activer l'onglet existant
      setActiveTabId(existingTab.id);
    } else {
      // Créer un nouvel onglet
      const { title, icon } = getTabInfo(path);
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        title,
        path,
        icon,
        closable: true
      };

      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  // Fermer un onglet
  const closeTab = (tabId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);

      // Si on ferme l'onglet actif, activer le dernier onglet
      if (tabId === activeTabId && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        setActiveTabId(lastTab.id);
        navigate(lastTab.path);
      }

      return newTabs;
    });
  };

  // Changer d'onglet
  const switchTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      navigate(tab.path);
    }
  };

  // Écouter les changements de route
  useEffect(() => {
    const currentPath = location.pathname;

    // Ajouter ou activer l'onglet pour la route actuelle
    if (currentPath !== "/" && currentPath !== "/clients" && currentPath !== "/dossiers") {
      addOrActivateTab(currentPath);
    }
  }, [location.pathname]);

  // Trouver l'onglet actif
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-full">
      {/* Barre d'onglets */}
      {tabs.length > 0 && (
        <div className="bg-white border-b border-border">
          <div className="flex items-center px-6">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 border-b-2 cursor-pointer group relative",
                  tab.id === activeTabId
                    ? "border-primary bg-blue-50"
                    : "border-transparent hover:bg-gray-50"
                )}
                onClick={() => switchTab(tab.id)}
              >
                {tab.icon}
                <span className="text-sm font-medium max-w-[200px] truncate">
                  {tab.title}
                </span>

                {tab.closable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 ml-2"
                    onClick={(e) => closeTab(tab.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu de la page */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}