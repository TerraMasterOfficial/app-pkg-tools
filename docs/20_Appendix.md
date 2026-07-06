# 20. Appendix


| Category ID | Display Name |
|---|---|
| `Audio_Video_Entertainment` | Audio & Video Entertainment |
| `Photography_Video` | Photography & Video |
| `Backup_Sync` | Backup & Sync |
| `Development_Tools` | Development Tools |
| `Utilities` | Utilities |
| `Web_Services` | Web Services |
| `Security` | Security |
| `Download` | Download |
| `Driver` | Driver |

**Applying for a New Category:**
If no existing category fits your app, you can apply for a new category:
1. Submit a category request through the Developer Platform support channel
2. Provide: suggested category ID, display name, and justification of at least 3 existing or planned apps
3. Review takes 5–10 business days
4. Custom/non-standard categories without prior approval will be rejected

### Appendix B: System Port Reference

The following ports are reserved by the TOS system and must not be used by applications:

| Port | Service |
|---|---|
| 22 | SSH |
| 80 | HTTP (TOS Web) |
| 443 | HTTPS |
| 445 | SMB |
| 3306 | MySQL |
| 5050 | TOS Daemon (internal system service port; prohibited for app use) |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8181 | TOS Nginx (Web UI) |
| 8443 | TOS HTTPS |

Recommended app port range: **8000–19999** (excluding ports already occupied by installed apps). If ports in the recommended range are occupied, you may use **49152–65535** (dynamic port range), but it must be explicitly declared in the configuration.


### Appendix C: TOS System Directories

| Path | Description |
|---|---|
| `/usr/local/<appid>/` | App main directory (Deb apps) |
| `/Volume1/@apps/<appid>/` | TOS app installation directory |
| `/var/lib/<appid>/` | App runtime data |
| `/var/log/<appid>/` | App logs |
| `/etc/init.d/<appid>` | TOS service script symlink |
| `/etc/systemd/system/<appid>.service` | Systemd service file |
| `/Volume1/docker/<appid>/` | Docker app data |

### Appendix D: TOS Systemd Targets

| Target | Description |
|---|---|
| `multi-user.target` | TOS application service target (**all app services must use this as `WantedBy`**) |
| `default.target` | System default boot target (do not use for app services; use `multi-user.target` instead) |

### Appendix E: Compatibility Matrix

| TOS Version | Base System | glibc | Python3 | Docker | Node.js |
|---|---|---|---|---|---|
| TOS 7.0 | Ubuntu 22.04 | 2.35 | 3.10 | 20.10+ | 18.x |
| TOS 7.x (subsequent minor versions, compatible with TOS 7.0) | Ubuntu 22.04 | 2.35 | 3.10 | 24.x (from TOS 7.2) | 20.x |

> Note: The TOS 7.x series minor versions (including 7.1 and above) will be based on Ubuntu 22.04 and maintain ABI/API compatibility for core dependencies. Apps developed for TOS 7.0 will run without additional adaptation.

### Appendix F: Language File Quick Template

```ini
[zh-cn]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[zh-hk]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[en-us]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[fr-fr]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[de-de]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[it-it]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[es-es]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[hu-hu]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[ja-jp]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[ko-kr]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[pl-pl]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[ru-ru]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[tr-tr]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""

[pt-pt]
name = ""
auth = ""
descript = ""
release_note = ""
important = ""
```

### Appendix G: Shared Folder API

```bash
# Create a shared folder for the app
ter_share_add -name <folder_name> -owner <username>

# Example
ter_share_add -name myapp-data -owner myapp
```

### Appendix H: Upgrade Migration Checklist

Use this checklist when upgrading your app to a new major version:

- [ ] Data migration scripts handle previous version formats
- [ ] Configuration files are backed up before modification
- [ ] New dependencies are declared in DEBIAN/control
- [ ] Service files are updated (if needed)
- [ ] Version numbers are incremented in config.ini, DEBIAN/control, and app.lang
- [ ] Changelog/release notes are updated
- [ ] Upgrade path tested: install old version → add data → upgrade → verify data
- [ ] Rollback path tested: downgrade or restore from backup
- [ ] SHA-256 checksums regenerated

---



### Appendix J: README.md Template

```markdown
# <App Name>

## Overview
A brief description of the app and its purpose.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
1. Requirements: TOS 7.0+, [other dependencies]
2. Install from TNAS App Center
3. Initial configuration steps

## Usage
How to access and use the app:

1. Access URL: `http://<your-nas-ip>:<port>`
2. Default credentials: [if applicable]
3. Key settings

## Permissions
| Permission | Rationale |
|---|---|
| Network: port XXXX | [rationale] |
| File system: /path/to/data | [rationale] |
| User: <appid> | Isolated service execution |

## Configuration
Key configuration options and their defaults.

## Ports
| Port | Protocol | Purpose |
|---|---|---|
| XXXX | TCP | [purpose] |

## Support
- Documentation: [link]
- Issue tracker: [link]
- Community: [link]

## Changelog
### v1.0.0 (YYYY-MM-DD)
- Initial release

## License
[License type]
```

### Appendix K: Complete Config File Templates

Complete downloadable config file templates for all app types are available on the TNAS Developer Platform:
- `config.ini` template (Deb WebUI Internal, Deb WebUI External, Deb No UI, Docker)
- `app.lang` template (14-language quick template; see Appendix F)
- Systemd unit file template (with security hardening)
- DEBIAN/control template (single-package, dual-package)
- Lifecycle script templates (preinst, postinst, prerm, postrm)
- Nginx config template
- docker-compose.yml template
- GitHub Actions CI/CD template

### Appendix L: Common Rejection Reasons & Fix Examples

| Rejection Reason | Incorrect Example | Correct Fix |
|---|---|---|
| Comments in config.ini | `// this is a comment` in JSON | Remove all comments; JSON does not support comments |
| Single quotes in JSON | `'version': '1.0.0'` | Use double quotes: `"version": "1.0.0"` |
| Trailing comma | `"beta": false,}` (comma on last field) | Remove trailing comma after the last field |
| Hardcoded IP | `"path": "http://192.168.1.100:8080"` | Use placeholder: `"path": "http://${ip}:8080"` |
| Missing languages | app.lang has only 12 languages | Add all 14 required language sections |
| root in systemd | `User=root` in service file | Use dedicated user: `User=<appid>` |
| Docker privileged mode | `privileged: true` in compose | Remove; use fine-grained capabilities |
| Missing checksum | No .sha256 file submitted | Run `sha256sum <file> > <file>.sha256` |
| Version not incremented | v1.0.0 → v1.0.0 (same version) | Increment version: v1.0.0 → v1.0.1 |

### Appendix M: Terminology & Definitions

| Term | Definition | AKA |
|---|---|---|
| **App ID** | Globally unique identifier for the app; set in `config.ini.id` | `app_id`, `appid`, `id` |
| **System ID** | Systemd service unit name; set in `config.ini.system_id` | `system_id`, service name |
| **Package Name** | Debian package name; set in the Package field of DEBIAN/control | `package`, deb package name |
| **Dual-Package Mode** | Two deb packages in one tar.gz archive — a deb data package (containing TOS platform configuration) and a deb source package (containing app binaries). | Dual-package mechanism |
| **Data Package** | TOS system-recognizable app configuration data package, abbreviated as deb data package | App data package, metadata package |
| **Source Package** | Runnable app main body deb package, abbreviated as deb source package | App installation package, binary package |
| **Single-Package Mode** | Develop directly according to the TOS 7.0 specification, integrating all files into a single deb package | Single-package mechanism |
| **WebUI Internal Opening** | App frontend opens within the TOS desktop as an iframe | iframe mode, embedded mode |
| **WebUI External Opening** | App frontend opens in a new browser tab | New tab mode, external mode |
| **No UI Service** | An app without a graphical interface; a background daemon service | Headless service, daemon |
| **Minimum TOS Version** | The minimum TOS version required by the app; set in the `low_version` field of `config.ini`. | Min TOS version, TOS version requirement |


### Appendix N: Beta App Management

| Rule | Description |
|---|---|
| **Visibility Scope** | Beta apps are only visible to users who have opted into beta testing |
| **Visibility Control** | Set `"beta": true` in config.ini; the platform automatically restricts visibility |
| **Graduation Process** | To graduate from Beta: set `"beta": false` and increment the version number. The version string should follow standard SemVer (do not use beta suffixes) |
| **Prohibited Behavior** | Beta apps must not be distributed as production releases; misleading users about beta status will result in rejection |
| **Expiry & Delisting** | Beta apps not updated for 90 days may be automatically delisted |
| **Version Number** | Use standard SemVer with the `"beta": true` field; do not use `-beta`, `-rc`, or other version string suffixes |

---


*This document is the official global specification for TOS7 app development and publishing. The specification will be continuously updated with TOS7 version iterations. Developers should refer to the latest version on the Developer Platform.*

---

← [Previous: FAQ](19_FAQ.md) &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
