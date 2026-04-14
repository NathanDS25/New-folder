import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Rooms from './pages/Rooms';
import Complaints from './pages/Complaints';
import Leaves from './pages/Leaves';
import Visitors from './pages/Visitors';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="visitors" element={<Visitors />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
