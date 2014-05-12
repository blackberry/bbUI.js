## bbUI.js WebWorks Extension

When using [Context Menus](https://github.com/blackberry/bbUI.js/wiki/Context-Menus) for BlackBerry 10 you will need to include the Cordova
plugin contained in the **ext** folder shown above in the file listing.

_**NOTE: This is only for BlackBerry 10 devices, and it is not needed for PlayBook BlackBerry 10 styling**_

### Installing the bbUI.js WebWorks Extension

Installing the bbUI.js plugin in your WebWorks installation is quite simple.  You first locate your WebWorks installation directory.  On Windows the
default path is typically _C:\Program Files\BlackBerry\BB10 WebWorks SDK a.b.c.d_

In this directory you will find a **plugin** directory.  Simply create a **com.blackberry.bbui** sub directory and copy all the contents from the above **ext** directory
into your new sub directory.  It will end up looking like the following:

```
plugin
   \com.blackberry.bbui
       \src
           \blackberry10
              - index.js
       \www
          - client.js
      - plugin.xml
```


Add the plugin to your WebWorks 2.0 project using "webworks plugin add com.blackberry.bbui".


