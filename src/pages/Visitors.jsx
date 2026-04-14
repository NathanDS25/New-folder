import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Clock, LogIn, LogOut, Search, User } from 'lucide-react';

export default function Visitors() {
  const { user } = useContext(AuthContext);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitingUser: '', // Assuming student ID for now
    timeIn: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/visitors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisitors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/visitors', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setFormData({ visitorName: '', visitingUser: '', timeIn: new Date().toISOString().slice(0, 16) });
      fetchVisitors();
    } catch (err) {
      console.error("Failed to add visitor:", err);
      alert("Error adding visitor. Please check if student ID is correct.");
    }
  };

  const handleClockOut = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/visitors/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchVisitors();
    } catch (err) {
      console.error("Failed to clock out visitor:", err);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Visitor Logs</h2>
          <p className="text-gray-500 mt-1">Real-time tracking of hostel visitors and guests</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Warden') && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-brand-navy text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-800 hover:shadow-lg transition-all duration-200 font-medium"
          >
            <UserPlus size={20} />
            <span>{showAddForm ? 'Cancel Registration' : 'Register Visitor'}</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
               <LogIn size={20} />
             </div>
             New Visitor Entry
          </h3>
          <form onSubmit={handleAddVisitor} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Visitor Full Name</label>
              <input 
                required
                type="text" 
                placeholder="Ex. John Doe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.visitorName}
                onChange={(e) => setFormData({...formData, visitorName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Visiting Student ID/Name</label>
              <input 
                required
                type="text" 
                placeholder="Student reference ID"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.visitingUser}
                onChange={(e) => setFormData({...formData, visitingUser: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Check-in Time</label>
              <input 
                required
                type="datetime-local" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.timeIn}
                onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
              />
            </div>
            <div className="md:col-span-3">
               <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]">
                 Complete Entry Registration
               </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Visitor</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Visiting Student</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Entry Time</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visitors.map((visitor) => (
                  <tr key={visitor._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                           {visitor.visitorName.charAt(0).toUpperCase()}
                         </div>
                         <span className="font-semibold text-gray-800">{visitor.visitorName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-600 font-medium">
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        {visitor.visitingUser?.name || visitor.visitingUser || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-500">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {new Date(visitor.timeIn).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {visitor.timeOut ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                          Checked Out
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 animate-pulse">
                          Inside Premises
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                       {!visitor.timeOut && (user?.role === 'Admin' || user?.role === 'Warden') && (
                         <button 
                           onClick={() => handleClockOut(visitor._id)}
                           className="text-rose-600 hover:text-rose-700 font-bold text-sm bg-rose-50 px-4 py-2 rounded-lg transition-all hover:bg-rose-100"
                         >
                           Clock Out
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {visitors.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                 <Search size={40} />
               </div>
               <h4 className="text-xl font-bold text-gray-800">No Visitor Records Found</h4>
               <p className="text-gray-500 mt-2 max-w-xs">There are no documented visitors at this time. Use the button above to register a new entry.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
