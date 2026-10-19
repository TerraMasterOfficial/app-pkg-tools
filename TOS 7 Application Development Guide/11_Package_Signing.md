# 11. Package Signing Security

### 11.1 Package Integrity

**Deb Packages:**
- Deb packages do **not** need to include `DEBIAN/md5sums`, and the platform **no longer validates** md5sums (this was a legacy requirement of the old TPK format and has been cancelled). If `dpkg-deb` generates an `md5sums` file automatically, it does not affect submission.
- **Packaging method is not restricted**: a package may be built with `dpkg-deb --build`, or the deb package structure may be organized manually — as long as the result is a valid deb package that conforms to the specification.
- Developers should provide SHA-256 checksums alongside deb packages:
  ```bash
  sha256sum <appid>_x86_64.deb > <appid>_x86_64.deb.sha256
  ```

**Docker Applications:**
- Docker images should use signature/digest-pinned references:
  ```yaml
  image: myapp@sha256:<digest>  # Preferred over :latest
  ```
- Use Docker Content Trust (DOCKER_CONTENT_TRUST=1) for verified pulls

### 11.2 Publisher Trust

The TNAS Developer Platform establishes publisher trust through:

1. **Developer Account Verification**: Registration requires email verification
2. **Application Review**: All submissions undergo manual security review
3. **Publisher Identity**: The `publisher` field in config.ini is displayed to users
4. **Version Audit Trail**: All version submissions are logged and traceable

> **Future Plan:** TerraMaster plans to introduce GPG key-based package signing for Deb applications and integrate Docker Content Trust for container images.

Until the full GPG signing scheme is implemented, a SHA-256 checksum file is required alongside every package. Note the confirmed platform behaviour: the platform does not read or verify the `.sha256` attachment when a version is submitted; verification, if any, is performed outside the submission flow.
1. Provide a SHA-256 checksum file for every binary artifact
2. The platform does not verify checksums at submission time
3. Ensure the published checksum matches the uploaded package
4. Maintainers must enable two-factor authentication (2FA) on their repository accounts (GitHub/Gitee)

### 11.3 Security Audit Requirements

All applications must pass a security audit during review:

| Check Item | Deb Applications | Docker Applications |
|---|---|---|
| No hardcoded credentials | ✅ | ✅ |
| Root privilege strictly prohibited | ✅ | ✅ |
| No privileged mode (strictly prohibited) | N/A | ✅ |
| No world-writable files | ✅ | N/A |
| Only declared dependencies | ✅ | ✅ |
| No excessive resource consumption | ✅ | ✅ |
| Vulnerability scanning | Optional | Recommended: `docker scan` / `trivy` |
| No script injection vulnerabilities | ✅ | ✅ |
| No path traversal vulnerabilities | ✅ | ✅ |
| No sensitive information in logs | ✅ | ✅ |
| Checksums match uploaded artifacts | ✅ | ✅ |

### 11.4 Supply Chain Security

**Deb Applications:**
- Declare precise dependency versions in DEBIAN/control
- Use reproducible build processes whenever possible
- Do not bundle unnecessary files or libraries

**Docker Applications:**
- Pin image tags to specific versions or digests (avoid `:latest`)
- Use multi-stage builds to reduce the attack surface
- Regularly update base images to include security patches
- Do not include development tools in production images

---

← [Previous: Permission Model](10_Permission_Model.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: Best Practices](12_Best_Practices.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
