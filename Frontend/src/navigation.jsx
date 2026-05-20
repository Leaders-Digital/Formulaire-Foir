//frontend\src\navigation.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AddProspect from "./pages/AddProspect";
import ListProspects from "./pages/ListProspects";


const AppNavigation = () => {
  return (
    <Routes>       
       {/* Public routes */}
        <Route path="/" element={<Navigate to="/formulaire" replace />} />
        <Route path="/formulaire" element={<AddProspect />} />
        <Route path="/liste" element={<ListProspects />} />
    </Routes>
  );
};

export default AppNavigation;
