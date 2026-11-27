CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,

    role ENUM('user', 'pitch_owner', 'admin')
        NOT NULL DEFAULT 'user',

    avatarUrl VARCHAR(500),

    city VARCHAR(255),
    bio TEXT,

    preferredType VARCHAR(100),
    position VARCHAR(100),
    preferredFoot VARCHAR(100),
    jerseyNumber INT,

    passwordChangeAt DATE,
    passwordResetToken CHAR(64),
    passwordResetExpires DATETIME,

    active TINYINT(1) DEFAULT 1,
    twoFactorEnabled TINYINT(1) DEFAULT 0,

    smsReminder TINYINT(1) DEFAULT 0,
    zaloNotification TINYINT(1) DEFAULT 0,
    promoAlerts TINYINT(1) DEFAULT 0,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pitches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    ownerId VARCHAR(36) NOT NULL,

    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),

    status ENUM('active', 'maintenance', 'inactive')
        NOT NULL DEFAULT 'active',

    imageUrl VARCHAR(500),

    pitchType ENUM('5-a-side', '7-a-side', '11-a-side')
        NOT NULL DEFAULT '7-a-side',

    rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
    description TEXT,
    facilities JSON,

    pricePerHour DECIMAL(12,2) NOT NULL DEFAULT 200000.00,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fkPitchesOwner
        FOREIGN KEY (ownerId)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE pitchImages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    pitchId VARCHAR(36) NOT NULL,

    imageUrl VARCHAR(500) NOT NULL,

    isPrimary TINYINT(1) NOT NULL DEFAULT 0,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fkPitchImagesPitch
        FOREIGN KEY (pitchId)
        REFERENCES pitches(id)
        ON DELETE CASCADE
);

CREATE TABLE pitchImages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    pitchId VARCHAR(36) NOT NULL,

    imageUrl VARCHAR(500) NOT NULL,

    isPrimary TINYINT(1) NOT NULL DEFAULT 0,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fkPitchImagesPitch
        FOREIGN KEY (pitchId)
        REFERENCES pitches(id)
        ON DELETE CASCADE
);

CREATE TABLE timeSlots (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    pitchId VARCHAR(36) NOT NULL,

    startTime TIME NOT NULL,
    endTime TIME NOT NULL,

    price DECIMAL(12,2) NOT NULL,

    isPeakHour TINYINT(1) NOT NULL DEFAULT 0,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fkTimeSlotsPitch
        FOREIGN KEY (pitchId)
        REFERENCES pitches(id)
        ON DELETE CASCADE
);

CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),

    userId VARCHAR(36) NOT NULL,

    bookingDate DATE NOT NULL,

    status ENUM(
        'pending',
        'confirmed',
        'cancelled',
        'refunded',
        'completed'
    ) NOT NULL DEFAULT 'pending',

    expiresAt DATETIME,
    paidAt DATETIME,
    refundedAt DATETIME,
    completedAt DATETIME,

    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fkBookingsUser
        FOREIGN KEY (userId)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idxPitchesOwnerId
ON pitches(ownerId);

CREATE INDEX idxPitchImagesPitchId
ON pitchImages(pitchId);

CREATE INDEX idxTimeSlotsPitchId
ON timeSlots(pitchId);

CREATE INDEX idxBookingsUserId
ON bookings(userId);

CREATE INDEX idxBookingsBookingDate
ON bookings(bookingDate);


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