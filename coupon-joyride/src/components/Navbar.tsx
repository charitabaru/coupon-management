
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 w-full bg-gradient-to-r from-coupon-secondary to-coupon-dark text-white shadow-lg">
      <div className="text-xl font-bold flex items-center">
        <span className="text-coupon-accent mr-2">✨</span>
        <span>Coupon App</span>
      </div>
      <Link 
        to="/admin" 
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent hover:bg-white/10 border border-coupon-accent/50 transition-colors text-coupon-accent hover:border-coupon-accent"
      >
        <Lock size={16} />
        <span>Admin</span>
      </Link>
    </nav>
  );
};

export default Navbar;
