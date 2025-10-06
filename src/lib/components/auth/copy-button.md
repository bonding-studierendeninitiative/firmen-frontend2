# CopyButton Component

## Purpose

Provides one-click copying functionality for text content like tokens, codes, or URLs, with visual feedback to confirm successful copying.

## Semantic Content

This component enables users to copy text content by:

- Displaying content with a copy button
- Handling clipboard operations
- Providing visual feedback on successful copy
- Supporting different content types (codes, URLs, text)

## Key Features

- **Clipboard Copy**: Copies content to system clipboard
- **Visual Feedback**: Shows success/error states
- **Content Display**: Shows the content to be copied
- **Accessibility**: Screen reader support for copy actions

## Component Tree

```
CopyButton
├── Content Container
│   ├── Content Display
│   │   ├── Text Content
│   │   └── Code Formatting (optional)
│   └── Copy Button
│       ├── Copy Icon
│       ├── Success Icon (after copy)
│       └── Button Label
└── Feedback Message (optional)
    ├── Success Message
    └── Error Message
```

## Content Types

- Plain text
- Code snippets
- URLs and links
- Tokens and keys
- Formatted text

## States

- Default: Ready to copy
- Copying: Operation in progress
- Success: Content copied successfully
- Error: Copy operation failed

## Actions

- Copy content to clipboard
- Display visual feedback
- Handle copy errors
- Reset state after timeout
