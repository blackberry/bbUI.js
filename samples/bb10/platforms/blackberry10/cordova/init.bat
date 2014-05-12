@ECHO OFF
goto comment
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
:comment

set /P CORDOVA_VERSION=<%~dps0..\VERSION
set CORDOVA_HOME_DIR=%USERPROFILE%\.cordova\lib\blackberry10\cordova\%CORDOVA_VERSION%
set LOCAL_NODE_BINARY=%CORDOVA_HOME_DIR%\bin\dependencies\node\bin
set LOCAL_BBTOOLS_BINARY=%CORDOVA_HOME_DIR%\bin\dependencies\bb-tools\bin

if defined CORDOVA_NODE (
    if exist "%CORDOVA_NODE%" (
        if defined CORDOVA_BBTOOLS (
            if exist "%CORDOVA_BBTOOLS%" (
                goto end
            )
        )
    )
)

if exist "%LOCAL_NODE_BINARY%" (
    set CORDOVA_NODE=%LOCAL_NODE_BINARY%
) else (
    set FOUNDNODE=
    for %%e in (%PATHEXT%) do (
        for %%X in (node%%e) do (
            if not defined FOUNDNODE (
                set FOUNDNODE=%%~$PATH:X
                for %%F in ("%%~$PATH:X") do set CORDOVA_NODE=%%~dpF
            )
        )
    )
)

if exist "%LOCAL_BBTOOLS_BINARY%" (
    set CORDOVA_BBTOOLS=%LOCAL_BBTOOLS_BINARY%
) else (
    set FOUNDBBTOOLS=
    for %%e in (%PATHEXT%) do (
        for %%X in (blackberry-nativepackager%%e) do (
            if not defined FOUNDBBTOOLS (
                set FOUNDBBTOOLS=%%~$PATH:X
                for %%F in ("%%~$PATH:X") do set CORDOVA_BBTOOLS=%%~dpF
            )
        )
    )
)

:end

set FOUNDJAVA=
for %%e in (%PATHEXT%) do (
  for %%X in (java%%e) do (
    if not defined FOUNDJAVA (
      set FOUNDJAVA=%%~$PATH:X
    )
  )
)

if not exist "%LOCAL_NODE_BINARY%" (
  if not exist "%CORDOVA_NODE%\node.exe" (
    echo node cannot be found on the path. Aborting.
    exit /b 2
  )
)
if exist "%~dp0..\package.json" (
  if not exist "%CORDOVA_NODE%\npm" (
    echo npm cannot be found on the path. Aborting.
    exit /b 2
  )
)
if not defined FOUNDJAVA (
  echo java cannot be found on the path. Aborting.
  exit /b 2
)
if not exist "%CORDOVA_BBTOOLS%\blackberry-nativepackager.bat" (
  echo blackberry-nativepackager cannot be found on the path. Aborting.
  exit /b 2
)
if not exist "%CORDOVA_BBTOOLS%\blackberry-deploy.bat" (
  echo blackberry-deploy cannot be found on the path. Aborting.
  exit /b 2
)
if not exist "%CORDOVA_BBTOOLS%\blackberry-signer.bat" (
  echo blackberry-signer cannot be found on the path. Aborting.
  exit /b 2
)
if not exist "%CORDOVA_BBTOOLS%\blackberry-debugtokenrequest.bat" (
  echo blackberry-debugtokenrequest cannot be found on the path. Aborting.
  exit /b 2
)

"%CORDOVA_NODE%\node" "%~dp0\check_reqs.js" %*

exit /b 0
