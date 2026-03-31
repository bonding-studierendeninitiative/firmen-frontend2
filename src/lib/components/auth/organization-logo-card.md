# OrganizationLogoCard Component

## Purpose

Manages organization branding through logo upload, preview, and management functionality.

## Semantic Content

This component provides organization logo management by:

- Displaying current organization logo
- Enabling logo upload functionality
- Providing logo preview and editing
- Managing logo file validation and storage

## Key Features

- **Logo Display**: Shows current organization logo
- **Upload Interface**: Drag-and-drop or click to upload
- **Image Preview**: Real-time preview of uploaded logo
- **File Validation**: Checks format, size, and dimensions
- **Crop/Edit Tools**: Basic image editing capabilities

## Component Tree

```
OrganizationLogoCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   └── Description
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Current Logo Display
│   │   │   ├── Logo Image
│   │   │   ├── Logo Info (size, format)
│   │   │   └── Remove Button
│   │   ├── Upload Area
│   │   │   ├── Dropzone
│   │   │   │   ├── Upload Icon
│   │   │   │   ├── Upload Text
│   │   │   │   └── Format Guidelines
│   │   │   ├── File Input (hidden)
│   │   │   └── Browse Button
│   │   ├── Preview Area
│   │   │   ├── Uploaded Image Preview
│   │   │   ├── Crop Controls
│   │   │   └── Preview Sizes
│   │   └── Action Buttons
│   │       ├── Save Changes
│   │       └── Cancel Upload
│   └── Upload Progress
```

## File Requirements

- Supported formats (PNG, JPG, SVG)
- Maximum file size
- Recommended dimensions
- Aspect ratio guidelines
- Quality recommendations

## Upload Process

- File selection or drag-and-drop
- Format and size validation
- Image preview generation
- Optional cropping/editing
- Progress indication
- Success/error feedback

## Display Variants

- Empty state (no logo)
- Current logo view
- Upload in progress
- Error state
- Success confirmation

## Actions

- Load current organization logo
- Handle file selection
- Validate uploaded files
- Process image upload
- Update logo display
- Remove existing logo
- Show upload progress
- Handle upload errors
