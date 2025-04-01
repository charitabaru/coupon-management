
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-coupon-dark to-coupon-secondary text-white w-full shadow-md">
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold">Coupon App</div>
        <span className="text-sm bg-coupon-accent text-coupon-dark px-2 py-0.5 rounded-md">Admin Panel</span>
      </div>
      
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="text-coupon-accent border-coupon-accent hover:bg-coupon-accent/10 flex items-center gap-2"
      >
        <LogOut size={16} />
        Sign Out
      </Button>
    </nav>
  );
};

export default AdminNavbar;
