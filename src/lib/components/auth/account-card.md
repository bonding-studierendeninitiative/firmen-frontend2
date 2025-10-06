# AccountCard Component

## Purpose

Displays and manages user account information including personal details, profile settings, and account status.

## Semantic Content

This component provides account management by:

- Displaying comprehensive user profile information
- Enabling profile editing and updates
- Managing account settings and preferences
- Showing account status and verification details

## Key Features

- **Profile Display**: Complete user information view
- **Editable Fields**: In-line or modal editing for profile data
- **Account Status**: Verification and security status
- **Settings Access**: Links to detailed account settings
- **Activity Summary**: Recent account activity overview

## Component Tree

```
AccountCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Account Status Badge
│   │   └── Edit Profile Button
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Profile Section
│   │   │   ├── User Avatar
│   │   │   │   ├── Profile Image
│   │   │   │   └── Change Avatar Button
│   │   │   ├── Basic Information
│   │   │   │   ├── Full Name
│   │   │   │   ├── Username/Handle
│   │   │   │   ├── Email Address
│   │   │   │   └── Phone Number
│   │   │   ├── Personal Details
│   │   │   │   ├── Bio/Description
│   │   │   │   ├── Location
│   │   │   │   ├── Website/Links
│   │   │   │   └── Date of Birth
│   │   │   └── Edit Controls
│   │   │       ├── Inline Edit Icons
│   │   │       └── Save/Cancel Actions
│   │   ├── Account Status Section
│   │   │   ├── Verification Status
│   │   │   │   ├── Email Verified
│   │   │   │   ├── Phone Verified
│   │   │   │   └── Identity Verified
│   │   │   ├── Security Level
│   │   │   │   ├── Two-Factor Status
│   │   │   │   ├── Password Strength
│   │   │   │   └── Login Methods
│   │   │   └── Account Health
│   │   │       ├── Profile Completeness
│   │   │       ├── Security Score
│   │   │       └── Activity Status
│   │   └── Quick Actions
│   │       ├── Change Password
│   │       ├── Update Email
│   │       ├── Manage Sessions
│   │       └── Privacy Settings
│   └── Last Updated Info
```

## Profile Information

- Personal identification data
- Contact information
- Biographical details
- Social and web links
- Profile completeness metrics

## Account Status

- Email and phone verification
- Identity verification level
- Security configuration status
- Account health indicators
- Activity and login history

## Edit Capabilities

- Inline field editing
- Bulk profile updates
- Image upload and cropping
- Field validation and formatting
- Change tracking and history

## Actions

- Load user account data
- Update profile information
- Change profile picture
- Verify contact information
- Update account settings
- Check account security
- Navigate to detailed settings
- Handle profile validation
