import React, { useState } from 'react';
import { useCoupon } from '@/contexts/CouponContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, Trash, ToggleLeft, ToggleRight, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have an AuthContext

const CouponManagement: React.FC = () => {
  const { token } = useAuth(); // Get auth token
  const { 
    coupons, 
    canClaim, 
    hasClaimedCoupon, 
    timeUntilNextClaim,
    addCoupon, 
    toggleCouponStatus, 
    deleteCoupon 
  } = useCoupon();
  const [newCouponCode, setNewCouponCode] = useState('');

  const handleAddCoupon = () => {
    if (token && newCouponCode.trim()) {
      addCoupon(newCouponCode, token);
      setNewCouponCode('');
    }
  };

  const handleToggleStatus = (id: string) => {
    if (token) {
      toggleCouponStatus(id, token);
    }
  };

  const handleDeleteCoupon = (id: string) => {
    if (token) {
      deleteCoupon(id, token);
    }
  };

  // Calculate system status
  const activeCoupons = coupons.filter(coupon => coupon.status === 'active').length;
  const totalCoupons = coupons.length;
  const systemStatus = activeCoupons === 0 ? 'critical' : activeCoupons < 3 ? 'warning' : 'healthy';

  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coupon Management</CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={systemStatus === 'healthy' ? 'default' : 
                      systemStatus === 'warning' ? 'secondary' : 
                      'destructive'}
              className="text-xs"
            >
              {systemStatus === 'healthy' ? 'System Healthy' : 
               systemStatus === 'warning' ? 'Low Inventory' : 
               'No Active Coupons'}
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              {activeCoupons}/{totalCoupons} Active
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Active Coupons</h3>
                  <p className="text-2xl font-bold">{activeCoupons}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">Claim Status</h3>
                  <p className="text-xl font-bold">{canClaim ? 'Available' : 'Unavailable'}</p>
                  {!canClaim && hasClaimedCoupon && timeUntilNextClaim && (
                    <div className="flex items-center justify-center gap-1 mt-1 text-amber-600 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>Next in {timeUntilNextClaim}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-slate-500 mb-1">System Status</h3>
                  <p className={`text-xl font-bold ${
                    systemStatus === 'healthy' ? 'text-green-600' :
                    systemStatus === 'warning' ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {systemStatus === 'healthy' ? 'Healthy' :
                     systemStatus === 'warning' ? 'Warning' :
                     'Critical'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Alert for critical status */}
          {systemStatus === 'critical' && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No active coupons available. Users cannot claim any coupons until you activate some.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Add new coupon */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter coupon code..."
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleAddCoupon} disabled={!newCouponCode.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Button>
          </div>
          
          {/* Coupon list */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Claim Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No coupons found. Add a coupon to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        <Badge variant={coupon.status === 'active' ? 'default' : 'secondary'}>
                          {coupon.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.claimedAt ? new Date(coupon.claimedAt).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(coupon.id)}
                            title={coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {coupon.status === 'active' ? 
                              <ToggleRight className="h-4 w-4 text-green-600" /> : 
                              <ToggleLeft className="h-4 w-4 text-slate-400" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponManagement;