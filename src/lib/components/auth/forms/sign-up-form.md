# SignUpForm Component

## Purpose

Enables new users to create accounts with customizable fields, avatar upload capabilities, and support for additional user information collection during registration.

## Semantic Content

This comprehensive registration form allows new users to create accounts with various personal information fields. It supports avatar uploads, custom additional fields, and provides a complete onboarding experience.

## Key Features

- **Account Creation**: Core registration with email and password
- **Avatar Upload**: Profile picture upload with image processing
- **Custom Fields**: Support for additional user information
- **Field Validation**: Real-time validation with custom rules
- **Terms Acceptance**: Optional terms and conditions checkboxes
- **Accessibility**: Comprehensive form accessibility

## Form Fields

- **Email**: Required email address for account
- **Password**: Secure password with strength requirements
- **Confirm Password**: Password confirmation (optional)
- **Name**: User's display name (optional)
- **Username**: Unique username (optional)
- **Avatar**: Profile picture upload (optional)
- **Custom Fields**: Configurable additional fields (text, number, boolean)

## Component Tree

```
SignUpForm
├── Form Container
│   ├── Avatar Upload Section (optional)
│   │   ├── Avatar Preview
│   │   ├── Upload Button
│   │   └── File Input
│   ├── Name Field (optional)
│   ├── Username Field (optional)
│   ├── Email Field
│   │   ├── Label
│   │   ├── Input
│   │   └── Error Message
│   ├── Password Field
│   │   ├── Label
│   │   ├── Password Input with Toggle
│   │   └── Error Message
│   ├── Confirm Password Field (optional)
│   ├── Additional Custom Fields
│   │   ├── Text Fields
│   │   ├── Number Fields
│   │   └── Boolean Checkboxes
│   ├── CAPTCHA Component (optional)
│   └── Submit Button
└── Terms and Conditions Links
```

## Avatar Upload Features

- Drag and drop support
- Image preview before upload
- Image resizing and cropping
- Delete uploaded avatar option
- File type validation

## Custom Field Types

- **Text**: Single-line text input
- **Number**: Numeric input with validation
- **Boolean**: Checkbox for true/false values
- **Required/Optional**: Configurable field requirements

## Validation Rules

- Email format and uniqueness
- Password strength requirements
- Password confirmation matching
- Username uniqueness (if enabled)
- Custom field validation rules
- File size and type for avatars

## Actions

- Submit registration form
- Upload and manage avatar image
- Validate fields in real-time
- Handle custom field validation
- Process successful registration
- Display registration errors

## Error Handling

- Email already in use
- Username already taken
- Password requirements not met
- Custom field validation failures
- Avatar upload errors
- Network/server errors
