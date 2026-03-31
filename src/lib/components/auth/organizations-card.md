# OrganizationsCard Component

## Purpose

Displays a list of organizations that a user belongs to, providing navigation and management options for each organization.

## Semantic Content

This component shows organization membership by:

- Listing all organizations user has access to
- Displaying organization details and user roles
- Providing selection and management actions
- Supporting organization creation
- Showing member counts and organization status

## Key Features

- **Organization List**: Shows all accessible organizations
- **Selection Interface**: Click to select organization
- **Management Actions**: Quick access to organization settings
- **Creation Option**: Button to create new organizations
- **Role Display**: Shows user's role in each organization

## Component Tree

```
OrganizationsCard
├── Card Header
│   ├── Title and Icon
│   ├── Description
│   └── Create Button
├── Card Content
│   ├── Empty State (if no organizations)
│   │   ├── Empty Icon
│   │   ├── Empty Message
│   │   └── Create Prompt
│   └── Organizations List
│       └── Organization Items
│           ├── Organization Logo
│           ├── Organization Info
│           │   ├── Organization Name
│           │   ├── User Role Badge
│           │   └── Member Count
│           ├── Selection Indicator
│           └── Management Button
```

## Organization Information

- Organization name and logo
- User's role within organization
- Number of members
- Organization status
- Selection state

## List States

- Empty: No organizations available
- Loading: Organizations being fetched
- Populated: Organizations displayed
- Error: Failed to load organizations

## Actions

- Select organization for navigation
- Create new organization
- Manage organization settings
- Display organization details
- Handle organization selection
