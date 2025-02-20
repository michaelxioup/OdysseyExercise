import { useState } from "react";
import { Link,useNavigate, useLocation} from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();




  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login"); 
  };

  if(location.pathname === "/login" || localStorage === "notAuthenticated") {
    return null
  }

  return (
    <>
  
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul className="nav-bar">
          <li><Link to="/home" onClick={() => setIsOpen(false)}>Welcome</Link></li>
          <li><Link to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>
        </ul>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>

   
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
