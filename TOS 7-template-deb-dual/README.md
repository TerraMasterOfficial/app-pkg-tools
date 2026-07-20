# Deb Dual-Package Template — TOS 7

A template for TOS 7 applications using the dual-package (archive) mode. Suitable when you already have a standard deb package and want to add TOS platform integration.

## Quick Start

```bash
# 1. Place your existing application's deb source package files in source-pkg/
# 2. Configure data-pkg/ files with TOS platform metadata
# 3. Replace "myapp" with your application ID everywhere
# 4. Build:
./build.sh x86_64
# Output: build/output/myapp_x86_64.tar.gz
```

## How It Works

Dual-package mode uses two deb packages in one tar.gz archive:

| Package | Purpose | Contains |
|---|---|---|
| **Data Package** (`myapp_1.0.0_amd64.deb`) | TOS platform integration | config.ini, icons, language file, systemd service — **NO binaries** |
| **Source Package** (`myapp-source_1.0.0_amd64.deb`) | Actual application | Application binary and dependencies |

## Directory Structure

```
myapp-dual/
├── build.sh                    # Build script
├── data-pkg/                   # TOS platform data package
│   ├── config.ini              # Platform metadata
│   ├── myapp.lang              # Multilingual file (14 languages)
│   ├── images/
│   │   └── icons/
│   │       └── myapp.svg       # App icon
│   ├── init.d/
│   │   └── myapp.service       # Systemd service unit
│   └── DEBIAN/
│       ├── control             # Declares Depends on source package
│       ├── postinst            # Enable & start service
│       └── prerm               # Stop & disable service
└── source-pkg/                 # Upstream application package
    └── DEBIAN/
        └── control             # Upstream package metadata
```

## Key Rules

- **Version Consistency:** Data and source package versions MUST match exactly
- **No Binaries in Data Package:** Data package must not contain any executables
- **Source Package Independence:** Source package must be installable via `dpkg -i`
- **Data Package Depends:** Data package control file must declare `Depends: myapp-source (= version)`

## Requirements

- Your existing deb application package
- TOS 7.0 or later

## Resources

- [TOS 7 Application Development Guide — Chapter 8.17](../../应用开发指南分开章节管理/docs/08_Deb开发规范.md)
- [TNAS Developer Platform](https://developer.terra-master.com)
