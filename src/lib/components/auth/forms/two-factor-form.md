# TwoFactorForm Component

## Purpose

Handles two-factor authentication verification using TOTP (authenticator apps), SMS codes, or backup codes to provide enhanced account security.

## Semantic Content

This form manages the second step of authentication after users have entered their primary credentials, requiring additional verification through various two-factor methods.

## Key Features

- **TOTP Support**: Time-based one-time passwords from authenticator apps
- **SMS Verification**: Text message-based verification codes
- **Backup Codes**: Emergency access codes for account recovery
- **QR Code Setup**: Display QR codes for authenticator app setup
- **Method Switching**: Toggle between different 2FA methods
- **Trust Device**: Option to trust the current device

## Form Fields

- **Verification Code**: 6-digit code input
- **Trust Device**: Checkbox to remember the device (optional)
- **Backup Code**: Alternative input for backup codes

## Component Tree

```
TwoFactorForm
├── Setup Section (if configuring 2FA)
│   ├── QR Code Display
│   ├── Secret Key Text
│   └── Setup Instructions
├── Verification Section
│   ├── Code Input Field
│   │   ├── Label
│   │   ├── OTP Input
│   │   └── Error Message
│   ├── Trust Device Checkbox (optional)
│   └── Submit Button
├── Alternative Methods
│   ├── SMS Code Button
│   ├── Backup Code Button
│   └── Method Switch Options
└── Help and Support Links
```

## 2FA Methods

- **TOTP (Time-based)**: Authenticator apps like Google Authenticator
- **SMS**: Text message verification codes
- **Backup Codes**: Pre-generated emergency codes
- **Recovery Options**: Alternative verification methods

## Validation Rules

- Verification code must be 6 digits
- Code must be valid and not expired
- Backup codes must be unused and valid

## Actions

- Submit verification code
- Resend SMS code
- Switch between 2FA methods
- Use backup codes
- Trust current device
- Complete 2FA setup
- Handle verification failures

## Setup Flow (New 2FA)

1. Display QR code for authenticator app
2. User scans QR code
3. User enters test code to verify setup
4. Generate and display backup codes
5. Enable 2FA for account

## Verification Flow (Existing 2FA)

1. Request verification code
2. User enters code from authenticator/SMS
3. Validate code
4. Optionally trust device
5. Complete authentication

## Error Handling

- Invalid verification codes
- Expired codes
- Rate limiting (too many attempts)
- SMS delivery failures
- Network/server errors
