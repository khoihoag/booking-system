process.env.NODE_ENV = 'development';
process.env.JWT_SECRET = 'my-super-secret-jwt-key-for-testing-only-12345';
process.env.JWT_EXPIRES_IN = '90d';
process.env.JWT_COOKIES_EXPIRES_IN = '90';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

// Biến dùng chung để lưu server và các token
let mongoServer;
let userToken;
let adminToken;
let pitchOwnerToken;
let pitchOwnerId;
let createdPitchId;
let createdTimeSlotId;
let createdBookingId;

describe('Test các API của ứng dụng (Database Memory Server)', () => {
  
  beforeAll(async () => {
    // 1. Khởi tạo MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // 2. Kết nối Mongoose tới memory server
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // 3. Dọn dẹp và đóng kết nối sau khi toàn bộ test chạy xong
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // =========================================================================
  // 1. USER & AUTH API (/api/user)
  // =========================================================================
  describe('1. Auth & User API', () => {
    
    test('POST /api/user/signup tạo tài khoản thường', async () => {
      const newUser = { 
        name: 'Normal User', 
        email: 'user@example.com', 
        password: 'password123', 
        password_confirm: 'password123' 
      };
      
      const response = await request(app).post('/api/user/signup').send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('token');
      userToken = response.body.token; // Lưu lại token
    });

    test('POST /api/user/signup tạo tài khoản Admin', async () => {
      const adminUser = { 
        name: 'Admin User', 
        email: 'admin@example.com', 
        password: 'password123', 
        password_confirm: 'password123'
      };
      const response = await request(app).post('/api/user/signup').send(adminUser);
      expect(response.status).toBe(201);
      adminToken = response.body.token;
      
      // Update role trực tiếp trong DB do mặc định signup là 'user'
      const User = mongoose.model('users');
      await User.findOneAndUpdate({ email: 'admin@example.com' }, { role: 'admin' });
    });

    test('POST /api/user/signup tạo tài khoản Pitch Owner', async () => {
      const ownerUser = { 
        name: 'Pitch Owner', 
        email: 'owner@example.com', 
        password: 'password123', 
        password_confirm: 'password123'
      };
      const response = await request(app).post('/api/user/signup').send(ownerUser);
      expect(response.status).toBe(201);
      pitchOwnerToken = response.body.token;
      pitchOwnerId = response.body.data._id || response.body.data.id;

      // Update role
      const User = mongoose.model('users');
      await User.findOneAndUpdate({ email: 'owner@example.com' }, { role: 'pitch_owner' });
    });

    test('POST /api/user/login đăng nhập thành công', async () => {
      const credentials = { email: 'user@example.com', password: 'password123' };
      const response = await request(app).post('/api/user/login').send(credentials);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('POST /api/user/login thất bại do sai mật khẩu', async () => {
      const credentials = { email: 'user@example.com', password: 'wrongpassword' };
      const response = await request(app).post('/api/user/login').send(credentials);
      
      expect(response.status).toBeGreaterThanOrEqual(400); 
    });

    test('GET /api/user/me lấy thông tin user hiện tại', async () => {
      const response = await request(app)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.email).toBe('user@example.com');
    });

    test('PATCH /api/user/updateData cập nhật thông tin user', async () => {
      const updateData = { name: 'Normal User Updated' };
      const response = await request(app)
        .patch('/api/user/updateData')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.name).toBe('Normal User Updated');
    });

    test('GET /api/user (Admin) lấy danh sách user', async () => {
      const response = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3); // Ít nhất 3 user vừa tạo
    });
  });

  // =========================================================================
  // 2. PITCH API (/api/pitch)
  // =========================================================================
  describe('2. Pitch API', () => {
    
    test('POST /api/pitch tạo mới sân bóng thành công (Pitch Owner)', async () => {
      const newPitch = { 
        name: 'Sân Bóng Đá Mini', 
        address: 'Hà Nội', 
        ownerId: pitchOwnerId
      };
      
      const response = await request(app)
        .post('/api/pitch')
        .set('Authorization', `Bearer ${pitchOwnerToken}`)
        .send(newPitch);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('created');
      expect(response.body.data).toHaveProperty('_id');
      createdPitchId = response.body.data._id;
    });

    test('GET /api/pitch lấy danh sách tất cả sân bóng', async () => {
      const response = await request(app).get('/api/pitch');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/pitch/:id lấy thông tin sân bóng theo ID', async () => {
      const response = await request(app).get(`/api/pitch/${createdPitchId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(createdPitchId);
    });
  });

  // =========================================================================
  // 3. TIMESLOT API (/api/timeSlot)
  // =========================================================================
  describe('3. TimeSlot API', () => {

    test('POST /api/timeSlot tạo khung giờ mới (Pitch Owner)', async () => {
      const newTimeSlot = { 
        pitchId: createdPitchId, 
        start_time: new Date('2026-10-02T07:00:00Z'), 
        end_time: new Date('2026-10-02T09:00:00Z'), 
        date: new Date('2026-10-02'),
        price: 200000 
      };
      
      const response = await request(app)
        .post('/api/timeSlot')
        .set('Authorization', `Bearer ${pitchOwnerToken}`)
        .send(newTimeSlot);
        
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('created');
      createdTimeSlotId = response.body.data._id;
    });

    test('GET /api/timeSlot lấy danh sách tất cả khung giờ', async () => {
      const response = await request(app).get('/api/timeSlot');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // =========================================================================
  // 4. BOOKING API (/api/booking)
  // =========================================================================
  describe('4. Booking API', () => {

    test('POST /api/booking tạo đặt sân mới thành công (Normal User)', async () => {
      const newBooking = { 
        timeSlotId: createdTimeSlotId, 
        totalPrice: 200000 
      };
      
      const response = await request(app)
        .post('/api/booking')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBooking);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('created');
      createdBookingId = response.body.data._id;
    });

    test('GET /api/booking/my-bookings lấy lịch sử đặt sân của tôi', async () => {
      const response = await request(app)
        .get('/api/booking/my-bookings')
        .set('Authorization', `Bearer ${userToken}`);
        
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('DELETE /api/booking/:id hủy đặt sân thành công', async () => {
      const response = await request(app)
        .delete(`/api/booking/${createdBookingId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking cancelled successfully');
    });
  });

});