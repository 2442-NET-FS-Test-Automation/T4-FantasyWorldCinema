import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute/* , AnonymousRoute */ } from "./auth/ProtectedRoute";
import { SelectCinema } from "./pages/SelectCinema";
import { DisplayShowtimes } from "./pages/DisplayShowtimes";
// import { Navbar } from "./Components/NavBar";
import { useState } from "react";
import { Button } from "antd";
import { LoginModal } from "./pages/LoginModal";
import { RegisterModal } from "./pages/RegisterModal";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuth } from './auth/useAuth';



export function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  return (
      <BrowserRouter>
        {/* <Navbar /> */}
        <div style={{ padding: '15px', background: '#e6f4ff', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>🧪 Mode: Test: This is not a NavigationBar</span>
          {!user ? (
            <>
              <Button type="primary" onClick={() => setIsLoginOpen(true)}>
                Open Login Modal
              </Button>
              <Button type="primary" onClick={() => setIsRegisterOpen(true)}>
                Open Register Modal
              </Button>
            </>
          ) : (
            <Button type="dashed" onClick={() => setIsProfileOpen(true)}>
              Open Profile
            </Button>
          )}
        </div>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        <ProfilePage isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

        <main className="min-h-screen bg-gray-50">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
            {/* Public routes */}

            <Route path="/" element={<SelectCinema />} /> {/* DELETE */}
            <Route path="/Showtimes/:CinemaId" element={<DisplayShowtimes />} /> {/* DELETE */}

            {/* <Route path="/home" element={<Home />} />
            <Route path="/cinema/:cinemaId" element={<CinemaDetails />} />
            <Route path="/showtime/:showtimeId" element={<ShowtimeDetails />} /> */}

            {/* Routes for not logged ones */}
            {/* <Route element={<AnonymousRoute />}> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            {/* </Route> */}


            {/* Protected routes - any logged ones */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/profile/:userId" element={<Profile />} /> */}
            </Route>

            {/* Protected routes - only CONSUMERS */}
            {/* <Route element={<ProtectedRoute allowedRoles={["Consumer"]} />}> */}
            {/* <Route path="/user/:userId/my-tickets" element={<MyTickets />} /> */}
            {/* </Route> */}

            {/* Protected routes - only ADMINS */}
            {/* <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}> */}
            {/* <Route path="/manage-catalog" element={<ManageCatalog />} />
                <Route path="/manage-catalog/movies" element={<ManageMovies />} />
                <Route path="/manage-catalog/showtimes" element={<ManageShowtimes />} />
                <Route path="/reports" element={<Reports />} /> */}
            {/* </Route> */}

            {/* Default redirection Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

