import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCoupon } from '@/contexts/CouponContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have an AuthContext

const ClaimHistory: React.FC = () => {
  const { token } = useAuth(); // Get auth token
  const { claimHistory, coupons, fetchCoupons, fetchClaimHistory } = useCoupon();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          await fetchCoupons(token);
          await fetchClaimHistory(token);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          // Add error handling (e.g., show toast notification)
        }
      };
      
      fetchData();
    }
  }, [token]); // Only depend on token
  // Filter by search term
  const filteredHistory = searchTerm 
    ? claimHistory.filter(claim => 
        claim.ip.includes(searchTerm) || 
        claim.couponCode.includes(searchTerm.toUpperCase())
      )
    : claimHistory;

  // Prepare data for pie chart
  const activeCoupons = coupons.filter(coupon => coupon.status === 'active').length;
  const claimedCoupons = coupons.filter(coupon => coupon.claimedBy).length;
  
  const chartData = [
    { name: 'Available', value: activeCoupons - claimedCoupons, color: '#4CAF50' },
    { name: 'Claimed', value: claimedCoupons, color: '#2196F3' },
    { name: 'Inactive', value: coupons.length - activeCoupons, color: '#9E9E9E' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Claim History & Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <Input
              placeholder="Search by IP or coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Coupon Code</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No claim history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.ip}</TableCell>
                      <TableCell>{claim.couponCode}</TableCell>
                      <TableCell>{claim.device}</TableCell>
                      <TableCell>{new Date(claim.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center h-80">
          <h3 className="text-lg font-semibold mb-4">Coupon Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClaimHistory;