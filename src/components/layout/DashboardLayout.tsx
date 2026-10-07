import Sidebar from './sidebar';
import Header from './header';
import type { ReactNode } from 'react';

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-h-screen bg-[#f8f8f7]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-6 max-w-5xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
