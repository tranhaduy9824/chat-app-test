#!/bin/bash

# Chạy npm start trong cửa sổ PowerShell hiện tại
npm start

# Mở một cửa sổ PowerShell mới và chạy npm run socket
powershell.exe -NoProfile -Command "Start-Process powershell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"./run-socket.ps1\"' -Verb RunAs"
