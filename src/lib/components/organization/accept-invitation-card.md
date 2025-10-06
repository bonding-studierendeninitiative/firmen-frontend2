# AcceptInvitationCard Component

## Purpose

Handles the process of accepting organization invitations, allowing invited users to join organizations and configure their membership settings.

## Semantic Content

This component is displayed when users access invitation links, providing them with organization details and options to accept or decline membership invitations.

## Key Features

- **Invitation Details**: Shows organization information and invitation context
- **Accept/Decline Options**: Clear actions for invitation response
- **Role Information**: Displays the role user will receive
- **Organization Preview**: Shows organization details before joining
- **Terms Display**: Organization-specific terms or policies

## Component Tree

```
AcceptInvitationCard
├── Card Header
│   ├── Title "Organization Invitation"
│   └── Invitation Status
├── Card Content
│   ├── Organization Information
│   │   ├── Organization Logo
│   │   ├── Organization Name
│   │   ├── Organization Description
│   │   └── Member Count
│   ├── Invitation Details
│   │   ├── Invited By Information
│   │   ├── Invited Role
│   │   ├── Invitation Date
│   │   └── Expiration Date
│   ├── User Information
│   │   ├── Invited Email
│   │   └── Current User Status
│   └── Terms and Conditions (optional)
└── Card Footer
    ├── Decline Button
    └── Accept Invitation Button
```

## Invitation Information

- **Organization Details**: Name, logo, description, member count
- **Invited Role**: Role user will receive upon acceptance
- **Inviter Information**: Who sent the invitation
- **Invitation Context**: Message or reason for invitation
- **Expiration**: When invitation expires
- **Terms**: Organization-specific policies

## Invitation States

- **Valid**: Invitation is active and can be accepted
- **Expired**: Invitation has passed expiration date
- **Already Member**: User is already organization member
- **Invalid**: Invitation token is invalid or corrupted
- **Revoked**: Invitation was cancelled by organization

## Actions

- Accept organization invitation
- Decline organization invitation
- View organization details
- Contact invitation sender
- Handle expired invitations
- Redirect after acceptance/decline

## Acceptance Process

1. Validate invitation token
2. Display organization and invitation details
3. User reviews information
4. User accepts or declines invitation
5. Process membership creation (if accepted)
6. Redirect to organization dashboard or previous page

## Error Handling

- Invalid invitation tokens
- Expired invitations
- Already accepted invitations
- Organization no longer exists
- Insufficient permissions
- Network/server errors

## Success Flow (Acceptance)

- Invitation accepted successfully
- User added to organization with specified role
- Redirect to organization dashboard
- Welcome message or onboarding
- Email confirmation sent

## Decline Flow

- Invitation declined
- Optional feedback collection
- Redirect to previous page or dashboard
- Notification sent to inviter (optional)
