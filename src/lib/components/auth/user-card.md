# UserCard Component

## Purpose

Displays comprehensive user information in a card format, showing profile details, role information, and providing action buttons for user management.

## Semantic Content

This component presents user information including:

- User profile image and basic details
- Role and permission information
- Account status and verification state
- Action buttons for profile management
- Loading states for user data

## Key Features

- **Profile Display**: Shows user avatar, name, and email
- **Role Information**: Displays user roles and permissions
- **Status Indicators**: Shows account verification and status
- **Action Buttons**: Provides user management actions
- **Responsive Layout**: Adapts to different screen sizes

## Component Tree

```
UserCard
├── Card Container
│   ├── Card Header
│   │   ├── User Avatar
│   │   ├── User Information
│   │   │   ├── User Name
│   │   │   ├── Email Address
│   │   │   └── Role Badge
│   │   └── Action Menu (optional)
│   │       ├── Edit Profile
│   │       ├── Manage Settings
│   │       └── Sign Out
│   ├── Card Content
│   │   ├── Account Information
│   │   │   ├── Account Type
│   │   │   ├── Member Since
│   │   │   └── Verification Status
│   │   └── Role Details (optional)
│   └── Card Footer (optional)
│       └── Additional Actions
└── Loading Skeleton (when pending)
```

## Information Displayed

- User profile image
- Full name and email
- Account role and permissions
- Verification status
- Account creation date
- Account type (personal/organization)

## Actions

- Edit user profile
- Manage account settings
- Sign out user
- View user details
- Update user information
