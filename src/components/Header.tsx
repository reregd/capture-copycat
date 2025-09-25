import { Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <header className="bg-white border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="grid grid-cols-3 gap-1 w-6 h-6">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Big</h1>
              <p className="text-xs text-muted-foreground">H-INVEST GROUP</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>Aides</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3 pl-4 border-l">
            <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center text-white text-sm font-medium">
              RV
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="text-left">
                    <div className="text-sm font-medium">Vianney</div>
                    <div className="text-xs text-muted-foreground">RECIPON</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};