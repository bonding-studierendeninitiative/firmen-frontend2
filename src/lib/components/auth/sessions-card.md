# SessionsCard Component

## Purpose

Manages user sessions and device access, providing visibility and control over active login sessions across devices.

## Semantic Content

This component handles session management by:

- Displaying all active user sessions and devices
- Providing session details and location information
- Enabling session termination and security controls
- Managing device trust and recognition settings

## Key Features

- **Session List**: All active sessions with details
- **Device Information**: Device type, browser, and OS details
- **Location Tracking**: Geographic session information
- **Session Controls**: Terminate individual or all sessions
- **Security Monitoring**: Suspicious activity detection

## Component Tree

```
SessionsCard
├── Settings Card Container
│   ├── Card Header
│   │   ├── Title
│   │   ├── Active Sessions Count
│   │   └── Terminate All Button
│   ├── Card Content
│   │   ├── Loading Skeleton (when pending)
│   │   ├── Current Session
│   │   │   ├── Session Info
│   │   │   │   ├── Current Badge
│   │   │   │   ├── Device Icon
│   │   │   │   ├── Browser/Device Name
│   │   │   │   ├── IP Address
│   │   │   │   ├── Location (City, Country)
│   │   │   │   ├── Login Time
│   │   │   │   └── Last Activity
│   │   │   └── Session Details
│   │   │       ├── User Agent
│   │   │       ├── Session Duration
│   │   │       └── Security Status
│   │   ├── Other Sessions
│   │   │   └── Session Items (multiple)
│   │   │       ├── Device Icon
│   │   │       ├── Session Info
│   │   │       │   ├── Browser/Device Name
│   │   │       │   ├── Operating System
│   │   │       │   ├── IP Address
│   │   │       │   ├── Location
│   │   │       │   ├── Login Time
│   │   │       │   └── Last Activity
│   │   │       ├── Security Indicators
│   │   │       │   ├── Trusted Device
│   │   │       │   ├── Suspicious Activity
│   │   │       │   └── Security Score
│   │   │       └── Session Actions
│   │   │           ├── Terminate Session
│   │   │           ├── Mark as Trusted
│   │   │           └── View Details
│   │   ├── Security Settings
│   │   │   ├── Auto-Logout Timer
│   │   │   ├── Remember Device
│   │   │   ├── Geographic Restrictions
│   │   │   └── Concurrent Session Limit
│   │   └── Empty State
│   │       └── No Active Sessions
│   └── Security Notes
│       ├── Session Security Tips
│       └── Logout Recommendations
```

## Session Information

- Device and browser identification
- Operating system details
- IP address and geographic location
- Login timestamp and duration
- Last activity tracking

## Security Features

- Suspicious activity detection
- Geographic anomaly alerts
- Device fingerprinting
- Concurrent session monitoring
- Trusted device management

## Session Controls

- Individual session termination
- Bulk session logout
- Selective device trust
- Session timeout configuration
- Remote device management

## Actions

- Load active user sessions
- Display session details
- Terminate specific sessions
- Logout from all devices
- Mark devices as trusted
- Configure session settings
- Monitor security threats
- Track session activity
