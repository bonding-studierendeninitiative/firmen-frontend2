# EmailOTPButton Component

## Purpose

Provides a toggle button that allows users to switch between email OTP authentication and traditional password-based authentication methods.

## Semantic Content

This button component enables users to choose their preferred authentication method by switching between email-based one-time passwords and conventional password login.

## Key Features

- **Method Switching**: Toggles between OTP and password auth
- **Visual Indicators**: Shows current authentication method
- **Accessibility**: Clear labeling of authentication options
- **State Awareness**: Displays appropriate text based on current mode

## Component Tree

```
EmailOTPButton
├── Button Container
│   ├── Method Icon
│   │   ├── Mail Icon (for OTP mode)
│   │   └── Lock Icon (for password mode)
│   ├── Action Text
│   │   ├── "Sign in with Email OTP"
│   │   └── "Sign in with Password"
│   └── Loading State (conditional)
```

## Button States

- **To OTP Mode**: "Sign in with Email OTP" (when in password mode)
- **To Password Mode**: "Sign in with Password" (when in OTP mode)
- **Loading**: Shows loading indicator during transition
- **Disabled**: When switching is not available

## Actions

- Switch to email OTP authentication flow
- Switch to password authentication flow
- Update form view and available fields
- Maintain user context during switch

## Navigation Flow

- From sign-in form to email OTP form
- From email OTP form back to sign-in form
- Preserves any entered email address
- Maintains URL state and parameters

## Use Cases

- Users who prefer passwordless authentication
- Users who forgot their password
- Users with password managers who want OTP
- Security-conscious users preferring OTP
- Mobile users wanting simpler authentication

## Integration

- Works with AuthForm component
- Integrates with routing system
- Maintains authentication state
- Preserves user context and redirects
