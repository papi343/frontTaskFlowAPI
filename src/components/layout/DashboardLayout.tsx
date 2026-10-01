import Sidebar from "./sidebar";
import Header from "./header";
import type { ReactNode } from "react";



interface DashboardLayoutProps {
    children: ReactNode;
}


function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>

        </div>
    )
}
export default DashboardLayout;
