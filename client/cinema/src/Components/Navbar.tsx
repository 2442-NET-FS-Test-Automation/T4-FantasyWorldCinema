import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { FaUserCircle } from 'react-icons/fa';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/home');
//   };

    const handleProfile = () => {
        navigate('/profile');
    };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md flex-shrink-0">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        
        <Link to="/" className="text-2xl font-bold tracking-wider text-blue-400 hover:text-blue-300">
          Fantasy World Cinema
        </Link>

        <div className="flex gap-6 items-center font-medium">

          {/* Conditional Rendering: Consumers */}
          {user?.role === 'Consumer' && (
            <Link to="/my-tickets" className="hover:text-blue-400 transition-colors">
              My Tickets
            </Link>
          )}

          {/* Conditional Rendering: Admin */}
          {user?.role === 'Admin' && (
            <>
              <Link to="/admin/catalog" className="hover:text-blue-400 transition-colors">
                Manage Catalog
              </Link>
              <Link to="/admin/reports" className="hover:text-blue-400 transition-colors">
                Reports
              </Link>
            </>
          )}
        </div>

        {/* Authentication controls */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-300">Hello, {user.name}</span>
              <button
                onClick={handleProfile}
              >
                <FaUserCircle />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                LogIn
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors"
              >
                SignUp
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
};