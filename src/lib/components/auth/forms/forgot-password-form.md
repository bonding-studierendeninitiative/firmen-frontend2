# ForgotPasswordForm Component

## Purpose

Allows users to request password reset emails when they cannot remember their login credentials, initiating the password recovery process.

## Semantic Content

This form provides a simple interface for users to request password reset instructions via email. It handles the initial step of the password recovery flow.

## Key Features

- **Email Collection**: Captures user email for password reset
- **Email Validation**: Ensures valid email format
- **CAPTCHA Protection**: Prevents automated abuse
- **Success Feedback**: Confirms reset email was sent
- **Error Handling**: Manages various error scenarios

## Form Fields

- **Email**: Email address associated with the account

## Component Tree

```
ForgotPasswordForm
├── Form Container
│   ├── Email Field
│   │   ├── Label
│   │   ├── Input
│   │   └── Error Message
│   ├── CAPTCHA Component (optional)
│   └── Submit Button
└── Success/Error Messages
```

## Validation Rules

- Email is required
- Email must be valid format

## Actions

- Submit email for password reset
- Send password reset email
- Display success confirmation
- Handle submission errors
- Navigate back to sign-in

## Process Flow

1. User enters email address
2. Form validates email format
3. CAPTCHA verification (if enabled)
4. Submit request to server
5. Display success message
6. User receives reset email

## Error Handling

- Invalid email format
- Email not found in system
- Rate limiting (too many requests)
- Network/server errors
- CAPTCHA verification failures

## Success States

- Email sent confirmation
- Instructions for next steps
- Link back to sign-in form
