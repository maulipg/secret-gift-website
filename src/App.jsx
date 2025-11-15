import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Lock, Truck, Star, Calendar, CheckCircle, Mail, Instagram, Youtube } from 'lucide-react';
import './App.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SecretGiftLanding() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [spotsLeft, setSpotsLeft] = useState(742);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const targetDate = new Date('2025-12-31T23:59:59');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load Razorpay on component mount
  useEffect(() => {
    loadRazorpayScript();
    
    // Load Razorpay Payment Button script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_Rg21Hy2HxCCkGx');
    script.async = true;
    
    const form = document.getElementById('razorpay-payment-form');
    if (form) {
      form.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const createConfetti = () => {
      const colors = ['#FF6B9D', '#C785F5', '#FFB4D6', '#A78BFA'];
      const newConfetti = [];
      for (let i = 0; i < 20; i++) {
        newConfetti.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 4 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setConfetti(newConfetti);
    };
    createConfetti();
  }, []);

  const handleBooking = () => {
    // Use Razorpay Payment Button instead of popup
    const form = document.getElementById('razorpay-payment-form');
    const button = form.querySelector('button');
    if (button) {
      button.click();
    }
  };

  const processPayment = () => {
    const RAZORPAY_KEY_ID = 'rzp_test_RfdQLkOAQk9RKk';
    const AMOUNT = 19900; // ₹199 in paise (199 * 100)

    // TEMPORARY: Using direct payment without order_id (for testing UI only)
    // For production, you MUST create an order from your backend first
    
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: AMOUNT,
      currency: 'INR',
      name: 'Secret Drop India',
      description: 'Secret Gift - 31st December 2025',
      image: '', // Add your logo URL here
      
      // NOTE: For production, you need to:
      // 1. Create a backend API endpoint
      // 2. Call Razorpay Order API from backend with key_secret
      // 3. Pass the order_id here
      // order_id: 'order_xxxxx', // Add this from backend
      
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        console.log('Payment ID:', response.razorpay_payment_id);
        
        setShowBookingPopup(false);
        setShowSuccessPopup(true);
        setSpotsLeft(prev => prev - 1);
        
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      notes: {
        product: 'Secret Gift 2025',
        delivery_date: '31st December 2025'
      },
      theme: {
        color: '#EC4899'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
        },
        escape: true,
        backdropclose: false
      }
    };

    // Check if Razorpay is loaded
    if (typeof window.Razorpay !== 'undefined') {
      try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          alert('Payment failed: ' + response.error.description);
        });
        razorpay.open();
      } catch (error) {
        console.error('Razorpay error:', error);
        alert('Payment gateway error. Please check your Razorpay credentials.');
      }
    } else {
      alert('Payment gateway is loading. Please try again in a moment.');
    }
  };

  const scrollToBooking = () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/40 to-slate-900 text-white overflow-x-hidden">
      {/* Floating confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="fixed w-2 h-2 rounded-full opacity-40 pointer-events-none"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            backgroundColor: c.color,
            animation: `fall ${c.duration}s linear ${c.delay}s infinite`
          }}
        />
      ))}

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-8">
            <Gift className="w-16 h-16 text-pink-400 mx-auto" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            The Secret Gift Drop
          </h1>
          
          <p className="text-2xl md:text-3xl text-pink-400 mb-3 font-medium">
            31st December 2025
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Something unique and magical awaits you.<br />
            <span className="text-pink-400 font-medium">Only 999 people will get it.</span>
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 rounded-xl p-4 min-w-[80px] border border-slate-700">
                <div className="text-3xl font-bold text-pink-400">{item.value.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Spots Left */}
          <div className="inline-block bg-pink-500/10 border border-pink-500/30 rounded-lg px-5 py-2 mb-10">
            <span className="text-pink-400 font-medium text-sm">⚡ Only {spotsLeft} spots remaining</span>
          </div>

          <div>
            <button 
              onClick={scrollToBooking}
              className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-pink-500/50"
            >
              Book Now 🎁
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-white">How It Works</h2>
          <p className="text-center text-gray-400 mb-16">Simple, mysterious, magical</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'Pre-Book', desc: 'Secure your secret gift for just ₹199', step: '01' },
              { icon: Calendar, title: 'Wait', desc: 'The mystery builds till 31st December', step: '02' },
              { icon: Gift, title: 'Receive', desc: 'Get your surprise delivered to your doorstep', step: '03' }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700 hover:border-pink-500/50 transition-colors">
                <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Join */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Join the Drop?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Because New Year deserves a surprise!<br />
            Start 2026 with good vibes, luck, and mystery.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: 'Exclusive', desc: 'One-of-a-kind experience' },
              { icon: Lock, title: 'Limited', desc: 'Only 999 gifts available' },
              { icon: Truck, title: 'Nationwide', desc: 'Delivered across India' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <item.icon className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div id="booking" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-lg mx-auto">
          <div className="bg-slate-800/80 rounded-xl p-8 border border-slate-700 shadow-xl">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3 text-white">Book Your Secret Gift</h2>
              <p className="text-gray-400 text-sm">Limited to 999 people. Be one of the chosen ones.</p>
            </div>
              
            <div className="bg-slate-900/80 rounded-lg p-6 mb-6 border border-slate-700">
              <div className="text-4xl font-bold text-pink-400 mb-1">₹199</div>
              <p className="text-gray-400 text-sm">Inclusive of delivery anywhere in India</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-2">⚡ {spotsLeft} of 999 spots remaining</p>
              <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-pink-500 h-full transition-all duration-500"
                  style={{ width: `${((999 - spotsLeft) / 999) * 100}%` }}
                />
              </div>
            </div>

            {/* Razorpay Payment Button */}
            <form id="razorpay-payment-form" className="w-full mb-4">
              {/* Razorpay button will be injected here */}
            </form>

            <button 
              onClick={scrollToBooking}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-pink-500/50"
            >
              Book My Secret Gift 🎁
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              🚫 COD not available — Limited edition drop
            </p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What People Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { text: "Last year's drop was magical! Can't wait for this one 🎁", name: "Priya S." },
              { text: "The mystery kept me excited for weeks. Totally worth it!", name: "Rahul M." }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <Star className="w-6 h-6 text-pink-400 mb-3" />
                <p className="text-gray-300 mb-3 italic text-sm">"{testimonial.text}"</p>
                <p className="text-pink-400 font-medium text-sm">— {testimonial.name}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { icon: CheckCircle, text: 'Secure Payment' },
              { icon: Truck, text: 'Fast Delivery' },
              { icon: Lock, text: 'Limited 999 Spots' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-800/50 px-5 py-2 rounded-lg border border-slate-700">
                <item.icon className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'What is the gift?', a: "It's a mystery! You'll discover it on 31st December. That's what makes it special." },
              { q: 'Can I cancel after booking?', a: "No, because this is a limited edition drop with only 999 spots. All bookings are final." },
              { q: 'When will I receive my gift?', a: "Your gift will arrive between 31st December 2025 and 3rd January 2026." },
              { q: 'Is delivery included?', a: "Yes! ₹199 includes nationwide delivery to any address in India." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                <h3 className="text-lg font-semibold text-pink-400 mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            <a href="mailto:hello@secretdrop.in" className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition">
              <Mail className="w-5 h-5" />
              <span className="text-sm">hello@secretdrop.in</span>
            </a>
          </div>
          
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-gray-500 text-xs">
            © 2025 Secret Drop India. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Book Button */}
      <button 
        onClick={scrollToBooking}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 z-50"
      >
        Book Now 🎁
      </button>

      {/* Booking Popup */}
      {showBookingPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-slate-700">
            <h3 className="text-2xl font-bold mb-3 text-white">Complete Your Booking</h3>
            <p className="text-gray-400 mb-6 text-sm">You're about to join 999 lucky people!</p>
            
            <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Secret Gift</span>
                <span className="text-white font-semibold">₹199</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Including delivery</span>
                <span className="text-green-400">✓ Secure</span>
              </div>
            </div>

            <button 
              onClick={processPayment}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition mb-3"
            >
              Pay ₹199 with Razorpay
            </button>
            
            <button 
              onClick={() => setShowBookingPopup(false)}
              className="w-full bg-slate-700 text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-green-500/50 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-green-400">Booking Confirmed! 🎉</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Your secret gift is reserved! Get ready for the reveal on 31st December.
            </p>
            <p className="text-xs text-gray-500">
              Check your email for confirmation details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}