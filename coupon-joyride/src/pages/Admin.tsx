
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

const AdminContent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="bg-admin-gradient min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

const Admin = () => {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
};

export default Admin;
