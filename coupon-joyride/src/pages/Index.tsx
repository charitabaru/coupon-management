
import { CouponProvider } from '@/contexts/CouponContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/CouponCard';

const Index = () => {
  return (
    <CouponProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex flex-col">
          {/* Hero Banner */}
          <section className="bg-coupon-gradient text-white py-12 px-4 md:py-16 text-center">
            <div className="container mx-auto max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Claim Your Free Coupon!</h1>
              <p className="text-xl opacity-90 mb-6">Limited stock—no signup needed!</p>
              
              <div className="mt-8 flex justify-center">
                <a 
                  href="#coupon-section" 
                  className="inline-block bg-white text-coupon-primary px-6 py-3 rounded-full font-medium text-lg hover:scale-105 hover:shadow-lg transition-all animate-pulse"
                >
                  Claim Now
                </a>
              </div>
            </div>
          </section>
          
          {/* Coupon Claim Section */}
          <section id="coupon-section" className="py-16 px-4 flex-1">
            <div className="container mx-auto max-w-3xl">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-2">Your Exclusive Discount Awaits</h2>
                <p className="text-gray-600">Click below to reveal your one-time discount code</p>
              </div>
              
              <CouponCard />
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </CouponProvider>
  );
};

export default Index;
