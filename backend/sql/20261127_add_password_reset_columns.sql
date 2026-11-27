ALTER TABLE users
  DROP COLUMN IF EXISTS password_reset_token,
  DROP COLUMN IF EXISTS password_reset_expires,
  ADD COLUMN IF NOT EXISTS passwordResetToken VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS passwordResetExpries DATETIME NULL;
