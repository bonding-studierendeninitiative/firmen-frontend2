# EmailOTPForm Component

## Purpose

Provides passwordless authentication through email-based one-time passwords, allowing users to sign in without remembering passwords.

## Semantic Content

This component implements a two-step passwordless authentication flow: first collecting the user's email address, then verifying a code sent to that email address.

## Key Features

- **Two-Step Process**: Email collection followed by code verification
- **Passwordless Authentication**: No password required
- **OTP Delivery**: Sends verification codes via email
- **Code Validation**: Verifies entered codes against sent codes
- **Resend Capability**: Allows resending codes if not received

## Form Fields

### Step 1 - Email Collection

- **Email**: Email address for code delivery

### Step 2 - Code Verification

- **Verification Code**: 6-digit OTP code from email

## Component Tree

```
EmailOTPForm
├── Email Collection Step
│   ├── Email Field
│   │   ├── Label
│   │   ├── Input
│   │   └── Error Message
│   └── Send Code Button
└── Code Verification Step
    ├── Code Input Field
    │   ├── Label
    │   ├── OTP Input with Separators
    │   └── Error Message
    ├── Verify Button
    ├── Resend Code Button
    └── Back to Email Button
```

## Process Flow

1. User enters email address
2. System sends OTP code to email
3. User receives email with code
4. User enters verification code
5. System validates code
6. Authentication completed

## OTP Input Features

- 6-digit code input
- Automatic progression between digits
- Auto-submit when complete
- Keyboard navigation support
- Visual separators (optional)

## Actions

- Submit email for code delivery
- Send OTP code via email
- Verify entered code
- Resend code if needed
- Navigate back to email step
- Complete authentication

## Validation Rules

- Email is required and valid format
- Verification code must be 6 digits
- Code must be valid and not expired

## Error Handling

- Invalid email format
- Email delivery failures
- Invalid verification codes
- Expired codes
- Rate limiting (too many requests)
- Network/server errors

## Success Flow

- Email sent confirmation
- Code verification success
- Authentication completion
- Redirect to intended destination
