# AuthCard Component

## Purpose

A main authentication wrapper component that provides dynamic view switching between different authentication flows and displays appropriate forms based on the current authentication state and URL path.

## Semantic Content

The component serves as a central hub for authentication, automatically determining which authentication form to display based on:

- Current URL path (sign-in, sign-up, forgot-password, etc.)
- User authentication state
- Available authentication methods
- Organization invitation status

## Key Features

- **Dynamic View Switching**: Automatically shows the correct authentication form
- **Back Navigation**: Provides navigation back to sign-in from other flows
- **Loading States**: Shows loading indicators during authentication processes
- **Error Handling**: Displays authentication errors and validation messages
- **Social Provider Integration**: Supports multiple social authentication providers
- **Organization Context**: Handles organization invitations and switching

## Component Tree

```
AuthCard
├── Card Header
│   ├── Back Button (conditional)
│   ├── Title
│   └── Description
├── Card Content
│   ├── AuthForm (main authentication form)
│   ├── Social Provider Buttons
│   ├── Divider/Separator
│   └── Alternative Action Links
├── Card Footer
│   ├── Terms/Privacy Links
│   └── Alternative Flow Buttons
└── Loading Overlay (conditional)
```

## States

- **Sign In**: Email/password or social login
- **Sign Up**: Registration with optional fields
- **Forgot Password**: Password reset request
- **Reset Password**: New password creation
- **Two Factor**: 2FA verification
- **Email OTP**: Email-based verification
- **Magic Link**: Passwordless authentication
- **Organization Invitation**: Accept organization invite
- **Settings Views**: Various account management interfaces

## Form Fields (varies by state)

- Email address
- Password
- Confirm password
- Name
- Username
- Profile image/avatar
- Custom additional fields
- OTP codes
- Organization details

## Actions

- Submit authentication forms
- Switch between authentication methods
- Navigate between different auth flows
- Handle social provider authentication
- Accept organization invitations
- Redirect to success/callback URLs
