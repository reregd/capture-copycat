import { ReactNode } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="container mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
};