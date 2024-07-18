# TOS 6 Native Application Development Guide - v1.0

## Overview

Unlike TOS 5, TOS 6 adopts a root file system that is fully compatible with Ubuntu 22.04. Similar to Ubuntu, the booting, shutdown, and application hosting of the TOS 6 system are all managed by systemd. Therefore, the way applications are launched and hosted in TOS 6 is slightly different from the past. If you plan to develop native applications that run on TOS 6, please refer to the following development guidelines.

> The id of the application is the unique identifier of the application; the 'appid' in the document all represents the id of the application.
> ![image](Application.png)

## 1¡¢config.ini£ºConfiguration file: config.ini (required)

#### config.ini is in json format
```json
{
  "id": "appid", 
  "md5": "",
  "path": "/appid/",
  "icon": "/images/icons/appid.svg",
  "name": "app name",
  "exec": true,
  "user": "",
  "group": "",
  "open_path": false,
  "resize": true,
  "state": false,
  "type": "iframe",
  "help": "",
  "version": "x.x.xxx",
  "recommend": true,
  "beta": true,
  "category": "Utilities",
  "depend": [],
  "platform": "x86_64",
  "low_version": "6.0.0",
  "reset": false,
  "official": "",
  "maxmin":true,
  "cli": {
    "name":"xxx",
    "path": "bin/xxx"
  }
}

```
#### Field Description

`id` : The unique feature of the application, which can only be composed of uppercase and lowercase letters and numbers, namely appid

`md5` : Leave blank by default, the packaging tool will automatically generate the md5 value

`path` : The default entry path for the application. By default, a path named with the application id is generated in the root directory of the application

`icon` : The path where the application's desktop icon is stored. The default is at  _site/images/icons/appid.svg_

`name` : The name of the application. Can be left blank, the system will automatically load the name from appid.lang

`exec` : Whether the application has a startup script, value: true/false

`user`: Create and specify a user to run the application; Leave blank to use the default user

`group`: Create and specify a user group for the user you created; Leave blank to use the default group (allusers)

`open_path` : Whether the application needs to be opened in a new window, value: true/false

`resize` : Used to define whether the front-end pop-up window can be resized; This is only valid when a non-new window is opened

`maxmin` : Used to define whether the front-end popup window can be maximized or minimized; this is only valid when the app does not open with a new window

`state` : Default value: false, no need to modify

`type` : use default: iframe

`help` : the URL of the application's help documentation; if it does not exist, leave it blank

`version` : the version information of the application

`recommend` : Marks whether the application is a recommended application. Value: true/false

`beta` : mark whether the application is a beta version; value: true/false

`category` : The category of the application. There are 6 values: Utilities, Security, Multimedia, Development_Tools, Business, Backup

`depend` : Whether the operation of the application depends on other applications, fill in the id of the dependent application here. For example: if the application needs to rely on mysql, fill in ["mysql"]

`platform` : The platform to run on. Value: x86_64/aarch64

`low_version` : Defines the minimum requirement for the TOS version. Applications are only available to compliant TOS systems

`reset` : Whether the application has a reset function, value: true/false

`official` : the official website of the application

`cli` : When the application is a command-line tool, it is used to register it with the routing of the TOS system


## 2. init.d/MyService.service: service block

> Optional: This service block is only effective when the value of exec in config.ini is true. Some applications may not need to be managed by the system, such as php_script, go, python.

```service
[Unit] Section
Description: A short description of the service.
Documentation: Web documentation related to the service, which can include multiple URL addresses.
Requires: Defines strong dependencies required by the service. If any of the required services fail to start, this service will also fail to start.
Wants: Defines weak dependencies required by the service. Even if any of the dependent services fail to start, this service will still continue to start.
BindsTo: Defines binding relationships for the service. If the bound service stops, this service will also stop.
PartOf: If PartOf is set, when other units are stopped or restarted, this unit will also be stopped or restarted.
Conflicts: Defines conflict relationships for the service. If a conflicting service starts, this service will stop.
Before and After: Define the order in which services are started.
OnFailure: Sets other units to start when this unit fails.

[Service] Section
Type: Defines the type of service, which can be simple, forking, oneshot, dbus, notify, or idle.
ExecStart: Defines the command to run when starting the service.
ExecStartPre and ExecStartPost: Define commands to run before and after the ExecStart command.
ExecReload: Defines the command to run when reloading the service configuration.
ExecStop: Defines the command to run when stopping the service.
Restart: Defines when the service should automatically restart, which can be no (the default), on-success, on-failure, on-abnormal, on-watchdog, on-abort, or always.
User and Group: Define the user and group used to run the service.
Environment, EnvironmentFile, and PassEnvironment: Set environment variables for the service.
WorkingDirectory: Sets the working directory for the service.

[Install] Section
Alias: Defines an alias for the service, which can be used to enable or disable the service.
WantedBy, RequiredBy, WantedBy, PartOf, BoundBy: Used to add the service to other targets.
Also: When one unit is enabled or disabled, other units will also be enabled or disabled.

Official Documentation: https://www.freedesktop.org/software/systemd/man/latest/index.html
Chinese Documentation: https://www.jinbuguo.com/systemd/systemd.index.html
```

## 3. Related scripts in the directory scripts

> Optional; Used to store some scripts related to starting the service. When there are no other scripts, this directory may not be needed;

## 4. Directory sbin, bin, lib

>Optional; used to store binary programs or dependent libraries necessary for the app; when there are no binary files, these directories are not required;

## 5. Directory images

> There must be an icons subdirectory for storing appid.png or appid.svg;
If the front-end UI needs other icons or images, the icons or images must be stored in the appid subdirectory under this directory (used to isolate the icons that the application depends on), the directory structure is as follows:

```
©À©¤©¤ images
©¦   ©À©¤©¤ appid
©¦   ©¦   ©¸©¤©¤ *.svg #Store the icons or images required by the front end
©¦   ©¸©¤©¤ icons
©¦       ©¸©¤©¤ appid.png
```

## 6. Directory config

> Used to hold some other configuration related to the application; As long as the startup script can load and configure them.

## 7. Multilingual configuration of application name and description

> appid.lang, the format is as follows:

```
[zh-cn]
name = "application name" # application name
auth = "TerraMaster" # developer
version = 2.4.008 #application version
description = "" #application description

[zh-hk]
name = "application name"
auth = "TerraMaster"
version = 2.4.008
descript = ""

[en-us]
name = "application name"
auth = "TerraMaster"
version = 2.4.008
descript = ""

...and some other languages, here is a list of some of the existing languages:

zh-cn
zh-hk
en-us
fr-fr 
de-de
it-it
es-es
hu-hu
ja-jp
ko-kr
pl-pl
ru-ru
tr-tr
pt-pt

You can choose to add other languages
```

## 8. A detailed explanation of webui.bz2

> Inside the tar package is the front-end interface of the application.
It is in the form of a tar package to ensure the integrity of the updated application.

## 9. A detailed explanation of lang.bz2

> The tar package contains the translation of the front-end interface of the application. The structure is as follows:

```
./
./hu-hu/
./hu-hu/appid.lang
./pt-pt/
./pt-pt/appid.lang
./fr-fr/
./fr-fr/appid.lang
./ko-kr/
./ko-kr/appid.lang
./pl-pl/
./pl-pl/appid.lang
./zh-hk/
./zh-hk/appid.lang
./en-us/
./en-us/appid.lang
./de-de/
./de-de/appid.lang
./es-es/
./es-es/appid.lang
./ru-ru/
./ru-ru/appid.lang
./it-it/
./it-it/appid.lang
./ja-jp/
./ja-jp/appid.lang
./zh-cn/
./zh-cn/appid.lang
./tr-tr/
./tr-tr/appid.lang
```

```
The language document format is a standard ini file, the format is as follows:

[appid]
key1 = "value"
key2 = "value"
key3 = "value"
...
```

## 10. Directory modules

> Used to store the index.json configuration file; this directory is related to the front-end UI, and applications without UI can ignore it; the format is as follows:

```
[
    {
        "id": "appid_key1",
        "icon": "/images/appid/key1.svg",
        "name": ["appid","key1"],
        "type": "iframe",
        "path": "/",
        "is_delete": true,
        "role": ["root","default"]
    },
    {
        "id": "appid_key2",
        "icon": "/images/appid/key2.svg",
        "name": ["appid","key2"],
        "type": "iframe",
        "is_delete": true,
        "path": "/key2",
        "role": ["root","default"]
    },
    {
        "id": "appid_key3",
        "icon": "/images/appid/key3.svg",
        "name": ["appid","key3"],
        "type": "iframe",
        "path": "/key3",
        "is_delete": true,
        "role": ["root","default"]
    }
]
```
#### Field Description
`id` : the unique identifier of the application function module;

`icon` : the icon displayed by the application function module, the storage location refers to the description of "directory images";

`name` : The translation variable of the name of the application function module, please refer to the description of "lang.bz2";

`type` : default: iframe;

`path` : is the front-end route corresponding to the function;

`is_delete` : default: true;

`role` : indicates which users are allowed to control the function module, root indicates administrator, default is non-administrator, or both can be assigned;

## 11, profile.sh: global environment variable configuration

> Optional; the format is as follows:

```shell
#!/bin/bash
AppRoot=$(dirname $(readlink -f "${BASH_SOURCE[0]}"))
AppBin="${AppRoot}/bin"

if [ ! -d $AppBin ]; then
  return 1
fi

export PATH="${PATH}:${AppBin}"
```

## 12. Map to TOS configuration (sysroot directory)

>Optional; when installing the application, link all the files in this directory to the corresponding directory in the TOS system; this option is valid for those dependent libraries that cannot be found.
Note: Lazy configuration is not recommended (that is, put the entire application in this directory for mapping)