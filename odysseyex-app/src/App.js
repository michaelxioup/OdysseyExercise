import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app">
      {!isLoginPage && <Sidebar />} 
      <div className={`content ${isLoginPage ? "no-sidebar" : "with-sidebar"}`}>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Used this logic to Navigate to the Login when starting the project */}
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute>} />  { /*ProtectedRoute is used to not allow a user that is not logged in to navigate to welcome or products page */}
          <Route path="/products" element={ <ProtectedRoute> <Products /> </ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
    <Layout />
  </Router>
  );
}

export default App;
