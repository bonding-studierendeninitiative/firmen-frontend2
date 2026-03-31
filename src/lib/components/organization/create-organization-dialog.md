# CreateOrganizationDialog Component

## Purpose

Provides a modal dialog for creating new organizations with customizable settings, branding options, and initial configuration.

## Semantic Content

This dialog allows users to establish new organizations by providing essential information like name, description, and visual branding, while setting up initial organizational structure.

## Key Features

- **Organization Setup**: Create new organizations with basic info
- **Logo Upload**: Add organization branding/visual identity
- **Name Validation**: Ensure unique and valid organization names
- **Slug Generation**: Create URL-friendly organization identifiers
- **Initial Settings**: Configure basic organization preferences
- **User Role Assignment**: Set creator as organization owner

## Form Fields

- **Organization Name**: Display name for the organization
- **Organization Slug**: URL-friendly identifier (auto-generated)
- **Description**: Optional organization description
- **Logo**: Organization logo/avatar upload
- **Website**: Optional organization website URL
- **Industry**: Optional industry/category selection

## Component Tree

```
CreateOrganizationDialog
├── Dialog Header
│   ├── Title "Create Organization"
│   ├── Description
│   └── Close Button
├── Dialog Content
│   ├── Organization Form
│   │   ├── Logo Upload Section
│   │   │   ├── Logo Preview
│   │   │   ├── Upload Button
│   │   │   └── Remove Logo Option
│   │   ├── Name Field
│   │   │   ├── Label
│   │   │   ├── Input
│   │   │   └── Validation Message
│   │   ├── Slug Field
│   │   │   ├── Label
│   │   │   ├── Input (auto-generated)
│   │   │   └── Availability Check
│   │   ├── Description Field (optional)
│   │   ├── Website Field (optional)
│   │   └── Industry Selection (optional)
│   └── Form Validation Messages
└── Dialog Footer
    ├── Cancel Button
    └── Create Organization Button
```

## Logo Upload Features

- **Image Upload**: Support for various image formats
- **Preview**: Show uploaded logo preview
- **Crop/Resize**: Automatic image optimization
- **Remove Option**: Delete uploaded logo
- **Fallback**: Default organization avatar if no logo

## Validation Rules

- **Name Required**: Organization name is mandatory
- **Name Uniqueness**: Must be unique across system
- **Slug Format**: URL-safe characters only
- **Slug Availability**: Must not conflict with existing slugs
- **Logo Size**: File size and dimension limits
- **Description Length**: Optional character limits

## Auto-Generation Features

- **Slug Creation**: Auto-generate from organization name
- **URL Preview**: Show final organization URL
- **Availability Check**: Real-time slug availability validation
- **Suggestion**: Alternative slugs if preferred is taken

## Actions

- Submit organization creation form
- Upload and process organization logo
- Validate organization name and slug
- Check slug availability
- Create organization with user as owner
- Redirect to new organization dashboard

## Error Handling

- Duplicate organization names
- Invalid slug formats
- Logo upload failures
- Network/server errors
- Validation failures
- Permission issues

## Success Flow

- Organization created successfully
- User assigned as owner
- Redirect to organization dashboard
- Display creation confirmation
- Initialize organization settings
