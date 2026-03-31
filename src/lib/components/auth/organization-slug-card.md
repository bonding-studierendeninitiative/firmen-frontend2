# OrganizationSlugCard Component

## Purpose

Manages organization URL slugs, providing an interface to view and edit the unique identifier used in organization URLs.

## Semantic Content

This component handles organization slug management by:

- Displaying the current organization slug/URL
- Providing an editable form for slug changes
- Validating slug format and availability
- Showing URL preview with the new slug

## Key Features

- **Slug Display**: Shows current organization URL slug
- **URL Preview**: Displays full URL with slug
- **Editable Form**: Input field for slug modification
- **Format Validation**: Ensures slug meets URL requirements
- **Availability Check**: Validates slug uniqueness

## Component Tree

```
OrganizationSlugCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Description
│   │   └── URL Preview
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   └── Slug Form
│   │       ├── Slug Input Field
│   │       │   ├── Label
│   │       │   ├── Input Element
│   │       │   ├── Format Help Text
│   │       │   └── Validation Messages
│   │       └── Save Button
│   └── Availability Status
```

## Validation Rules

- Slug format requirements (lowercase, hyphens, no spaces)
- Length constraints (minimum/maximum)
- Character restrictions (alphanumeric and hyphens only)
- Uniqueness validation
- Reserved word restrictions

## URL Display

- Current organization URL
- Preview of new URL with updated slug
- Domain and path structure
- Validation status indicators

## Form States

- Default: Current slug displayed
- Editing: Input field active
- Validating: Checking availability
- Valid: Slug is available
- Invalid: Slug has issues

## Actions

- Load current organization slug
- Validate slug format
- Check slug availability
- Save slug changes
- Display URL preview
- Handle validation feedback
