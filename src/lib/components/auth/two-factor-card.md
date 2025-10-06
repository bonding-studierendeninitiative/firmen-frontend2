# TwoFactorCard Component

## Purpose

Manages two-factor authentication (2FA) settings including setup, configuration, and backup codes management.

## Semantic Content

This component handles 2FA management by:

- Enabling and disabling two-factor authentication
- Configuring various 2FA methods (TOTP, SMS, email)
- Managing backup codes and recovery options
- Providing 2FA security status and recommendations

## Key Features

- **2FA Status**: Current authentication level display
- **Setup Wizard**: Step-by-step 2FA configuration
- **Method Selection**: Multiple 2FA options available
- **Backup Codes**: Recovery code generation and management
- **Device Management**: Trusted device configuration

## Component Tree

```
TwoFactorCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Security Level Badge
│   │   └── 2FA Status Toggle
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Status Overview
│   │   │   ├── 2FA Enabled Status
│   │   │   │   ├── Enabled Icon
│   │   │   │   ├── Security Level
│   │   │   │   └── Last Setup Date
│   │   │   ├── Active Methods
│   │   │   │   ├── Primary Method
│   │   │   │   ├── Backup Methods
│   │   │   │   └── Method Status
│   │   │   └── Security Score
│   │   ├── 2FA Methods (when disabled)
│   │   │   ├── Authenticator App
│   │   │   │   ├── Method Description
│   │   │   │   ├── Setup Button
│   │   │   │   └── QR Code Area
│   │   │   ├── SMS Authentication
│   │   │   │   ├── Phone Number Input
│   │   │   │   ├── Country Code Selector
│   │   │   │   └── Verify Button
│   │   │   ├── Email Authentication
│   │   │   │   ├── Email Address Display
│   │   │   │   ├── Send Code Button
│   │   │   │   └── Code Input Field
│   │   │   └── Hardware Keys
│   │   │       ├── Key Registration
│   │   │       └── Compatible Keys List
│   │   ├── Setup Process (when configuring)
│   │   │   ├── Step Indicator
│   │   │   ├── Current Step Content
│   │   │   │   ├── QR Code Display
│   │   │   │   ├── Manual Entry Code
│   │   │   │   ├── App Instructions
│   │   │   │   └── Verification Code Input
│   │   │   ├── Navigation Buttons
│   │   │   │   ├── Previous Step
│   │   │   │   ├── Next Step
│   │   │   │   └── Complete Setup
│   │   │   └── Setup Progress
│   │   ├── Active 2FA Management (when enabled)
│   │   │   ├── Current Methods
│   │   │   │   └── Method Items (multiple)
│   │   │   │       ├── Method Icon
│   │   │   │       ├── Method Name
│   │   │   │       ├── Status Badge
│   │   │   │       ├── Last Used
│   │   │   │       └── Actions
│   │   │   │           ├── Test Method
│   │   │   │           ├── Remove Method
│   │   │   │           └── Set as Primary
│   │   │   ├── Add New Method
│   │   │   └── Method Settings
│   │   ├── Backup Codes
│   │   │   ├── Codes List
│   │   │   │   └── Code Items (multiple)
│   │   │   │       ├── Recovery Code
│   │   │   │       ├── Used Status
│   │   │   │       └── Copy Button
│   │   │   ├── Generate New Codes
│   │   │   ├── Download Codes
│   │   │   └── Print Codes
│   │   ├── Action Buttons
│   │   │   ├── Enable 2FA
│   │   │   ├── Disable 2FA
│   │   │   ├── Reset 2FA
│   │   │   └── Emergency Access
│   │   └── Security Warnings
│   │       ├── Method Recommendations
│   │       └── Security Tips
│   └── Recovery Information
```

## 2FA Methods

- TOTP authenticator apps
- SMS text message codes
- Email verification codes
- Hardware security keys
- Backup recovery codes

## Setup Process

- Method selection and configuration
- QR code scanning for TOTP
- Phone number verification for SMS
- Hardware key registration
- Backup code generation

## Security Management

- Primary method designation
- Backup method configuration
- Recovery code management
- Method testing and validation
- Emergency access procedures

## Actions

- Enable/disable 2FA
- Configure 2FA methods
- Generate QR codes
- Verify setup codes
- Manage backup codes
- Test authentication methods
- Handle method removal
- Provide emergency recovery
