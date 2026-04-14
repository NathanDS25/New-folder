import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { FilePlus, Calendar, Clock, CheckCircle, XCircle, Send, X } from 'lucide-react';

export default function Leaves() {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get('http://localhost:5000/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('http://localhost:5000/api/leaves', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowApplyForm(false);
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      console.error("Failed to apply for leave:", err);
      alert("Error submitting leave application.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`http://localhost:5000/api/leaves/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaves();
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-500';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-500';
      default: return 'bg-amber-100 text-amber-700 border-amber-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={18} className="text-emerald-500"/>;
      case 'Rejected': return <XCircle size={18} className="text-rose-500"/>;
      default: return <Clock size={18} className="text-amber-500"/>;
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Leave Requests</h2>
          <p className="text-gray-500 mt-1">Manage and track student leave applications</p>
        </div>
        {user?.role === 'Student' && (
          <button 
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            {showApplyForm ? <X size={20}/> : <FilePlus size={20} />}
            <span>{showApplyForm ? 'Cancel Application' : 'Apply for Leave'}</span>
          </button>
        )}
      </div>

      {showApplyForm && (
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-slide-up">
           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
               <Send size={20} />
             </div>
             Request New Leave
          </h3>
          <form onSubmit={handleApplyLeave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Start Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">End Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Reason for Leave</label>
              <textarea 
                required
                placeholder="Please provide a brief reason..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-h-[100px]"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
               <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]">
                 Submit Leave Application
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {leaves.map((leave, idx) => (
             <div key={leave._id || idx} className={`p-6 rounded-2xl shadow-sm hover:shadow-md border-t-4 transition-all duration-300 bg-white/80 backdrop-blur-sm ${getStatusColor(leave.status).split(' ')[2]}`}>
               <div className="flex justify-between items-start mb-5">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold border border-gray-100">
                     {leave.requestedBy?.name ? leave.requestedBy.name.charAt(0).toUpperCase() : 'S'}
                   </div>
                   <div>
                     <h3 className="font-semibold text-gray-800">{leave.requestedBy?.name || 'Student'}</h3>
                     <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${getStatusColor(leave.status)}`}>
                       {getStatusIcon(leave.status)}
                       <span className="ml-1">{leave.status || 'Pending'}</span>
                     </span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100 mb-5">
                 <div className="flex items-center text-gray-600 text-sm">
                   <Calendar size={16} className="mr-2.5 text-blue-500" />
                   <span className="font-medium text-gray-700">
                     {new Date(leave.startDate).toLocaleDateString()}  -  {new Date(leave.endDate).toLocaleDateString()}
                   </span>
                 </div>
                 <div className="text-sm text-gray-600 mt-2">
                   <strong className="text-gray-800 font-medium mr-1">Reason:</strong> {leave.reason}
                 </div>
               </div>

               {leave.status === 'Pending' && (user?.role === 'Admin' || user?.role === 'Warden') && (
                 <div className="flex space-x-3 pt-2">
                    <button 
                      onClick={() => handleUpdateStatus(leave._id, 'Approved')}
                      className="flex-1 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(leave._id, 'Rejected')}
                      className="flex-1 bg-rose-50 text-rose-600 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </button>
                 </div>
               )}
             </div>
          ))}
          
          {leaves.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4">
                <FilePlus size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Leave Requests</h3>
              <p className="text-gray-500 max-w-sm">There are currently no leave applications to display. Requests will appear here once submitted.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
