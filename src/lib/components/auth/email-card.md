# EmailCard Component

## Purpose

Manages user email settings including primary email, email verification, and email change functionality.

## Semantic Content

This component handles email management by:

- Displaying current email address and status
- Enabling email address changes with verification
- Managing email verification processes
- Providing email security and notification settings

## Key Features

- **Email Display**: Current email with verification status
- **Email Change**: Secure email update process
- **Verification Flow**: Email confirmation handling
- **Security Notifications**: Email-based security alerts
- **Backup Emails**: Multiple email management

## Component Tree

```
EmailCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Verification Badge
│   │   └── Primary Email Label
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Current Email Section
│   │   │   ├── Email Display
│   │   │   │   ├── Email Address
│   │   │   │   ├── Verification Status
│   │   │   │   │   ├── Verified Icon
│   │   │   │   │   ├── Pending Icon
│   │   │   │   │   └── Unverified Warning
│   │   │   │   └── Primary Badge
│   │   │   ├── Verification Actions
│   │   │   │   ├── Resend Verification
│   │   │   │   ├── Mark as Verified
│   │   │   │   └── Verification Status
│   │   │   └── Change Email Button
│   │   ├── Email Change Form
│   │   │   ├── New Email Field
│   │   │   │   ├── Label
│   │   │   │   ├── Input Element
│   │   │   │   ├── Format Validation
│   │   │   │   └── Availability Check
│   │   │   ├── Current Password Field
│   │   │   │   ├── Label
│   │   │   │   ├── Input (hidden)
│   │   │   │   └── Security Note
│   │   │   ├── Verification Method
│   │   │   │   ├── Email Confirmation
│   │   │   │   └── SMS Backup (if available)
│   │   │   └── Form Actions
│   │   │       ├── Send Verification
│   │   │       ├── Cancel Change
│   │   │       └── Progress Indicator
│   │   ├── Additional Emails
│   │   │   ├── Backup Email List
│   │   │   │   └── Email Items (multiple)
│   │   │   │       ├── Email Address
│   │   │   │       ├── Verification Status
│   │   │   │       ├── Set as Primary
│   │   │   │       └── Remove Email
│   │   │   └── Add Email Button
│   │   ├── Email Settings
│   │   │   ├── Notification Preferences
│   │   │   ├── Security Alerts
│   │   │   └── Marketing Emails
│   │   └── Form Validation
│   │       ├── Error Messages
│   │       └── Success Notifications
│   └── Email Policy Info
```

## Email Verification

- Verification status indicators
- Resend verification options
- Verification code handling
- Confirmation email tracking
- Manual verification override

## Email Change Process

- New email validation
- Current password verification
- Verification email sending
- Confirmation code entry
- Primary email switching

## Multiple Email Support

- Backup email addresses
- Primary email designation
- Email verification tracking
- Email removal functionality
- Cross-email notifications

## Actions

- Load current email settings
- Validate email format
- Check email availability
- Send verification emails
- Process email changes
- Manage email verification
- Update email preferences
- Handle email errors
