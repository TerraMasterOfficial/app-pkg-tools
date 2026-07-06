# 9. Docker Development

### 9.1 Overview

Docker applications run in containers managed by the TOS7 built-in Docker engine. They are defined via a `docker-compose.yml` file and require the DockerEngine application to be installed on the TNAS device.

**Core Requirements:**
- Must provide a `docker-compose.yml` compatible with Compose Spec 3.8+
- Data must be persisted to NAS-accessible directories via volume mounts
- **Privileged mode is strictly prohibited**
- **System core ports (22, 80, 443, 8181, 5050) must not be occupied**

### 9.2 Directory Structure

```
<appid>-docker/                # Repository root
├── config.ini                 # Application metadata
├── app.lang                   # Multilingual file (14 languages)
├── docker-compose.yml         # [Required] Container orchestration config
├── .env.example               # [Optional] Environment variable example
├── README.md                  # Bilingual documentation
└── images/
    └── icons/
        └── <appid>.svg        # Application icon
```

### 9.3 docker-compose.yml Specification

```yaml
version: "3.8"
services:
  <appid>:
    image: <registry>/<image>:<tag>  # Images limited to Docker Hub only
    container_name: <appid>
    restart: unless-stopped
    Volumes:
      - /Volume1/docker/<appid>/config:/config
      - /Volume1/docker/<appid>/data:/data
    ports:
      - "<host_port>:<container_port>"
    environment:
      - TZ=Asia/Shanghai
    user: "1000:1000"

x-app-meta:
  web:
    port: <host_port>
    protocol: http
```

**Rules:**

1. **Version**: Must be compatible with Compose Spec 3.8 or higher
2. **x-app-meta**: For Docker applications with a UI, the `x-app-meta` tag must be appended at the end of the `docker-compose.yml` file (after the services block), containing `web.port` (Web UI port number) and `web.protocol` (request protocol, typically `http`).
   ```yaml
   x-app-meta:
     web:
       port: 8080
       protocol: http
   ```
3. **Data Persistence**: All data directories must be mounted to host paths. Data stored only inside the container will be lost when the container is removed.
4. **Port Mapping**:
   - Disabled ports: 22, 80, 443, 8181, 5050 (system services)
   - Recommended range: 8000-19999
   - Verify that the selected port is not in use on the TNAS before submission
5. **Privileged Mode**: **Strictly prohibited**. The `user` field must be used to specify UID/GID.
6. **Timezone**: Default configuration `TZ=Asia/Shanghai`. Users may modify as needed.
7. **Container Name**: Must match the application `id`
8. **Restart Policy**: Use `unless-stopped` for normal services
9. **Network Mode**: `network_mode: host` is **strictly prohibited**, except for system-level network tools. System-level network tools must clearly state the rationale at submission and may only use it after approval. Regular applications are strictly prohibited. Using host network mode breaks container isolation and poses security risks. Use port mapping instead:
   ```yaml
   ports:
     - "8080:8080"
   ```
10. **Timezone**: Container timezone must be explicitly configured:
   ```yaml
   environment:
     - TZ=Asia/Shanghai
     - TZ=${TZ:-Asia/Shanghai}  # Allow user override
   ```
    Do not leave the timezone empty — inconsistent timestamps can cause data corruption in time-sensitive applications.

### 9.4 Image and Security Requirements

1. **Image Source (Docker Hub Only)**: **All Docker images must come from Docker Hub. Non-Docker Hub images will be rejected outright.** Images must be hosted on **Docker Hub** (hub.docker.com). Other image registries (such as ghcr.io, quay.io, self-hosted private registries, etc.) are not supported.

   | Priority | Source | Example |
   |---|---|---|
   | 1 (Preferred) | Docker Hub official project images | `nginx`, `postgres` |
   | 2 | Docker Hub verified publishers | Docker Hub images with Verified badge |
   | 3 | Docker Hub well-known community images | `linuxserver/jellyfin` (100M+ pulls, actively maintained) |
   | ❌ Rejected | Images from non-Docker Hub sources | Private registries, ghcr.io, quay.io, etc. |
   | ❌ Rejected | Unverified personal images on Docker Hub | Docker Hub images with few pulls, no documentation |

   > **Mandatory Requirement:** Images must be hosted on Docker Hub. Image source will be verified during review. Using non-Docker Hub images will result in immediate rejection.

   Images from non-Docker Hub sources or unverified Docker Hub images will be rejected during security review.
2. **Image Size**: Use multi-stage builds or Alpine base images to reduce size.
3. **Sensitive Information**: Hardcoding passwords, tokens, or secrets in images or compose files is prohibited. Use environment variables or `.env` files.
4. **Security Scanning**: Run `docker scan` or `trivy` before submission to check for known vulnerabilities.
5. **User Permissions**: **Running as root is strictly prohibited, and `--privileged` mode is strictly prohibited.** A non-root user must be specified via the `user` field.

### 9.5 Complete Example

**Application Overview:**
- ID: `myapp-docker`
- Type: Docker application
- Image: `linuxserver/myapp:latest`
- Port: 8080
- Dependency: DockerEngine

#### config.ini

```json
{
  "id": "myapp-docker",
  "icon": "/images/icons/myapp-docker.svg",
  "publisher": "Developer Name",
  "path": "http://${ip}:8080",
  "exec": true,
  "open_path": true,
  "resize": true,
  "maxmin": true,
  "width": 0,
  "height": 0,
  "help": "https://github.com/example/myapp/wiki",
  "version": "1.0.0",
  "recommend": false,
  "beta": false,
  "low_version": "TOS7.0",
  "category": ["Utilities"],
  "depend": ["DockerEngine"],
  "relation": ["docker", "DockerEngine"],
  "platform": "x86_64",
  "official": "https://example.com",
  "application_type": "docker",
  "system_id": "",
  "package": "",
  "compose_project": "myapp-docker",
  "user": "myapp",
  "all_user_display": true,
  "allow_open_in_mobile": false
}
```

#### docker-compose.yml

```yaml
version: "3.8"
services:
  myapp-docker:
    image: linuxserver/myapp:1.0.0
    container_name: myapp-docker
    restart: unless-stopped
    Volumes:
      - /Volume1/docker/myapp-docker/config:/config
      - /Volume1/docker/myapp-docker/data:/data
    ports:
      - "8080:8080"
    environment:
      - TZ=Asia/Shanghai
      - PUID=1000
      - PGID=1000

x-app-meta:
  web:
    port: 8080
    protocol: http
```


> **Note:** This application opens its WebUI externally, so `path` uses the `http://${ip}:<port>` format.

**Multi-container Service Startup Order:**
For applications with multiple services (e.g., Web + Database):
```yaml
services:
  app-db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  app-web:
    image: myapp:1.0.0
    depends_on:
      app-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```
- Use `depends_on` with `condition: service_healthy` to ensure correct startup order
- Health checks must be defined for every service
- Platform validation: all services must be healthy before the application is shown as "Running"

**Health Check Failure Handling:**
- After 3 consecutive health check failures, the container is marked as "unhealthy"
- The Application Center displays the application as "Abnormal"
- Docker's restart policy (`unless-stopped`) will attempt to restart unhealthy containers
- If the container enters a restart loop, the platform will flag the application as needing developer attention

**Data Backup, Migration, and Reset:**

| Operation | Path | Method |
|---|---|---|
| Backup config | `/Volume1/docker/<appid>/config` | tar or rsync backup |
| Backup data | `/Volume1/docker/<appid>/data` | tar or rsync backup |
| Migration | All `/Volume1/docker/<appid>/` | Copy to new device, same path |
| Reset to defaults | Stop container → Delete `/Volume1/docker/<appid>/config` → Restart | Container creates fresh config |
| Completely delete data | Stop container → Delete `/Volume1/docker/<appid>/` | All data permanently removed |

> Note: Config and data are stored separately, enabling independent backup/restore. Always back up before major upgrades.

---

← [Previous: Deb Development](08_Deb_Development.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: Permission Model](10_Permission_Model.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
