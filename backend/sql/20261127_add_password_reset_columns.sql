ALTER TABLE users
  DROP COLUMN IF EXISTS password_reset_token,
  DROP COLUMN IF EXISTS password_reset_expires,
  ADD COLUMN IF NOT EXISTS passwordResetToken VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS passwordResetExpries DATETIME NULL;


ALTER TABLE pitches
  ADD COLUMN imageUrl VARCHAR(500) NULL DEFAULT '',
  ADD COLUMN pitchType ENUM('5-a-side', '7-a-side', '11-a-side')
    NOT NULL DEFAULT '7-a-side',
  ADD COLUMN rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  ADD COLUMN description TEXT NULL,
  ADD COLUMN facilities JSON NULL,
  ADD COLUMN pricePerHour DECIMAL(12,2) NOT NULL DEFAULT 200000;

ALTER TABLE pitches
  MODIFY COLUMN status ENUM('active', 'maintenance', 'inactive')
    NOT NULL DEFAULT 'active';