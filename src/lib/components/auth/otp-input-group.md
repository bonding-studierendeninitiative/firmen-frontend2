# OTPInputGroup Component

## Purpose

Provides a specialized input group for one-time password (OTP) entry with individual digit inputs, visual separators, and enhanced user experience features.

## Semantic Content

This component creates a series of individual input fields for entering OTP codes, with automatic focus management, visual formatting, and accessibility features optimized for code entry.

## Key Features

- **Individual Digit Inputs**: Separate input for each OTP digit
- **Auto-Advancement**: Automatically moves to next input on entry
- **Visual Separators**: Optional separators between digit groups
- **Paste Support**: Handles pasting full OTP codes
- **Backspace Handling**: Intelligent deletion and focus management

## Component Tree

```
OTPInputGroup
├── OTP Input Container
│   ├── Digit Input 1
│   ├── Separator (optional)
│   ├── Digit Input 2
│   ├── Digit Input 3
│   ├── Separator (optional)
│   ├── Digit Input 4
│   ├── Digit Input 5
│   └── Digit Input 6
└── Hidden Full Input (for form submission)
```

## Separator Configurations

- **No Separators**: 123456
- **One Separator**: 123 456
- **Two Separators**: 12 34 56

## Input Behaviors

- **Auto-Focus**: Focus moves to next input on digit entry
- **Backspace**: Clears current digit and moves to previous
- **Paste Handling**: Distributes pasted code across inputs
- **Arrow Keys**: Navigate between inputs
- **Tab Navigation**: Standard tab order support

## Validation Features

- **Numeric Only**: Accepts only numeric characters
- **Length Validation**: Ensures 6-digit codes
- **Real-time Updates**: Updates form value as user types
- **Visual Feedback**: Highlights invalid or incomplete codes

## Actions

- Handle individual digit input
- Manage focus between inputs
- Process pasted OTP codes
- Validate code completeness
- Submit complete codes automatically
- Clear all inputs on reset

## Accessibility Features

- Proper ARIA labels
- Screen reader announcements
- Keyboard navigation support
- Focus management
- Error announcements
- Input descriptions

## Use Cases

- Two-factor authentication codes
- Email verification codes
- SMS verification codes
- Recovery codes
- Setup verification codes
