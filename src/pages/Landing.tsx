
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">PayTech</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Payout Automation for EdTech
              </h2>
              <p className="mt-5 text-xl text-gray-500">
                Streamline how your EdTech company manages payments to mentors and educators with our secure, flexible, and auditable platform.
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              </div>

              <div className="mt-12">
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { title: "Easy Session Tracking", description: "Collect and manage session data effortlessly" },
                    { title: "Automated Calculations", description: "Custom rates with tax handling" },
                    { title: "Mentor Dashboard", description: "Transparent payout visibility" },
                  ].map((feature, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h3 className="text-2xl font-bold text-white">Payout Dashboard</h3>
                  <p className="text-blue-100 mt-2">Manage all your mentor payments in one place</p>
                </div>
                <div className="px-6 py-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Mentor Session</p>
                          <p className="text-xs text-gray-500">Apr 15, 2023 • 60 minutes</p>
                        </div>
                        <p className="text-sm font-semibold">₹4,000</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Evaluation Review</p>
                          <p className="text-xs text-gray-500">Apr 14, 2023 • 30 minutes</p>
                        </div>
                        <p className="text-sm font-semibold">₹2,000</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Live Session</p>
                          <p className="text-xs text-gray-500">Apr 12, 2023 • 90 minutes</p>
                        </div>
                        <p className="text-sm font-semibold">₹6,000</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Payout</span>
                      <span className="text-base font-semibold text-primary">₹12,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">PayTech</h3>
              <p className="text-gray-300 text-sm">
                Streamlining EdTech payout operations with our advanced automation platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-300 text-sm">
                Email: info@paytech.io<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2023 PayTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
