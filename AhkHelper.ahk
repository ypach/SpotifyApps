;MsgBox %0%

if %0%>0 
{
	aArgs := StrSplit(%0%,";",";")
	p1 := aArgs[1]
	;MsgBox %aArgs[1]%
	Gosub, %p1%
}
;MsgBox %1%
return


fRunSpotify:
Process, Exist, Spotify.exe
;MsgBox, %ErrorLevel%
If ErrorLevel = 0
{
	Run, C:\Progs\Spotify\Spotify.exe
	sleep, 3000
}
return

fWinActivate:
p2 := aArgs[2]
IfWinExist, %p2%
{
	WinActivate
}
else
{
	sProc = %p2%.exe
	;MsgBox, %sProc%
	Process, Exist, %sProc%
	;MsgBox, %ErrorLevel%
	If ErrorLevel > 0
	{
		pid = %ErrorLevel%
		WinGetClass, ClassID, ahk_pid %pid%
		WinActivate, ahk_class %classID%
	}
}
return

fControlClick:
p2 := aArgs[2]
p3 := aArgs[3]
p4 := aArgs[4]
IfWinExist, %p4%
{
	;MsgBox, spotify exists
	ControlClick, %p2% %p3%, %p4%
}
else
{
	sProc = %p4%.exe
	;MsgBox, %sProc%
	Process, Exist, %sProc%
	;MsgBox, %ErrorLevel%
	If ErrorLevel > 0
	{
		;MsgBox, Spotify controlClick
		pid = %ErrorLevel%
		WinGetClass, ClassID, ahk_pid %pid%
		ControlClick, %p2% %p3%, ahk_class %classID%
	}
}
return

fMouseMove:
p2 := aArgs[2]
p3 := aArgs[3]
MouseMove, %p2%, %p3%
return

fClick:
p2 := aArgs[2]
p3 := aArgs[3]
Click, left, %p2%, %p3%
return

fResizeWindow:
p2 := aArgs[2]
p3 := aArgs[3]
p4 := aArgs[4]
IfWinExist, %p2%
{
	WinMove, %p2%,,,,%p3%,%p4%
}
else
{
	sProc = %p2%.exe
	;MsgBox, %sProc%
	Process, Exist, %sProc%
	;MsgBox, %ErrorLevel%
	If ErrorLevel > 0
	{
		pid = %ErrorLevel%
		WinGetClass, ClassID, ahk_pid %pid%
		WinMove, ahk_class %classID%,,,,%p3%,%p4%
	}
}
return

fMoveWindow:
p2 := aArgs[2]
p3 := aArgs[3]
p4 := aArgs[4]
IfWinExist, %p2%
{
	;MsgBox, exists
	WinRestore, %p2%
	WinMove, %p2%,,%p3%,%p4%
}
else
{
	sProc = %p2%.exe
	;MsgBox, %sProc%
	Process, Exist, %sProc%
	;MsgBox, %ErrorLevel%
	If ErrorLevel > 0
	{
		pid = %ErrorLevel%
		WinGetClass, ClassID, ahk_pid %pid%
		WinWait, ahk_class %classID%
		WinRestore
		WinMove, %p3%, %p4%
	}
}
return

fWindowTop:
p2 := aArgs[2]
IfWinExist, %p2%
{
	WinWait, %p2%
	WinSet, AlwaysOnTop, Toggle
	WinSet, AlwaysOnTop, Off
}
else
{
	sProc = %p2%.exe
	;MsgBox, %sProc%
	Process, Exist, %sProc%
	;MsgBox, %ErrorLevel%
	If ErrorLevel > 0
	{
		pid = %ErrorLevel%
		WinGetClass, ClassID, ahk_pid %pid%
		WinWait, ahk_class %classID%
		WinSet, AlwaysOnTop, Toggle
		WinSet, AlwaysOnTop, Off
	}
}
return