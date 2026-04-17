import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      // Mark that user has registered
      localStorage.setItem('hasRegistered', 'true');
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex">
      <div className="hidden lg:flex w-1/2 bg-brand-navy p-12 flex-col justify-center text-white relative overflow-hidden bg-slate-900">
         <div className="relative z-10 max-w-lg mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-white leading-tight">Welcome to Your Second Home</h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Experience comfortable, secure, and modern living. HostelSys is designed to provide students with state-of-the-art facilities, 24/7 security, high-speed Wi-Fi, and a vibrant community where you can thrive academically and socially.
            </p>
            <div className="grid grid-cols-2 gap-6 text-sm font-medium">
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]"></div>
                <span className="text-slate-200">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"></div>
                <span className="text-slate-200">Smart Room Access</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                <span className="text-slate-200">Digital Leave Passes</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                <span className="text-slate-200">Quick Complaint Resolution</span>
              </div>
            </div>
         </div>
         {/* Decorative background elements */}
         <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-[#F4F7F6]">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md lg:shadow-xl lg:border lg:border-gray-100">
          <div className="mb-6 text-center">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
             </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join HostelSys today.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700">
                <option value="Student">Student</option>
                <option value="Warden">Warden</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-4">Register</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
