# PasskeyButton Component

## Purpose

Provides WebAuthn/passkey authentication functionality, allowing users to sign in using biometric authentication, hardware security keys, or platform authenticators.

## Semantic Content

This button enables modern passwordless authentication through WebAuthn technology, supporting fingerprint, face recognition, hardware keys, and other secure authenticators.

## Key Features

- **WebAuthn Support**: Uses Web Authentication API
- **Biometric Authentication**: Fingerprint, face recognition, etc.
- **Hardware Keys**: USB/NFC security keys support
- **Platform Authenticators**: Built-in device authenticators
- **Passwordless**: No passwords required

## Component Tree

```
PasskeyButton
├── Button Container
│   ├── Passkey Icon
│   ├── Action Text
│   │   ├── "Sign in with Passkey"
│   │   └── "Create Passkey"
│   └── Loading State (conditional)
```

## Button States

- **Sign In**: "Sign in with Passkey" (for existing users)
- **Create**: "Create Passkey" (for new passkey setup)
- **Loading**: Shows progress during authentication
- **Unavailable**: When WebAuthn is not supported

## WebAuthn Process

### Registration (Creating Passkey)

1. User initiates passkey creation
2. System generates challenge
3. Browser prompts for authenticator
4. User provides biometric/PIN
5. Passkey created and stored

### Authentication (Using Passkey)

1. User initiates passkey sign-in
2. System requests authentication
3. Browser prompts for authenticator
4. User provides biometric/PIN
5. Authentication completed

## Supported Authenticators

- **Biometric**: Fingerprint, face recognition, iris scan
- **Hardware Keys**: YubiKey, SoloKey, etc.
- **Platform**: Windows Hello, Touch ID, Android biometric
- **PIN/Pattern**: Device unlock methods

## Actions

- Initiate passkey creation
- Perform passkey authentication
- Handle WebAuthn challenges
- Manage authentication errors
- Provide fallback options

## Error Handling

- WebAuthn not supported
- No authenticators available
- User cancellation
- Authenticator failures
- Network/server errors
- Invalid credentials

## Browser Compatibility

- Modern browsers with WebAuthn support
- Progressive enhancement for unsupported browsers
- Graceful degradation to other auth methods
- Feature detection and user guidance
