# Kế hoạch quản lý vòng đời Booking

## 1. Vòng đời mục tiêu

```text
pending
  ├─ thanh toán thành công trong 10 phút → confirmed
  └─ quá 10 phút hoặc thanh toán thất bại → cancelled

confirmed
  ├─ trận đấu hoàn tất → completed
  └─ được hủy hợp lệ → cancelled
```

`expiresAt` là thời điểm hết hạn thanh toán của booking `pending`.

## 2. Phương án hiện tại

Khi tạo booking trong lúc thanh toán:

- Booking được tạo với trạng thái `pending`.
- Backend lưu `expiresAt = thời điểm hiện tại + 10 phút`.
- Thanh toán thành công sẽ chuyển `pending` sang `confirmed`.
- Một job chạy định kỳ mỗi phút để chuyển booking `pending` đã quá hạn sang `cancelled`.
- Các request đọc hoặc tạo booking cũng có thể dọn các booking pending đã hết hạn.

### Ưu điểm

- Ít thay đổi trong code hiện tại.
- Không cần thêm Redis, worker hoặc dịch vụ bên ngoài.
- Phù hợp với môi trường demo, local và hệ thống chỉ chạy một backend instance.

### Hạn chế

- Job định kỳ vẫn gắn với tiến trình Node.js.
- Có thể trễ tối đa khoảng một phút.
- Khi chạy nhiều backend instance, mỗi instance có thể cùng thực hiện job.
- Chưa có retry, monitoring hoặc cơ chế đảm bảo xử lý phân tán.

## 3. Phương án 3: Queue hoặc scheduler chuyên dụng

Khi tạo booking `pending`, hệ thống tạo một delayed job có thời gian chạy sau 10 phút:

```text
Tạo booking pending
  → tạo delayed job 10 phút
  → webhook thanh toán thành công
      → pending → confirmed
      → hủy delayed job
  → delayed job chạy
      → kiểm tra booking vẫn pending và đã hết hạn
      → pending → cancelled
```

Có thể dùng Redis + BullMQ hoặc một dịch vụ cloud queue/scheduler tương đương.

### Quy tắc bắt buộc

- Delayed job phải kiểm tra lại trạng thái trước khi hủy.
- Nếu booking đã `confirmed`, job không được thay đổi trạng thái.
- Job cần retry khi database tạm thời lỗi.
- Xử lý phải idempotent để chạy lại không gây sai trạng thái.
- Cần lưu log lỗi và có monitoring cho các job thất bại.
- Webhook thanh toán phải xác thực chữ ký và không được tin dữ liệu từ frontend.

### Ưu điểm

- Mỗi booking có lịch xử lý riêng, không cần quét toàn bộ database mỗi phút.
- Hoạt động tốt khi chạy nhiều backend instance.
- Có thể retry, theo dõi lỗi và xử lý tải lớn.
- Phù hợp với thanh toán thật và webhook bất đồng bộ.

### Nhược điểm

- Phải vận hành thêm Redis hoặc dịch vụ queue.
- Tăng chi phí và độ phức tạp triển khai.
- Cần thêm worker, monitoring và quy trình xử lý job thất bại.
- Cần viết thêm test cho retry, duplicate job và race condition giữa thanh toán với hết hạn.

## 4. Vì sao chưa triển khai phương án 3 ngay

Phương án hiện tại đủ cho giai đoạn phát triển hiện tại vì:

- Thanh toán đang là chế độ mô phỏng.
- Chưa có webhook thanh toán thật.
- Hệ thống chưa cần xử lý lượng booking lớn.
- Chưa có hạ tầng Redis hoặc worker riêng.
- Thêm queue lúc này sẽ tạo chi phí vận hành lớn hơn lợi ích thực tế.

Triển khai queue ngay sẽ làm tăng số thành phần cần cấu hình và kiểm thử, trong khi nghiệp vụ thanh toán thật chưa hoàn thiện.

## 5. Điều kiện chuyển sang phương án 3

Nên chuyển sang queue/scheduler khi có một hoặc nhiều điều kiện sau:

- Tích hợp VNPay, MoMo, Stripe hoặc cổng thanh toán thật.
- Nhận kết quả thanh toán qua webhook bất đồng bộ.
- Backend chạy từ hai instance trở lên.
- Số lượng booking pending tăng cao.
- Cần đảm bảo thời gian hết hạn chính xác hơn một phút.
- Cần retry, monitoring và audit rõ ràng cho thanh toán.

## 6. Kế hoạch triển khai sau này

1. Chọn Redis + BullMQ hoặc dịch vụ queue tương đương.
2. Tạo worker riêng cho delayed job hết hạn booking.
3. Thêm `paymentReference` và trạng thái thanh toán riêng nếu cổng thanh toán yêu cầu.
4. Chuyển webhook thành nguồn xác nhận thanh toán duy nhất.
5. Thêm xử lý idempotent cho webhook và delayed job.
6. Thêm test cho các tình huống race condition:
   - Thanh toán thành công ngay trước thời điểm hết hạn.
   - Job hết hạn chạy sau khi booking đã confirmed.
   - Webhook được gửi lặp lại.
   - Worker bị dừng rồi chạy lại.
7. Chỉ loại bỏ job định kỳ hiện tại sau khi queue đã được monitoring ổn định.

