import React, { useEffect } from 'react';
import { useCoupon } from '@/contexts/CouponContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, Check, Gift } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CouponClaimSection: React.FC = () => {
  const { 
    claimCoupon, 
    hasClaimedCoupon, 
    claimedCoupon, 
    errorMessage, 
    isLoading, 
    canClaim,
    timeUntilNextClaim,
    checkClaimEligibility 
  } = useCoupon();

  // Check eligibility on mount and when component is focused
  useEffect(() => {
    checkClaimEligibility();
    
    // Also check when user returns to the tab
    const handleFocus = () => {
      checkClaimEligibility();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkClaimEligibility]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Claim Your Discount</CardTitle>
        <CardDescription>
          Get your exclusive discount coupon
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Already claimed coupon display */}
        {hasClaimedCoupon && claimedCoupon && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="flex justify-center mb-2">
              <Check className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-1">Your Coupon Code</h3>
            <div className="bg-white p-3 rounded border border-green-300 text-xl font-mono tracking-wider">
              {claimedCoupon}
            </div>
            <p className="text-sm mt-2 text-gray-600">
              Use this code at checkout for your discount
            </p>
          </div>
        )}
        
        {/* Show cooldown timer */}
        {!canClaim && timeUntilNextClaim && (
          <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Next claim available in: <strong>{timeUntilNextClaim}</strong>
              </AlertDescription>
            </div>
          </Alert>
        )}
        
        {/* Error message */}
        {errorMessage && !hasClaimedCoupon && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full py-6 text-lg"
          variant={canClaim ? "default" : "outline"}
          disabled={!canClaim || isLoading}
          onClick={claimCoupon}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : hasClaimedCoupon ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Already Claimed
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Claim Your Coupon
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CouponClaimSection;