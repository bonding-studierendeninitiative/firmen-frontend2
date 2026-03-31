# AuthTabs Component

## Purpose

Provides tabbed navigation between different authentication methods, allowing users to switch between sign-in options like password, magic link, or OTP.

## Semantic Content

This component creates a tabbed interface for authentication options:

- Tab navigation between different auth methods
- Active tab highlighting
- Content switching based on selected tab
- Consistent styling across authentication flows

## Key Features

- **Tab Navigation**: Switch between authentication methods
- **Active State**: Visual indication of current tab
- **Content Switching**: Dynamic content based on active tab
- **Accessibility**: Proper tab navigation support

## Component Tree

```
AuthTabs
├── Tabs Container
│   ├── Tab List
│   │   ├── Password Tab
│   │   ├── Magic Link Tab
│   │   ├── OTP Tab
│   │   └── Social Tabs
│   └── Tab Content
│       ├── Password Form
│       ├── Magic Link Form
│       ├── OTP Form
│       └── Social Options
```

## Tab Types

- Password: Email/password authentication
- Magic Link: Passwordless email authentication
- OTP: One-time password authentication
- Social: Social provider authentication

## Actions

- Switch between authentication tabs
- Maintain active tab state
- Handle tab navigation
- Display appropriate content for each tab
