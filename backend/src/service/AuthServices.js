const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const crypto = require("crypto");

const AppError = require("../utils/AppError");
const userRepository = require("./../repositories/UserRepository");
const sendEmail = require("../utils/Email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const correctPassword =  (candidatePassword, userPassword) => {
    return  bcrypt.compare(candidatePassword, userPassword)
}

const changedPassword = (user, JWTTimeStamp) => {
    if (user.passwordChangeAt) {
        const changedTimeStamp = parseInt(new Date(user.passwordChangeAt).getTime() / 1000, 10)
        return JWTTimeStamp < changedTimeStamp
    }
    return false
}

const createResetPasswordToken = (user) => {
    const resetToken = crypto.randomBytes(32).toString('hex')

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    return resetToken
}

// ====== SIGN UP ======
exports.signup = async (userData) => {
  if (userData.password_confirm !== userData.password) {
    throw new AppError("Mật khẩu không khớp", 400);
  }

  if (userData.password.length < 8) {
    throw new AppError("Mật khẩu có ít nhất 8 ký tự", 400);
  }

  userData.password = await bcrypt.hash(userData.password, 12);
  userData.password_confirm = undefined;

  const newUser = await userRepository.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  const token = signToken(newUser.id);
  return { user: newUser, token };
};


// ====== LOG IN ======
exports.login = async (email, password) => {
  if (!email || !password) {
    throw new AppError("Vui lòng nhập email và mật khẩu.", 400);
  }

  const user = await userRepository.findByEmail(email, true);
  if (!user || !(await correctPassword(password, user.password))) {
    throw new AppError("Email hoặc mật khẩu không chính xác.", 401);
  }

  // Hide password before returning
  user.password = undefined;

  const token = signToken(user.id);
  return { user, token };
};
// ===== PROTECT ====
exports.protect = async (token) => {
  if (!token) {
    throw new AppError(
      "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.",
      401,
    );
  }

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  const currentUser = await userRepository.findById(decoded.id);
  if (!currentUser) {
    throw new AppError(
      "Tài khoản không còn tồn tại. Vui lòng đăng nhập lại.",
      401,
    );
  }

  if (changedPassword(currentUser, decoded.iat)) {
    throw new AppError(
      "Mật khẩu vừa được thay đổi. Vui lòng đăng nhập lại.",
      401,
    );
  }

  return currentUser;
};

// ===== FORGOT PASSWORD =====
exports.forgotPassword = async (email, protocol, host) => {
  if (!email) {
    throw new AppError("Vui lòng nhập địa chỉ email.", 400);
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("Không tìm thấy tài khoản với email này.", 404);
  }

  const resetToken = createResetPasswordToken(user);
  await userRepository.saveUser(user);

  const resetURL = `${protocol}://${host}/api/user/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and password_confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await userRepository.saveUser(user);

    throw new AppError("Không thể gửi email. Vui lòng thử lại sau.", 500);
  }

  return resetToken;
};

// ===== RESET PASWORD =====
exports.resetPassword = async (token, password, password_confirm) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userRepository2.findByResetToken(hashedToken);
  if (!user) {
    throw new AppError("Mã xác thực không hợp lệ hoặc đã hết hạn.", 400);
  }

  user.password = password;
  user.password_confirm = password_confirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await userRepository.saveUser(user);

  const newToken = signToken(user.id);
  return { user, token: newToken };
};

// ===== UPDATE PASSWORD =====
exports.updatePassword = async (
  userId,
  passwordCurrent,
  password,
  password_confirm,
) => {
  if (password !== password_confirm) {
    throw new AppError("Mật khẩu xác nhận không khớp.", 401);
  }

  const user = await userRepository.findById(userId, true);
  if (!user) {
    throw new AppError("Không tìm thấy tài khoản.", 404);
  }

  if (!(await correctPassword(passwordCurrent, user.password))) {
    throw new AppError("Mật khẩu hiện tại không chính xác.", 401);
  }

  user.password = password;

  await userRepository.saveUser(user);

  const token = signToken(user.id);
  return { user, token };
};
