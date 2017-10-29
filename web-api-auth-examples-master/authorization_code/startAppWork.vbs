Set oShell = WScript.CreateObject ("WScript.Shell")
oShell.run "cmd.exe"
WScript.Sleep 500
oShell.SendKeys "node app.js"
oShell.SendKeys "{ENTER}"
WScript.Sleep 1000
oShell.Run "C:\Users\gdirgela\AppData\Local\Google\Chrome\Application\chrome.exe -url http:\\localhost:8888/login"
'set oApp = CreateObject("Shell.Application")
'oApp.ShellExecute """C:\Users\gdirgela\AppData\Local\Google\Chrome\Application\chrome.exe""","http:\\localhost:8888","","",1
Set oShell = Nothing
'Set oApp = Nothing