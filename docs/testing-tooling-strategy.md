# Chiến lược công cụ kiểm thử

## Kết luận

Jest nên là công cụ chính cho unit test và integration test. Tuy nhiên, để kiểm thử đầy đủ backend, frontend và luồng người dùng, nên kết hợp thêm một số công cụ chuyên biệt.

## Bộ công cụ đề xuất

| Mục đích | Công cụ |
|---|---|
| Backend unit test | Jest |
| API integration test | Jest + Supertest |
| Database test | MySQL test database riêng hoặc MySQL Docker container |
| React component test | Jest + React Testing Library + `@testing-library/user-event` |
| Mock API frontend | MSW |
| E2E toàn hệ thống | Playwright |
| Coverage | Jest Coverage |

## Backend

Dùng:

```text
Jest
Supertest
MySQL test database
```

Phân chia như sau:

- Jest: test service, model và utility.
- Supertest: test endpoint Express thật.
- MySQL test database: test repository, SQL query và flow booking với dữ liệu thật.
- Jest mock: chỉ mock email, payment hoặc service bên ngoài.

Không nên mock repository trong mọi test. Mock chỉ chứng minh service gọi hàm đúng, không chứng minh query, schema hoặc database behavior hoạt động đúng.

## Frontend

Frontend React nên thêm:

```bash
npm install -D jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event msw
```

Phạm vi sử dụng:

- Jest: chạy test component và utility.
- React Testing Library: test theo cách người dùng nhìn thấy và tương tác.
- `user-event`: mô phỏng click, nhập form, submit và các thao tác người dùng thực tế.
- MSW: mock API ở tầng HTTP thay vì mock trực tiếp `axios`.

## E2E

Dùng Playwright cho các luồng nghiệp vụ quan trọng:

```text
Đăng nhập
→ tìm sân
→ xem chi tiết
→ chọn time slot
→ đặt sân
→ xem booking
→ hủy booking
```

Playwright có test runner, assertion, isolation, chạy song song và hỗ trợ Chromium, Firefox, WebKit.

## Có cần dùng Vitest không?

Không cần. Vì backend đã dùng Jest và frontend chưa có test runner, dùng Jest xuyên suốt sẽ giảm số lượng công cụ và cấu hình phải bảo trì.

Vitest chỉ nên được cân nhắc nếu frontend cần tốc độ chạy test cao hơn đáng kể. Khi đó sẽ có Jest cho backend và Vitest cho frontend, làm tăng chi phí bảo trì.

## Cấu hình coverage đề xuất

```js
module.exports = {
  testEnvironment: 'node',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  }
};
```

Jest hỗ trợ `collectCoverageFrom` để tính cả file chưa được import và `coverageThreshold` để làm test fail khi coverage thấp.

## Lệnh chạy đề xuất

```bash
npm test
npm test -- --coverage
npm test -- --runInBand
```

Chỉ dùng `--runInBand` cho test database hoặc khi debug. Unit test thuần nên chạy song song để giảm thời gian.

## Cấu trúc thư mục

```text
backend/
  test/
    unit/
    integration/
frontend/
  src/
    components/
      __tests__/
e2e/
```

## Kết luận cuối

Bộ công cụ phù hợp nhất với dự án:

```text
Jest
+ Supertest
+ MySQL test database
+ React Testing Library
+ user-event
+ MSW
+ Playwright
```

Đây là sự cân bằng tốt giữa tốc độ, độ tin cậy và công sức cấu hình.

### Tài liệu tham khảo

- [Jest configuration](https://jestjs.io/docs/configuration)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library user-event](https://testing-library.com/docs/user-event/intro/)
- [MSW documentation](https://mswjs.io/docs/)
- [Playwright documentation](https://playwright.dev/docs/intro)

## Lưu ý

Không nên viết quá nhiều E2E vì chúng chậm và dễ flaky. Chỉ dùng Playwright cho các luồng nghiệp vụ quan trọng; phần lớn logic nên được bảo vệ bằng unit và integration test.
