import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { SelectCinema } from "./pages/SelectCinema";
import { DisplayShowtimes } from "./pages/DisplayShowtimes";
import { Navbar } from "./Components/Navbar";
import { ManageCatalog } from "./pages/ManageCatalog";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ShowtimeDetails } from "./pages/ShowtimeDetails";

export function AppContent() {

  return (
      <BrowserRouter>
        <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              {/* Public routes */}

              <Route path="/home" element={<SelectCinema />} />
              <Route path="/cinema/:CinemaId" element={<DisplayShowtimes />} />
              <Route path="/showtime/:showtimeId" element={<ShowtimeDetails />} />

              {/* Protected routes - only CONSUMERS */}
              {/* <Route element={<ProtectedRoute allowedRoles={["Consumer"]} />}> */}
              {/* <Route path="/user/:userId/my-tickets" element={<MyTickets />} /> */}
              {/* </Route> */}

              {/* Protected routes - only ADMINS */}
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="/admin/catalog" element={<ManageCatalog />} />
                  {/* 
                  <Route path="/manage-catalog/movies" element={<ManageMovies />} />
                  <Route path="/manage-catalog/showtimes" element={<ManageShowtimes />} />
                  <Route path="/reports" element={<Reports />} /> */}
              </Route>

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

