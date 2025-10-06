# MagicLinkForm Component

## Purpose

Enables passwordless authentication through magic links sent via email, providing a secure and convenient way to sign in without passwords.

## Semantic Content

This form allows users to request a magic link that, when clicked, automatically signs them into their account without requiring a password.

## Key Features

- **Passwordless Login**: No password required
- **Email-based Authentication**: Uses secure tokens sent via email
- **One-Click Access**: Single click authentication from email
- **Security**: Time-limited and single-use tokens
- **Callback Handling**: Processes magic link clicks

## Form Fields

- **Email**: Email address to receive the magic link

## Component Tree

```
MagicLinkForm
├── Form Container
│   ├── Email Field
│   │   ├── Label
│   │   ├── Input
│   │   └── Error Message
│   └── Send Magic Link Button
├── Success Message
│   ├── Confirmation Text
│   ├── Email Instructions
│   └── Resend Link Option
└── Back to Sign-in Link
```

## Process Flow

1. User enters email address
2. System generates secure magic link
3. Magic link sent to user's email
4. User clicks link in email
5. System validates token
6. User automatically signed in
7. Redirect to intended destination

## Magic Link Features

- Time-limited tokens (usually 10-15 minutes)
- Single-use authentication
- Secure token generation
- Device-independent access
- No password storage required

## Actions

- Submit email for magic link
- Send magic link via email
- Process magic link clicks
- Validate authentication tokens
- Complete automatic sign-in
- Resend magic link if needed

## Validation Rules

- Email is required
- Email must be valid format
- Magic link tokens must be valid and not expired

## Error Handling

- Invalid email format
- Email delivery failures
- Expired magic links
- Invalid or used tokens
- Network/server errors
- Rate limiting

## Success States

- Magic link sent confirmation
- Instructions for checking email
- Automatic sign-in completion
- Redirect to intended page

## Security Considerations

- Tokens expire after time limit
- Single-use tokens prevent reuse
- Secure token generation
- HTTPS-only magic links
