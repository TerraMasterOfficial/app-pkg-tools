# TOS 6 Application Development Guide

## １、The run environment of the TOS 6 app maker
```shell
target: x86_64 
./makeapp_x64

target: aarch64
./makeapp_arm
```

## 2、App storage location
```
x86_64：projects are stored in x64_tos6_apps; 
aarch64: projects are stored in arm_tos6_apps
```

## 3、make tpk package
```shell
#packaged application location
./x64_tos6_apps/TOS6_APP_HelloWorld/output
./arm_tos6_apps/TOS6_APP_HelloWorld/output

#x86_64　platform:
./makeapp_x64 -path x64_tos6_apps/TOS6_APP_HelloWorld

#aarch64 platform:
./makeapp_arm -path arm_tos6_apps/TOS6_APP_HelloWorld
```

## 4、Application data directory
> Applications with data storage requirements can call system interfaces in startup scripts
```shell
ter_share_add -name ExampleData -owner ExampleUser
```

## 5、Development Manual
> [Development Manual](Manual.md)
