# OrganizationNameCard Component

## Purpose

Provides an interface for viewing and editing organization names, with form validation and permission-based editing capabilities.

## Semantic Content

This component manages organization name updates by:

- Displaying the current organization name
- Providing an editable form for name changes
- Validating name input requirements
- Handling save operations with proper feedback

## Key Features

- **Name Display**: Shows current organization name
- **Editable Form**: Input field for name changes
- **Validation**: Real-time name validation
- **Permission Control**: Edit access based on user permissions
- **Save Operations**: Handles name update submissions

## Component Tree

```
OrganizationNameCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Description
│   │   └── Instructions
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   └── Name Form
│   │       ├── Name Input Field
│   │       │   ├── Label
│   │       │   ├── Input Element
│   │       │   └── Validation Messages
│   │       └── Save Button
│   └── Permission Messages (if no access)
```

## Form Elements

- Organization name input field
- Real-time validation feedback
- Save button with loading states
- Error message display

## Validation Rules

- Name cannot be empty
- Minimum length requirements
- Special character restrictions
- Uniqueness validation (if required)

## Permission States

- Editable: User can modify organization name
- Read-only: User can view but not edit
- Loading: Fetching current state
- Error: Failed to load or save

## Actions

- Load current organization name
- Validate name input
- Save name changes
- Handle validation errors
- Display success/error feedback
