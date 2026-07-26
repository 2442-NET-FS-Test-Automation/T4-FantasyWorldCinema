import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import logotype from '../assets/Logotype.png'
import logo from '../assets/Logo1-1.png'
import { LoginModal } from "../pages/LoginModal";
import { RegisterModal } from "../pages/RegisterModal";
import { ProfilePage } from "../pages/ProfilePage";
import { useState } from "react";
import Avatar from 'antd/es/avatar/Avatar';
import { UserOutlined } from '@ant-design/icons';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
            <nav className="bg-slate-500/20 backdrop-blur-lg shadow-2xl rounded-full px-6 py-1.5 flex justify-between items-center border border-slate-400/30 transition-colors duration-300">
        
        <div className="flex items-center w-[140px] min-[1140px]:w-[300px]">
          <Link to="/" className="relative flex-shrink-0 h-7 w-full">
            <picture className="contents">
              <source media="(min-width: 1140px)" srcSet={logotype} />
              <img 
                src={logo} 
                alt="Fantasy World Cinema" 
                className="absolute top-1/2 -translate-y-1/2 left-0 w-[110%] min-[1140px]:w-[100%] max-w-none h-auto object-contain drop-shadow-md" 
              />
            </picture>
          </Link>
        </div>

        <div className="hidden md:flex bg-slate-500/20 rounded-full p-1 border border-slate-400/30 shadow-inner font-primary text-sm">
          
          {user?.role === 'Consumer' && (
            <Link to="/my-tickets" className="px-5 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              My Tickets
            </Link>
          )}

          {user?.role === 'Admin' && (
            <>
              <Link to="/admin/catalog" className="px-5 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                Manage Catalog
              </Link>
              <Link to="/admin/reports" className="px-5 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                Reports
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-end w-[140px] min-[1140px]:w-[300px] font-primary">
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-200 italic hidden lg:block drop-shadow-sm">
                Greetings, {user.name}
              </span>
              <Avatar 
                icon={<UserOutlined />} 
                onClick={() => setIsProfileOpen(true)}
                className="bg-slate-600/50 text-slate-100 border border-slate-400/50 cursor-pointer hover:scale-110 hover:border-white transition-all shadow-md backdrop-blur-md"
              />
            </div>
          ) : (
            <div className="flex bg-slate-500/20 rounded-full p-1 border border-slate-400/30 shadow-inner text-sm">
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-5 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              >
                LogIn
              </button>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="px-5 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 hover:scale-105 transition-all duration-300 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              >
                SignUp
              </button>
            </div>
          )}
        </div>
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      </nav>
    </div>

  );
};