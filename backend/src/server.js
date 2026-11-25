const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')
const db = require('./config/database')

const bookingLifecycleService = require('./service/BookingLifecycleService')


// Vấn đề khi  dùng setTimeOut không dùng đệ quy, khi query db quá 60s setTimeOut không đợi mà tiếp tục chạy gây ra chồng chéo  
function startBookingLifecycleJob() {
  const runJob = async () => {
    try {
      await bookingLifecycleService.expirePendingBookings();
      await bookingLifecycleService.completeFinishedBookings();
    } catch (error) {
      console.error('Booking lifecycle job failed:', error);
    } finally {
      // Đợi xong hẳn rồi mới hẹn giờ 60s cho lần chạy kế tiếp
      setTimeout(runJob, 60 * 1000);
    }
  };

  runJob(); // Chạy ngay 1 lần lúc server vừa bật lên để dọn dẹp các đơn cũ trong lúc server tắt
} 

async function startServer () {
  try {
        console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
});
    await db.query('SELECT 1')
    console.log('MYSQL connected ...')

    startBookingLifecycleJob()

    const PORT = process.env.PORT || 3000

    app.listen(3000, () => {
      console.log(`Server running on port: ${PORT}`)
    })
  } catch (error) {
    console.log("Don't connected to MYSQL: ", error)
    process.exit(1)
  }
}

startServer()

