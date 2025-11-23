import './dashboard.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="dashboard-root">
            <Sidebar />
            <div className="dashboard-main">
                <Header />
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
}
