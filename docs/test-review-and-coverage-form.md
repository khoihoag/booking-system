# Form review độ bao phủ và chất lượng test

Ngày review: 2026-11-28  
Phạm vi: toàn bộ backend, frontend và cấu hình test trong repository.

## 1. Kết luận nhanh

**Đánh giá hiện tại: Chưa đạt để tin cậy khi merge.**

Lý do chính không phải chỉ là thiếu case, mà là test suite hiện tại đang không chạy xanh:

- `npm test` tại `backend/`: **6 suite fail**; chỉ có 7 test chạy qua và 7 test fail trong các suite đã load được.
- Bốn service đang require đường dẫn không tồn tại: `src/repository2/...`; code thực tế chỉ có `src/repositories/...`.
- `UserServices` và `AuthServices` còn dùng `userRepository2` nhưng biến này không được khai báo.
- Test `BookingServices` đang dùng contract cũ: thiếu `date`, kỳ vọng trạng thái `confirmed`, trong khi code hiện tại tạo booking `pending` và có lifecycle riêng.
- Frontend không có test runner, test file, component test hay E2E test.
- Coverage 57.39% trong `docs/test-coverage-report.md` là kết quả cũ, không tái lập được ở trạng thái hiện tại; lần chạy mới chỉ đạt coverage một phần do nhiều suite không load được.

### Lệnh và kết quả đã kiểm tra

| Lệnh | Kết quả |
|---|---|
| `npm test` | Fail: 6 test suites, 7 tests fail; lỗi import và contract test cũ |
| `npx jest test/unit --coverage --runInBand` | Fail; coverage không đại diện cho toàn bộ unit suite |
| Frontend test | Không có script test |
| Frontend build/lint | Chưa chạy trong review này |

## 2. Ma trận bao phủ theo tầng

| Tầng | Hiện trạng | Mức tin cậy | Thiếu chính |
|---|---|---:|---|
| Service unit | Có 5 file test, nhưng phần lớn không load được | Thấp | auth đầy đủ, lifecycle, lỗi repository, case biên |
| Repository | Có code nhưng không có test trực tiếp | Thấp | query thành công/rỗng/lỗi DB, filter và update |
| Model | Không có bộ test validation độc lập | Thấp | required, enum, default, hook, virtual, password |
| Controller/router/API | Một app test tuần tự, hiện không khởi động được | Thấp | auth, role, lỗi input, 404, response contract |
| Integration DB | Có app test cũ dùng MongoMemoryServer, nhưng backend hiện dùng MySQL repository | Thấp | flow nhiều request, dữ liệu thật, rollback/consistency |
| Frontend component | Chưa có | Không có | form, state, routing, loading/error/empty |
| Frontend E2E | Chưa có | Không có | đăng nhập → chọn sân → đặt sân → hủy |

## 3. Form review chi tiết

Trạng thái dùng trong form:

- `[x]` Đã có kiểm thử và có giá trị bảo vệ hành vi.
- `[~]` Có test nhưng chưa đủ hoặc hiện đang fail.
- `[ ]` Chưa có test.
- `P0` Chặn merge hoặc có nguy cơ sai dữ liệu/bảo mật.
- `P1` Nên làm ngay sau khi test suite chạy lại.
- `P2` Cải thiện chất lượng và độ tin cậy.

### A. Hạ tầng test và khả năng chạy lại

| Trạng thái | Ưu tiên | Hạng mục | Bằng chứng / giải thích |
|---|---:|---|---|
| [ ] | P0 | Sửa import `repository2` thành module repository đang tồn tại, hoặc khôi phục module đúng thiết kế | `AuthServices.js:7`, `PitchServices.js:1`, `TimeSlotServices.js:1`, `UserServices.js:1` require `../repository2/...`, nhưng không có thư mục này |
| [ ] | P0 | Sửa biến `userRepository2` chưa khai báo | `UserServices.js:31,46,56` và `AuthServices.js:146` sẽ lỗi runtime/reference |
| [ ] | P0 | Đưa test suite về trạng thái xanh trước khi đo coverage | Unit test không thể là baseline khi suite không load hoặc assertion theo contract cũ |
| [ ] | P1 | Tách dữ liệu test độc lập giữa các test hoặc reset DB theo test | `app.test.js` phụ thuộc thứ tự và biến global như `userToken`, `createdPitchId`, `createdBookingId` |
| [ ] | P1 | Dùng MySQL test database cô lập trong CI | Mỗi test run cần schema/database riêng hoặc transaction cleanup; không dùng database phát triển |
| [ ] | P1 | Thêm script coverage lặp lại được | Hiện `backend/package.json` chỉ có `test: jest --runInBand`; chưa có ngưỡng coverage |

### B. Service unit test

| Trạng thái | Ưu tiên | Module / hành vi cần test | Chi tiết form test đề xuất |
|---|---:|---|---|
| [~] | P0 | `BookingServices.createBooking` | Cập nhật fixture có `date`; test single/multiple slot, slot rỗng, ID trùng, slot không tồn tại, slot đã nằm trong booking cùng ngày, repository lỗi; kiểm tra booking được tạo là `pending`, có `date`, `expiresAt` khoảng 10 phút |
| [~] | P0 | `BookingLifecycleService` | Test transition hợp lệ/không hợp lệ, owner/admin/pitch owner, role bị chặn, booking không tồn tại, pending hết hạn, `paidAt/refundedAt/completedAt`, expire và auto-complete |
| [~] | P1 | `AuthServices.signup/login` | Test confirm sai, password dưới 8 ký tự, bcrypt fail, duplicate email, user không tồn tại, password sai, token, password không lộ trong kết quả |
| [ ] | P0 | `AuthServices.protect` | Không token, JWT sai/hết hạn, user bị xóa/inactive, password đổi sau khi token phát hành, token hợp lệ |
| [ ] | P1 | Forgot/reset/update password | Email thiếu/không tồn tại, lưu token hash + expiry, lỗi gửi email phải xóa token, reset token sai/hết hạn, confirm sai, password hiện tại sai |
| [~] | P1 | `UserServices` | Sau khi sửa import, test filter field, update không tìm thấy, cấm password, role không được đổi qua `updateData`, delete repository lỗi |
| [~] | P1 | `PitchServices`, `TimeSlotServices` | Có test happy path nhưng thiếu repository reject, dữ liệu rỗng, `findPitchTimeSlotsByDate` với booking rỗng/slot ID dạng object/string |
| [ ] | P1 | Controller/error mapping | Service throw `AppError`, validation error, CastError, duplicate key và lỗi không xác định phải ra status/body đúng |

### C. Repository và database contract

| Trạng thái | Ưu tiên | Hạng mục | Form test cần có |
|---|---:|---|---|
| [ ] | P0 | `UserRepository` | create/findByEmail/findById/save/update/delete; `select password`, active user, inactive user, duplicate email, DB reject |
| [ ] | P1 | `BookingRepository` | create, find by user/date/pitch, expire pending, update, empty result, invalid ID, query lỗi |
| [ ] | P1 | `PitchRepository` | filter owner/status, find one missing, update/delete missing, DB error |
| [ ] | P1 | `TimeSlotRepository` | find by pitch, find by IDs, update/delete, empty list, DB error |
| [ ] | P1 | Consistency khi đặt sân | Hai request cùng slot/cùng date phải không cùng tạo booking thành công; test này hiện chưa có và logic check-then-create có rủi ro race condition |

### D. Model validation và hook

| Trạng thái | Ưu tiên | Model | Cases thiếu |
|---|---:|---|---|
| [ ] | P1 | `UserModel` | required name/email/password/password_confirm, email lowercase/format/unique, role enum, jersey range, defaults, bcrypt pre-save, `correctPassword`, `changedPassword`, inactive query filter |
| [ ] | P1 | `PitchModel` | owner/name/address required, pitch type enum/default, rating min/max, status enum, price virtual, pitch type virtual, time_slots virtual |
| [ ] | P1 | `TimeSlotModel` | pitch/time/price required, price >= 0, `is_peak_hour` default, booking virtual; kiểm tra hook vì hook hiện tham chiếu `start_time/end_time` nhưng schema không khai báo các field này |
| [ ] | P1 | `BookingModel` | required refs/date, status enum/default, expiresAt default, timestamps, status transition ở service |

### E. API integration và authorization

| Trạng thái | Ưu tiên | Endpoint group | Cases cần bổ sung |
|---|---:|---|---|
| [~] | P0 | Auth/user | missing/invalid/expired Bearer token, user inactive, role sai, duplicate email, invalid payload, forgot/reset/update password |
| [~] | P0 | Pitch | public list/detail, owner create, user bị chặn create, admin/owner update/delete, missing ID, payload invalid |
| [~] | P0 | Time slot | public list/by pitch/date, role create/update/delete, missing pitch/slot, invalid price/time |
| [~] | P0 | Booking | date missing, single/multiple slots, duplicate slot, slot already booked, confirm/refund/complete, owner/admin permission, invalid transition, expired payment |
| [ ] | P1 | Error contract | Assert đồng thời HTTP status, `status`, message, error shape; test unknown route, invalid ID và lỗi SQL |
| [ ] | P1 | Rate limit/security middleware | 50+ request trong window, helmet headers, cookie flags; xác nhận mongo sanitize/XSS đang comment thì behavior nào được chấp nhận |
| [ ] | P1 | Alias route | `/api/booking` và `/api/bookings` phải có behavior giống nhau hoặc ghi rõ route chính thức |

### F. Frontend

| Trạng thái | Ưu tiên | Khu vực | Form test đề xuất |
|---|---:|---|---|
| [ ] | P0 | Test infrastructure | Thêm test runner + DOM environment + user-event; hiện `frontend/package.json` không có script `test` và không có dependency test |
| [ ] | P1 | Auth | SignIn/SignUp validation, success/error, token/session, redirect, logout, login-required modal |
| [ ] | P1 | Discovery/pitch | search/filter, empty state, loading, API error, detail, price/date formatting |
| [ ] | P0 | Booking | chọn slot, date, disabled booked slot, submit success/fail, duplicate click, refresh state |
| [ ] | P1 | Dashboards/account | role-based rendering cho user/owner/admin, update profile, booking list, cancel/status updates |
| [ ] | P2 | Utilities/accessibility | format VND/date, keyboard form flow, labels, error messages, responsive critical layout |
| [ ] | P1 | E2E smoke | login → discovery → pitch detail → chọn slot → booking → xem my bookings → cancel |

## 4. Các vấn đề chất lượng của test hiện tại

1. **Test phụ thuộc thứ tự và state dùng chung.** `app.test.js` tạo user/admin/owner rồi dùng token và ID ở test sau. Một test fail sớm có thể làm hàng loạt test sau fail theo, khiến nguyên nhân bị che khuất.
2. **Một số assertion quá lỏng.** Ví dụ login sai chỉ kiểm tra status `>= 400`; nên kiểm tra status cụ thể và error contract.
3. **Một số assertion bám contract cũ.** `BookingServices.test.js` kỳ vọng `confirmed` và message cũ, trong khi implementation hiện tạo `pending` và dùng lifecycle.
4. **Unit mock không bảo vệ database behavior.** Mock repository chỉ chứng minh service gọi mock; không chứng minh query, schema, index, hook hay transaction/consistency.
5. **Coverage hiện tại dễ gây hiểu nhầm.** Coverage được tạo trong lúc suite fail và module không load được; không nên dùng nó làm quality gate.
6. **Không có test chống hồi quy cho lỗi import/exports.** Một smoke test load tất cả route/service sẽ bắt ngay `repository2` và biến chưa khai báo.

## 5. Thứ tự sửa tối thiểu

### P0 — phải làm trước

- [ ] Sửa toàn bộ import `repository2` và `userRepository2`.
- [ ] Cập nhật unit fixture/assertion theo booking contract hiện tại (`date`, `pending`, lifecycle).
- [ ] Chạy lại `npm test` cho đến khi test suite load được và không còn lỗi hạ tầng.
- [ ] Thêm API test cho auth thiếu token/sai role và booking race/duplicate.
- [ ] Thêm ít nhất một frontend smoke test cho auth và booking, hoặc ghi rõ frontend chưa có quality gate.

### P1 — để có mức bảo vệ chấp nhận được

- [ ] Unit test toàn bộ `AuthServices` và `BookingLifecycleService`.
- [ ] Repository integration test với MySQL test database riêng.
- [ ] API negative cases và error response contract.
- [ ] Reset fixture giữa test, bỏ phụ thuộc thứ tự.
- [ ] Thêm coverage command + threshold; chỉ đo khi toàn bộ suite pass.

### P2 — cải thiện độ tin cậy dài hạn

- [ ] Frontend component tests cho các state loading/empty/error.
- [ ] Một E2E smoke flow có dữ liệu test ổn định.
- [ ] Test security middleware/rate limit và kiểm tra open handles trong CI.

## 6. Tiêu chí hoàn thành đề xuất

- Backend unit + integration test pass từ một lệnh duy nhất.
- Không có test phụ thuộc thứ tự hoặc biến global giữa test.
- Tối thiểu các nhánh P0 trong form đều có test regression.
- Coverage chỉ được công bố sau khi suite pass; có thể bắt đầu với ngưỡng **80% statements, 70% branches** cho backend service/controller được chọn, sau đó mở rộng.
- Frontend có test script chạy được và có ít nhất một auth smoke test + một booking smoke test.
- CI chạy test, coverage, build và lint với cùng cấu hình mà local sử dụng.

## 7. Verdict

**Verdict: Fix P0 first.** Hiện chưa thể đánh giá coverage là đạt vì test suite không chạy được ổn định và frontend chưa có automated test. Báo cáo cũ nên được xem là historical note, không phải số liệu hiện hành.

**Đã bỏ qua:** chưa chạy frontend build/lint và chưa sửa code/test theo yêu cầu review-only.  
**Rủi ro cần biết:** lỗi `repository2`/`userRepository2` là lỗi runtime trực tiếp; app test hiện còn dùng Mongoose/MongoDB cũ trong khi repository chính dùng MySQL, nên integration test hiện chưa kiểm tra đúng database production.
