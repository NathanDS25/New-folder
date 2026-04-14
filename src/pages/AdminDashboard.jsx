import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { DollarSign, Bed, Users, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'Admin') {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await api.get('http://localhost:5000/api/analytics', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (user?.role !== 'Admin') {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
        <h2 className="text-3xl font-bold text-brand-navy mb-4">Welcome back, {user?.name}!</h2>
        <p className="text-gray-500">Use the sidebar to navigate your modules.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-navy mb-8">Overview Dashboard</h2>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign size={24} />} color="bg-green-500" />
          <StatCard title="Available Beds" value={`${stats.availableBeds} / ${stats.totalBeds}`} icon={<Bed size={24} />} color="bg-blue-500" />
          <StatCard title="Active Students" value={stats.studentCount} icon={<Users size={24} />} color="bg-purple-500" />
          <StatCard title="Open Complaints" value={stats.openComplaints} icon={<AlertCircle size={24} />} color="bg-red-500" />
        </div>
      ) : (
        <div className="text-gray-500">Loading admin analytics...</div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-xl text-white ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
