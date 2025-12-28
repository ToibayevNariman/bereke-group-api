// DBML for Verity Group backend (PostgreSQL)
// Docs: https://dbml.dbdiagram.io/docs

Enum user_type {
  CLIENT
  EMPLOYEE
  SYSTEM_ADMIN
}

Enum employee_status {
  WORKING
  NOT_WORKING
}

Enum identity_type {
  PHONE
}

Enum otp_channel {
  SMS
}

Enum otp_status {
  PENDING
  VERIFIED
  EXPIRED
  LOCKED
  CANCELED
}

Enum refresh_status {
  ACTIVE
  REVOKED
  ROTATED
  EXPIRED
}

Table users {
  id uuid [pk]
  user_type user_type [not null]
  is_active boolean [not null, default: true]
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table person_profiles {
  id uuid [pk]
  user_id uuid [not null, unique, ref: > users.id]
  last_name varchar(100) [not null]
  first_name varchar(100) [not null]
  middle_name varchar(100) // optional
  iin char(12) [not null, unique, note: 'IIN (Kazakhstan), stored as 12-char string']
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table clients {
  id uuid [pk]
  user_id uuid [not null, unique, ref: > users.id]
  // place for client-specific fields later (e.g., address, contract info, etc.)
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table employees {
  id uuid [pk]
  user_id uuid [not null, unique, ref: > users.id]
  hire_date date [not null]
  fire_date date
  status employee_status [not null, default: 'WORKING']
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table roles {
  id uuid [pk]
  code varchar(50) [not null, unique, note: 'ADMIN, ACCOUNTANT, HR, FOREMAN, SITE_MANAGER, SENIOR_ON_SITE, PROCUREMENT']
  name varchar(100) [not null]
  description text
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table user_roles {
  user_id uuid [not null, ref: > users.id]
  role_id uuid [not null, ref: > roles.id]
  assigned_at timestamptz [not null]
  assigned_by uuid [ref: > users.id, note: 'who assigned the role']
  indexes {
    (user_id, role_id) [unique]
    (role_id)
  }
}

Table auth_identities {
  id uuid [pk]
  user_id uuid [not null, ref: > users.id]
  type identity_type [not null, default: 'PHONE']
  phone_e164 varchar(20) [not null, note: 'E.164 format: +7705...']
  is_primary boolean [not null, default: true]
  is_verified boolean [not null, default: true]

  // brute-force protection / rate limiting state
  failed_attempts int [not null, default: 0]
  locked_until timestamptz
  last_otp_sent_at timestamptz

  created_at timestamptz [not null]
  updated_at timestamptz [not null]

  indexes {
    (phone_e164) [unique]
    (user_id)
    (locked_until)
  }
}

Table otp_challenges {
  id uuid [pk]
  identity_id uuid [not null, ref: > auth_identities.id]
  channel otp_channel [not null, default: 'SMS']
  code_hash varchar(255) [not null, note: 'Hash of OTP, never store code in plain']
  expires_at timestamptz [not null]
  status otp_status [not null, default: 'PENDING']

  // anti-bruteforce counters per challenge
  verify_attempts int [not null, default: 0]
  max_attempts int [not null, default: 5]

  // request context
  request_ip inet
  user_agent text

  created_at timestamptz [not null]
  verified_at timestamptz

  indexes {
    (identity_id)
    (expires_at)
    (status)
  }
}

Table otp_attempts {
  id uuid [pk]
  challenge_id uuid [not null, ref: > otp_challenges.id]
  attempted_at timestamptz [not null]
  ip inet
  is_success boolean [not null]
  reason varchar(50) [note: 'e.g. WRONG_CODE, EXPIRED, LOCKED, TOO_MANY_ATTEMPTS']
  indexes {
    (challenge_id)
    (attempted_at)
  }
}

Table refresh_tokens {
  id uuid [pk]
  user_id uuid [not null, ref: > users.id]
  token_hash varchar(255) [not null, note: 'Hash of refresh token (store only hash)']
  status refresh_status [not null, default: 'ACTIVE']

  issued_at timestamptz [not null]
  expires_at timestamptz [not null]
  revoked_at timestamptz
  rotated_to uuid [ref: > refresh_tokens.id, note: 'token rotation chain']
  replaced_by uuid [ref: > refresh_tokens.id]

  // device/session context
  ip inet
  user_agent text
  device_id varchar(100)

  indexes {
    (user_id)
    (expires_at)
    (status)
    (token_hash) [unique]
  }
}

Table system_admin_credentials {
  id uuid [pk]
  user_id uuid [not null, unique, ref: > users.id]
  password_hash varchar(255) [not null]
  password_updated_at timestamptz
  last_login_at timestamptz
  created_at timestamptz [not null]

  note: 'Only for SYSTEM_ADMIN user_type. Enforce one system admin via unique constraint + business rule.'
}
