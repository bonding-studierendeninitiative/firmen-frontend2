# PasswordCard Component

## Purpose

Manages user password settings including password changes, strength requirements, and security policies.

## Semantic Content

This component handles password management by:

- Enabling secure password changes
- Displaying password strength and requirements
- Managing password policies and validation
- Providing password security recommendations

## Key Features

- **Password Change Form**: Secure password update interface
- **Strength Indicator**: Real-time password strength feedback
- **Requirements Display**: Clear password policy guidelines
- **Security Recommendations**: Best practices and tips
- **Change History**: Password update tracking

## Component Tree

```
PasswordCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Security Badge
│   │   └── Last Changed Info
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Current Password Section
│   │   │   ├── Password Field
│   │   │   │   ├── Label
│   │   │   │   ├── Input (hidden)
│   │   │   │   ├── Show/Hide Toggle
│   │   │   │   └── Validation Messages
│   │   │   └── Forgot Password Link
│   │   ├── New Password Section
│   │   │   ├── New Password Field
│   │   │   │   ├── Label
│   │   │   │   ├── Input (hidden)
│   │   │   │   ├── Show/Hide Toggle
│   │   │   │   └── Strength Indicator
│   │   │   │       ├── Strength Bar
│   │   │   │       ├── Strength Label
│   │   │   │       └── Requirements Checklist
│   │   │   ├── Confirm Password Field
│   │   │   │   ├── Label
│   │   │   │   ├── Input (hidden)
│   │   │   │   ├── Show/Hide Toggle
│   │   │   │   └── Match Indicator
│   │   │   └── Password Requirements
│   │   │       ├── Minimum Length
│   │   │       ├── Character Types
│   │   │       ├── Special Characters
│   │   │       └── Common Password Check
│   │   ├── Security Recommendations
│   │   │   ├── Tips List
│   │   │   ├── Best Practices
│   │   │   └── External Links
│   │   ├── Action Buttons
│   │   │   ├── Save Changes
│   │   │   ├── Cancel
│   │   │   └── Generate Strong Password
│   │   └── Form Validation
│   │       ├── Error Messages
│   │       └── Success Confirmation
│   └── Security Notes
│       └── Policy Information
```

## Password Requirements

- Minimum length constraints
- Character type requirements
- Special character inclusion
- Common password prevention
- Strength scoring system

## Security Features

- Current password verification
- Password strength validation
- Match confirmation checking
- Policy compliance verification
- Secure password generation

## User Experience

- Real-time strength feedback
- Clear requirement indicators
- Show/hide password options
- Progressive validation
- Success confirmation

## Actions

- Validate current password
- Check new password strength
- Confirm password matching
- Update user password
- Generate secure passwords
- Display security recommendations
- Handle password errors
- Log password changes
