import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Plus } from 'lucide-react';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-brand-navy">Room Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
          <Plus size={18} />
          <span>Add Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map(room => {
          const isFull = room.occupants.length >= room.capacity;
          return (
            <div key={room._id} className={`p-6 rounded-2xl shadow-sm border-t-4 transition-all hover:shadow-md bg-white ${isFull ? 'border-red-500' : 'border-green-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Room {room.roomNumber}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {isFull ? 'Full' : 'Vacant'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span className="text-sm font-medium">Occupancy: {room.occupants.length} / {room.capacity}</span>
                </div>
                <div className="text-sm text-gray-500">Type: <span className="capitalize">{room.type}</span></div>
                <div className="text-sm text-gray-500">Fees: ${room.fees}/month</div>
              </div>

              {room.occupants.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold mb-2">OCCUPANTS</p>
                  <div className="flex -space-x-2">
                    {room.occupants.map((occ, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-brand-slate flex items-center justify-center text-white text-xs border-2 border-white ring-1 ring-gray-100" title={occ.name}>
                        {occ.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {rooms.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            No rooms found. Add some rooms to the database to preview.
          </div>
        )}
      </div>
    </div>
  );
}
