"use client"
import Sidebar from '@/components/sidebar/Sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
const queryClient = new QueryClient();

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Toggle function for sidebar state
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isMinimized={isSidebarMinimized} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 bg-zinc-800 ${
          isSidebarMinimized ? 'w-[calc(100%-80px)]' : 'w-[calc(100%-280px)]'
        }`}
      >
             <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>

      </div>
    </div>
  );
};

export default Layout;
