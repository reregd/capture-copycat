import { ReactNode } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { TabBrowser } from "./TabBrowser";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Navigation />
      <div className="flex-1 flex flex-col">
        <TabBrowser>
          <main className="container mx-auto px-6 py-6 flex-1">
            {children}
          </main>
        </TabBrowser>
      </div>
    </div>
  );
};