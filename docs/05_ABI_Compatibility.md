# 5. ABI Compatibility


### 5.1 ABI Stability Rules

1. **System Library ABI**: Minor version updates will not break the glibc ABI. Applications compiled against glibc 2.35 will continue to work normally.
2. **Systemd Service Conventions**: `multi-user.target` and service management interfaces will remain stable.
3. **Docker Engine**: Docker API compatibility follows Docker upstream stability guarantees.
4. **TOS App Center API**: Install/start/stop/uninstall interfaces are versioned and backward-compatible.

### 5.2 Declaring Runtime Dependencies

Applications should explicitly declare runtime dependencies:

**In DEBIAN/control (Deb Applications):**
```
Depends: libc6 (>= 2.35), python3 (>= 3.10), systemd
```

**In docker-compose.yml (Docker Applications):**
```yaml
services:
  myapp:
    image: myapp:1.0.0  # Lock to a specific version; avoid :latest
```

> **Note:** If your application depends on system libraries that are not pre-installed, you must explicitly declare them in `Depends`; otherwise, the installation may fail on some TOS systems due to missing dependencies.


### 5.3 Testing Recommendations

To ensure forward compatibility:
- Test your application on the latest TOS 7 version before submission
- Use version-locked dependencies in Deb packages
- Docker applications should lock image tags to specific versions (not `:latest`)
- Subscribe to TOS release notes on the developer platform

---

← [Previous Chapter: Package Specification](04_Package_Specification.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next Chapter: Development Environment](06_Development_Environment.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Table of Contents](../README.md)
