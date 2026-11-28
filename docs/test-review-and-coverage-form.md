# Kế hoạch test chi tiết cho Booking System

Ngày review: 2026-11-28  
Phạm vi: toàn bộ backend MySQL, frontend React và các flow người dùng hiện có trong repository.

Contract và fixture đã chốt nằm tại [test-contract-and-fixtures.md](./test-contract-and-fixtures.md). Mọi test mới phải dùng cùng các field, role, status và fixture trong file đó.

Trạng thái baseline: **toàn bộ test đã bị xóa**, vì vậy coverage hiện tại là 0% và mọi mục bên dưới cần được xây dựng lại. Tài liệu này là test specification mới, không sử dụng các test cũ làm bằng chứng.

## 1. Kết luận nhanh

**Đánh giá hiện tại: Chưa có quality gate.**

Lý do chính không phải chỉ là thiếu case, mà là test suite hiện tại đang không chạy xanh:

- Không còn test file để chạy; `npm test` không thể chứng minh hành vi hệ thống.
- Backend MySQL dùng `src/repositories/...`; mọi test cũ dùng MongoDB/Mongoose phải bỏ, không khôi phục lại.
- `UserServices` và `AuthServices` còn dùng `userRepository2` nhưng biến này không được khai báo.
- Một số controller còn lỗi nhánh error (`next` không tồn tại trong callback), cần có test để bắt lỗi runtime.
- Frontend không có test runner, test file, component test hay E2E test.
- Các model Mongoose và `app.test.js` là code legacy, không dùng làm nguồn sự thật cho MySQL.

### Lệnh và kết quả đã kiểm tra

| Lệnh | Kết quả |
|---|---|
| `npm test` | Chưa có test file sau khi người dùng xóa test |
| Jest coverage | 0% test coverage hiện hành; chưa có suite để đo |
| Frontend test | Không có script test |
| Frontend build/lint | Chưa chạy trong review này |

## 2. Ma trận bao phủ theo tầng

| Tầng | Hiện trạng | Mức tin cậy | Thiếu chính |
|---|---|---:|---|
| Service unit | Không còn test file | Không có | auth đầy đủ, lifecycle, lỗi repository, case biên |
| Repository | Có code nhưng không có test trực tiếp | Thấp | query thành công/rỗng/lỗi DB, filter và update |
| Model | Không có bộ test validation độc lập | Thấp | required, enum, default, hook, virtual, password |
| Controller/router/API | Không còn integration test | Không có | auth, role, lỗi input, 404, response contract |
| Integration DB | Chưa có test; backend dùng MySQL pool và transaction | Không có | flow nhiều request, dữ liệu thật, rollback/consistency |
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

### A. Hạ tầng test và dữ liệu MySQL

| Trạng thái | Ưu tiên | Hạng mục | Bằng chứng / giải thích |
|---|---:|---|---|
| [ ] | P0 | Tạo MySQL test database riêng | Không dùng `DB_NAME` phát triển; dùng schema/database riêng cho local và CI |
| [ ] | P0 | Chạy migration/DDL trước test | Tạo đủ `users`, `pitches`, `pitchImages`, `timeSlots`, `bookings`, `bookingTimeSlots`, foreign key và index |
| [ ] | P0 | Reset dữ liệu sau mỗi integration test | Dùng transaction rollback nếu test chỉ dùng một connection; nếu code mở nhiều connection thì truncate theo thứ tự phụ thuộc |
| [x] | P0 | Sửa `userRepository2` | `UserServices.js:31,46,56` và `AuthServices.js:146` hiện sẽ lỗi runtime/reference |
| [ ] | P0 | Bỏ MongoDB/Mongoose khỏi test path MySQL | `backend/test/app.test.js` cũ không được khôi phục; test phải đi qua `mysql2/promise` repository |
| [ ] | P1 | Mock pool ở unit test repository | Kiểm tra SQL và params mà không cần DB; integration test mới kiểm tra SQL thật |
| [ ] | P1 | Thêm script test rõ tầng | `test:unit`, `test:integration`, `test:coverage`, `test:ci` |
| [ ] | P1 | Chỉ đo coverage khi toàn bộ test pass | Không dùng coverage một phần làm quality gate |

#### Fixture tối thiểu

Mỗi integration suite cần factory tạo dữ liệu và trả ID thật:

```text
user: player, owner, admin, otherPlayer, inactiveUser
pitch: ownerPitch, otherPitch
timeSlot: slotA, slotB cùng pitch; slotOtherPitch
booking: pending, confirmed, cancelled, refunded, completed, expired
```

Không dùng ID hard-code, không dùng state giữa test, không phụ thuộc thứ tự test.

### B. Service unit test

| Trạng thái | Ưu tiên | Module / hành vi cần test | Chi tiết form test đề xuất |
|---|---:|---|---|
| [ ] | P0 | `BookingServices.createBooking` | Test single/multiple slot, slot rỗng, ID trùng, slot không tồn tại, slot đã nằm trong booking cùng ngày, repository lỗi; kiểm tra booking được tạo là `pending`, có `date`, `expiresAt` khoảng 10 phút |
| [ ] | P0 | `BookingLifecycleService` | Test transition hợp lệ/không hợp lệ, owner/admin/pitch owner, role bị chặn, booking không tồn tại, pending hết hạn, `paidAt/refundedAt/completedAt`, expire và auto-complete |
| [ ] | P1 | `AuthServices.signup/login` | Test confirm sai, password dưới 8 ký tự, bcrypt fail, duplicate email, user không tồn tại, password sai, token, password không lộ trong kết quả |
| [ ] | P0 | `AuthServices.protect` | Không token, JWT sai/hết hạn, user bị xóa/inactive, password đổi sau khi token phát hành, token hợp lệ |
| [ ] | P1 | Forgot/reset/update password | Email thiếu/không tồn tại, lưu token hash + expiry, lỗi gửi email phải xóa token, reset token sai/hết hạn, confirm sai, password hiện tại sai |
| [ ] | P1 | `UserServices` | Sau khi sửa import, test filter field, update không tìm thấy, cấm password, role không được đổi qua `updateData`, delete repository lỗi |
| [ ] | P1 | `PitchServices`, `TimeSlotServices` | Test happy path, repository reject, dữ liệu rỗng, `findPitchTimeSlotsByDate` với booking rỗng/slot ID dạng object/string |
| [ ] | P1 | Controller/error mapping | Service throw `AppError`, lỗi SQL, duplicate key, foreign key và lỗi không xác định phải ra status/body đúng |

#### B1. `AuthServices`

| Case | Input / mock | Expected |
|---|---|---|
| Signup thành công | password và password_confirm giống nhau, >= 8 ký tự | hash password, không lưu confirm, tạo user role mặc định `user`, trả JWT |
| Signup sai confirm | hai password khác nhau | `AppError` 400, không gọi repository |
| Signup password ngắn | 7 ký tự | 400, không hash/insert |
| Signup thiếu password | `password` undefined/null | không được crash; trả 400 |
| Signup thiếu name/email | field rỗng | 400 hoặc lỗi DB được map đúng |
| Signup duplicate email | repository reject duplicate key | 400, không lộ SQL/error nội bộ |
| Login thiếu email/password | từng field thiếu và cả hai thiếu | 400 |
| Login user không tồn tại | `findByEmail` trả undefined | 401 |
| Login sai password | bcrypt compare false | 401 |
| Login đúng | repository trả user + password hash | token đúng payload, password không xuất hiện trong response |
| Protect không có token | null/undefined/empty | 401 |
| Protect token không hợp lệ | `jwt.verify` reject | 401 |
| Protect token hết hạn | `TokenExpiredError` | 401 với message hết hạn |
| Protect user đã inactive/không tồn tại | `findById` trả undefined | 401 |
| Protect password đã đổi | `passwordChangeAt > decoded.iat` | 401 |
| Forgot email thiếu/không tồn tại | email rỗng hoặc repository không có user | 400/404 |
| Forgot thành công | email service success | lưu token hash + expiry khoảng 10 phút, gửi đúng recipient/message |
| Forgot email fail | `sendEmail` reject | xóa token/expiry đã lưu, trả 500 |
| Reset token sai/hết hạn | `findByResetToken` không có user | 400 |
| Reset thành công | token hợp lệ, password mới | hash password khi save, xóa reset fields, trả token mới |
| Update password | current đúng, password confirm đúng | save password mới, cập nhật token |
| Update password fail | confirm sai, user không tồn tại, current sai | 401/404 đúng case |

#### B2. `BookingServices` và `BookingLifecycleService`

| Case | Expected |
|---|---|
| Thiếu date | 400, không query slot |
| Thiếu `timeSlotId` | 400 |
| Một slot hợp lệ | gọi `findById`, kiểm tra booking cùng ngày, tạo `pending` + expiry 10 phút |
| Nhiều slot hợp lệ | gọi `findByIds`, tạo một booking chứa đúng danh sách slot |
| Mảng slot rỗng | 400 |
| Slot ID trùng | 400, không insert |
| Một slot không tồn tại | 404 |
| Slot thuộc pitch khác trong cùng mảng | policy phải được xác định và test; không cho booking sai pitch |
| Slot đã có booking chưa hủy cùng ngày | 400 |
| Slot chỉ có booking cancelled | cho phép đặt lại |
| Repository check/create lỗi | lỗi được giữ nguyên/map đúng; không nuốt lỗi |
| Đặt đồng thời cùng slot/ngày | chỉ một request thành công; request còn lại 400/409 |
| Pending → confirmed | cập nhật `status`, `paidAt`, xóa `expiresAt` |
| Pending → cancelled | thành công nếu owner/staff hợp lệ |
| Confirm pending đã hết hạn | đổi cancelled rồi trả 400 |
| Confirm cancelled/completed/refunded | 400 vì transition không hợp lệ |
| Refund | chỉ admin/pitch owner, thêm `refundedAt` |
| Complete | chỉ admin/pitch owner, thêm `completedAt` |
| User thường refund/complete | 403 |
| Booking không tồn tại | 404 |
| Owner khác hủy/cập nhật | 403 |
| `expireBooking` | chỉ pending quá hạn mới chuyển cancelled |
| `expirePendingBookings` | gọi đúng repository job |
| `completeFinishedBookings` | booking confirmed có giờ kết thúc đã qua chuyển completed; slot format sai không làm job crash |

#### B3. Service còn lại

| Module | Cases |
|---|---|
| `PitchServices` | create/list/find owner/find ID/update/delete; kết quả rỗng; repository reject; filter chỉ ownerId |
| `TimeSlotServices` | create/list/find/update/delete; find theo pitch/date; slot booked đánh dấu `isBooked`; booking rỗng; repository reject |
| `UserServices` | filter field được phép; loại bỏ field lạ; cấm password ở update; update/delete không tồn tại; không cho mass assignment role nếu route user thường |

### C. Repository và database contract

| Trạng thái | Ưu tiên | Hạng mục | Form test cần có |
|---|---:|---|---|
| [ ] | P0 | `UserRepository` | create/findByEmail/findById/saveUser/findByResetToken/update/delete; password select; active flag; duplicate email; parameter binding |
| [ ] | P0 | `BookingRepository.create` | transaction insert booking + bookingTimeSlots; commit; rollback khi insert slot fail; connection release; expiry default |
| [ ] | P0 | `BookingRepository.load` | group nhiều row thành một booking; booking không có slot; user/pitch metadata; ordering |
| [ ] | P1 | `BookingRepository` query | find all/status/user/pitch+date; loại cancelled; empty result; update allowed fields only; delete |
| [ ] | P1 | `PitchRepository` | create/find/update/delete; owner filter; missing row; foreign key owner; allowed update fields only |
| [ ] | P1 | `TimeSlotRepository` | create/find all/by pitch/by IDs; empty IDs; update/updateMany allowed fields; delete; foreign key pitch |
| [ ] | P0 | SQL injection boundary | input filter/name/email/date không được làm thay đổi SQL; mọi giá trị phải truyền qua params |
| [ ] | P0 | Foreign key/data integrity | không tạo pitch thiếu owner, slot thiếu pitch, booking thiếu user/slot |
| [ ] | P0 | Concurrent booking | kiểm tra transaction/locking hoặc unique strategy để hai request không chiếm cùng slot cùng ngày |

### D. Model validation và hook

Vì backend đang dùng MySQL repository, model Mongoose bên `backend/src/models` không phải tầng runtime chính. Không viết test mới cho Mongoose trừ khi quyết định dùng lại chúng; thay vào đó test DDL, repository và service validation.

| Trạng thái | Ưu tiên | Model | Cases thiếu |
|---|---:|---|---|
| [ ] | P0 | MySQL `users` | NOT NULL, UNIQUE email/phone, ENUM role, active/default flags, password reset columns |
| [ ] | P0 | MySQL `pitches` | owner FK, status/pitchType ENUM, rating/price decimal, cascade behavior |
| [ ] | P0 | MySQL `timeSlots` | pitch FK, TIME fields, price decimal, peak default |
| [ ] | P0 | MySQL `bookings` | user FK, date, status ENUM, expiry/payment timestamps |
| [ ] | P0 | MySQL `bookingTimeSlots` | composite primary key, booking/slot FKs, cascade delete |
| [ ] | P1 | Migration repeatability | migration trên database mới và database đã có cột; không tạo duplicate column/index ngoài ý muốn |

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

#### E1. Bảng endpoint bắt buộc

| Endpoint | Happy path | Negative/authorization |
|---|---|---|
| `POST /api/user/signup` | 201, token, cookie, user | thiếu field, password mismatch/short, duplicate email, SQL error |
| `POST /api/user/login` | 200, token, cookie | thiếu credentials, sai password, user inactive, JWT fail |
| `POST /api/user/forgotPassword` | 200, mail sent | thiếu email, không tồn tại, SMTP fail và token cleanup |
| `PATCH /api/user/resetPassword/:token` | 200, token mới | token sai/hết hạn, password mismatch, field naming contract |
| `GET /api/user/me` | user hiện tại | no token, bad token, deleted/inactive user |
| `PATCH /api/user/updateData` | chỉ cập nhật profile allowed fields | password/role injection, missing user, duplicate email |
| `PATCH /api/user/updatePassword` | password + token mới | current sai, confirm sai, no token |
| `DELETE /api/user/deleteMe` | active = 0, 204 | no token, missing user |
| `GET /api/user` | admin list | user/owner 403 |
| `POST /api/user` | admin create | non-admin, unknown fields, duplicate email |
| `GET/PATCH/DELETE /api/user/:id` | admin CRUD | non-admin, missing ID, invalid ID, not found |
| `GET /api/pitch` | list + `results` | DB error, empty list |
| `GET /api/pitch/:id` | detail | missing, invalid ID, DB error |
| `POST /api/pitch` | owner creates pitch | user/admin policy, ownerId spoofing, required fields |
| `PATCH/DELETE /api/pitch/:id` | admin/owner changes/deletes | wrong role, missing pitch, foreign key/cascade |
| `GET /api/user/my-pitches` | owner pitches | user/admin 403, empty result |
| `GET /api/timeSlot` | ordered slots | DB error, empty result |
| `GET /api/timeSlot/:id` | slot detail | missing/invalid ID |
| `GET /api/timeSlot/pitch/:pitchId?date=...` | slots with `isBooked` | missing/invalid date/pitch, empty result |
| `POST /api/timeSlot` | owner/admin creates | user 403, missing pitch, invalid time/price |
| `PATCH/DELETE /api/timeSlot/:id` | owner/admin changes/deletes | user 403, missing slot, booking impact |
| `GET /api/booking/my-bookings` | own bookings + results | no token, only own rows |
| `POST /api/booking` | pending booking | missing date/slot, duplicate/unavailable, transaction fail |
| `GET /api/booking/:id` | owner/admin/owner-role access | other user 403, not found |
| `PATCH /api/booking/:id` | valid lifecycle transition | extra fields, invalid status, role/state violation |
| `DELETE /api/booking/:id` | owner/admin cancels | other user, invalid state, not found |
| `POST /api/booking/:id/confirm-payment` | confirm pending | expired/invalid state/unauthorized |
| `POST /api/booking/:id/refund` | staff refund | ordinary user, invalid state |
| `POST /api/booking/:id/complete` | staff complete | ordinary user, invalid state |

#### E2. API contract cần assert

Mỗi request phải assert đủ:

```text
HTTP status
response.status
response.message nếu có
response.data shape
không lộ password/token reset hash/SQL stack ở production
database state sau request
```

### F. Frontend

| Trạng thái | Ưu tiên | Khu vực | Form test đề xuất |
|---|---:|---|---|
| [ ] | P0 | Test infrastructure | Jest + jsdom + React Testing Library + user-event + MSW; thêm script `test` và `test:coverage` |
| [ ] | P1 | `AppContext` | đọc localStorage hợp lệ, localStorage JSON lỗi, set/clear user, add/remove toast và auto-dismiss |
| [ ] | P1 | `SignIn` | required fields, password min 6, password visibility, API success, localStorage token/user, redirect thường, pending booking redirect, account redirect, API error |
| [ ] | P1 | `SignUp` | required, password min 8, mismatch, API payload `password_confirm`, success redirect/state, duplicate/API error |
| [ ] | P1 | `LoginRequiredModal` | close, sign in callback `/signin`, sign up callback `/signup`, accessible button labels |
| [ ] | P1 | `Navbar` | logged-out links, role links, dropdown, sign out clears storage/context, dashboard navigation |
| [ ] | P1 | `Discovery` | fetch success, loading, API error, empty, search/filter/type/price/location, pitch card link, malformed pitch data |
| [ ] | P0 | `PitchDetails` | fetch detail, date change, slot loading, available/booked/selected, total price, unauthenticated modal, authenticated booking payload, API error, pending booking/session state |
| [ ] | P1 | `MockVietQRCard` | amount formatting, transfer content, copy account/amount/memo, copy feedback, missing values |
| [ ] | P1 | `UserDashboard` | bookings loading/data/empty, upcoming/history filters, analytics calculations, detail modal, cancel confirm/rollback on API error, copy booking code |
| [ ] | P1 | `OwnerDashboard` | role access, pitch tabs, active/inactive display, booking confirm/cancel API, empty state; flag static/demo data separately |
| [ ] | P1 | `AdminDashboard` | users/bookings display, role/status labels, admin actions and API errors if wired |
| [ ] | P1 | `AccountPage` | profile/football/security/notification tabs, API payloads, success/error, password update, storage refresh, unauthenticated behavior |
| [ ] | P2 | `ToastContainer` | render toast types, remove action, auto timeout, multiple toasts |
| [ ] | P2 | `Format.js` | VND zero/large/decimal/null, date valid/invalid/malformed, no timezone shift for `YYYY-MM-DD` |
| [ ] | P2 | Layout/common | logo click, footer links, modal keyboard/close, form labels, image alt, focus and keyboard navigation |
| [ ] | P1 | E2E smoke | login → discovery → pitch detail → slot/date → booking → dashboard → cancel |

### F1. Frontend data contract checks

Các fixture API phải kiểm tra đúng tên field MySQL trả về (`id`, `ownerId`, `pitchId`, `timeSlotId`, `date`, `startTime`, `endTime`). Không dùng `_id`, `time`, `location` hoặc `time_slots` trong fixture nếu API thật không trả các field đó.

Các mismatch cần có test regression:

- backend role dùng `pitch_owner`, frontend đang kiểm tra `owner` ở một số chỗ;
- frontend login dùng `passwordConfirm` cho reset/update, backend service dùng `password_confirm`/controller map riêng;
- frontend có component/static fixture dùng `_id`, trong khi MySQL repository trả `id`;
- frontend dùng nhiều `axios` trực tiếp thay vì instance `api` có `withCredentials`.

## 4. Các rủi ro code mà test bắt buộc phải phát hiện

1. **`userRepository2` chưa tồn tại.** Test `UserServices.updateUser`, `updateData`, `deleteUser` và `AuthServices.resetPassword` phải fail ngay khi module hoặc flow được gọi.
2. **Controller dùng `next` ngoài scope.** `TimeSlotController.getTimeSlotById` và `deleteTimeSlot` có nhánh `next(...)` nhưng callback không nhận `next`; test resource không tồn tại phải bắt lỗi này.
3. **`PitchController.getAllPitches` có nhánh dùng `next` nhưng callback không nhận `next`.** Test DB trả lỗi/empty phải không được biến thành `ReferenceError`.
4. **Role không nhất quán.** Backend dùng `pitch_owner`, frontend một số chỗ kiểm tra `owner`; test authorization và navbar/dashboard phải bắt mismatch.
5. **Check-then-insert booking có race condition.** Hai request đồng thời có thể cùng thấy slot trống; integration/concurrency test phải chứng minh chỉ một booking thành công.
6. **Booking không tự gắn `pitchId` ở booking table.** Query phải đi qua `bookingTimeSlots → timeSlots → pitches`; test multi-slot và slot khác pitch phải bảo đảm không trả/đặt sai sân.
7. **Repository mapping phải thống nhất ID.** MySQL trả `id`, frontend có code cũ dùng `_id`; API contract test phải bắt mismatch.
8. **Frontend giữ optimistic state khi hủy booking.** Test API DELETE fail phải chứng minh UI rollback đúng và không báo hủy thành công giả.
9. **Không được test model Mongoose như runtime MySQL.** Test phải tập trung DDL, SQL, repository và service; code legacy Mongoose chỉ cần smoke test/đánh dấu cần xóa nếu còn được import.

## 5. Thứ tự sửa tối thiểu

### P0 — phải làm trước

- [ ] Sửa toàn bộ import `repository2` và `userRepository2`.
- [ ] Viết unit test tối thiểu cho auth, booking service và lifecycle theo bảng trên.
- [ ] Chạy `npm test` với MySQL test database cho tới khi suite xanh.
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

**Verdict: Build the P0 test baseline first.** Hiện chưa thể đánh giá coverage vì toàn bộ test đã bị xóa. File này là danh sách kiểm thử cần triển khai, không phải kết quả coverage.

**Đã bỏ qua:** chưa chạy frontend build/lint vì yêu cầu hiện tại là cập nhật đặc tả test, chưa triển khai test.  
**Rủi ro cần biết:** code còn lỗi runtime và contract mismatch; nếu chỉ viết happy-path test, các lỗi quyền, transaction, race condition và mapping ID vẫn có thể lọt.
