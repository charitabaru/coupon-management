
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@demo.com'); // Pre-fill for testing
  const [password, setPassword] = useState('pass123'); // Pre-fill for testing
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use the login function from useAuth
      await login(email, password);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`p-6 bg-white rounded-lg shadow-lg w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@demo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-coupon-secondary focus:border-coupon-accent"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-coupon-secondary focus:border-coupon-accent"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-coupon-secondary to-coupon-dark hover:opacity-90"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Use demo credentials:</p>
        <p>Email: admin@demo.com / Password: pass123</p>
      </div>
    </form>
  );
};

export default LoginForm;
