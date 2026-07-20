# Deb Single-Package Template — TOS 7

A ready-to-use template for building TOS 7 Deb applications in single-package mode.

## Quick Start

```bash
# 1. Clone or copy this template
# 2. Replace "myapp" with your actual application ID everywhere
# 3. Add your application binary/script to bin/
# 4. Update config.ini with your app metadata
# 5. Update myapp.lang with your descriptions
# 6. Optional: Add webui.bz2 for WebUI applications
# 7. Build:
./build.sh x86_64
# or for ARM:
./build.sh aarch64
```

## Directory Structure

```
myapp/
├── config.ini              # Application metadata (JSON format)
├── myapp.lang              # Multilingual file (14 languages required)
├── myapp.env               # Environment variables (loaded by systemd via EnvironmentFile)
├── build.sh                # Build script (includes pre-build validation)
├── bin/
│   └── myapp               # Application executable
├── images/
│   └── icons/
│       └── myapp.svg       # App icon (SVG, 128x128 recommended)
├── init.d/
│   └── myapp.service       # Systemd service unit
├── nginx/                  # Nginx config (external open only)
├── webui.bz2              # Frontend archive (WebUI apps only)
├── depends/               # Dependency files (optional)
│   ├── bin/
│   ├── lib/
│   ├── etc/
│   ├── data/
│   └── logs/
└── DEBIAN/
    ├── control             # Package metadata
    ├── postinst            # Post-install script
    ├── prerm               # Pre-remove script
    └── postrm              # Post-remove script
```

## Subtype Configuration

This template defaults to **WebUI Internal Open (iframe)**. To change:

| Subtype | config.ini Changes | webui.bz2 Required? |
|---|---|---|
| WebUI Internal (iframe) | `"type": "iframe"`, `"path": "/myapp/"` | ✅ Required |
| WebUI External (new tab) | Remove `"type"`, set `"open_path": true`, `"path": "http://${ip}:8686"` | ✅ Required |
| No UI Service | Remove `"type"`, `"open_path"`, `"path"` fields | ❌ Not required |

## Requirements

- TOS 7.0 or later
- Python 3.10 (pre-installed in TOS)
- Systemd

## Resources

- [TOS 7 Application Development Guide](../../应用开发指南分开章节管理/)
- [TNAS Developer Platform](https://developer.terra-master.com)
