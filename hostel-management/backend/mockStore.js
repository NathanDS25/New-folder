// In-memory data store for "Mock Mode" fallback
const bcrypt = require('bcrypt');

const mockStore = {
  users: [],
  rooms: [
    { _id: 'r1', roomNumber: '101', capacity: 1, occupants: [], type: 'single', fees: 500 },
    { _id: 'r2', roomNumber: '102', capacity: 2, occupants: [], type: 'double', fees: 300 },
    { _id: 'r3', roomNumber: '103', capacity: 4, occupants: [], type: 'dorm', fees: 150 },
    { _id: 'r4', roomNumber: '104', capacity: 1, occupants: [], type: 'single', fees: 550 },
    { _id: 'r5', roomNumber: '105', capacity: 2, occupants: [], type: 'double', fees: 350 },
  ],
  complaints: [],
  leaves: [],
  visitors: [],

  async addUser(userData) {
    const user = { ...userData, _id: Date.now().toString() };
    this.users.push(user);
    return user;
  },

  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  },

  async findUserById(id) {
    return this.users.find(u => u._id === id);
  }
};

module.exports = mockStore;
