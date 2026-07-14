# 1. Overview

TOS 7 is built on Ubuntu 22.04 and uses a standard Linux runtime environment. Starting from TOS 7, the platform supports the following two types for newly submitted applications:

- **Deb Applications**: Native applications running directly on the host, packaged in standard Debian package format
- **Docker Applications**: Containerized applications deployed via Docker Compose

> **Note:** The `.tpk` format submission channel for historical versions has been closed for new applications. Already published tpk-format applications will continue to be maintained, but all newly published applications must follow the Deb or Docker specifications defined in this document.


All applications submitted to the TNAS App Center must strictly follow this guide to pass platform automated validation and manual review.

---

[Next Chapter: Architecture Strategy](02_Architecture_Strategy.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Table of Contents](../README.md)
