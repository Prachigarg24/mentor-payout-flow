
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/mentor');
    }
  }, [isAuthenticated, navigate, user?.role]);

  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      <header className="bg-white/80 backdrop-blur-md border-b border-lavender-200 px-6 py-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-lavender-700 to-pistachio-600 bg-clip-text text-transparent">PayTech</h1>
          <div className="flex gap-4">
            <Button variant="outline" className="border-lavender-300 hover:bg-lavender-100" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-lavender-600 hover:bg-lavender-700" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-waves py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="glass-card p-8 rounded-xl shadow-xl">
                <h2 className="text-4xl font-extrabold text-lavender-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  Payout Automation for EdTech
                </h2>
                <p className="mt-5 text-xl text-gray-700">
                  Streamline how your EdTech company manages payments to mentors and educators with our secure, flexible, and auditable platform.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-lavender-600 to-lavender-800 hover:from-lavender-700 hover:to-lavender-900" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-pistachio-400 text-pistachio-700 hover:bg-pistachio-50" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                </div>
              </div>
              
              <div className="mt-12 lg:mt-0">
                <div className="glass-card overflow-hidden border border-lavender-200 shadow-xl">
                  <div className="px-6 py-8 bg-gradient-to-r from-lavender-600 to-lavender-800">
                    <h3 className="text-2xl font-bold text-white">Payout Dashboard</h3>
                    <p className="text-lavender-100 mt-2">Manage all your mentor payments in one place</p>
                  </div>
                  <div className="px-6 py-8 bg-white/90">
                    <div className="space-y-6">
                      <div className="bg-pistachio-50 rounded-lg p-4 border border-pistachio-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Mentor Session</p>
                            <p className="text-xs text-gray-500">Apr 15, 2023 • 60 minutes</p>
                          </div>
                          <p className="text-sm font-semibold text-lavender-700">₹4,000</p>
                        </div>
                      </div>
                      <div className="bg-pistachio-50 rounded-lg p-4 border border-pistachio-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Evaluation Review</p>
                            <p className="text-xs text-gray-500">Apr 14, 2023 • 30 minutes</p>
                          </div>
                          <p className="text-sm font-semibold text-lavender-700">₹2,000</p>
                        </div>
                      </div>
                      <div className="bg-pistachio-50 rounded-lg p-4 border border-pistachio-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Live Session</p>
                            <p className="text-xs text-gray-500">Apr 12, 2023 • 90 minutes</p>
                          </div>
                          <p className="text-sm font-semibold text-lavender-700">₹6,000</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-pistachio-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Payout</span>
                        <span className="text-base font-semibold text-lavender-700">₹12,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-lavender-800 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Easy Session Tracking", 
                  description: "Collect and manage session data effortlessly with our intuitive interface." 
                },
                { 
                  title: "Automated Calculations", 
                  description: "Custom rates with tax handling to ensure accurate payouts every time." 
                },
                { 
                  title: "Mentor Dashboard", 
                  description: "Transparent payout visibility for all your educators and mentors." 
                },
              ].map((feature, index) => (
                <div key={index} className="glass-card p-6 hover:shadow-lg transition-all">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pistachio-400 to-lavender-400 flex items-center justify-center mb-4">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-medium text-lavender-800">{feature.title}</h3>
                  <p className="mt-3 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-lavender-800 to-lavender-900 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">PayTech</h3>
              <p className="text-lavender-200 text-sm">
                Streamlining EdTech payout operations with our advanced automation platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-lavender-200 text-sm">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-lavender-200 text-sm">
                Email: info@paytech.io<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-lavender-700 mt-8 pt-8 text-center text-lavender-300 text-sm">
            <p>© 2025 PayTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
