import React, { useState, useEffect, useRef } from 'react';
import { Gift, Sparkles, Lock, Truck, Star, Calendar, CheckCircle, Mail, Instagram, Youtube, Heart, Users, Package, Menu, X } from 'lucide-react';

export default function SecretGiftLanding() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [spotsLeft, setSpotsLeft] = useState(742);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const observerRef = useRef(null);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

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

  // Load Razorpay immediately on component mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay');
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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

    // Create floating hearts
    const heartInterval = setInterval(() => {
      setFloatingHearts(prev => [...prev, {
        id: Date.now(),
        left: Math.random() * 100,
        duration: 3 + Math.random() * 2
      }]);
      
      // Clean up old hearts
      setTimeout(() => {
        setFloatingHearts(prev => prev.slice(1));
      }, 5000);
    }, 2000);

    return () => clearInterval(heartInterval);
  }, []);

  const processPayment = async () => {
    // Prevent double-clicks
    if (isProcessing) return;
    
    // Check if Razorpay is loaded
    if (!razorpayLoaded || typeof window.Razorpay === 'undefined') {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const AMOUNT = 249; // ₹249
    const API_URL = import.meta.env.VITE_API_URL || 'https://webpage-et86.onrender.com';

    try {
      // Create order from backend
      const response = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: AMOUNT,
          currency: 'INR',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Secret Gift India',
        description: 'Secret Gift - 31st December 2025',
        image: '/logo.svg',
        order_id: data.order.id,
        
        handler: async function (response) {
          // Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              console.log('Payment verified successfully');
              setShowBookingPopup(false);
              setShowSuccessPopup(true);
              
              // Decrease spots by 1, reset to 999 when it reaches 0
              setSpotsLeft(prev => {
                const newSpots = prev - 1;
                return newSpots <= 0 ? 999 : newSpots;
              });
              
              setTimeout(() => {
                setShowSuccessPopup(false);
              }, 5000);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support with Payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsProcessing(false);
          }
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
            setIsProcessing(false);
          },
          escape: true,
          backdropclose: false
        }
      };

      // Open Razorpay instantly
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
        setIsProcessing(false);
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const scrollToBooking = () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/40 to-slate-900 text-white overflow-x-hidden">
      {/* Navigation Menu Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 z-40 bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-110 animate-glowPulse"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Animated Navigation Drawer - Gift Unwrap Style */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeInUp"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer - Unwrapping Animation */}
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-full z-50 menu-overlay">
            <div className="h-full bg-gradient-to-br from-pink-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-l border-pink-400/30 p-8 flex flex-col">
              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="self-end mb-8 p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Animated Gift Icon */}
              <div className="mb-8 text-center animate-bounceIn">
                <div className="inline-block relative">
                  <Gift className="w-16 h-16 text-pink-400 animate-giftUnwrap" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold mt-4 gradient-text">Secret Gift</h2>
              </div>

              {/* Menu Items with Staggered Animation */}
              <nav className="flex-1 space-y-4">
                {[
                  { label: '🏠 Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                  { label: '💝 Our Story', action: () => scrollToSection('story') },
                  { label: '🎯 How It Works', action: () => scrollToSection('how-it-works') },
                  { label: '⭐ Reviews', action: () => scrollToSection('reviews') },
                  { label: '🎁 Book Now', action: scrollToBooking }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full text-left px-6 py-4 rounded-xl glass border-pink-400/20 hover:border-pink-400/60 transition-all hover:translate-x-2 text-lg font-semibold hover:bg-white/5 animate-slideInRight"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Social Links with Animation */}
              <div className="mt-8 pt-8 border-t border-pink-400/20">
                <p className="text-sm text-gray-300 mb-4 animate-fadeInUp">Connect with us</p>
                <div className="flex gap-4 justify-center">
                  {[
                    { icon: Instagram, href: '#', color: 'pink' },
                    { icon: Youtube, href: '#', color: 'red' },
                    { icon: Mail, href: 'mailto:secretgiftindia@gmail.com', color: 'purple' }
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      className={`p-3 rounded-full glass border-${social.color}-400/30 hover:border-${social.color}-400/60 transition-all hover:scale-110 animate-bounceIn`}
                      style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className={`w-5 h-5 text-${social.color}-400`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

      {/* Hero Section - Emotional & Animated */}
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background with Parallax */}
        <div 
          className="absolute inset-0 z-0 parallax"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1920&q=80" 
            alt="Gift giving moment" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/80 via-purple-900/70 to-slate-900/90"></div>
        </div>

        {/* Floating hearts animation */}
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute z-5 text-pink-400/40 animate-floatUp"
            style={{ 
              left: `${heart.left}%`, 
              bottom: '-50px',
              animationDuration: `${heart.duration}s`
            }}
          >
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
        ))}

        {/* Decorative Rolling Gifts */}
        <div className="absolute top-1/4 left-10 animate-rollIn opacity-20 hidden md:block">
          <Gift className="w-16 h-16 text-pink-300" />
        </div>
        <div className="absolute bottom-1/4 right-10 animate-rollIn opacity-20 hidden md:block" style={{ animationDelay: '0.3s' }}>
          <Gift className="w-20 h-20 text-purple-300" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Animated Gift Icon with Bounce */}
          <div className="inline-block mb-8 animate-bounceIn">
            <div className="relative">
              <Gift className="w-24 h-24 text-pink-400 mx-auto drop-shadow-2xl animate-giftUnwrap" />
              <Sparkles className="w-10 h-10 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-400/30 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight animate-textReveal">
            Give the Gift of
            <span className="block gradient-text text-6xl md:text-8xl mt-2 animate-bounceIn" style={{ animationDelay: '0.3s' }}>
              Pure Joy ✨
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed scroll-reveal">
            Whether it's for <span className="text-pink-400 font-semibold">your mom</span>, 
            <span className="text-purple-400 font-semibold"> your partner</span>, 
            <span className="text-yellow-400 font-semibold"> your sister</span>, or even 
            <span className="text-green-400 font-semibold"> yourself</span> — 
            every moment deserves to be celebrated with a heartfelt surprise.
          </p>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed scroll-reveal">
            <Heart className="inline w-5 h-5 text-red-400 animate-heartbeat" /> 
            {' '}Not just for New Year's Eve. Not just for birthdays.{' '}
            <span className="text-pink-400 font-medium">For any moment that matters.</span>
          </p>

          {/* Emotional callout boxes */}
          <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto scroll-reveal">
            <div className="glass rounded-xl p-4 border-pink-400/30 hover:border-pink-400/60 transition-all">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200 font-medium">Surprise Someone Special</p>
            </div>
            <div className="glass rounded-xl p-4 border-purple-400/30 hover:border-purple-400/60 transition-all">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200 font-medium">Celebrate Every Occasion</p>
            </div>
            <div className="glass rounded-xl p-4 border-yellow-400/30 hover:border-yellow-400/60 transition-all">
              <Package className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200 font-medium">Thoughtfully Curated</p>
            </div>
          </div>

          {/* Countdown Timer - Styled */}
          <div className="mb-8 scroll-reveal">
            <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest">Special Drop Countdown</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-2xl p-4 min-w-[90px] border-pink-400/20 hover:border-pink-400/50 transition-all backdrop-blur-xl">
                  <div className="text-4xl font-bold gradient-text">{item.value.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spots Left with shimmer */}
          <div className="inline-block glass rounded-lg px-6 py-3 mb-10 border-pink-400/30 shimmer scroll-reveal">
            <span className="text-pink-400 font-semibold text-lg">⚡ {spotsLeft} of 999 spots left</span>
          </div>

          <div className="scroll-reveal">
            <button 
              onClick={scrollToBooking}
              className="group bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Book Your Gift Now
                <Gift className="w-6 h-6 group-hover:animate-bounce" />
              </span>
            </button>
            <p className="text-gray-400 text-sm mt-4">
              💝 Starting at just ₹249 • Free Delivery • Surprise Guaranteed
            </p>
          </div>
        </div>
      </div>

      {/* Emotional Story Section - NEW */}
      <div id="story" className="py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Every Gift Tells a <span className="gradient-text">Story</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Imagine the smile when your loved one opens something they never expected. 
              The warmth. The connection. The memory that lasts forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* For Her */}
            <div className="scroll-reveal">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80" 
                  alt="Gift for her" 
                  className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">For Your Loved Ones</h3>
                    <p className="text-gray-200">Mom, girlfriend, sister, wife — make them feel cherished</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-reveal space-y-6">
              <div className="glass rounded-xl p-6 border-pink-400/20 hover:border-pink-400/50 transition-all">
                <Heart className="w-10 h-10 text-pink-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">💝 For Your Mother</h3>
                <p className="text-gray-300 leading-relaxed">
                  She gave you everything. Now give her a moment of pure delight. 
                  A surprise that says "Thank you for being you."
                </p>
              </div>

              <div className="glass rounded-xl p-6 border-purple-400/20 hover:border-purple-400/50 transition-all">
                <Sparkles className="w-10 h-10 text-purple-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">💜 For Your Partner</h3>
                <p className="text-gray-300 leading-relaxed">
                  Keep the spark alive. Show them they're always on your mind 
                  with a thoughtful gift that arrives when they least expect it.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border-yellow-400/20 hover:border-yellow-400/50 transition-all">
                <Star className="w-10 h-10 text-yellow-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">✨ For Yourself</h3>
                <p className="text-gray-300 leading-relaxed">
                  You deserve it too! Treat yourself to something special. 
                  Self-love is the best love.
                </p>
              </div>
            </div>
          </div>

          {/* For Him / Universal */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal order-2 md:order-1 space-y-6">
              <div className="glass rounded-xl p-6 border-blue-400/20 hover:border-blue-400/50 transition-all">
                <Gift className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">🎁 For Any Occasion</h3>
                <p className="text-gray-300 leading-relaxed">
                  Birthdays, anniversaries, or just because — there's no wrong time 
                  to make someone feel special.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border-green-400/20 hover:border-green-400/50 transition-all">
                <Users className="w-10 h-10 text-green-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">💚 For Your Best Friend</h3>
                <p className="text-gray-300 leading-relaxed">
                  Celebrate your bond. Remind them why they're irreplaceable 
                  with a surprise that speaks volumes.
                </p>
              </div>

              <div className="glass rounded-xl p-6 border-red-400/20 hover:border-red-400/50 transition-all">
                <CheckCircle className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-3">❤️ For Family</h3>
                <p className="text-gray-300 leading-relaxed">
                  Strengthen bonds. Create memories. Show gratitude. 
                  Family deserves your thoughtfulness.
                </p>
              </div>
            </div>

            <div className="scroll-reveal order-1 md:order-2">
              <div className="relative group">
                <img 
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80" 
                  alt="Gift giving" 
                  className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Universal Gifting</h3>
                    <p className="text-gray-200">Perfect for everyone, every time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-white scroll-reveal">How It Works</h2>
          <p className="text-center text-gray-300 mb-4 text-xl scroll-reveal">Simple. Thoughtful. Magical.</p>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto scroll-reveal">
            Three easy steps to create a moment of pure joy. No hassle, just happiness.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { 
                icon: Lock, 
                title: 'Book Your Surprise', 
                desc: 'Reserve your spot for just ₹249. Secure payment, guaranteed delivery.',
                step: '01',
                detail: 'Limited to 999 gifts. Once you book, your gift is secured.',
                color: 'pink'
              },
              { 
                icon: Calendar, 
                title: 'The Wait Begins', 
                desc: 'Sit back and let the anticipation build. Your gift is being carefully prepared just for you.',
                step: '02',
                detail: 'We keep it a complete secret until 31st December. Trust us, the surprise is worth the wait!',
                color: 'purple'
              },
              { 
                icon: Gift, 
                title: 'Receive & Celebrate', 
                desc: 'Your mystery gift arrives between 31st December and 3rd January. Unwrap and start 2026 with joy!',
                step: '03',
                detail: 'Track your delivery and get ready to discover what\'s inside. Happy New Year! 🎉',
                color: 'yellow'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative glass rounded-2xl p-8 text-center border-slate-700 hover:border-pink-400/50 transition-all hover:shadow-2xl hover:scale-105 duration-300 scroll-reveal">
                <div className={`absolute -top-4 -right-4 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg`}>
                  {item.step}
                </div>
                
                {/* Image with icon overlay */}
                <div className="relative mb-6 mx-auto w-full h-48 rounded-xl overflow-hidden group">
                  <img 
                    src={idx === 0 ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' : idx === 1 ? 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80' : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/30 to-purple-500/30 flex items-center justify-center`}>
                    <item.icon className={`w-16 h-16 text-${item.color}-300 drop-shadow-2xl group-hover:scale-125 transition-all`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 text-base mb-4 leading-relaxed">{item.desc}</p>
                <div className={`pt-4 border-t border-${item.color}-400/20`}>
                  <p className="text-sm text-gray-400 italic">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Timeline - Animated */}
          <div className="relative max-w-4xl mx-auto mt-16 scroll-reveal">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 transform -translate-y-1/2 hidden md:block rounded-full shadow-lg"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-pink-500/50 hover:scale-110 transition-all cursor-pointer">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <p className="text-base text-gray-300 font-semibold">Book Today</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/50 hover:scale-110 transition-all cursor-pointer">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <p className="text-base text-gray-300 font-semibold">Wait for Dec 31</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-yellow-500/50 hover:scale-110 transition-all cursor-pointer animate-giftUnwrap">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <p className="text-base text-gray-300 font-semibold">Receive & Enjoy!</p>
              </div>
            </div>
          </div>

          {/* Additional Info Section - Enhanced */}
          <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-8 border-pink-400/30 hover:border-pink-400/60 transition-all scroll-reveal">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-3 text-xl">What's Inside?</h4>
                  <p className="text-sm text-gray-400">It's a mystery! Could be tech, accessories, self-care, or something completely unexpected. All we can say is - it's unique and carefully chosen.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 rounded-lg p-3">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Why Trust Us?</h4>
                  <p className="text-sm text-gray-400">Last year, hundreds received their mystery gifts on time. Check our testimonials below. Your satisfaction is guaranteed!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Mission</h2>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
            We believe New Year deserves more than just resolutions—it deserves magic, surprises, and unforgettable moments. Our mission is to bring joy to 999 people across India by delivering carefully curated mystery gifts that spark wonder and create lasting memories.
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Start 2026 with good vibes, luck, and the thrill of the unknown. Because every great year begins with a great surprise.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: 'Exclusive', desc: 'One-of-a-kind curated experience', detail: 'Handpicked gifts you won\'t find anywhere else', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
              { icon: Lock, title: 'Limited', desc: 'Only 999 gifts available', detail: 'Once they\'re gone, they\'re gone forever', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80' },
              { icon: Truck, title: 'Nationwide', desc: 'Delivered across India', detail: 'Free delivery to your doorstep, guaranteed', img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500/40 transition">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>
                <div className="p-6">
                  <item.icon className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
                  <p className="text-gray-500 text-xs italic">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story & Experience */}
      <div className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Story</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              From a small idea to India's most exciting New Year tradition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 space-y-6">
              <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-xl p-6 border border-pink-500/20">
                <h3 className="text-2xl font-bold text-white mb-3">3+ Years of Magic</h3>
                <p className="text-gray-400 leading-relaxed">
                  What started as a passion project in 2022 has grown into something extraordinary. We've successfully delivered mystery gifts to thousands of happy customers across India, creating unforgettable New Year moments.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-3">Why We Do This</h3>
                <p className="text-gray-400 leading-relaxed">
                  We believe the best gifts aren't always the ones you expect. The element of surprise, the anticipation, the joy of discovery—that's what makes a gift truly special. Every year, we carefully curate unique items that bring smiles, spark conversations, and start the new year right.
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-4">
              {/* Featured Image */}
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80"
                  alt="Gift celebration"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              </div>

              {/* Additional trust-building images */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80"
                    alt="Premium gift packaging"
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=300&q=80"
                    alt="Happy customers"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-pink-500/20 rounded-lg p-3">
                    <CheckCircle className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">5,000+</h4>
                    <p className="text-sm text-gray-400">Gifts Delivered</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">4.8/5</h4>
                    <p className="text-sm text-gray-400">Customer Rating</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-pink-500/20 rounded-lg p-3">
                    <Truck className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">28 States</h4>
                    <p className="text-sm text-gray-400">Pan-India Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trustworthiness Statement */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-8 border border-pink-500/30">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Why Trust Secret Drop India?</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-pink-500/10 rounded-xl p-4 mb-3">
                  <CheckCircle className="w-8 h-8 text-pink-400 mx-auto" />
                </div>
                <h4 className="font-semibold text-white mb-2">100% Transparent</h4>
                <p className="text-sm text-gray-400">No hidden charges. What you see is what you pay—₹249 includes everything.</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-500/10 rounded-xl p-4 mb-3">
                  <Lock className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                <h4 className="font-semibold text-white mb-2">Secure Payments</h4>
                <p className="text-sm text-gray-400">Your payment is processed through Razorpay—India's most trusted payment gateway.</p>
              </div>

              <div className="text-center">
                <div className="bg-pink-500/10 rounded-xl p-4 mb-3">
                  <Truck className="w-8 h-8 text-pink-400 mx-auto" />
                </div>
                <h4 className="font-semibold text-white mb-2">Guaranteed Delivery</h4>
                <p className="text-sm text-gray-400">We've never missed a deadline. Your gift arrives on time, every time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stories */}
      <div id="reviews" className="py-20 px-4 scroll-reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stories That Warm Our Hearts</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real moments, real joy. Here's what makes this journey special.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-xl p-6 border border-pink-500/20">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                  alt="Anjali"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-400"
                />
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">The Perfect Surprise</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                "I ordered this for my younger sister who was feeling low during New Year. When the package arrived on 31st, her face lit up! She called me crying (happy tears!) saying it was exactly what she needed. Thank you for making my sister's New Year unforgettable."
              </p>
              <p className="text-xs text-pink-400 font-medium">— Anjali, Mumbai</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"
                  alt="Rahul"
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                />
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Worth Every Rupee</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                "Honestly, I was skeptical about a 'mystery gift.' But wow! What I received was not just valuable, it was thoughtful and unique. My family keeps asking me where I got it from. Already booked again for next year!"
              </p>
              <p className="text-xs text-purple-400 font-medium">— Rahul, Bangalore</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-xl p-6 border border-pink-500/20">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80"
                  alt="Priya"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-400"
                />
                <Star className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">A New Tradition</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                "Last year, my entire college group ordered together. The unboxing party we had on New Year's Eve became legendary! This year, we're 15 people. Secret Drop has become our New Year tradition."
              </p>
              <p className="text-xs text-pink-400 font-medium">— Priya, Pune</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div id="booking" className="py-20 px-4 bg-slate-800/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1200&q=80"
            alt="Gift background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-lg mx-auto relative z-10">
          <div className="bg-slate-800/80 rounded-xl p-8 border border-slate-700 shadow-xl">
            <div className="text-center mb-8">
              <Gift className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3 text-white">Book Your Secret Gift</h2>
              <p className="text-gray-400 text-sm">Limited to 999 people. Be one of the chosen ones.</p>
            </div>
              
            <div className="bg-slate-900/80 rounded-lg p-6 mb-6 border border-slate-700">
              <div className="text-4xl font-bold text-pink-400 mb-1">₹249</div>
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

            <button 
              onClick={processPayment}
              disabled={isProcessing || !razorpayLoaded}
              className={`w-full px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg 
                ${isProcessing || !razorpayLoaded 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600 hover:shadow-pink-500/50'
                } text-white`}
            >
              {isProcessing ? '⏳ Processing...' : !razorpayLoaded ? '⏳ Loading...' : 'Book Now - ₹249 🎁'}
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
          <h2 className="text-3xl font-bold text-center mb-4 text-white">What Our Customers Say</h2>
          <p className="text-center text-gray-400 mb-12">Real reviews from real people who experienced the magic</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                text: "We received this gift last year and it was absolutely amazing! The quality exceeded our expectations. My wife still uses it daily. Booking again this year for my parents!", 
                name: "Vikram K.", 
                location: "Delhi",
                rating: 5
              },
              { 
                text: "Amazing service and super fast delivery! Got my package on 31st Dec morning. The gift inside was so unique and practical. Worth every penny. Highly recommend to everyone!", 
                name: "Sneha R.", 
                location: "Chennai",
                rating: 5
              },
              { 
                text: "Highly recommend Secret Drop! The mystery element made it so exciting. My entire family gathered to open it together. It's not just a gift, it's an experience. Can't wait for this year's!", 
                name: "Arjun M.", 
                location: "Kolkata",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-pink-500/40 transition">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-pink-400 font-medium text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional mini reviews */}
          <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm italic mb-2">"Delivered right on time, packaging was premium!"</p>
              <p className="text-pink-400 text-xs">— Neha S., Hyderabad</p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm italic mb-2">"Best ₹249 I've spent. My friends are jealous!"</p>
              <p className="text-pink-400 text-xs">— Karan P., Jaipur</p>
            </div>
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
              { q: 'Is delivery included?', a: "Yes! ₹249 includes nationwide delivery to any address in India." }
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
                <span className="text-white font-semibold">₹249</span>
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
              Pay ₹249 with Razorpay
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