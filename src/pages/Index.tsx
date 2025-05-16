
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/mentor');
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user?.role]);
  
  return null;
};

export default Index;
