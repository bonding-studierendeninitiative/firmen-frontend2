# AcceptInvitationCard Component

## Purpose

Manages the invitation acceptance process for organization membership, providing invitation details and acceptance controls.

## Semantic Content

This component handles invitation acceptance by:

- Displaying invitation details and organization information
- Providing invitation acceptance or rejection options
- Managing user account creation if needed
- Handling invitation validation and expiration

## Key Features

- **Invitation Display**: Complete invitation information
- **Organization Preview**: Details about the inviting organization
- **Account Integration**: Link with existing or create new account
- **Acceptance Flow**: Step-by-step invitation processing
- **Validation Checks**: Invitation status and expiration

## Component Tree

```
AcceptInvitationCard
├── Card Container
│   ├── Card Header
│   │   ├── Invitation Icon
│   │   ├── Title
│   │   └── Status Badge
│   ├── Card Content
│   │   ├── Loading State (when validating)
│   │   ├── Invitation Details
│   │   │   ├── Inviter Information
│   │   │   │   ├── Inviter Name
│   │   │   │   ├── Inviter Avatar
│   │   │   │   └── Invitation Date
│   │   │   ├── Organization Info
│   │   │   │   ├── Organization Name
│   │   │   │   ├── Organization Logo
│   │   │   │   ├── Member Count
│   │   │   │   └── Organization Description
│   │   │   ├── Role Information
│   │   │   │   ├── Assigned Role
│   │   │   │   ├── Permission Level
│   │   │   │   └── Role Description
│   │   │   └── Invitation Message
│   │   │       ├── Personal Message
│   │   │       └── Additional Notes
│   │   ├── Account Options
│   │   │   ├── Existing Account
│   │   │   │   ├── Sign In Prompt
│   │   │   │   ├── Account Email
│   │   │   │   └── Link Account Option
│   │   │   ├── New Account
│   │   │   │   ├── Account Creation Form
│   │   │   │   ├── Required Information
│   │   │   │   └── Terms Agreement
│   │   │   └── Guest Access (if available)
│   │   │       ├── Limited Access Info
│   │   │       └── Guest Limitations
│   │   ├── Action Buttons
│   │   │   ├── Accept Invitation
│   │   │   ├── Decline Invitation
│   │   │   ├── Create Account & Accept
│   │   │   └── Sign In to Accept
│   │   ├── Terms and Conditions
│   │   │   ├── Organization Policies
│   │   │   ├── Privacy Agreement
│   │   │   └── Terms of Service
│   │   └── Status Messages
│   │       ├── Success Confirmation
│   │       ├── Error Messages
│   │       └── Expiration Warnings
│   └── Validation Status
│       ├── Invitation Validity
│       └── Expiration Information
```

## Invitation Information

- Complete invitation context
- Organization details and branding
- Role and permission information
- Inviter identification
- Invitation timeline and expiration

## Account Integration

- Link with existing user accounts
- New account creation workflow
- Guest access options (if supported)
- Account verification requirements
- Profile completion prompts

## Acceptance Process

- Invitation validation and verification
- Account authentication or creation
- Role assignment confirmation
- Organization membership activation
- Welcome and onboarding initiation

## Actions

- Validate invitation token
- Display invitation details
- Process invitation acceptance
- Handle invitation rejection
- Create or link user accounts
- Assign organization roles
- Send confirmation notifications
- Redirect to organization dashboard
