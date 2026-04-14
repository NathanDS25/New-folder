import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BedDouble, FileText, UserCheck, Receipt, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20}/>, roles: ['Admin', 'Warden', 'Student'] },
    { label: 'Rooms', path: '/dashboard/rooms', icon: <BedDouble size={20}/>, roles: ['Admin', 'Warden'] },
    { label: 'Complaints', path: '/dashboard/complaints', icon: <FileText size={20}/>, roles: ['Admin', 'Warden', 'Student'] },
    { label: 'Visitors', path: '/dashboard/visitors', icon: <UserCheck size={20}/>, roles: ['Admin', 'Warden'] },
    { label: 'Leaves', path: '/dashboard/leaves', icon: <Receipt size={20}/>, roles: ['Admin', 'Warden', 'Student'] },
  ];

  return (
    <div className="w-64 h-screen bg-brand-navy text-white flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center justify-center border-b border-brand-slate">
        <h1 className="text-2xl font-bold tracking-wider">HOSTEL<span className="text-blue-400">SYS</span></h1>
      </div>
      
      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-brand-slate hover:text-white'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-slate">
        <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut size={20}/>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
