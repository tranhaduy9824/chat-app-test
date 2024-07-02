# Chạy npm start trong cửa sổ PowerShell hiện tại
npm start

# Mở một cửa sổ PowerShell mới và chạy npm run socket
Start-Process powershell.exe -ArgumentList '-ExecutionPolicy Bypass -NoProfile -File "./run-socket.ps1"' -Verb RunAs
