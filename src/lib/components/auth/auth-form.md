# AuthForm Component

## Purpose

A container component that dynamically renders the appropriate authentication form based on the current view state, handling all form switching logic and state management.

## Semantic Content

This component acts as a form router, determining which specific authentication form to display based on the current authentication flow. It manages the overall form state and provides consistent behavior across all authentication methods.

## Key Features

- **Form Routing**: Renders correct form based on current view
- **State Management**: Manages loading states across all forms
- **Validation**: Provides consistent form validation
- **Error Handling**: Centralizes error display and handling
- **Accessibility**: Ensures proper form accessibility

## Component Tree

```
AuthForm
├── SignInForm (email/password authentication)
├── SignUpForm (user registration)
├── ForgotPasswordForm (password reset request)
├── ResetPasswordForm (new password creation)
├── TwoFactorForm (2FA verification)
├── EmailOTPForm (email OTP verification)
├── MagicLinkForm (passwordless authentication)
├── RecoverAccountForm (account recovery)
├── AuthCallback (OAuth callback handling)
└── SignOut (logout functionality)
```

## Supported Views

- Sign In
- Sign Up
- Forgot Password
- Reset Password
- Two Factor Authentication
- Email OTP Verification
- Magic Link Authentication
- Account Recovery
- OAuth Callback
- Sign Out

## Common Form Elements

- Form containers with proper semantics
- Field validation and error display
- Loading states and disabled states
- Submit buttons with loading indicators
- Form-specific actions and links
- Consistent styling and layout

## Actions

- Submit forms with appropriate data
- Handle form validation
- Display validation errors
- Manage loading states
- Navigate between forms
- Handle authentication success/failure
