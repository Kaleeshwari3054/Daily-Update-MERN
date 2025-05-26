import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UpdateHistory from "./pages/UpdateHistory";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";
import "./App.css";

function App() {
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //     navigate('/');  // Redirect to home page after loading finishes
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  // if (loading) {
  //   return (
  //     <div
  //       className="loading-screen d-flex justify-content-center align-items-center"
  //       style={{ height: '100vh' }}
  //     >
  //       <div className="text-center">
  //         <div
  //           className="spinner-border text-primary"
  //           role="status"
  //           style={{ width: '3rem', height: '3rem' }}
  //         >
  //           <span className="visually-hidden">Loading...</span>
  //         </div>
  //         <p className="mt-3">Starting up...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <UpdateHistory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
