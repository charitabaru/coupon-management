
import { Clock, Tag, Wifi } from 'lucide-react';
import { useCoupon } from '@/contexts/CouponContext';

const OverviewCards: React.FC = () => {
  const { coupons, claimHistory } = useCoupon();
  
  // Calculate stats
  const totalCoupons = coupons.length;
  
  // Count claims within the last 24 hours
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const claimsToday = claimHistory.filter(claim => {
    const claimDate = new Date(claim.timestamp);
    return claimDate >= oneDayAgo;
  }).length;
  
  // Count unique IPs
  const uniqueIPs = new Set(claimHistory.map(claim => claim.ip)).size;

  const cards = [
    {
      title: 'Total Coupons',
      value: totalCoupons,
      icon: Tag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Claimed Today',
      value: claimsToday,
      icon: Clock,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Active IPs',
      value: uniqueIPs,
      icon: Wifi,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
