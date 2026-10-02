"use client";

import * as React from "react";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileNavBar } from "./mobile-nav-bar";
import { HeaderTopBar } from "./header-top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-midnight text-white flex w-full max-w-[100vw] overflow-x-hidden relative">
      {/* Desktop Sidebar (Fixed Left) */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 w-full min-w-0 max-w-full min-h-screen pb-20 lg:pb-12 overflow-x-hidden">
        {/* Sticky Header */}
        <HeaderTopBar />

        {/* Page Content */}
        <main className="flex-1 px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl w-full min-w-0 max-w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Nav */}
      <MobileNavBar />
    </div>
  );
}
