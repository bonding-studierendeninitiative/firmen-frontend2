# OrganizationsCard Component

## Purpose

Displays a comprehensive list of all organizations a user belongs to, with options to create new organizations, manage existing ones, and handle organization invitations.

## Semantic Content

This card component provides a centralized view of the user's organization memberships, including their roles, organization details, and management options for each organization.

## Key Features

- **Organization Listing**: Shows all user's organizations
- **Role Display**: User's role in each organization
- **Organization Details**: Names, logos, member counts
- **Quick Actions**: Direct access to organization functions
- **Creation Access**: Button to create new organizations
- **Status Indicators**: Active, pending, and other states

## Component Tree

```
OrganizationsCard
├── Card Header
│   ├── Title "Organizations"
│   ├── Description
│   └── Create Organization Button
├── Card Content
│   ├── Organizations List
│   │   └── Organization Items
│   │       ├── Organization Logo
│   │       ├── Organization Info
│   │       │   ├── Organization Name
│   │       │   ├── User Role Badge
│   │       │   └── Member Count
│   │       └── Actions Menu
│   │           ├── Switch to Organization
│   │           ├── Organization Settings
│   │           ├── View Members
│   │           └── Leave Organization
│   ├── Empty State (if no organizations)
│   └── Loading State
└── Card Footer (optional)
    └── View All Organizations Link
```

## Organization Display Information

- **Organization Name**: Display name of the organization
- **Organization Logo**: Visual branding/avatar
- **User Role**: User's role within the organization
- **Member Count**: Number of organization members
- **Creation Date**: When user joined organization
- **Status**: Active, pending invitation, etc.

## Available Actions

- **Switch Context**: Set as active organization
- **View Settings**: Access organization configuration
- **Manage Members**: View and manage organization members
- **Leave Organization**: Remove user from organization
- **Create New**: Start new organization creation process

## Organization States

- **Active**: Currently selected working context
- **Available**: Organizations user can access
- **Pending**: Invitations awaiting acceptance
- **Inactive**: Organizations user has left or been removed from

## Role-Based Features

- **Owner**: Full management access
- **Admin**: Administrative privileges
- **Member**: Standard access and viewing
- **Custom Roles**: Organization-specific permissions

## Empty States

- **No Organizations**: First-time user guidance
- **No Access**: When all memberships removed
- **Loading**: During data fetch
- **Error**: When organizations cannot be loaded

## Actions

- Load user's organizations
- Create new organization
- Switch organization context
- Leave organizations
- Handle organization invitations
- Navigate to organization settings
