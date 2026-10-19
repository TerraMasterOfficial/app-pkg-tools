# 19. FAQ

### 19.1 Review

**Q: What should I do if my review is rejected?**  
Review the rejection reason, correct it, and resubmit. Common rejection reasons include: JSON format errors, missing language files, port conflicts, icon format or icon path issues. Refer to the Review Standards chapter for details.

**Q: How long does the review take?**  
The total review cycle is usually 5–9 business days (of which manual review is 3–5 business days). Initial submissions may take longer (full manual review of all content); update version reviews are faster (typically 1–3 business days).

**Q: Can the app ID be changed?**  
It cannot be changed after creation. Please confirm the app ID carefully before publishing — in particular, it must not start with the reserved `tos` prefix (see 8.4.2 / 8.11).

**Q: Can my app ID start with `tos`?**  
No. `tos` is reserved by the platform in the nginx route/command namespace: an app ID starting with `tos` (for example `tos-log-server`) collides with the platform's own nginx entries and the application page cannot be opened normally; the nginx names derived from the app ID (`nginx/<appid>.conf`, the route prefix) must not start with `tos` either (FB-20261017-002; see 8.4.2 / 8.11). Choose a different app ID before publishing — the app ID cannot be changed after creation.

### 19.2 Technical Issues

**Q: What should I do about port conflicts?**  
- Use of system-reserved ports is prohibited: 22, 80, 443, 445, 3306, 5050, 5432, 6379, 8181, 8443 (authoritative list: Appendix B of Chapter 20)
- Recommended range: 8000–19999
- Detect port occupation in a preinst script before installation
- Different apps use different ports; the platform does not auto-assign ports

**Q: What are the version numbering rules?**  
- The version number must follow 4.2 Version Number Specification: allowed characters, numerically comparable, and greater than the previously published version. It always comes from the `version` field in `config.ini`
- The App Center detects updates by comparing version numbers numerically, so a version that is not greater than the installed one will not reach existing users as an update
- Recommended: digits and dots only, increasing over time (e.g. `1.0.0` → `1.0.1`); SemVer `major.minor.patch` is a good default
- For beta versions, use the `"beta": true` field instead of a `-beta` / `-rc` suffix

**Q: Single-package or dual-package?**  
- Starting from scratch → Single-package mode (all files integrated into one deb package)
- Existing general-purpose standard deb package, complex build → Dual-package mode (source package + data package)
- Simple binary program → Single-package mode

**Q: The config.ini file has a .ini extension but the content is JSON — why?**  
Early TOS configuration systems used the `.ini` extension. To maintain backward compatibility and reduce developer migration costs, new versions retain this extension, but the internal parser has been upgraded to JSON format. Developers only need to write using JSON syntax.

### 19.3 Installation & Running

**Q: What should I do if app installation fails?**  
1. Check `systemctl status <system_id>` to view service status
2. Check `journalctl -u <system_id> -n 50` to view service logs
3. Verify that all required fields in config.ini are correctly filled
4. Verify that the systemd service file path and permissions are correct
5. Verify that the port is not in use: `ss -tlnp | grep <port>`

**Q: How do I debug WebUI internal-opening apps?**  
1. Check whether `/var/api/<app_id>.sock` exists
2. Use `curl --unix-socket /var/api/<app_id>.sock http://localhost/` to directly test the backend
3. In the browser DevTools Network panel, check requests to `/v2/proxy/<app_id>/`
4. Verify that the frontend correctly includes the `Cookie` and `X-Csrf-Token` headers

**Q: How do I debug WebUI external-opening apps?**  
1. Check that the backend is listening on the port expected by the app's `path` field
2. Check the nginx configuration file path and syntax: `nginx -t`
3. Directly access `http://<TNAS_IP>:<port>` to confirm the backend responds correctly
4. If the portal block (`location /<app_id>/`) carries `proxy_pass`, verify that its port matches the backend listening port. A portal block that only sets the proxy headers (no `proxy_pass`) is compliant when the application ships its own frontend Web panel and its service is reachable through the application socket `/var/api/<app_id>.sock`; adding `proxy_pass` to the portal block is only an optional improvement and must never be used as a ground for rejection (see 8.3.2 / 8.11; advisory item list: 12 §12.10)
5. If the app page still cannot be opened, check the App ID and the nginx names derived from it (`nginx/<appid>.conf` and the route prefix): names starting with the reserved `tos` prefix collide with the platform's own nginx entries and must be renamed (FB-20261017-002; see 8.4.2 / 8.11).

---

← [Previous: Commercialization & Donations](18_Commercialization_Donations.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: Appendix](20_Appendix.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
