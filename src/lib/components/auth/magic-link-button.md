# MagicLinkButton Component

## Purpose

Provides a toggle button that allows users to switch between magic link authentication and other authentication methods.

## Semantic Content

This button enables users to choose magic link authentication as an alternative to password or OTP-based authentication, offering a passwordless option.

## Key Features

- **Method Switching**: Toggles to magic link authentication
- **Visual Indicators**: Shows magic link option clearly
- **Accessibility**: Clear labeling for magic link auth
- **State Management**: Maintains authentication context

## Component Tree

```
MagicLinkButton
├── Button Container
│   ├── Magic Link Icon
│   ├── Action Text
│   │   └── "Sign in with Magic Link"
│   └── Loading State (conditional)
```

## Button States

- **Available**: "Sign in with Magic Link"
- **Loading**: Shows loading indicator during transition
- **Disabled**: When magic link is not available

## Actions

- Switch to magic link authentication flow
- Navigate to magic link form
- Preserve user context during switch
- Maintain authentication state

## Navigation Flow

- From sign-in form to magic link form
- From other auth forms to magic link
- Preserves entered email address
- Maintains URL parameters and redirects

## Use Cases

- Users who prefer passwordless authentication
- Users who want one-click email access
- Security-conscious users avoiding password storage
- Mobile users wanting simplified authentication
- Users without password managers

## Integration

- Works with AuthForm routing
- Integrates with magic link form
- Maintains user session context
- Preserves redirect destinations
