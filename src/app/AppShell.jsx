import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppShell() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F5F7] md:flex md:items-stretch">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="min-w-0 flex-1 overflow-x-hidden">
                <Topbar />

                <main className="min-w-0 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-[1700px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}