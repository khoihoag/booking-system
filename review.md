# Đánh giá Code (Code Review) đa chiều: Hệ thống Booking

Dưới đây là danh sách ưu tiên các vấn đề tìm thấy khi đánh giá dự án `booking-system` dựa trên 5 tiêu chí bắt buộc (Tính chính xác, Tính dễ đọc, Kiến trúc, Bảo mật và Hiệu suất).

Có một số lỗ hổng kiến trúc nghiêm trọng liên quan đến phân quyền (lỗ hổng IDOR), lỗi treo request (hanging requests) ở các controller và lỗi race condition ảnh hưởng đến tính toàn vẹn của dữ liệu.

### 🔴 Nghiêm trọng (Critical) - Bắt buộc sửa trước khi merge

**1. Bảo mật (Lỗ hổng IDOR nghiêm trọng trong Controllers & Routes)**
- `src/controller/PitchController.js` (dòng 40, 50) & `src/routes/PitchRouter.js`
- `src/controller/TimeSlotController.js` & `src/routes/TimeSlotRouter.js`
- `src/controller/BookingController.js` (dòng 52) & `src/routes/BookingRoute.js`
  - **Vấn đề:** Lỗ hổng Insecure Direct Object Reference (IDOR) xuất hiện ở nhiều nơi. Role `pitch_owner` có thể sửa/xóa **bất kỳ** sân (pitch) và **bất kỳ** khung giờ (time slot) nào chỉ bằng cách truyền ID vào, vì controllers/services không hề kiểm tra xem user đang đăng nhập (`req.user.id`) có thực sự là chủ của sân đó hay không. Tại `BookingController.updateBooking`, **bất kỳ** user nào cũng có thể cập nhật trạng thái (status) hoặc giá (price) của **bất kỳ** booking nào.
  - **Giải pháp:** Truyền `req.user` xuống tầng service và bắt buộc kiểm tra quyền sở hữu trước khi thực hiện hành động `update` hoặc `delete`.

**2. Bảo mật (Thiếu gán ID của chủ sở hữu khi tạo mới)**
- `src/controller/PitchController.js` (dòng 7)
  - **Vấn đề:** Khi tạo một sân (pitch) mới, `ownerId` được lấy trực tiếp từ `req.body`. Điều này có nghĩa là một user có thể tạo sân và gán quyền sở hữu cho một user khác bất kỳ.
  - **Giải pháp:** Gán cứng `req.body.ownerId = req.user.id` trong controller trước khi truyền dữ liệu xuống tầng service.

**3. Tính chính xác (Treo request do xử lý lỗi sai)**
- `src/controller/PitchController.js` (dòng 44, 55)
- `src/controller/TimeSlotController.js` (dòng 28, 40, 52)
  - **Vấn đề:** Bạn đang sử dụng `return new AppError(...)` thay vì `return next(new AppError(...))`. Việc return một object lỗi trong Express route sẽ không trả về response cho client; request sẽ bị treo cho đến khi timeout.
  - **Giải pháp:** Bọc tất cả các lỗi trả về ở controller vào middleware `next()`.

**4. Hiệu suất / Tính chính xác (Lỗi Race Condition - Đặt trùng lịch)**
- `src/service/BookingServices.js` (dòng 17-29)
  - **Vấn đề:** Quá trình tạo booking thực hiện hai truy vấn rời rạc, không đảm bảo tính nguyên tử (atomic): đầu tiên lấy `timeSlot` để kiểm tra trạng thái, sau đó mới cập nhật trạng thái thành 'booked'. Nếu hai user cùng đặt một lịch vào cùng một phần nghìn giây, cả hai đều sẽ vượt qua bước kiểm tra `if (status !== 'available')`, dẫn đến việc bị trùng lịch (double-booking).
  - **Giải pháp:** Sử dụng truy vấn atomic để cập nhật: `TimeSlot.findOneAndUpdate({ _id: timeSlotId, status: 'available' }, { status: 'booked' })`. Nếu kết quả trả về null, nghĩa là lịch đã bị người khác đặt trước.

**5. Tính chính xác (Lỗi Crash App ở Route Wildcard)**
- `src/app.js` (dòng 39-41)
  - **Vấn đề:** Wildcard route `app.all('/{*splat}', (err, req, res, next) => ...)` đang sử dụng tham số của một error-handler (4 tham số). Vì nó được truyền vào một route thông thường, Express sẽ map các tham số bị sai (`req` thành `err`, `res` thành `req`, `next` thành `res`). Việc gọi `next(new AppError(...))` sẽ làm crash app với lỗi `TypeError: next is not a function`.
  - **Giải pháp:** Đổi chữ ký route thành `app.all('*', (req, res, next) => ...)`.

**6. Tính chính xác (Lỗi xử lý JWT Error)**
- `src/controller/ErrorController.js` (dòng 24)
  - **Vấn đề:** Câu lệnh `if (err.name === 'JsonWebTokenError') err => handleJWTError(err)` chỉ định nghĩa một arrow function nhưng không bao giờ thực thi nó, nghĩa là các lỗi JWT sẽ bị bỏ qua và không được xử lý.
  - **Giải pháp:** Sửa thành `err = handleJWTError(err)`.

### 🟡 Bắt buộc (Required) - Cần sửa trước khi merge

**7. Kiến trúc (Lỗi logic Soft Delete)**
- `src/repositories/UserRepository.js` (dòng 31)
  - **Vấn đề:** Lệnh `return await User.findByIdAndDelete(id, {active: false}, {new: true})`. Bạn đang gọi hàm xóa document nhưng lại truyền data update làm tham số thứ hai (điều này khiến `findByIdAndDelete` hiểu lầm đó là object `options`). Kết quả là user sẽ bị xóa vĩnh viễn (hard-delete) khỏi database.
  - **Giải pháp:** Nếu bạn muốn xóa mềm (soft delete), hãy dùng `findByIdAndUpdate(id, { active: false }, { new: true })`.

**8. Tính chính xác (Lỗi Population trong Mongoose)**
- `src/models/PitchModel.js` (dòng 38)
  - **Vấn đề:** Field virtual `time_slots` trỏ tới `ref: "TimeSlot"`, nhưng model này được đăng ký trong Mongoose là `mongoose.model('time_slots', timeSlotSchema)`. Mongoose sẽ văng lỗi không tìm thấy schema khi gọi lệnh populate.
  - **Giải pháp:** Đổi thành `ref: "time_slots"`.
- `src/repositories/TimeSlotRepository.js` (dòng 8, 12)
  - **Vấn đề:** Việc gọi `.populate('pitches')` sẽ gây crash vì tên field liên kết trong schema `TimeSlot` là `pitchId`, chứ không phải `pitches`.
  - **Giải pháp:** Đổi thành `.populate('pitchId')`.

**9. Kiến trúc (Lộ logic Mongoose Object trong Service/Repository)**
- `src/repositories/BookingRepository.js` (dòng 42) & `src/repositories/PitchRepository.js` (dòng 24)
  - **Vấn đề:** Việc lấy document lên, dùng `Object.assign()`, rồi gọi `.save()` làm mờ ranh giới giữa tầng Repository và thao tác object của Mongoose. Điều này còn gây ra nguy cơ giảm hiệu suất do phát sinh truy vấn thừa.
  - **Giải pháp:** Sử dụng `Model.findByIdAndUpdate(id, data, { new: true, runValidators: true })` để đảm bảo ranh giới kiến trúc rõ ràng hơn.

**10. Bảo mật (Tắt Middleware chống Injection)**
- `src/app.js` (dòng 21-22)
  - **Vấn đề:** Dòng code của `mongoSanitize()` và `xss()` đang bị comment lại. Việc xử lý input hiện tại hoàn toàn có thể bị tấn công qua NoSQL injection và XSS payload.
  - **Giải pháp:** Bỏ comment các dòng này để kích hoạt lại chức năng dọn dẹp dữ liệu (sanitation) cơ bản.

### 🔵 Góp ý nhỏ / Tùy chọn (Nit / Optional)

**11. Góp ý nhỏ (Lỗi Copy-Paste ở Controllers)**
- `src/controller/PitchController.js` (dòng 55) & `src/controller/TimeSlotController.js` (dòng 28, 40, 52)
  - **Vấn đề:** Thông báo lỗi của `AppError` ghi là "No tour found with that ID", có vẻ như là boilerplate copy từ một dự án khác (như app đặt tour du lịch).
  - **Giải pháp:** Cập nhật lại thành "No pitch found..." và "No time slot found...".

**12. Tùy chọn (Mongoose Pre-Find Hook có thể bị treo)**
- `src/models/UserModel.js` (dòng 55)
  - **Vấn đề:** `UserSchema.pre(/^find/, function() { ... })`. Các hook đồng bộ của Mongoose có thể hoạt động trên các phiên bản mới mà không cần gọi `next()`, nhưng việc bỏ qua callback `next` hoặc không trả về Promise có thể gây ra hành vi không xác định hoặc treo truy vấn ở một số cấu hình cũ.
  - **Giải pháp:** Thêm `next` vào chữ ký hàm và gọi `next()` ở cuối block code.
