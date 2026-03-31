# OrganizationNameCard Component

## Purpose

Provides an interface for updating the organization's display name with real-time validation, uniqueness checking, and proper permission controls.

## Semantic Content

This settings card allows authorized users to change their organization's name while ensuring the new name meets requirements and doesn't conflict with existing organizations.

## Key Features

- **Name Editing**: Change organization display name
- **Real-Time Validation**: Immediate feedback on name validity
- **Uniqueness Check**: Verify name availability
- **Permission Control**: Only authorized users can edit
- **Change History**: Track name change history

## Form Fields

- **Organization Name**: Text input for new organization name

## Component Tree

```
OrganizationNameCard
├── Card Header
│   ├── Title "Organization Name"
│   ├── Description
│   └── Edit Button/Icon
├── Card Content
│   ├── Current Name Display
│   ├── Name Edit Form (when editing)
│   │   ├── Name Input Field
│   │   │   ├── Label
│   │   │   ├── Input
│   │   │   └── Validation Message
│   │   ├── Character Count
│   │   └── Availability Status
│   └── Change History (optional)
└── Card Footer
    ├── Cancel Button (when editing)
    └── Save Changes Button (when editing)
```

## Validation Rules

- **Required**: Organization name cannot be empty
- **Length**: Minimum and maximum character limits
- **Uniqueness**: Name must not conflict with existing organizations
- **Format**: Acceptable characters and formatting rules
- **Reserved Names**: Prevent use of system-reserved names

## Display States

- **View Mode**: Shows current organization name
- **Edit Mode**: Shows editable form with validation
- **Loading**: During name availability checks
- **Saving**: During name update process
- **Error**: When validation fails or update errors occur

## Real-Time Features

- **Character Counting**: Show remaining characters
- **Availability Check**: Real-time uniqueness validation
- **Format Validation**: Immediate feedback on name format
- **Save State**: Enable/disable save based on validation

## Actions

- Toggle edit mode
- Validate name format and availability
- Save organization name changes
- Cancel editing and revert changes
- Display change confirmation

## Permission Checks

- **Owner**: Full edit access
- **Admin**: Edit access (configurable)
- **Member**: View only
- **Custom Roles**: Based on specific permissions

## Error Handling

- Name already in use by another organization
- Invalid name format or characters
- Network failures during validation
- Permission denied errors
- Server-side validation failures

## Success Flow

- Name validated successfully
- Organization name updated
- Confirmation message displayed
- UI updated with new name
- Change logged in audit trail
