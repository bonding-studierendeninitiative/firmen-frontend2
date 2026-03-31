# AuthLayout Component

## Purpose

Provides a consistent layout wrapper for authentication pages, handling responsive design, background patterns, and proper spacing for auth forms.

## Semantic Content

This component creates a standardized layout for authentication pages by:

- Centering content on the page
- Providing responsive breakpoints
- Adding background patterns or gradients
- Managing title and description display
- Ensuring consistent spacing and typography

## Key Features

- **Responsive Layout**: Adapts to different screen sizes
- **Background Patterns**: Optional decorative background elements
- **Content Centering**: Properly centers authentication content
- **Title Management**: Handles page titles and descriptions
- **Flexible Sizing**: Supports different content width options

## Component Tree

```
AuthLayout
├── Layout Container
│   ├── Background Pattern (optional)
│   │   ├── Gradient Overlay
│   │   └── Decorative Elements
│   ├── Content Container
│   │   ├── Title Section (optional)
│   │   │   ├── Page Title
│   │   │   └── Page Description
│   │   └── Content Slot
│   │       └── Authentication Forms
└── Responsive Breakpoints
```

## Layout Options

- Centered: Content centered on page
- Top-aligned: Content aligned to top
- With background: Decorative background patterns
- Without background: Clean, minimal layout

## Width Variants

- Small: Narrow forms (320px)
- Medium: Standard forms (400px)
- Large: Wide forms (500px)
- Extra Large: Full-width forms (600px)

## Actions

- Render page title and description
- Apply responsive layout styling
- Handle background pattern display
- Manage content width constraints
- Provide consistent spacing
