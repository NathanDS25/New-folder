import { Bell, Search, X, CheckSquare, MessageSquare, UserPlus } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New leave application from Nathan', time: '5 mins ago', icon: <CheckSquare size={16}/>, color: 'text-blue-500 bg-blue-50' },
    { id: 2, text: 'Room 102 reported a plumbing issue', time: '1 hour ago', icon: <MessageSquare size={16}/>, color: 'text-amber-500 bg-amber-50' },
    { id: 3, text: 'Visitor John Doe checked in for Room 305', time: '2 hours ago', icon: <UserPlus size={16}/>, color: 'text-emerald-500 bg-emerald-50' },
  ];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search rooms, students, or complaints..." 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-full transition-all duration-200 ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 border-2 border-white rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-slide-up">
                {/* Arrow */}
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                
                <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold">3 NEW</span>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 hover:bg-gray-50 transition-colors flex items-start space-x-3 cursor-pointer border-b border-gray-50 last:border-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${notif.color}`}>
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 leading-snug line-clamp-2">{notif.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 text-center bg-gray-50/50 rounded-b-xl">
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition">View All</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-navy to-slate-800 flex items-center justify-center text-white font-bold shadow-lg border border-white/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
