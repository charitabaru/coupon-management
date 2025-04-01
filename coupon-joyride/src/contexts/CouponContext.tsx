import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponsAPI, claimsAPI } from '@/services/api';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  status: 'active' | 'inactive';
  claimedBy?: string;
  claimedAt?: string;
}

interface ClaimHistory {
  id: string;
  ip: string;
  couponCode: string;
  device: string;
  timestamp: string;
}

interface CouponContextType {
  coupons: Coupon[];
  claimHistory: ClaimHistory[];
  isLoading: boolean;
  error: string | null;
  errorMessage: string | null;
  hasClaimedCoupon: boolean;
  claimedCoupon: string | null;
  canClaim: boolean;
  timeUntilNextClaim: string | null;
  fetchCoupons: (token: string) => Promise<void>;
  fetchClaimHistory: (token: string) => Promise<void>;
  claimCoupon: () => Promise<void>;
  checkClaimEligibility: () => Promise<void>;
  addCoupon: (code: string, token: string) => Promise<void>;
  toggleCouponStatus: (id: string, token: string) => Promise<void>;
  deleteCoupon: (id: string, token: string) => Promise<void>;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasClaimedCoupon, setHasClaimedCoupon] = useState(false);
  const [claimedCoupon, setClaimedCoupon] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string | null>(null);
  
  // Check if user can claim a coupon
  const checkClaimEligibility = async () => {
    try {
      // Here we would normally call an API to check if user can claim
      // For now, let's simulate this with localStorage
      const lastClaimTime = localStorage.getItem('lastClaimTime');
      const claimedCode = localStorage.getItem('claimedCode');
      
      if (claimedCode) {
        setHasClaimedCoupon(true);
        setClaimedCoupon(claimedCode);
      } else {
        setHasClaimedCoupon(false);
      }
      
      if (lastClaimTime) {
        const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const nextAvailableTime = parseInt(lastClaimTime) + cooldownTime;
        const currentTime = Date.now();
        
        if (currentTime < nextAvailableTime) {
          setCanClaim(false);
          
          // Calculate remaining time
          const remainingTime = nextAvailableTime - currentTime;
          const hours = Math.floor(remainingTime / (60 * 60 * 1000));
          const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
          setTimeUntilNextClaim(`${hours}h ${minutes}m`);
        } else {
          setCanClaim(true);
          setTimeUntilNextClaim(null);
        }
      } else {
        setCanClaim(true);
        setTimeUntilNextClaim(null);
      }
    } catch (err) {
      setErrorMessage('Failed to check claim eligibility');
      console.error(err);
    }
  };

  const fetchCoupons = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await couponsAPI.getAll(token);
      setCoupons(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClaimHistory = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await claimsAPI.getHistory(token);
      setClaimHistory(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load claim history');
    } finally {
      setIsLoading(false);
    }
  };

  const claimCoupon = async () => {
    setIsLoading(true);
    setError(null);
    setErrorMessage(null);
    
    try {
      const result = await claimsAPI.claim();
      setHasClaimedCoupon(true);
      setClaimedCoupon(result.code);
      
      // Store claim info in localStorage
      localStorage.setItem('lastClaimTime', Date.now().toString());
      localStorage.setItem('claimedCode', result.code);
      
      toast.success(`Claimed coupon: ${result.code}`);
      setCanClaim(false);
      
      // Set cooldown timer
      const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
      const hours = Math.floor(cooldownTime / (60 * 60 * 1000));
      setTimeUntilNextClaim(`${hours}h 0m`);
      
    } catch (err) {
      setError(err.message);
      setErrorMessage(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addCoupon = async (code: string, token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await couponsAPI.create(code, token);
      toast.success('Coupon added successfully');
      await fetchCoupons(token);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCouponStatus = async (id: string, token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const coupon = coupons.find(c => c.id === id);
      if (!coupon) throw new Error('Coupon not found');
      
      await couponsAPI.updateStatus(id, coupon.status === 'active' ? false : true, token);
      toast.success('Coupon status updated');
      await fetchCoupons(token);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCoupon = async (id: string, token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await couponsAPI.delete(id, token);
      toast.success('Coupon deleted successfully');
      await fetchCoupons(token);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize eligibility check
  useEffect(() => {
    checkClaimEligibility();
  }, []);

  return (
    <CouponContext.Provider value={{
      coupons,
      claimHistory,
      isLoading,
      error,
      errorMessage,
      hasClaimedCoupon,
      claimedCoupon,
      canClaim,
      timeUntilNextClaim,
      fetchCoupons,
      fetchClaimHistory,
      claimCoupon,
      checkClaimEligibility,
      addCoupon,
      toggleCouponStatus,
      deleteCoupon
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};