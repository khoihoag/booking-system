const assertSuccess = (response, statusCode = 200) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toEqual(
    expect.objectContaining({ status: expect.any(String) }),
  );
};

const assertError = (response, statusCode, message) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toEqual(
    expect.objectContaining({
      status: 'fail',
      message: message ? expect.stringContaining(message) : expect.any(String),
    }),
  );
};

const assertNoSensitiveFields = (value) => {
  expect(value).not.toHaveProperty('password');
  expect(value).not.toHaveProperty('passwordResetToken');
  expect(value).not.toHaveProperty('passwordResetExpires');
};

const assertPublicUser = (user) => {
  expect(user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      email: expect.any(String),
      role: expect.stringMatching(/^(user|pitch_owner|admin)$/),
    }),
  );
  assertNoSensitiveFields(user);
};

module.exports = {
  assertSuccess,
  assertError,
  assertNoSensitiveFields,
  assertPublicUser,
};
