// src/pages/AdminDashboard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CouponProvider } from '@/contexts/CouponContext';
import AdminNavbar from '@/components/AdminNavbar';
import OverviewCards from '@/components/OverviewCards';
import CouponManagement from '@/components/CouponManagement';
import ClaimHistory from '@/components/ClaimHistory';
import SecuritySettings from '@/components/SecuritySettings';

const DashboardContent = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/admin');
    }
  }, [isAuthenticated, token, navigate]);
  
  if (!isAuthenticated) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <OverviewCards />
        <CouponManagement />
        <ClaimHistory />
        <SecuritySettings />
        
        <div className="h-10"></div>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AuthProvider>
      <CouponProvider>
        <DashboardContent />
      </CouponProvider>
    </AuthProvider>
  );
};

export default AdminDashboard;