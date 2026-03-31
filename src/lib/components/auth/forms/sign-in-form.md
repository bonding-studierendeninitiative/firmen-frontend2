# SignInForm Component

## Purpose

Provides user authentication through email/username and password, with support for additional features like remember me, two-factor authentication, and alternative authentication methods.

## Semantic Content

This form allows existing users to authenticate and access their accounts using their credentials. It supports various authentication flows and provides links to related authentication actions.

## Key Features

- **Credential Authentication**: Email or username with password
- **Remember Me**: Option to persist login session
- **Two-Factor Support**: Redirects to 2FA when required
- **Alternative Methods**: Links to forgot password, magic link, etc.
- **Validation**: Real-time field validation and error display
- **Accessibility**: Proper form semantics and keyboard navigation

## Form Fields

- **Email/Username**: Text input for user identifier
- **Password**: Secure password input with optional visibility toggle
- **Remember Me**: Checkbox for session persistence (optional)

## Component Tree

```
SignInForm
├── Form Container
│   ├── Email/Username Field
│   │   ├── Label
│   │   ├── Input
│   │   └── Error Message
│   ├── Password Field
│   │   ├── Label with Forgot Password Link
│   │   ├── Password Input
│   │   └── Error Message
│   ├── Remember Me Checkbox (optional)
│   ├── CAPTCHA Component (optional)
│   └── Submit Button
└── Alternative Actions
    ├── Forgot Password Link
    ├── Magic Link Button
    └── Email OTP Button
```

## Validation Rules

- Email/Username is required
- Email must be valid format (when using email)
- Password is required
- Password must meet security requirements

## Actions

- Submit credentials for authentication
- Toggle password visibility
- Navigate to forgot password flow
- Switch to alternative authentication methods
- Handle two-factor authentication redirect
- Display authentication errors

## Error Handling

- Invalid credentials
- Account locked/suspended
- Network/server errors
- Validation errors
- Rate limiting
