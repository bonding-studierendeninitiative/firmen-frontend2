# AuthCallback Component

## Purpose

Handles OAuth authentication callbacks and redirects users appropriately after successful or failed authentication attempts from external providers.

## Semantic Content

This component processes the return journey from external authentication providers (Google, GitHub, etc.) and manages the post-authentication flow, including session establishment and user redirection.

## Key Features

- **OAuth Callback Handling**: Processes authentication responses from external providers
- **Session Management**: Establishes user sessions after successful authentication
- **Redirect Logic**: Navigates users to intended destinations
- **Error Handling**: Manages authentication failures and displays appropriate messages
- **Loading States**: Shows progress during callback processing

## Component Tree

```
AuthCallback
├── Loading Indicator
├── Success Message (conditional)
├── Error Message (conditional)
└── Redirect Handler
```

## Process Flow

1. Receive authentication response from external provider
2. Validate authentication tokens/codes
3. Establish user session
4. Handle any authentication errors
5. Redirect to intended destination or default location

## States

- **Loading**: Processing authentication callback
- **Success**: Authentication completed successfully
- **Error**: Authentication failed or was cancelled
- **Redirecting**: Navigating to final destination

## Actions

- Process OAuth tokens/authorization codes
- Establish authenticated session
- Handle authentication errors
- Redirect to success URL or default location
- Display status messages to user
