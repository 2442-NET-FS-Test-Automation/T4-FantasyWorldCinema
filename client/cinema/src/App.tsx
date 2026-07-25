import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute, AnonymousRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { SelectCinema } from "./pages/SelectCinema";
import { DisplayShowtimes } from "./pages/DisplayShowtimes";
import { Navbar } from "./Components/NavBar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} /> {/* DELETE */}
            <Route path="/" element={<SelectCinema />} /> {/* DELETE */}
            <Route path="/Showtimes/:CinemaId" element={<DisplayShowtimes />} /> {/* DELETE */}

            {/* <Route path="/home" element={<Home />} />
            <Route path="/cinema/:cinemaId" element={<CinemaDetails />} />
            <Route path="/showtime/:showtimeId" element={<ShowtimeDetails />} /> */}

            {/* Routes for not logged ones */}
            <Route element={<AnonymousRoute />}>
                {/* <Route path="/login" element={<LoginPage />} /> */}
                {/* <Route path="/register" element={<Register />} /> */}
            </Route>


            {/* Protected routes - any logged ones */}
            <Route element={<ProtectedRoute />}>
                {/* <Route path="/profile/:userId" element={<Profile />} /> */}
            </Route>

            {/* Protected routes - only CONSUMERS */}
            <Route element={<ProtectedRoute allowedRoles={["Consumer"]} />}>
                {/* <Route path="/user/:userId/my-tickets" element={<MyTickets />} /> */}
            </Route>

            {/* Protected routes - only ADMINS */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                {/* <Route path="/manage-catalog" element={<ManageCatalog />} />
                <Route path="/manage-catalog/movies" element={<ManageMovies />} />
                <Route path="/manage-catalog/showtimes" element={<ManageShowtimes />} />
                <Route path="/reports" element={<Reports />} /> */}
            </Route>

            {/* Default redirection Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}