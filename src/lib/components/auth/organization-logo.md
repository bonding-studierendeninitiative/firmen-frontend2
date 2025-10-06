# OrganizationLogo Component

## Purpose

Displays organization logos with intelligent fallbacks, supporting different sizes and handling image loading states for consistent organization branding.

## Semantic Content

This component renders organization visual identity by:

- Displaying organization logos when available
- Providing fallback icons when no logo exists
- Supporting various sizes for different contexts
- Handling image loading and error states

## Key Features

- **Logo Display**: Shows organization logo images
- **Fallback Handling**: Generic organization icon when no logo
- **Size Variants**: Multiple size options for different uses
- **Loading States**: Skeleton during image loading
- **Error Handling**: Graceful handling of broken images

## Component Tree

```
OrganizationLogo
├── Logo Container
│   ├── Logo Image (when available)
│   │   ├── Image Element
│   │   ├── Alt Text
│   │   └── Loading Handler
│   ├── Logo Fallback
│   │   ├── Organization Icon
│   │   ├── Background Color
│   │   └── Icon Color
│   └── Loading Skeleton (during load)
```

## Display Modes

- Image: Organization's custom logo
- Icon: Generic organization icon fallback
- Initials: Organization name initials (optional)
- Skeleton: Loading placeholder

## Size Variants

- Small: List items and compact displays
- Medium: Standard card displays
- Large: Header and prominent displays
- Extra Large: Branding and hero sections

## Actions

- Load and display organization logo
- Handle image loading errors
- Generate fallback display
- Manage loading states
- Apply size styling
