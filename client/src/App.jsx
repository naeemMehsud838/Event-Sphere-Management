import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageWrapper from "./components/PageWrapper";

// ADMIN
import AdminDashboard from "./pages/admin55/AdminDashboard";

// USER PAGES
import About from "./pages/user pages/About";
import Contact from "./pages/user pages/contact";
import Pricing from "./pages/user pages/pricing";
import Login from "./pages/user pages/Login";
import Register from "./pages/user pages/Register";
import Landing from "./pages/user pages/Landing";
import ExposPage from "./pages/user pages/ExposPage";
import ExpoDetail from "./pages/user pages/ExpoDetail";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";

// EXHIBITOR
import ExhibitorLayout from "./components/ExhibitorLayout";
import Dashboard from "./pages/exhibitor/Dashboard";
import CreateBooth from "./pages/exhibitor/CreateBooth";
import MyBooth from "./pages/exhibitor/MyBooth";
import Message from "./pages/exhibitor/Message";
import ExhibitorProfile from "./pages/exhibitor/ExhibitorProfile";
import BoothDetails from "./pages/exhibitor/BoothDetails";
import ExhibitorEvents from "./pages/exhibitor/ExhibitorEvents";
import EAttendee from "./pages/exhibitor/E-Attendee";

// ATTENDEE
import AttendeeLayout from "./components/AttendeeLayout";
import AttendeeDashboard from "./pages/attendee/AttendeeDashboard";
import Session from "./pages/attendee/Session";
import Schedule from "./pages/attendee/Schedule";
import Booking from "./pages/attendee/Booking";
import AttendeeMessage from "./pages/attendee/attendeeMessage";
import AttendeeProfile from "./pages/attendee/AttendeeProfile";
import AdminProtectedRoute from "./components/AdminProtectedRoute55";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      {/* ALWAYS SHOW NAVBAR (no condition) */}
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ADMIN */}
<Route
  path="/admin"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>
          {/* PUBLIC */}
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/expos" element={<PageWrapper><ExposPage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/expos/:id" element={<ExpoDetail />} />
          <Route path="/profilepage" element={<ProfilePage />} />

          <Route path="*" element={<ErrorPage />} />

          {/* EXHIBITOR */}
          <Route path="/exhibitor" element={<ExhibitorLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-booth" element={<CreateBooth />} />
            <Route path="my-booth" element={<MyBooth />} />
            <Route path="message" element={<Message />} />
            <Route path="ExhibitorProfile" element={<ExhibitorProfile />} />
            <Route path="booth/:id" element={<BoothDetails />} />
            <Route path="ExhibitorEvents" element={<ExhibitorEvents />} />
            <Route path="E-Attendee" element={<EAttendee />} />
          </Route>

          {/* ATTENDEE */}
          <Route path="/attendee" element={<AttendeeLayout />}>
            <Route index element={<AttendeeDashboard />} />
            <Route path="session" element={<Session />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="booking" element={<Booking />} />
            <Route path="attendeeMessage" element={<AttendeeMessage />} />
            <Route path="AttendeeProfile" element={<AttendeeProfile />} />
          </Route>

        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}