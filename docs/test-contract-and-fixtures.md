# Test Contract và Fixtures chính thức

Ngày chốt: 2026-11-28  
Phạm vi: backend MySQL, API Express, frontend React và automated test.

Đây là nguồn chuẩn cho request, response, kiểu dữ liệu và dữ liệu mẫu. Test không được tự tạo contract khác với tài liệu này. Fixture tĩnh và factory động đã chuẩn bị trong `backend/test/fixtures`; helper dùng chung nằm trong `backend/test/helpers`.

## 1. Quy ước dữ liệu

| Dữ liệu | Contract |
|---|---|
| ID | UUID dạng string, database dùng `VARCHAR(36)`, API dùng field `id` |
| Role | `user`, `pitch_owner`, `admin` |
| Ngày booking | API dùng `date`, format `YYYY-MM-DD`; database dùng `bookingDate` |
| Giờ slot | `HH:mm:ss` hoặc `HH:mm` nếu API đã thống nhất; không dùng chuỗi khoảng giờ trong API chính |
| Timezone | `Asia/Ho_Chi_Minh` |
| Tiền | JSON number, đơn vị VND; không trả chuỗi tiền đã format |
| Boolean | JSON boolean `true`/`false`; MySQL có thể lưu `TINYINT(1)` |
| Booking mới | `pending` |
| Duplicate slot | HTTP `409 Conflict` |
| Lỗi input | HTTP `400` |
| Chưa đăng nhập | HTTP `401` |
| Không đủ quyền | HTTP `403` |
| Không tìm thấy | HTTP `404` |
| Lỗi hệ thống/database | HTTP `500` |

## 2. Contract response chung

### Thành công

```json
{
  "status": "success",
  "data": {}
}
```

Các thao tác tạo mới dùng:

```json
{
  "status": "created",
  "data": {}
}
```

Các thao tác cập nhật dùng:

```json
{
  "status": "updated",
  "data": {}
}
```

Danh sách có thể thêm `results`:

```json
{
  "status": "success",
  "results": 1,
  "data": []
}
```

### Lỗi

```json
{
  "status": "fail",
  "message": "Nội dung lỗi"
}
```

Production không trả password, reset token hash, SQL query hoặc stack trace.

## 3. Contract user/auth

### User object trả về API

```json
{
  "id": "user-uuid",
  "name": "Test Player",
  "email": "player@test.com",
  "role": "user",
  "phoneNumber": "0900000001",
  "city": "Ho Chi Minh City",
  "bio": null,
  "active": true
}
```

Không trả `password`, `passwordResetToken` hoặc `passwordResetExpires`.

### Signup

`POST /api/user/signup`

```json
{
  "name": "Test Player",
  "email": "player@test.com",
  "password": "password123",
  "password_confirm": "password123"
}
```

Điều kiện:

- Tất cả field bắt buộc.
- Password tối thiểu 8 ký tự.
- `password_confirm` phải giống `password`.
- User mới có role `user`.
- Password phải được hash trước khi lưu.

Thành công: HTTP `201`, trả `token`, cookie `jwt` và user object.

### Login

`POST /api/user/login`

```json
{
  "email": "player@test.com",
  "password": "password123"
}
```

Thành công: HTTP `200`, trả `token`, cookie `jwt` và user object không có password.

### Update profile

`PATCH /api/user/updateData`

Chỉ cho phép các field profile và preference. Không cho cập nhật:

```text
password
password_confirm
role
active
```

### Update password

`PATCH /api/user/updatePassword`

```json
{
  "passwordCurrent": "password123",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

## 4. Contract pitch

### Pitch object

```json
{
  "id": "pitch-uuid",
  "ownerId": "owner-uuid",
  "name": "Apex Football Pitch",
  "address": "District 1, Ho Chi Minh City",
  "status": "active",
  "pitchType": "7-a-side",
  "rating": 5.0,
  "description": "Artificial turf pitch",
  "facilities": ["parking", "lights"],
  "pricePerHour": 200000
}
```

`pitchType` chỉ nhận `5-a-side`, `7-a-side`, `11-a-side`.  
`status` chỉ nhận `active`, `maintenance`, `inactive`.

### Tạo pitch

`POST /api/pitch`

```json
{
  "name": "Apex Football Pitch",
  "address": "District 1, Ho Chi Minh City",
  "pitchType": "7-a-side",
  "pricePerHour": 200000
}
```

`ownerId` phải lấy từ user đã đăng nhập, không tin `ownerId` do client tự gửi.

## 5. Contract time slot

### Time slot object

```json
{
  "id": "slot-uuid",
  "pitchId": "pitch-uuid",
  "startTime": "18:00:00",
  "endTime": "19:30:00",
  "price": 200000,
  "isPeakHour": true,
  "isBooked": false
}
```

Điều kiện:

- `startTime < endTime`.
- `price >= 0`.
- `pitchId` phải tồn tại.
- `isBooked` chỉ là field tính theo ngày truy vấn, không lưu trực tiếp trong database.

### Lấy slot theo sân/ngày

`GET /api/timeSlot/pitch/:pitchId?date=2026-12-01`

Response trả danh sách slot và `isBooked` theo ngày đó.

## 6. Contract booking

### Booking object

```json
{
  "id": "booking-uuid",
  "userId": {
    "id": "user-uuid",
    "name": "Test Player",
    "email": "player@test.com"
  },
  "timeSlotId": [
    {
      "id": "slot-uuid",
      "pitchId": "pitch-uuid",
      "pitch": {
        "id": "pitch-uuid",
        "name": "Apex Football Pitch",
        "address": "District 1, Ho Chi Minh City"
      }
    }
  ],
  "date": "2026-12-01",
  "status": "pending",
  "expiresAt": "2026-12-01T10:10:00.000Z",
  "paidAt": null,
  "refundedAt": null,
  "completedAt": null
}
```

### Tạo booking

`POST /api/booking`

```json
{
  "timeSlotId": ["slot-uuid"],
  "date": "2026-12-01"
}
```

Quy tắc:

- API luôn nhận mảng `timeSlotId`, kể cả khi chỉ đặt một slot.
- Các slot phải cùng một pitch.
- Không được trùng ID trong cùng request.
- Không được có booking chưa hủy cùng slot và cùng ngày.
- Booking mới có status `pending`.
- `expiresAt` mặc định sau thời điểm tạo 10 phút.
- Insert booking và `bookingTimeSlots` phải nằm trong cùng transaction.
- Hai request đồng thời cho cùng slot/ngày chỉ được một request thành công.

### Lifecycle

```text
pending → confirmed
pending → cancelled
confirmed → completed
confirmed → refunded
```

Không cho chuyển ngược hoặc chuyển từ trạng thái kết thúc sang trạng thái khác.

## 7. Bộ fixture chuẩn

### Users

```js
const fixtures = {
  player: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Test Player',
    email: 'player@test.com',
    password: 'password123',
    role: 'user',
    active: true
  },
  otherPlayer: {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Other Player',
    email: 'other-player@test.com',
    password: 'password123',
    role: 'user',
    active: true
  },
  pitchOwner: {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Test Pitch Owner',
    email: 'owner@test.com',
    password: 'password123',
    role: 'pitch_owner',
    active: true
  },
  admin: {
    id: '44444444-4444-4444-8444-444444444444',
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    active: true
  },
  inactiveUser: {
    id: '55555555-5555-4555-8555-555555555555',
    name: 'Inactive User',
    email: 'inactive@test.com',
    password: 'password123',
    role: 'user',
    active: false
  }
};
```

### Pitches và slots

```js
const pitch = {
  id: '66666666-6666-4666-8666-666666666666',
  ownerId: '33333333-3333-4333-8333-333333333333',
  name: 'Apex Football Pitch',
  address: 'District 1, Ho Chi Minh City',
  status: 'active',
  pitchType: '7-a-side',
  rating: 5.0,
  pricePerHour: 200000
};

const otherPitch = {
  id: '77777777-7777-4777-8777-777777777777',
  ownerId: '33333333-3333-4333-8333-333333333333',
  name: 'Second Football Pitch',
  address: 'District 3, Ho Chi Minh City',
  status: 'active',
  pitchType: '5-a-side',
  rating: 4.5,
  pricePerHour: 150000
};

const availableSlot = {
  id: '88888888-8888-4888-8888-888888888888',
  pitchId: '66666666-6666-4666-8666-666666666666',
  startTime: '18:00:00',
  endTime: '19:30:00',
  price: 200000,
  isPeakHour: true
};

const secondSlot = {
  id: '99999999-9999-4999-8999-999999999999',
  pitchId: '66666666-6666-4666-8666-666666666666',
  startTime: '20:00:00',
  endTime: '21:30:00',
  price: 200000,
  isPeakHour: true
};

const otherPitchSlot = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  pitchId: '77777777-7777-4777-8777-777777777777',
  startTime: '18:00:00',
  endTime: '19:30:00',
  price: 150000,
  isPeakHour: false
};
```

### Bookings

```js
const pendingBooking = {
  id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  userId: '11111111-1111-4111-8111-111111111111',
  timeSlotId: ['88888888-8888-4888-8888-888888888888'],
  date: '2026-12-01',
  status: 'pending',
  expiresAt: '2026-12-01T10:10:00.000Z'
};

const confirmedBooking = {
  id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  userId: '11111111-1111-4111-8111-111111111111',
  timeSlotId: ['99999999-9999-4999-8999-999999999999'],
  date: '2026-12-02',
  status: 'confirmed',
  expiresAt: null,
  paidAt: '2026-12-01T10:00:00.000Z'
};

const expiredBooking = {
  id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  userId: '11111111-1111-4111-8111-111111111111',
  timeSlotId: ['88888888-8888-4888-8888-888888888888'],
  date: '2026-12-03',
  status: 'pending',
  expiresAt: '2026-12-01T09:00:00.000Z'
};
```

## 8. Cách dùng fixture theo tầng

### Factory động

Dùng factory khi test cần dữ liệu độc lập giữa các test hoặc cần nhiều bản ghi không trùng ID/email:

```js
const { factories } = require('../fixtures');

const player = factories.makeUser({ role: 'user' });
const owner = factories.makeUser({ role: 'pitch_owner' });
const pitch = factories.makePitch({ ownerId: owner.id });
const slot = factories.makeTimeSlot({ pitchId: pitch.id });
const booking = factories.makeBooking({
  userId: player.id,
  timeSlotId: [slot.id],
  date: factories.dateOnly(2),
});
```

Khi cần cả graph dữ liệu liên kết:

```js
const scenario = factories.makeScenario();

scenario.users.player.id;
scenario.pitches.main.id;
scenario.timeSlots.first.pitchId;
scenario.bookings.pending.timeSlotId;
```

Factory có thể override từng field nhưng vẫn giữ default contract:

```js
const expiredBooking = factories.makeBooking({
  status: 'pending',
  expiresAt: factories.dateTime(-10),
});
```

Không dùng factory để bỏ qua quan hệ dữ liệu. Khi tạo slot hoặc booking, luôn truyền `pitchId`/`userId`/`timeSlotId` từ entity đã tạo.

### Service unit

- Dùng object fixture trong memory.
- Mock repository.
- Không kết nối MySQL.
- Assert business rule và lời gọi repository.

### Repository integration

- Dùng cùng dữ liệu fixture nhưng insert vào MySQL test database.
- Assert kết quả SQL, mapping, transaction và database state.
- Reset database sau từng test hoặc từng suite.

### API integration

- Dùng Supertest.
- Tạo fixture qua factory/database helper.
- Gọi API bằng token thật được tạo từ flow login hoặc token test hợp lệ.
- Assert HTTP response và database state sau request.

### Frontend

- Dùng fixture response qua MSW.
- Không mock sâu component con nếu không cần.
- Assert UI theo hành vi người dùng và field contract API.

## 9. Checklist chốt contract

- [x] ID là UUID string, field API là `id`.
- [x] API booking nhận `timeSlotId` dạng array.
- [x] API dùng `date`, database dùng `bookingDate`.
- [x] Role là `user`, `pitch_owner`, `admin`.
- [x] Tiền là JSON number theo VND.
- [x] Timezone là `Asia/Ho_Chi_Minh`.
- [x] Booking mới là `pending`.
- [x] Duplicate booking trả `409`.
- [x] Lỗi dùng format `{ status, message }`.
- [x] Fixture chuẩn gồm player, other player, owner, admin, inactive user, pitch, slots và booking lifecycle.
