"use client"
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react';
import { Toaster } from 'sonner';
const queryClient = new QueryClient();

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Toggle function for sidebar state
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-max">
      {/* Sidebar */}
      <Sidebar isMinimized={isSidebarMinimized} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300  ${
          isSidebarMinimized ? 'w-[calc(100%-80px)]' : 'w-[calc(100%-280px)]'
        }`}
      >
             <QueryClientProvider client={queryClient}>
             <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
          <Toaster />
        </ThemeProvider>
        </QueryClientProvider>

      </div>
    </div>
  );
};

export default Layout;
