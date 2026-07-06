# 4. Package Specification

This section defines the formal specifications for TOS 7 application packages. All applications must comply with this specification.


### 4.1 Application Lifecycle

TOS 7 applications follow a clearly defined lifecycle:

```
  Install ──► Configure ──► Start ──► Running
     │            │            │           │
     │            │            │           ├── Stop ──► Stopped ──► Start (Restart)
     │            │            │
     │            │            └── Crash ──► Auto-restart (if configured)
     │            │
     │            └── Upgrade ──► Stop ──► Install New Version ──► Migrate ──► Start
     │
     └── Uninstall ──► Stop ──► Cleanup ──► Remove
```

**Deb Application Lifecycle Stages:**

| Stage | Trigger | Script/Operation | Expected Behavior |
|---|---|---|---|
| Before Install | `dpkg -i` | `DEBIAN/preinst` | Create user, check prerequisites, create directories |
| Install | `dpkg -i` | Package extraction | Files deployed to `/usr/local/<appid>/` etc. |
| After Install | `dpkg -i` | `DEBIAN/postinst` | Set permissions, enable service, start service |
| Start | `systemctl start` | systemd / init.d | Application process starts |
| Stop | `systemctl stop` | systemd / init.d | Application process gracefully stops |
| Before Uninstall | `dpkg --remove` | `DEBIAN/prerm` | Stop service |
| After Uninstall | `dpkg --remove` | `DEBIAN/postrm` | Clean up user, data, residual files |
| Upgrade | `dpkg -i` (new version) | prerm → Upgrade → postinst | Stop old version, install new version, migrate data, start |

**Docker Application Lifecycle Stages:**

| Stage | Trigger | Operation | Expected Behavior | Additional Notes |
|---|---|---|---|---|
| Install | App Center (user clicks "Install" button) | Pull image, create volumes | Image available, data directories created | Platform automatically executes the installation process; no additional developer intervention required |
| Start | App Center (user clicks "Start" button) / `docker-compose up` | Start container | Service accessible | Users can also manually start via command line, consistent with platform operation logic |
| Stop | App Center (user clicks "Stop" button) / `docker-compose down` | Stop container | Service stopped, data retained | Only stops the container process; mounted data volumes are not deleted |
| Upgrade | App Center (user clicks "Update" button when a new version is available) | Pull new image, rebuild container | Zero-downtime or brief downtime | It is recommended that applications support smooth upgrades to avoid data interruption |
| Uninstall | App Center (user clicks "Uninstall" button) | Remove container, optionally clean up volumes | All resources released | Users can choose whether to retain data volumes to avoid accidental data deletion |

> Note: "App Center" refers to the built-in application management interface of the TNAS system. Install/start/stop/upgrade/uninstall operations performed by users through this interface will trigger the corresponding lifecycle processes.


### 4.2 Version Number Specification

TOS 7 follows **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH

MAJOR: Incompatible API changes
MINOR: Backward-compatible new features
PATCH: Backward-compatible bug fixes
```

**Rules:**
1. Each submitted version number must be **strictly greater** than the previous version
2. Version downgrades are prohibited
3. Version numbers must be consistent across `version` in config.ini, `Version` in DEBIAN/control, and `version` in app.lang
4. The platform validates version consistency upon submission
5. Maximum version number length: **20 characters**. Exceeding this will result in rejection.
6. Allowed characters in version numbers: digits (`0-9`) and dots (`.`) only. Example: `"1.2.3"`
7. Pre-release/beta versions must use the `"beta": true` field in config.ini, not version number suffixes.

**Beta Version Management Notes:**
- The platform does not support version number suffixes (e.g., `-beta`, `-rc`, `-alpha`)
- Multiple beta versions are distinguished by incrementing the patch number:
  - First beta version → `"version": "1.0.0"` + `"beta": true`
  - Second beta version → `"version": "1.0.1"` + `"beta": true`
  - Third stable release → `"version": "1.0.2"` + `"beta": false`
- Stable release: Set `"beta": false`; increment version number normally
- Version rollback: The platform does not support rolling back to a "smaller" version number. If a rollback is needed, a rollback request must be submitted on the developer platform, and the platform will roll back the application to the previous stable version
- See Appendix N - Beta Version Application Management for details

### 4.3 Upgrades

**Deb Application Upgrades:**
- During upgrade, `preinst` receives `$1 = "upgrade"` parameter
- `postinst` receives `$1 = "configure"` parameter, with `$2` being the old version number
- Use `$2` to detect the old version and perform data migration
- Never delete user data during the upgrade process; only modify configuration formats or migrate data structures
- Users store data in the `/usr/local/<app_id>` directory, which is the application's dedicated data directory. The platform will not delete or overwrite user data in this directory during application upgrades or reinstallation
- It is recommended not to store data in system common directories such as `/etc`, `/var`, `/usr/bin`, as these directories may be overwritten by system updates or application upgrades, leading to data loss

```bash
# Example: postinst with migration logic
case "$1" in
    configure)
        if [ -n "$2" ]; then
            # Upgrading from version $2
            if dpkg --compare-versions "$2" lt "2.0.0"; then
                # Migrate v1.x configuration format to v2.x
                /usr/local/<appid>/bin/migrate.sh "$2"
            fi
        else
            # Fresh install
            echo "Fresh install"
        fi
        ;;
esac
```


**Docker Application Upgrades:**
- Pull new image tags
- Rebuild containers using existing volume mounts
- Preserve data across upgrades through persistent volumes
- Include migration logic in the application entry script if needed

### 4.4 Compatibility Matrix

| TOS Version | Base System | glibc | Python3 | Docker | Node.js |
|---|---|---|---|---|---|
| TOS 7.0 | Ubuntu 22.04 | 2.35 | 3.10 | 20.10+ | 18.x |
| TOS 7.x (subsequent minor versions, compatible with TOS 7.0) | Ubuntu 22.04 | 2.35 | 3.10 | 20.10+ (TOS 7.0); 24.x (since TOS 7.2) | 20.x |

> **Note:** Node.js versions are for reference within Docker containers only. Deb applications must not directly depend on them.

> **Important:** Applications must declare the minimum TOS version requirement via the `low_version` field in config.ini. The platform will automatically filter out incompatible devices.

> **TOS 7.x Minor Version Compatibility:** The TOS 7.x minor version series (including 7.1 and above) will maintain ABI/API compatibility for core dependencies (glibc/Python3/Docker/Node.js) based on Ubuntu 22.04. Applications developed for TOS 7.0 will run without additional adaptation.

**TOS 7 Minor Version Compatibility:**
- The `low_version` field must specify the minimum required TOS version
- When submitting updates, test on the latest TOS 7 minor version


### 4.5 Case Sensitivity Specification

TOS is based on Ubuntu Linux, and the filesystem is strictly case-sensitive. All applications must follow the rules below:

| Element | Rule |
|---|---|
| Filenames | Strictly match case. `config.ini` ≠ `Config.ini` ≠ `CONFIG.INI` |
| Directory names | Strictly match case. `/images/icons/` ≠ `/Images/Icons/` |
| config.ini key names | All key names must be lowercase. `"version"` correct, `"Version"` incorrect |
| Application ID (`id`) | Strictly match case. `MyApp` ≠ `myapp`. Cannot be modified after creation |
| Systemd service name | Must strictly match, case-sensitive |


**Prohibited:** Using case variants of the same file or directory within a single application package. This causes "file not found" and "service start failure" errors on Linux.

---

---

### 4.6 Cross-Platform Line Ending Specification (CRLF to LF)

All scripts and configuration files running on the TOS system (Linux environment) **must use LF (`\n`) as the line ending**. Using Windows default CRLF (`\r\n`) line endings is prohibited.

#### Impact

- Script execution errors: `bad interpreter: No such file or directory`
- Configuration file parsing failures (e.g., systemd service files, Nginx configurations)
- Interpreter paths incorrectly recognized as non-existent binaries like `/bin/bash\r`

#### Mandatory Requirements

1. All `.sh` / `.py` / `.ini` / `.lang` / `.service` / `.conf` files must be converted to LF line endings before submission
2. Deb package build scripts must include automatic conversion logic to prevent CRLF from being introduced during the build process

#### Recommended Fixes

##### Option 1: Automatic Conversion in Build Script (Recommended)

```python
import os

def convert_crlf_to_lf(file_path):
    with open(file_path, "rb") as f:
        content = f.read()
    content = content.replace(b"\r\n", b"\n")
    with open(file_path, "wb") as f:
        f.write(content)

# Before packaging, iterate over all files that need conversion
for root, _, files in os.walk("your_app_source/"):
    for name in files:
        if name.endswith((".sh", ".py", ".ini", ".lang", ".service", ".conf")):
            convert_crlf_to_lf(os.path.join(root, name))
```

##### Option 2: Local Development Tool Configuration

- **VS Code**: Click `CRLF` in the bottom-right status bar, switch to `LF`, then save
- **Git Global Configuration** (prevent subsequent files from being auto-converted to CRLF):

```bash
git config --global core.autocrlf input
```

---

← [Previous Chapter: Quick Start](03_Quick_Start.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next Chapter: ABI Compatibility](05_ABI_Compatibility.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Table of Contents](../README.md)
