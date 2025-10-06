# VerifyEmailCard Component

## Purpose

Manages email verification process including sending verification emails, entering verification codes, and confirming email addresses.

## Semantic Content

This component handles email verification by:

- Displaying email verification status and requirements
- Sending verification emails to user's address
- Processing verification code entry and validation
- Confirming successful email verification

## Key Features

- **Verification Status**: Current email verification state
- **Code Sending**: Request verification email functionality
- **Code Entry**: Input field for verification codes
- **Resend Options**: Resend verification email capability
- **Success Confirmation**: Verification completion feedback

## Component Tree

```
VerifyEmailCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Verification Status Badge
│   │   └── Email Address Display
│   ├── Card Content
│   │   ├── Loading State (when processing)
│   │   ├── Verification Status
│   │   │   ├── Current Status
│   │   │   │   ├── Verified Icon
│   │   │   │   ├── Pending Icon
│   │   │   │   └── Unverified Warning
│   │   │   ├── Email Address
│   │   │   │   ├── Primary Email
│   │   │   │   ├── Verification Status
│   │   │   │   └── Change Email Link
│   │   │   └── Verification Timeline
│   │   │       ├── Last Attempt
│   │   │       ├── Expiration Time
│   │   │       └── Attempts Remaining
│   │   ├── Send Verification Section
│   │   │   ├── Send Instructions
│   │   │   │   ├── Process Description
│   │   │   │   ├── Email Delivery Info
│   │   │   │   └── Spam/Junk Warning
│   │   │   ├── Send Button
│   │   │   │   ├── Send Verification Email
│   │   │   │   ├── Loading State
│   │   │   │   └── Cooldown Timer
│   │   │   └── Email Status
│   │   │       ├── Sent Confirmation
│   │   │       ├── Delivery Status
│   │   │       └── Error Messages
│   │   ├── Code Entry Section
│   │   │   ├── Instructions
│   │   │   │   ├── Check Email Message
│   │   │   │   ├── Code Format Info
│   │   │   │   └── Expiration Warning
│   │   │   ├── Verification Code Input
│   │   │   │   ├── Code Input Field
│   │   │   │   ├── Format Validation
│   │   │   │   ├── Auto-Submit Option
│   │   │   │   └── Character Counter
│   │   │   ├── Code Actions
│   │   │   │   ├── Verify Code Button
│   │   │   │   ├── Clear Code Button
│   │   │   │   └── Auto-Paste Option
│   │   │   └── Code Status
│   │   │       ├── Validation Progress
│   │   │       ├── Invalid Code Error
│   │   │       └── Expired Code Warning
│   │   ├── Alternative Options
│   │   │   ├── Resend Code
│   │   │   │   ├── Resend Button
│   │   │   │   ├── Cooldown Period
│   │   │   │   └── Attempt Limits
│   │   │   ├── Different Email
│   │   │   │   ├── Change Email Option
│   │   │   │   └── Email Update Link
│   │   │   └── Manual Verification
│   │   │       ├── Contact Support
│   │   │       └── Alternative Methods
│   │   ├── Success State
│   │   │   ├── Verification Confirmed
│   │   │   ├── Success Icon
│   │   │   ├── Confirmation Message
│   │   │   └── Next Steps
│   │   └── Form Validation
│   │       ├── Error Display
│   │       ├── Success Messages
│   │       └── Rate Limiting Info
│   └── Help Information
│       ├── Troubleshooting Tips
│       ├── Email Delivery Issues
│       └── Support Contact
```

## Verification Process

- Email verification code generation
- Secure email delivery
- Code format and expiration handling
- Validation and confirmation
- Success state management

## Code Management

- Time-limited verification codes
- Secure code generation
- Rate limiting and attempt tracking
- Code expiration handling
- Resend functionality with cooldowns

## User Experience

- Clear instructions and guidance
- Visual feedback and progress indication
- Error handling and recovery options
- Alternative verification methods
- Help and support resources

## Actions

- Send verification email
- Validate verification codes
- Process email confirmation
- Handle verification errors
- Resend verification emails
- Update verification status
- Manage rate limiting
- Provide user feedback
