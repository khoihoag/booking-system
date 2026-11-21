const app = require('./app')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
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

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE

mongoose.connect(DB).then(() => {
    console.log('connected...')
    startBookingLifecycleJob()
})

app.listen(3000, () => {
    console.log('start')
})


