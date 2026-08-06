
# 12. Best Practices

### 12.1 Application Directory Layout

Follow a consistent directory layout to ensure maintainability and compatibility. All non-embedded applications (both official and third-party) are installed on **storage volumes** at `/Volume*/@apps/<appid>/`.

**Standard Directory Layout:**

```
/Volume*/@apps/<appid>/
├── <binary>          # Application executable
├── config.ini        # Application configuration file
├── <appid>.lang      # Language file
├── images/           # Icon resources
├── webui.bz2         # Front-end page archive (WebUI applications)
├── nginx/            # Nginx configuration (externally opened applications)
├── init.d/           # Systemd service files
├── data/             # Runtime data (writable)
└── logs/             # Application logs
```

> **Note:** `*` in `/Volume*/` represents the volume number (e.g., Volume1, Volume2) chosen by the user during installation.

**Data Storage Recommendations:**
- Store persistent application data in `/Volume*/@apps/<appid>/data/`
- Store logs in `/Volume*/@apps/<appid>/logs/`
- Store user business data (media, documents, etc.) in shared folders under `/Volume*/`

### 12.2 Data Persistence

**Deb Applications:**
1. Persistent data is recommended to be stored under `/Volume*/@apps/<appid>/data/` or a dedicated shared folder under `/Volume*/`
2. For NAS-accessible data, create a shared folder:
   ```bash
   ter_share_add -name <appid>-data -owner <appid>
   ```
3. If needed, create symbolic links to maintain compatibility:
   ```bash
   ln -s /Volume*/<appid>-data /Volume*/@apps/<appid>/data
   ```
4. Runtime data is stored in `/Volume*/@apps/<appid>/data/`

**Docker Applications:**
1. Mount all persistent data directories via volumes:
   ```yaml
   Volumes:
     - /Volume*/DockerAppData/<appid>/config:/config
     - /Volume*/DockerAppData/<appid>/data:/data
   ```
2. Storing data in the container filesystem is prohibited
3. Use separate volumes for configuration and data to support independent backups

> **Note:** `*` in `/Volume*/` represents the volume number (e.g., Volume1, Volume2) chosen by the user during installation.

### 12.3 Logging

**Deb Applications:**
```bash
# Use systemd journal (recommended)
# All stdout/stderr from the service is automatically captured
# View logs: journalctl -u <appid>

# Or write to file
exec >> /Volume*/@apps/<appid>/logs/app.log 2>&1
```

**Docker Applications:**
```yaml
services:
  myapp:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

> **Note:** Each container log file is limited to 10MB, with 3 files retained, for a total log size cap of 30MB.

**Best Practices:**
- Use structured logging (JSON format recommended)
- Include timestamp, level, and context in every log entry
- Rotate logs to prevent disk exhaustion
- Never log sensitive information (passwords, tokens, personal data)

**Log Retention and Cleanup:**

| Log Type | Maximum Retention | Cleanup Method |
|---|---|---|
| Application Logs (files) | 30 days | Logrotate: daily rotation, retain 30 files |
| Systemd Journal | Managed by platform | Automatically managed via journald limits |
| Docker Container Logs | 10MB per file, 3 files total | Docker logging driver configuration |

**Logrotate Configuration:**
```
/Volume*/@apps/<appid>/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

### 12.4 Resource Limits

| Resource | Deb Applications (systemd) | Docker Applications (compose) |
|---|---|---|
| Memory | `MemoryMax=512M` | `memory: 512M` |
| CPU | `CPUQuota=200%` | `cpus: '2.0'` |
| File Descriptors | `LimitNOFILE=65536` | N/A (container level) |
| Processes | `LimitNPROC=256` | N/A (container level) |
| Disk | N/A (use quotas) | Volume size limit |

**Guidelines:**
- Set resource limits based on expected workload, not maximum possible usage
- Reserve a 20-30% peak buffer on top of typical usage
- Document resource requirements in README.md

### 12.5 Health Checks

**Deb Applications:**
```ini
# In systemd service file
[Service]
StartLimitBurst=3
StartLimitIntervalSec=60

# Watchdog (if application supports it)
WatchdogSec=30
```

**Docker Applications:**
```yaml
services:
  myapp:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
```

### 12.6 Upgrades and Migration

**Deb Applications:**
1. Always check for old versions in `postinst`:
   ```bash
   if [ -n "$2" ]; then
       # Upgrading from $2 — run migration
       /Volume*/@apps/<appid>/bin/migrate --from "$2"
   fi
   ```
2. Never delete user data during upgrades
3. Back up before modifying configuration formats
4. Migration logic should be reversible to support rollback
5. **Users are advised to store data within `/Volume*/@apps/<appid>/data/` or within `/Volume*/`** to ensure data is not lost after upgrades

**Docker Applications:**
1. Use an entrypoint script to detect and migrate old data formats:
   ```bash
   #!/bin/bash
   if [ -f /config/version ]; then
       OLD_VERSION=$(cat /config/version)
       if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then
           /app/migrate.sh "$OLD_VERSION" "$NEW_VERSION"
       fi
   fi
   echo "$NEW_VERSION" > /config/version
   ```
2. Test upgrade paths for at least the last 2 major versions

### 12.7 Security Hardening

**Deb Applications:**
```ini
[Service]
# Drop all capabilities, add only required ones
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=true

# File system protection
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/Volume*/@apps/<appid>/data /Volume*/@apps/<appid>/logs

> **Note:** If the application needs to write configuration files under `/etc`, it must use `ReadWritePaths` to explicitly declare writable paths.

# Network namespace (optional)
# PrivateNetwork=true  # Only when network is not needed

# User namespace
# PrivateUsers=true
```

**Docker Applications:**
```yaml
services:
  myapp:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE  # Only when binding to ports below 1024
    read_only: true
    tmpfs:
      - /tmp
      - /run
```

> **Required (all submissions must include):**
> - `NoNewPrivileges=true`
> - `ProtectSystem=strict`
> - `ProtectHome=true`
> - `ReadWritePaths` (explicit paths only)
> - Non-root `User`/`Group`
>
> **Recommended (strongly suggested):**
> - `AmbientCapabilities` (only needed capabilities)
> - `LimitNOFILE`, `LimitNPROC`
> - `PrivateTmp=true`
> - `PrivateDevices=true`
>
> **Optional (advanced hardening):**
> - `PrivateNetwork=true` (only when network is not needed)
> - `PrivateUsers=true`
> - `MemoryDenyWriteExecute=true`

### 12.8 Application Port Allocation

**Rules:**
1. Prioritize selecting ports within the recommended range **8000-19999** (12,000 ports total, greatly reducing conflict probability)
2. If the recommended range ports are occupied, **49152-65535 (dynamic port range)** can be used as an alternative.
3. Check commonly used ports to avoid conflicts before selection; make ports configurable via environment variables
4. Document port usage in README.md

**Port Range Description:**
- **8000-19999**: The recommended port range for TOS 7 applications, avoiding system core service ports (such as 22/80/443/8181), with ample capacity to meet the port needs of the vast majority of applications
- **49152-65535**: IANA-defined dynamic/private port range, suitable for temporary or backup scenarios

**Common Port Reference (Avoid Using):**

| Port | Application |
|---|---|
| 22 | SSH |
| 80 | TOS Web (HTTP) |
| 443 | TOS Web (HTTPS) |
| 445 | SMB |
| 3306 | MySQL |
| 5050 | TOS Daemon |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 8096 | Jellyfin |
| 8181 | TOS Nginx |
| 8443 | TOS HTTPS |
| 9000 | Portainer |
| 9090 | Prometheus |


← [Previous: Package Signing](11_Package_Signing.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: Local Testing & Debugging](13_Local_Testing.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
