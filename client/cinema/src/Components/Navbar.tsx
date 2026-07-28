import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import logotype from '../assets/Logotype.png'
import logo from '../assets/Logo1-1.png'
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { ProfilePage } from "./ProfilePage";
import { useState } from "react";
import Avatar from 'antd/es/avatar/Avatar';
import { UserOutlined } from '@ant-design/icons';

export const Navbar = () => {
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <nav className="bg-slate-500/20 backdrop-blur-lg shadow-2xl rounded-full px-6 py-1.5 flex justify-between items-center border border-slate-400/30 transition-colors duration-300">
        
        <div className="flex items-center w-35 min-[1140px]:w-75">
          <Link to="/" className="relative shrink-0 h-7 w-full">
            <picture className="contents">
              <source media="(min-width: 1140px)" srcSet={logotype} />
              <img 
                src={logo} 
                alt="Fantasy World Cinema" 
                className="invert absolute top-1/2 -translate-y-1/2 left-0 w-[35%] min-[1140px]:w-[110%] max-w-none h-auto object-contain drop-shadow-lg/50 mix-blend-exclusion" 
              />
            </picture>
          </Link>
        </div>
        {(user?.role === 'Consumer' || user?.role === 'Admin') && (
          <div className="hidden md:flex bg-slate-500/20 rounded-full p-1 border border-slate-400/30 shadow-inner font-primary text-base">
            
            {user?.role === 'Consumer' && (
              <Link 
                to="/user/my-tickets" 
                className="group relative flex items-center justify-center px-5 h-8 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors duration-300"
              >
                <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                  My Tickets
                </span>
              </Link>
            )}

            {user?.role === 'Admin' && (
              <>
                <Link 
                  to="/admin/catalog" 
                  className="group relative flex items-center justify-center px-5 h-8 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors duration-300"
                >
                  <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                    Manage Catalog
                  </span>
                </Link>
                <Link 
                  to="/admin/reports" 
                  className="group relative flex items-center justify-center px-5 h-8 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors duration-300"
                >
                  <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                    Reports
                  </span>
                </Link>
              </>
            )}
          </div>
        )}

        <div className="flex items-center justify-end w-35 min-[1140px]:w-75 font-primary">
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-base text-slate-200 italic hidden lg:block drop-shadow-sm">
                Greetings, {user.name}
              </span>
              <Avatar 
                icon={<UserOutlined />} 
                onClick={() => setIsProfileOpen(true)}
                className="bg-slate-600/50 text-slate-100 border border-slate-400/50 cursor-pointer hover:scale-110 hover:border-white transition-all shadow-md backdrop-blur-md mix-blend-exclusion"
              />
            </div>
          ) : (
            <div className="flex bg-slate-500/20 rounded-full p-1 border border-slate-400/30 shadow-inner text-base">
              
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="cursor-pointer group relative flex items-center justify-center px-5 h-8 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors duration-300"
              >
                <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                  LogIn
                </span>
              </button>
              
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="cursor-pointer group relative flex items-center justify-center px-5 h-8 rounded-full text-slate-200 hover:text-white hover:bg-slate-700/80 transition-colors duration-300"
              >
                <span className="inline-block transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                  SignUp
                </span>
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