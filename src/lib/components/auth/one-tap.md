# OneTap Component

## Purpose

Integrates Google One Tap sign-in functionality, providing a streamlined authentication experience for users with Google accounts.

## Semantic Content

This component displays Google's One Tap prompt, allowing users to sign in with a single click using their Google account without being redirected away from the current page.

## Key Features

- **Google Integration**: Official Google One Tap SDK
- **Seamless UX**: No page redirects required
- **Automatic Prompts**: Smart prompting based on user context
- **Account Selection**: Choose from multiple Google accounts
- **Privacy Focused**: Minimal data sharing

## Component Tree

```
OneTap
├── Google One Tap Container
│   ├── Account Prompt
│   │   ├── Google Account Avatar
│   │   ├── Account Name/Email
│   │   └── Continue Button
│   ├── Account Selector (multi-account)
│   └── Dismiss/Close Option
```

## One Tap Flow

1. Component loads Google One Tap SDK
2. Google evaluates user eligibility
3. One Tap prompt appears (if eligible)
4. User clicks to continue with Google account
5. Google provides ID token
6. System verifies token and creates session
7. User signed in automatically

## Eligibility Criteria

- User has Google account signed in
- User previously signed in to site with Google
- User hasn't dismissed One Tap recently
- Browser supports One Tap features
- Site meets Google's requirements

## Actions

- Initialize Google One Tap SDK
- Handle One Tap prompt display
- Process Google ID tokens
- Create authenticated sessions
- Handle user dismissals
- Manage One Tap state

## User Interactions

- **Continue**: Sign in with displayed Google account
- **Use Another Account**: Switch to different Google account
- **Dismiss**: Close One Tap prompt
- **Disable**: Turn off One Tap for this site

## Error Handling

- Google SDK loading failures
- Network connectivity issues
- Invalid ID tokens
- Account verification failures
- User cancellation

## Privacy Features

- Minimal data collection
- User consent management
- Account selection control
- Dismissal preferences
- Privacy policy compliance
