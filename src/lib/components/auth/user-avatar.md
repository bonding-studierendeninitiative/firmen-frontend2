# UserAvatar Component

## Purpose

Displays a user's profile image with intelligent fallbacks, supporting various sizes and states for consistent user representation throughout the application.

## Semantic Content

This component renders user avatars by:

- Displaying user profile images when available
- Showing initials as fallback when no image exists
- Providing loading states during image loading
- Supporting different sizes and styling variants
- Handling broken or failed image loads

## Key Features

- **Image Display**: Shows user profile pictures
- **Fallback Handling**: Displays user initials when no image
- **Size Variants**: Multiple size options for different contexts
- **Loading States**: Skeleton loading during image fetch
- **Error Handling**: Graceful handling of broken images

## Component Tree

```
UserAvatar
├── Avatar Container
│   ├── Avatar Image (when available)
│   │   ├── Image Element
│   │   ├── Alt Text
│   │   └── Loading Handler
│   ├── Avatar Fallback
│   │   ├── Initials Text
│   │   ├── Background Color
│   │   └── Text Color
│   └── Loading Skeleton (during load)
└── Error Handler
```

## Display Modes

- Image: Shows user's profile picture
- Initials: First letters of user's name
- Icon: Generic user icon fallback
- Skeleton: Loading placeholder

## Actions

- Load and display user image
- Generate initials from user name
- Handle image loading errors
- Manage loading states
- Apply size and styling variants
