# OrganizationSlugCard Component

## Purpose

Manages the organization's URL slug (identifier), allowing authorized users to change the URL-friendly identifier while ensuring uniqueness and proper formatting.

## Semantic Content

This settings card provides functionality to update the organization's slug, which is used in URLs and as a unique identifier, with validation to ensure URL safety and uniqueness.

## Key Features

- **Slug Editing**: Change organization URL identifier
- **URL Preview**: Show full URL with new slug
- **Availability Check**: Real-time slug availability validation
- **Format Validation**: Ensure URL-safe characters
- **Impact Warning**: Show what will change with new slug

## Form Fields

- **Organization Slug**: Text input for URL-friendly identifier

## Component Tree

```
OrganizationSlugCard
├── Card Header
│   ├── Title "Organization URL"
│   ├── Description
│   └── Edit Button/Icon
├── Card Content
│   ├── Current URL Display
│   │   ├── Base URL
│   │   └── Current Slug
│   ├── Slug Edit Form (when editing)
│   │   ├── Slug Input Field
│   │   │   ├── Label
│   │   │   ├── URL Preview
│   │   │   ├── Input
│   │   │   └── Validation Message
│   │   ├── Availability Status
│   │   ├── Format Guidelines
│   │   └── Impact Warning
│   └── Change History (optional)
└── Card Footer
    ├── Cancel Button (when editing)
    └── Save Changes Button (when editing)
```

## Validation Rules

- **Required**: Slug cannot be empty
- **Format**: Only URL-safe characters (letters, numbers, hyphens)
- **Length**: Minimum and maximum character limits
- **Uniqueness**: Slug must not conflict with existing organizations
- **Reserved**: Prevent use of system-reserved slugs

## URL Features

- **Full URL Preview**: Show complete organization URL
- **Real-Time Updates**: URL preview updates as user types
- **Copy URL**: Copy full organization URL to clipboard
- **Custom Domain**: Support for custom domain integration (if available)

## Format Guidelines

- Lowercase letters and numbers only
- Hyphens allowed but not at start/end
- No consecutive hyphens
- No special characters or spaces
- Minimum length requirements

## Impact Warnings

- **URL Changes**: All organization URLs will change
- **Bookmark Impact**: User bookmarks will break
- **Integration Updates**: API integrations may need updates
- **SEO Impact**: Search engine optimization considerations

## Actions

- Toggle edit mode
- Validate slug format and availability
- Preview URL changes
- Save slug changes
- Copy organization URL
- Display change warnings

## Permission Checks

- **Owner**: Full edit access
- **Admin**: Edit access (configurable)
- **Member**: View only
- **Custom Roles**: Based on specific permissions

## Error Handling

- Slug already in use
- Invalid slug format
- Reserved slug names
- Network failures during validation
- Permission denied errors

## Success Flow

- Slug validated successfully
- Organization slug updated
- All URLs updated throughout system
- Confirmation message displayed
- Redirect to new URL if necessary
