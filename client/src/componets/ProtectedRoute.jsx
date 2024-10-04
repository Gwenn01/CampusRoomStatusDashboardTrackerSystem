import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check the state, could be a token or boolean

  return isAuthenticated ? children : <Navigate to="/login" />; // If authenticated, render the child component, else redirect to login
};

export default ProtectedRoute;
