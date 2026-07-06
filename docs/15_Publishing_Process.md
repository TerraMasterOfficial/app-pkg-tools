# 15. Publishing Process

### 15.1 Detailed Operation Workflow

#### Step 1: Register a Developer Account

1. Visit the TNAS Developer Platform: https://developer.terra-master.com
2. Click the [Register] button to enter the registration information page
3. Use a valid email address as your login account and fill in your developer name (it is recommended to keep it consistent with the `publisher` field in the configuration file)
4. Read and agree to the terms of service, then click [Confirm] to complete registration
5. Email verification is required after registration; the account takes effect immediately with no manual review needed.

> **Note:** The account email is used to receive review result notifications, password resets, and other important information. Please keep your email valid.

#### Step 2: Obtain Configuration Templates and Develop Your Application

1. Refer to the standard templates in Chapter 8 (Deb Application Development & Configuration Specification) of this document to write config.ini, app.lang, systemd service files, and other configurations, or use the recommended project template repository on the TNAS Developer Platform for quick initialization
2. Complete application development and packaging according to this document's specifications
3. Perform local testing and verification (see Chapter 13)

#### Step 3: Create a Public Repository

1. Create a public repository on GitHub or Gitee
2. Upload all required files (configuration files, application packages, icons, README.md, etc.)
3. **Deb applications** — upload the `<appid>_<platform>.tar.gz` archive (containing the `<appid>.deb` data package and `<package>.deb` source package)
4. **Docker applications** — upload `docker-compose.yml`, `config.ini`, `app.lang`, and icon files
5. Include SHA-256 checksum files

#### Step 4: Create an Application on the Developer Platform

1. Log in to the Developer Platform, click [My Applications] → [Add Application]
2. Fill in application information:
   - **Application ID**: Must exactly match the `id` field in config.ini
   - **Application Package Type**: Choose Docker or Deb package type
   - **Repository URL**: Provide the public repository URL (must be public, otherwise review cannot proceed)
3. Confirm and submit the creation

#### Step 5: Add a New Application Version

1. Find the target application under [My Applications] and click [Version Management]
2. Click [Add Version] and fill in the version number
   - Version number format: strictly follow `xx.yy.zzz` (major.minor.patch)
   - Historical version numbers cannot be reused
   - Must match the `version` field in config.ini
3. After submitting the version, the publishing application process begins

#### Step 6: Platform Automated Validation

After submission, the platform automatically performs the following checks:
- File format validation (config.ini JSON syntax, app.lang format)
- Field completeness validation (no missing required fields)
- Language coverage validation (all 14 language nodes present)
- Icon validation (SVG format, path matching)
- Checksum verification (SHA-256 matches uploaded files)
- Version consistency validation (config.ini / DEBIAN/control / app.lang version match; Docker apps only check config.ini and app.lang version consistency, no DEBIAN/control check needed)

**Common causes of automated validation failure:**
- config.ini contains comments or syntax errors
- app.lang is missing language nodes
- Icon not found or incorrect format
- Checksum mismatch

#### Step 7: Manual Review

The review team reviews from four dimensions (see Chapter 16 for details):
1. **Configuration Completeness** (weight 30%): All required files present, correct format
2. **Functional Availability** (weight 35%): Install, start, run, uninstall all function without errors
3. **Security** (weight 25%): No malicious code, no excessive authorization, no hardcoded sensitive data
4. **Compliance** (weight 10%): Content compliance, description matches functionality

Review workflow: Initial Review (information consistency, repository compliance) → Security Review (technical support staff) → Functional Compatibility Testing (testing support staff) → Comprehensive Review (dedicated review staff)

#### Step 8: Review Result Notification

Review results are delivered to developers through two channels:
- **Platform Messages**: Log in to the Developer Platform to check review status
- **Registered Email**: Review results are sent to the email used during registration

Review status descriptions:
- **Under Review**: Application is in the review queue
- **Approved**: Application has passed review and entered the publishing process
- **Rejected**: Application has issues that need correction; must be fixed and resubmitted within 30 days
- **Voluntarily Withdrawn**: Developer has proactively withdrawn the review application

#### Step 9: Official Publication

After passing the review, the application will be listed on the TNAS App Center within 1-2 business days:
- Users can search for and install the application in the App Center
- Developers can check the application status change to "Published" under [My Applications]

> **Statistics:** The developer dashboard displays core data such as the number of published apps, total app downloads, and cumulative app submissions. The progress of the 3 most recent publishing applications is updated in real time.

### 15.2 Repository Requirements

- Must be a **public repository** (GitHub or Gitee). Private repositories are not supported.
- Must contain all required configuration files and application resources.
- Deb applications must submit a `tar.gz` archive containing the `<appid>.deb` data package and `<package>.deb` source package.
- Docker applications must submit `docker-compose.yml`, `config.ini`, `app.lang`, and icon files.
- Repository resources must remain available long-term. Published resources cannot be deleted.
- The repository structure must conform to the specified directory layout.
- All binary artifacts must be accompanied by SHA-256 checksum files.

**Application Renaming and ID Change Policy:**
- The application `id` (in config.ini) **cannot be changed** once published
- The application display name (in app.lang) can be updated in new versions
- If the application `id` needs to be changed, it must be submitted as a brand new application (new listing, new review)
- The old application must go through the application delisting process (see Section 17.4)

---

← [Previous: CICD Guide](14_CICD_Guide.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: Review Standards](16_Review_Standards.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to TOC](../README.md)
