# OTPInput Component

## Purpose

Specialized input component for one-time password (OTP) entry, providing individual character inputs with automatic focus progression and validation.

## Semantic Content

This component handles OTP code entry by:

- Providing individual input fields for each digit
- Automatically advancing focus between fields
- Supporting paste operations for complete codes
- Validating input format and length

## Key Features

- **Individual Digits**: Separate input for each OTP digit
- **Auto-Focus**: Automatic progression between inputs
- **Paste Support**: Handles pasting complete OTP codes
- **Validation**: Real-time format and length validation
- **Accessibility**: Proper screen reader support

## Component Tree

```
OTPInput
├── OTP Container
│   ├── Input Group
│   │   ├── Digit Input 1
│   │   ├── Digit Input 2
│   │   ├── Digit Input 3
│   │   ├── Digit Input 4
│   │   ├── Digit Input 5
│   │   └── Digit Input 6
│   ├── Separators (optional)
│   │   ├── Dash/Space Elements
│   │   └── Visual Grouping
│   └── Error Display
│       └── Validation Messages
```

## Input Behavior

- Single character per input
- Numeric-only validation
- Auto-advance on digit entry
- Auto-backspace on deletion
- Complete code validation

## Validation States

- Empty: No input entered
- Partial: Some digits entered
- Complete: All digits entered
- Valid: Code format is correct
- Invalid: Code format is incorrect

## Actions

- Handle individual digit input
- Manage focus progression
- Process paste operations
- Validate code format
- Trigger completion callbacks
