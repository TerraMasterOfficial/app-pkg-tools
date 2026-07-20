# Docker Template — TOS 7

A template for building TOS 7 Docker applications using Docker Compose.

## Quick Start

```bash
# 1. Replace "myapp-docker" with your application ID everywhere
# 2. Replace the image: field in docker-compose.yml with your Docker Hub image
# 3. Update config.ini with your metadata
# 4. Update app.lang with your descriptions
# 5. Copy .env.example to .env and adjust values
# 6. Test locally:
docker compose up -d
# 7. Submit the entire directory as a tar.gz to the TNAS Developer Platform
```

## Directory Structure

```
myapp-docker/
├── config.ini              # Application metadata (JSON)
├── app.lang                # Multilingual file (14 languages required)
├── docker-compose.yml      # Container orchestration config
├── .env.example            # Environment variable template
├── images/
│   └── icons/
│       └── myapp-docker.svg # App icon (SVG, 128x128 recommended)
└── README.md               # This file
```

## Key Rules

| Rule | Detail |
|---|---|
| **Image Source** | Docker Hub only — other registries rejected |
| **No Root** | Must use non-root user via `user:` field |
| **No Privileged** | `privileged: true` is strictly prohibited |
| **No Host Network** | `network_mode: host` is prohibited |
| **Version Tag** | Lock to specific version, not `:latest` |
| **Data Persistence** | Mount to `/Volume1/docker/<appid>/` paths |
| **Ports** | Use recommended range 8000-19999 |
| **Health Check** | Required for every service |
| **x-app-meta** | Required for Web UI apps |
| **Timezone** | Must set `TZ` environment variable |

## Updating the Image

To use your own Docker image:
1. Build and push to Docker Hub:
   ```bash
   docker build -t yourname/myapp:1.0.0 .
   docker push yourname/myapp:1.0.0
   ```
2. Update `docker-compose.yml`:
   ```yaml
   services:
     myapp-docker:
       image: yourname/myapp:1.0.0
   ```

## Requirements

- TOS 7.0 or later
- DockerEngine installed on TOS (from App Center)
- Your Docker image hosted on Docker Hub

> **Multi-arch note:** When submitting to the TNAS Developer Platform, set the correct `platform` field in `config.ini` (`x86_64` or `aarch64`) for each submission. Docker images may support both architectures via manifest, but TOS requires separate submissions per platform.

## Resources

- [TOS 7 Application Development Guide — Chapter 9](../../应用开发指南分开章节管理/docs/09_Docker开发.md)
- [TNAS Developer Platform](https://developer.terra-master.com)
