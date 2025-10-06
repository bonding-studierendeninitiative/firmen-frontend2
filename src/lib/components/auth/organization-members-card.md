# OrganizationMembersCard Component

## Purpose

Manages organization membership, displaying team members and providing controls for member management.

## Semantic Content

This component handles organization member management by:

- Displaying list of organization members
- Showing member roles and permissions
- Providing member invitation functionality
- Managing member role updates and removal

## Key Features

- **Member List**: Display of all organization members
- **Role Management**: View and update member roles
- **Invitation System**: Send invites to new members
- **Member Actions**: Remove, update, or manage members
- **Permission Display**: Show member access levels

## Component Tree

```
OrganizationMembersCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Description
│   │   └── Add Member Button
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Members List
│   │   │   └── Member Items (multiple)
│   │   │       ├── Member Avatar
│   │   │       ├── Member Info
│   │   │       │   ├── Name
│   │   │       │   ├── Email
│   │   │       │   └── Join Date
│   │   │       ├── Role Badge
│   │   │       └── Actions Menu
│   │   │           ├── Edit Role
│   │   │           ├── Remove Member
│   │   │           └── View Profile
│   │   ├── Pending Invitations
│   │   │   └── Invitation Items (multiple)
│   │   │       ├── Email Address
│   │   │       ├── Invited Role
│   │   │       ├── Invitation Date
│   │   │       └── Actions
│   │   │           ├── Resend Invite
│   │   │           └── Cancel Invite
│   │   └── Empty States
│   │       ├── No Members
│   │       └── No Pending Invites
│   └── Pagination (if needed)
```

## Member Information

- User avatar and basic profile
- Name and email address
- Current role and permissions
- Join date and activity status
- Contact and profile links

## Role Management

- Role assignment interface
- Permission level display
- Role change confirmation
- Access level descriptions
- Hierarchy visualization

## Invitation Features

- Email invitation sending
- Role pre-assignment
- Invitation tracking
- Resend capabilities
- Expiration handling

## Actions

- Load organization members
- Display member information
- Send member invitations
- Update member roles
- Remove members from organization
- Manage pending invitations
- Handle role permissions
- Track member activities
