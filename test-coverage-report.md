# Báo cáo độ bao phủ test

## Tổng quan

| Khu vực | Kết quả |
|---|---:|
| Backend unit test | 30/30 pass |
| Backend integration test | Chưa chạy hoàn chỉnh |
| Frontend test | Chưa có |
| Tổng test hiện có | 46 test |
| Unit Statements | 57.39% (198/345) |
| Unit Branches | 37.83% (56/148) |
| Unit Functions | 33.78% (25/74) |
| Unit Lines | 58.38% (195/334) |

## Backend services

| Module | Statements | Branches | Functions | Đánh giá |
|---|---:|---:|---:|---|
| `PitchServices` | 100% | 100% | 100% | Tốt |
| `TimeSlotServices` | 100% | 100% | 100% | Tốt |
| `UserServices` | 93.93% | 100% | 75% | Tốt |
| `BookingServices` | 73.68% | 60% | 50% | Trung bình |
| `AuthServices` | 35.21% | 33.33% | 42.85% | Thấp |

Thiếu nhiều nhánh ở `AuthServices` như signup/login lỗi, token và phân quyền. `BookingServices` còn thiếu các trường hợp booking không tồn tại, kiểm tra quyền và lỗi repository.

## Backend repositories

| Module | Statements | Đánh giá |
|---|---:|---|
| `BookingRepository` | 41.17% | Thấp |
| `PitchRepository` | 33.33% | Thấp |
| `TimeSlotRepository` | 42.10% | Thấp |
| `UserRepository` | 42.85% | Thấp |

Unit test đang mock repository, nên logic truy vấn database thật chưa được kiểm tra đầy đủ.

## Backend models

| Module | Statements | Đánh giá |
|---|---:|---|
| `BookingModel` | 100% | Tốt |
| `TimeSlotModel` | 77.77% | Khá |
| `UserModel` | 47.05% | Thấp |
| `PitchModel` | 36.36% | Thấp |

Các phần cần bổ sung: required fields, kiểu dữ liệu, enum, default values, unique email và validation schema.

## Backend utilities

| Module | Statements | Đánh giá |
|---|---:|---|
| `AppError` | 100% | Tốt |
| `Email` | 50% | Thấp |

`Email.js` chưa được kiểm tra đầy đủ việc gửi mail, lỗi SMTP và xử lý promise.

## Integration test

File chính: `backend/test/app.test.js`.

| Nhóm API | Phạm vi hiện có |
|---|---|
| Auth/User | Signup, login, current user, update user, admin users |
| Pitch | Create, list, detail |
| TimeSlot | Create, list |
| Booking | Create, my bookings, cancel |

Integration test bị lỗi môi trường do `mongodb-memory-server` không bind được `0.0.0.0`:

```text
listen EPERM: operation not permitted 0.0.0.0
```

Các trường hợp còn thiếu:

- Request không có token, token sai hoặc hết hạn
- Role không đủ quyền
- Payload thiếu hoặc sai kiểu
- Resource không tồn tại
- Duplicate email, booking hoặc time slot
- Mongoose validation error
- Rate limit và error response format

## Frontend

Frontend hiện chưa có automated test.

| Khu vực chưa được kiểm thử |
|---|
| Sign in/sign up |
| Routing, navbar và logout |
| Discovery và tìm kiếm pitch |
| Pitch detail và booking flow |
| Account và các dashboard |
| API loading/error state |
| Form validation và responsive behavior |

## Đánh giá và ưu tiên

| Mức ưu tiên | Việc cần làm |
|---|---|
| 1 | Sửa môi trường MongoDB Memory Server để integration test chạy ổn định |
| 2 | Bổ sung test cho `AuthServices` và authorization |
| 3 | Bổ sung integration test cho lỗi và permission |
| 4 | Test repository và model validation |
| 5 | Thêm frontend test cho login, booking và màn hình chính |

### Kết luận

Mức bao phủ hiện tại: **trung bình thấp**. Service cơ bản có coverage khá, nhưng authentication, repository/database, controller/API và frontend còn thiếu nhiều kiểm thử. Coverage 57.39% chỉ phản ánh backend unit test; chưa đại diện cho toàn bộ hệ thống.

## Phạm vi kiểm tra

- Đã chạy backend unit coverage: `npx jest test/unit --coverage --runInBand`.
- Chưa thêm test hoặc sửa lỗi test.
- Chưa chạy browser/E2E test.
- Integration coverage chưa đáng tin cậy vì test MongoDB Memory Server chưa chạy hoàn chỉnh.
