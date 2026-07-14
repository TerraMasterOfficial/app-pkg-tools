# 3. Quick Start

This chapter helps developers complete their first TOS 7 application development and publishing in 5 minutes.

### 3.1 Prerequisites

- A TNAS device running TOS 7.0 (current stable/beta version)

  > 💡 **No TNAS hardware?** You can use an Ubuntu 22.04 VM, Open TOS local deployment, or apply for a remote testing device as an alternative. See the "Alternative Testing Solutions for Developers Without TNAS Hardware" section in [6.2 Development Tools](#62-development-tools).

- Basic Linux command line skills
- GitHub account (for code hosting and developer platform integration)

### 3.2 Five-Step Publishing Process

**Step 1: Register a Developer Account**

Visit the [TNAS Developer Platform](https://developer.terra-master.com) (Coming soon), register and complete developer verification.

**Step 2: Choose Application Type**

| Your Application Characteristics | Recommended Type |
|---|---|
| Native binary, Python scripts (leveraging system pre-installed Python 3.10), lightweight system services | Deb Application |
| Requires isolated runtime environment, complex dependencies, multi-container architecture | Docker Application |

> ⚠️ **Note:** Language runtimes such as Node.js, Java, and Go are not pre-installed in TOS. Deb applications cannot directly depend on them. See [Chapter 2 · Architecture Strategy](02_Architecture_Strategy.md).

**Step 3: Choose a Project Template**

Based on your application type, use the corresponding GitHub template repository:

| Template Repository | Packaging Method | Applicable Scenarios |
|---|---|---|
| [Deb App Template (Single Package)](https://github.com/terra-master/app-template-deb) | Single-package mode | New applications built from scratch; all files packaged together |
| [Deb App Template (Dual Package)](https://github.com/terra-master/app-template-deb-dual) | Dual-package mode | Applications that already have a universal standard deb package |
| [Docker App Template](https://github.com/terra-master/app-template-docker) | Docker | Docker containerized deployment |

> ⚠️ **Note:** Subtype (WebUI Internal/External/Headless) and packaging method (single/dual package) are two independent dimensions and can be cross-combined. Both single and dual packages support all three subtypes.

> Each template repository includes: complete directory structure, config.ini, multilingual files, systemd service,
> frontend/backend example code, lifecycle scripts, build script (build.sh), GitHub Actions CI/CD configuration.
> Click the **"Use this template"** button on the repository page to create your project.

**Step 4: Local Development and Testing**

```bash
# Deb App: Build and test installation
dpkg-deb --build ./<app_root_directory> ./<appid>_<version>_amd64.deb
sudo dpkg -i <appid>_<version>_amd64.deb
sudo systemctl status <system_id>

# Docker App: Start testing
docker-compose up -d
curl http://localhost:<port>/health
```

**Step 5: Submit for Review**

1. Push your code to a public GitHub repository
2. Create an application on the developer platform and link the repository
3. Upload the application package (.deb or .tar.gz) and fill in version information
4. Submit for review; wait for platform automated validation and manual review
5. After approval, the application will be published to the TNAS App Center

### 3.3 Key Checklist

Before submitting, verify the following items:

- [ ] config.ini is valid JSON format (no comments, no trailing commas, double quotes)
- [ ] app.lang includes all 14 languages (untranslated languages filled with English)
- [ ] Icon is in SVG format, stored at `/images/icons/<appid>.svg`
- [ ] systemd service file `User` is not root
- [ ] Version number is strictly incremented and consistent across config.ini, DEBIAN/control, and app.lang
- [ ] Full install/start/stop/uninstall workflow tested on a real TNAS device

  > 💡 **No TNAS hardware?** You can use alternative solutions for testing (Ubuntu 22.04 VM, Open TOS, remote testing device). See the "Alternative Testing Solutions for Developers Without TNAS Hardware" section in [6.2 Development Tools](#62-development-tools).

---

### 3.4 Common Pitfalls to Avoid

Before beginning formal development, pay special attention to the two most common cross-platform issues below to avoid rejection after submission:

#### Top 1: Line Ending Issues (CRLF to LF)

- **Symptom:** Scripts edited on Windows report `bad interpreter: No such file or directory` after uploading to TOS
- **Root Cause:** Windows defaults to CRLF line endings; Linux only recognizes LF
- **Solution:** Ensure all scripts and configuration files use LF line endings before submission (see Chapter 4 Cross-Platform Line Ending Specification)

```bash
# Quickly check for CRLF files in your project
grep -rl $'
' *.sh *.py *.ini *.lang *.service *.conf 2>/dev/null
# One-click conversion (Linux/macOS)
sed -i 's/
$//' *.sh *.py *.ini *.lang *.service *.conf
```

#### Top 2: Missing Node.js Dependencies

- **Symptom:** Application reports `node: command not found` on startup
- **Root Cause:** TOS does not pre-install Node.js; you cannot directly depend on the node runtime in Deb applications
- **Solution:** Use Go to compile static binaries, or use Python 3.10 (pre-installed in the system) (see Chapter 2 - Handling Non-Pre-installed Dependencies)

---

← [Previous Chapter: Architecture Strategy](02_Architecture_Strategy.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next Chapter: Package Specification](04_Package_Specification.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Table of Contents](../README.md)
