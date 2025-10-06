# ResetPasswordForm Component

## Purpose

Enables users to set a new password after clicking a password reset link from their email, completing the password recovery process.

## Semantic Content

This form is accessed via a secure token from a password reset email and allows users to create a new password for their account.

## Key Features

- **Token Validation**: Verifies reset token from URL
- **New Password Creation**: Secure password input with requirements
- **Password Confirmation**: Optional password confirmation field
- **Security Requirements**: Enforces password strength rules
- **Auto-redirect**: Redirects to sign-in after successful reset

## Form Fields

- **New Password**: Secure password input with strength requirements
- **Confirm Password**: Password confirmation (optional)

## Component Tree

```
ResetPasswordForm
├── Form Container
│   ├── New Password Field
│   │   ├── Label
│   │   ├── Password Input with Toggle
│   │   └── Error Message
│   ├── Confirm Password Field (optional)
│   │   ├── Label
│   │   ├── Password Input with Toggle
│   │   └── Error Message
│   └── Submit Button
└── Success/Error Messages
```

## Validation Rules

- New password is required
- Password must meet strength requirements
- Confirm password must match (if enabled)
- Reset token must be valid and not expired

## Token Handling

- Extracts reset token from URL parameters
- Validates token before showing form
- Handles expired or invalid tokens
- Redirects to forgot password if token is invalid

## Actions

- Validate reset token on load
- Submit new password
- Confirm password reset
- Redirect to sign-in page
- Handle reset failures

## Process Flow

1. User clicks reset link from email
2. Component validates reset token
3. User enters new password
4. Password confirmation (if enabled)
5. Submit new password
6. Success confirmation
7. Redirect to sign-in

## Error Handling

- Invalid or expired reset token
- Password requirements not met
- Password confirmation mismatch
- Network/server errors
- Token already used

## Success Flow

- Password successfully reset
- Automatic redirect to sign-in
- Success message display
