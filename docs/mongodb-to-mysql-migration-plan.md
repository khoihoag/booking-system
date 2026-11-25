# Kế hoạch chuyển Booking System từ MongoDB sang MySQL

## 1. Mục tiêu

Chuyển backend từ MongoDB/Mongoose sang MySQL để:

- Thực hành thiết kế cơ sở dữ liệu quan hệ và SQL.
- Sử dụng khóa ngoại, `JOIN` và transaction.
- Giữ nguyên API hiện tại để frontend gần như không phải thay đổi.
- Giữ nguyên booking lifecycle:

```text
pending → confirmed/cancelled
confirmed → refunded/completed
```

## 2. Vì sao mô hình phù hợp với MySQL

Các model hiện tại có quan hệ rõ ràng:

```text
users
  └── bookings
        └── booking_time_slots
              └── time_slots
                    └── pitches
```

- Một user có nhiều booking.
- Một pitch có nhiều time slot.
- Một booking có thể chứa nhiều time slot.
- Một time slot có thể được đặt vào nhiều ngày khác nhau.

## 3. Schema MySQL đề xuất

### `users`

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'pitch_owner', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### `pitches`

```sql
CREATE TABLE pitches (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### `time_slots`

```sql
CREATE TABLE time_slots (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pitch_id BIGINT UNSIGNED NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  is_peak_hour BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pitch_id) REFERENCES pitches(id)
);
```

### `bookings`

```sql
CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'refunded', 'completed') NOT NULL DEFAULT 'pending',
  expires_at DATETIME NULL,
  paid_at DATETIME NULL,
  refunded_at DATETIME NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_bookings_date_status (booking_date, status)
);
```

### `booking_time_slots`

Đây là bảng trung gian cho quan hệ nhiều-nhiều giữa booking và time slot.

```sql
CREATE TABLE booking_time_slots (
  booking_id BIGINT UNSIGNED NOT NULL,
  time_slot_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (booking_id, time_slot_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id)
);
```

## 4. Ánh xạ từ MongoDB sang MySQL

| MongoDB/Mongoose | MySQL |
|---|---|
| `_id` | `id` |
| `userId` | `bookings.user_id` |
| `timeSlotId[]` | `booking_time_slots` |
| `date` | `booking_date` |
| `created_at` | `created_at` |
| `updated_at` | `updated_at` |
| `populate()` | `JOIN` |
| Mongoose enum | MySQL `ENUM` hoặc bảng trạng thái |
| Mongoose validation | SQL constraint + service validation |
| Mongo update document | SQL `UPDATE` |
| Mongo transaction | MySQL transaction |

## 5. Thứ tự triển khai

### Bước 1: Tạo branch migration

```bash
git checkout -b mysql-migration
```

Không xóa MongoDB ở branch hiện tại.

### Bước 2: Cài driver và cấu hình database

Chọn một driver/query builder đang phù hợp với kiến thức hiện tại:

- `mysql2` nếu muốn viết SQL trực tiếp.
- `knex` nếu muốn có migration và query builder.

Với mục tiêu học SQL, ưu tiên `mysql2` và viết SQL rõ ràng.

Thêm biến môi trường:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=booking_system
MYSQL_USER=root
MYSQL_PASSWORD=your_password
```

Không commit mật khẩu thật.

### Bước 3: Tạo schema và dữ liệu mẫu

- Tạo database.
- Chạy các lệnh `CREATE TABLE`.
- Tạo user, pitch và time slot mẫu.
- Kiểm tra khóa ngoại.

### Bước 4: Viết MySQL repository

Tạo các repository tương ứng:

```text
UserRepositoryMySQL
PitchRepositoryMySQL
TimeSlotRepositoryMySQL
BookingRepositoryMySQL
```

Trong giai đoạn đầu, chỉ cần viết lại `BookingRepository` trước.

### Bước 5: Viết lại query booking

Lấy booking của user:

```sql
SELECT
  b.*,
  p.name AS pitch_name,
  p.address AS pitch_address,
  ts.id AS time_slot_id,
  ts.start_time,
  ts.end_time,
  ts.price
FROM bookings b
JOIN booking_time_slots bts ON bts.booking_id = b.id
JOIN time_slots ts ON ts.id = bts.time_slot_id
JOIN pitches p ON p.id = ts.pitch_id
WHERE b.user_id = ?
ORDER BY b.booking_date DESC, b.created_at DESC;
```

Kiểm tra slot đã được đặt:

```sql
SELECT b.id
FROM bookings b
JOIN booking_time_slots bts ON bts.booking_id = b.id
WHERE b.booking_date = ?
  AND bts.time_slot_id IN (?, ?)
  AND b.status IN ('pending', 'confirmed');
```

Chỉ `pending` và `confirmed` mới giữ slot.

### Bước 6: Chuyển booking creation sang transaction

```text
BEGIN
  kiểm tra slot chưa bị giữ
  tạo booking pending với expires_at = now + 10 phút
  thêm các dòng vào booking_time_slots
COMMIT
```

Nếu có lỗi:

```text
ROLLBACK
```

Không được tạo booking nhưng thiếu dòng trong bảng `booking_time_slots`.

### Bước 7: Chuyển BookingLifecycleService

Giữ nguyên các hàm hiện tại, chỉ đổi repository bên dưới:

```text
confirmBooking()
cancelBooking()
refundBooking()
completeBooking()
expireBooking()
```

Mỗi hàm phải cập nhật booking bằng transaction nếu có thao tác liên quan đến slot hoặc thanh toán.

### Bước 8: Chuyển job tự động

Job hết hạn:

```sql
UPDATE bookings
SET status = 'cancelled'
WHERE status = 'pending'
  AND expires_at <= NOW();
```

Job hoàn tất trận đấu cần lấy `booking_date + time_slots.end_time`, sau đó cập nhật:

```sql
UPDATE bookings
SET status = 'completed', completed_at = NOW()
WHERE id = ?
  AND status = 'confirmed';
```

Trong giai đoạn đầu có thể giữ interval hiện tại. Sau này chuyển sang queue/scheduler nếu chạy nhiều instance.

### Bước 9: Giữ nguyên API frontend

Các endpoint nên giữ nguyên:

```text
POST   /api/booking
GET    /api/booking/my-bookings
POST   /api/booking/:id/confirm-payment
POST   /api/booking/:id/refund
POST   /api/booking/:id/complete
DELETE /api/booking/:id
```

Frontend không cần biết database đã đổi từ MongoDB sang MySQL.

### Bước 10: Gỡ MongoDB sau cùng

Chỉ gỡ Mongoose và MongoDB sau khi:

- Các API booking chạy đúng bằng MySQL.
- Lifecycle test đã pass.
- Frontend hiển thị đúng các trạng thái.
- Dữ liệu cần thiết đã được migrate.
- Có backup dữ liệu cũ.

## 6. Test bắt buộc

- Tạo booking thành công.
- Không cho đặt trùng slot trong cùng ngày.
- Booking `pending` hết hạn chuyển thành `cancelled`.
- Thanh toán thành công chuyển thành `confirmed`.
- Booking sau trận đấu chuyển thành `completed`.
- `confirmed` chuyển thành `refunded` đúng quyền.
- Không cho `completed/refunded/cancelled` chuyển ngược.
- Transaction rollback khi thêm booking slot thất bại.
- Hai request đặt cùng slot đồng thời không được cùng thành công.

## 7. Rủi ro cần lưu ý

- MySQL cần xử lý transaction và race condition cẩn thận.
- Không dùng `SELECT` rồi `INSERT` riêng rẽ mà không có transaction/lock.
- `time_slot` là khung giờ dùng lại theo nhiều ngày; không nên lưu trạng thái `booked` cố định trên `time_slots`.
- Cần chuyển dữ liệu MongoDB sang đúng kiểu `DATE`, `TIME`, `DATETIME`.
- Không xóa booking `cancelled`; giữ lại để audit và thống kê.

## 8. Quyết định kiến trúc

Không cần chuyển sang NestJS cho migration này. Giữ Express và chỉ thay lớp repository/database:

```text
Express Controller
  → Service / BookingLifecycleService
    → MySQL Repository
      → MySQL
```

Như vậy frontend và API giữ ổn định, còn phần SQL được thực hành trong database layer.

