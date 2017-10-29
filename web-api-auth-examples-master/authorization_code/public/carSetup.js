var vGetCoverTimeout;
var gvRefreshTokenTimeout;
var gvProgressTimeout;
var gvScrollAlbumNameTimeout;
var gvScrollTrackNameTimeout;
var gvScrollArtistNameTimeout;
var gsRetry;
var sXml = '<root><el name"el1"></el></root>';
var parser = new DOMParser();
var gvConfig = parser.parseFromString(sXml,"text/xml");



fRefreshToken();
fInit();
function fInit(){
	var sPath = 'HomeDir/appConfig.xml';
	var sConfigExists = fFileExists(sPath).toString();
	var sRes = sConfigExists;
	if (sConfigExists == 'true'){
		sRes = sRes + '; config exists';
		//el('x').innerText = sRes;
		sRes = fReadConfig(sPath);
		fReadEq();
		var sVolume = getConfVal('Volume');
		if (sVolume=='null'){
			sVolume = 20;
		}
		setVolume(sVolume);
	}
	else{
		sRes = sRes + '; config does not exist';
	}
	//el('x').innerText = sRes;
}

function setVolume(sVolume){
	var nVolumeLength = el('divVolumeScope').style.width.replace('px','');
	var nSpotifyVolumeLength = 61;
	var nX = nVolumeLength*sVolume/100;
	el('divVolume').style.width = nX + 'px';
	var nClickX = nX*nSpotifyVolumeLength/nVolumeLength + 720;
	controlClick(nClickX,570);
}

function setEq(nBand,nLevel){
	hidePointer();
	var sPath = getConfVal('ApoSpotifyConfigPath');
	var sFilter = 'Filter f' + nBand;
	var sEq = fReadFile(sPath);
	var saEq = sEq.split('\r\n');
	var sRes ='';
	try{
		var sRow;
		var sSep='';
		for (sRow of saEq){
			if (sRow.startsWith(sFilter)){
				el('x').innerText = nBand+', '+nLevel + ', ' + sFilter;
				var saGain = sRow.split('Gain');
				var saDb = saGain[1].split('dB');
				var sRowNew = saGain[0] + 'Gain ' + nLevel + ' dB' + saDb[1];
				el('tFilter'+nBand).value = nLevel;
				sRes = sRes + sSep + sRowNew;
			}else{
				sRes = sRes + sSep + sRow;
			}
			sSep ='\r\n';
		}
		fWriteFile(sPath,sRes);
	} catch (err) {
		sRes = err.message;
	}
	//el('x').innerText = sRes;
}

function setBrightness(n){
	var nOpacity = el('divBrightness').style.opacity - 0.1*n;
	if (nOpacity<0){
		nOpacity = 0;
	}
	if (nOpacity>1){
		nOpacity = 1;
	}
	el('divBrightness').style.opacity = nOpacity;
}

function fReadConfig(sPath){
	var sRet = 'ok';
	var sXml = fReadFile(sPath);
	gvConfig = parser.parseFromString(sXml,"text/xml");
	//sRet = getConfVal('ApoSpotifyConfigPath');
	return sRet;
}

function getConfVal(sKey){
	
	var sVal = '';
	try{
		var vKey = gvConfig.getElementById(sKey);
		if (vKey != null){
			sVal = vKey.getAttribute('value').toString();
		}else{
			sVal='null';
		}
	}
	catch (err) {
		sVal = err.message;
	}
	return sVal;
}

function setConfVal(sKey,sVal){
	var vKey = gvConfig.getElementById(sKey);
	if (vKey != null){
		vKey.setAttribute('value',sVal);
	}
	else{
		var sXml = new XMLSerializer().serializeToString(gvConfig);
		sXml = sXml.replace('</config>','');
		var newKey = '\t' + '<key id="' + sKey +'" value="' + sVal + '"/>' + '\r\n</config>';
		sXml = sXml + newKey;
		gvConfig = parser.parseFromString(sXml,'text/xml');
	}
	var sXmlText = new XMLSerializer().serializeToString(gvConfig);	
	var sPath = 'HomeDir/appConfig.xml';
	fWriteFile(sPath,sXmlText);
}

function fReadFile(sPath){
	$.ajax({
		url: '/fReadFile'
		,async: false
		,data: {
		'sPath': sPath
	}
	}).done(function(data) {
	try{
		var d = new Date();
		//el('x').innerText = d.toLocaleString();
		//el('x').innerText = sPath + ' exists = ' + data.vRes + ' (' + d.toLocaleString() + ')';
		sRes = data.vRes;
		//alert(data.vRes);
		//getCover();
	}
	catch (err){
		alert(err.message);
	}
	});
	return sRes;
}
function fFileExists(sPath){
	var sRes = 'undefined';
	$.ajax({
		url: '/fFileExists'
		,async: false
		,data: {
		'sPath': sPath
	}
	}).done(function(data) {
	try{
		var d = new Date();
		//el('x').innerText = d.toLocaleString();
		//el('x').innerText = sPath + ' exists = ' + data.vRes + ' (' + d.toLocaleString() + ')';
		sRes = data.vRes;
		//alert(data.vRes);
		//getCover();
	}
	catch (err){
		alert(err.message);
	}
	});
	//alert(sRes);
	return sRes;
}

function fTest(){
	var sTest = fNow();
	setConfVal('EqCut2xx',5);
	return;
	var s = 'x';
	$.ajax({
		url: '/fTest',
		data: {
		'sP1': s
	}
	}).done(function(data) {
	try{
		var d = new Date();
		//el('x').innerText = d.toLocaleString();
		el('x').innerText = data.vRes;
		//alert(data.vRes);
		//getCover();
	}
	catch (err){
		alert(err.message);
	}
	});
}

function fRunAhk(sFunc){
	$.ajax({
		url: '/fRunAhk',
		data: {
		'sFunc': sFunc
	}
	}).done(function(data) {
	try{
		//var d = new Date();
		//el('x').innerText = d.toLocaleString();
		//alert(data.vRes);
		//getCover();
	}
	catch (err){
		alert(err.message);
	}
	});
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

function fReadEq(){
	var sFilter = 'Filter f';
	var sPath = getConfVal('ApoSpotifyConfigPath');
	var sEq = fReadFile(sPath);
	var saEq = sEq.split('\r\n');
	var sRes ='';
//	el('x').innerText = 'ok';
	try{
		var sRow;
		for (sRow of saEq){
			if (sRow.startsWith(sFilter)){
				var saGain = sRow.split('Gain');
				var saDb = saGain[1].split('dB');
				var nGain = Math.round(saDb[0]*1);
				var sFilterNr = sRow.substr(8,1);
				el('tFilter' + sFilterNr).value = nGain;
			}
		}
	} catch (err) {
		sRes = err.message;
	}
}

function fCutEq(n){
	hidePointer();
	var sPath = getConfVal('ApoSpotifyConfigPath');
	var sKey = 'EqCut' + n;
	var sFilter = 'Filter f' + n;
	var sGain = getConfVal(sKey);
	var sEq = fReadFile(sPath);
	var saEq = sEq.split('\r\n');
	var sRes ='';
	try{
		var sRow;
		var sSep='';
		for (sRow of saEq){
			if (sRow.startsWith(sFilter)){
				var saGain = sRow.split('Gain');
				var saDb = saGain[1].split('dB');
				var sRowNew = saGain[0] + 'Gain ' + sGain + ' dB' + saDb[1];
				el('tFilter' + n).value = sGain;
				sRes = sRes + sSep + sRowNew;
			}else{
				sRes = sRes + sSep + sRow;
			}
			sSep ='\r\n';
		}
		fWriteFile(sPath,sRes);
	} catch (err) {
		sRes = err.message;
	}
	el('x').innerText = sRes;
}

function fEq(n){
	hidePointer();
	var nD = Math.sign(n);
	var sFilter = 'Filter f' + n*nD + ' ';
	var sPath = getConfVal('ApoSpotifyConfigPath');
	var sEq = fReadFile(sPath);
	var saEq = sEq.split('\r\n');
	var sRes ='';
	try{
		var sRow;
		var sSep='';
		var sGain = '';
		for (sRow of saEq){
			if (sRow.startsWith(sFilter)){
				var saGain = sRow.split('Gain');
				var saDb = saGain[1].split('dB');
				if (sGain==''){
					var nGain = Math.round(saDb[0]*1 + nD);
					sGain = nGain;
				}
				var sRowNew = saGain[0] + 'Gain ' + sGain + ' dB' + saDb[1];
				el('tFilter' + n*nD).value = sGain;
				sRes = sRes + sSep + sRowNew;
			}else{
				sRes = sRes + sSep + sRow;
			}
			sSep ='\r\n';
		}
		fWriteFile(sPath,sRes);
	} catch (err) {
		sRes = err.message;
	}
	el('x').innerText = sRes;
	//if ()
}

function fWriteFile(sPath,sText){
	$.ajax({
		url: '/fWriteFile',
		async: false, 
		data: {
		'sPath': sPath
		,'sText': sText
	}
	}).done(function(data) {
	try{
		//var d = new Date();
		//el('x').innerText = d.toLocaleString();
		//alert(data.vRes);
		//getCover();
	}
	catch (err){
		alert(err.message);
	}
	});
}

function fMute(){
	controlClick(700,570);
}

function fVolumeClicked(e){
	var d = fNow();
	var sFunc = 'fWinActivate;Spotify';
	//fRunAhk(sFunc);
	//sleep(300);
	// 0 - 299;
	// 370 - 500;
	var nVolumeLength = el('divVolumeScope').style.width.replace('px','');
	var nSpotifyVolumeLength = 61;
	var nX = e.offsetX;
	el('divVolume').style.width = nX + 'px';
	var nVolume = Math.round(nX/nVolumeLength*100);
	var nClickX = nX*nSpotifyVolumeLength/nVolumeLength + 720;
	//el('x').innerText=nProgressLength;
	controlClick(nClickX,570);
	setConfVal('Volume',nVolume);
}

function fProgressClicked(e){
	var d = fNow();
	var sFunc = 'fWinActivate;Spotify';
	//fRunAhk(sFunc);
	//sleep(300);
	// 0 - 299;
	// 370 - 500;
	var nProgressLength = el('divProgressScope').style.width.replace('px','');
	var nSpotifyBarLength = 201;
	var nClickX = e.offsetX*nSpotifyBarLength/nProgressLength + 299;
	//el('x').innerText=nProgressLength;
	controlClick(nClickX,580);
	sleep(1500);
	getCover('Once','yes');
	
}
function fNow(){
	var d = new Date();
	return d.toLocaleString();
}
function fStrToMs(sStr){
	var saStr = sStr.split(':');
	var sMin = saStr[0];
	var sSec = saStr[1];
	//el('x').innerText = 'min = ' + sMin*1 + ', sec = ' + sSec*1;
	var vMs = sMin*60000+sSec*1000;
	return vMs;
}
function fMs(sElement){
	//el('x').innerText = el(sElement).value;
	return fStrToMs(el(sElement).value);
}
function msToStr(vMs){
	var sVal = '';
	var vMin = Math.floor(vMs/60000);
	var vSec = Math.floor((vMs % 60000) / 1000);
	var sSep = ':';
	if (vSec<10){
		sSep = ':0';
	}
	sVal = vMin + sSep + vSec;
	return sVal;
}
function showSettings(){
	var sVisibility = 'hidden';
	if (el('divSettings').style.visibility=='hidden'){
		sVisibility = 'visible';
	}
	el('divSettings').style.visibility = sVisibility;
}
function fRefreshToken(){
	el('obtain-new-token').click();
	clearTimeout(gvRefreshTokenTimeout);
	gvRefreshTokenTimeout = setTimeout(fRefreshToken,180000);
}
function showSpotify(){
	var sFunc = 'fMoveWindow;Spotify;50;-25';
	//sFunc = 'fMoveWindow;qqq;0;0';
	fRunAhk(sFunc);
	sleep(300);
	sFunc = 'fResizeWindow;Spotify;100;100';
	sleep(300);
	sFunc = 'fWinActivate;Spotify';
	fRunAhk(sFunc);
	showSettings();
}
function hideSpotify(){
	var sFunc = 'fMoveWindow;Spotify;1100;-25';
	//sFunc = 'fMoveWindow;qqq;0;0';
	fRunAhk(sFunc);
	sleep(300);
	sFunc = 'fWinActivate;qqq';
	fRunAhk(sFunc);
	showSettings();
	sleep(300);
	sFunc = 'fResizeWindow;Spotify;100;100';
	fRunAhk(sFunc);
}
function fPlayPause(){
	var sFunc = 'fWinActivate;Spotify';
	controlClick(400,550);
	//fRunAhk(sFunc);
	//sleep(300);
	sleep(1200);
	getCover('OncePP','yes');
}
function controlClick(nX,nY){
	sFunc = 'fControlClick;x' + nX + ';y' + nY + ';Spotify';
	fRunAhk(sFunc);
	hidePointer();
}
function hidePointer(){
	sleep(300);
	var sFunc = 'fMouseMove;5;700';
	fRunAhk(sFunc);
}
function fStart(){
	var sFunc = 'fMoveWindow;qqq;-25;-133';
	//sFunc = 'fMoveWindow;qqq;0;0';
	fRunAhk(sFunc);
	sleep(200);
	//alert('ok');
	sFunc = 'fRunSpotify';
	fRunAhk(sFunc);
	sleep(3300);
	sFunc = 'fMoveWindow;Spotify;1100;0';
	fRunAhk(sFunc);
	sleep(300);
	sFunc = 'fResizeWindow;Spotify;100;100';
	fRunAhk(sFunc);
	setTimeout(fRefreshToken,5000);
}


function fPrev(){
	//var sFunc = 'fWinActivate;Spotify';
	//fRunAhk(sFunc);
	//sleep(300);
	controlClick(355,550);
	sleep(1000);
	getCover('Once','yes');
}
function fNext(){
	//var sFunc = 'fWinActivate;Spotify';
	//fRunAhk(sFunc);
	//sleep(300);
	controlClick(445,550);
	sleep(400);
	el('hidCompTrackId').value = el('hidTrackId').value;
	getCover('Retry','yes');
}
function fNextOld(){
	$.ajax({
		url: '/fNext',
		data: {
		'x': 'xxx'
	}
	}).done(function(data) {
	try{
		sleep(1000);
		//alert(data.vRes);
		sleep(500);
		getCover('Retry');
	}
	catch (err){
		alert(err.message);
	}
	});
}
function fCreateFile(){
	try{
		var refresh_token = document.getElementById('tRefreshToken').value;
		var sAccessToken = document.getElementById('tAccessToken').value;
		$.ajax({
		  url: '/test',
		  data: {
			'refresh_token': refresh_token
		  }
		}).done(function(data) {
		  try{
			  var d = new Date();
			  var oauthSource = document.getElementById('oauth-template').innerHTML,
			  oauthTemplate = Handlebars.compile(oauthSource),
			  oauthPlaceholder = document.getElementById('oauth');
			  vTestVar = data.testVar;
			  oauthPlaceholder.innerHTML = oauthTemplate({
				access_token: sAccessToken,
				refresh_token: refresh_token,
				test_var: vTestVar
			  });
		  }
		  catch (err){
			  alert(err.message);
		  }
		});
	}
	catch (err){
		alert(err.message);
	}
}
function el(sId){
	var el = document.getElementById(sId);
	return el;
}
function retryGetCover(){
	//el('divMsg').innerText ='Retry: ' + gsRetry;
	if (gsRetry=='yes'){
		getCover('Retry','no');
	}
}
function getCoverTest(s){
	alert(s);
}
function getProgressWidth(){
	return el('divProgress').style.width.replace('px','');
}
function setProgressWidth(nWidth){
	return el('divProgress').style.width = nWidth + 'px';
}
function getProgressScopeWidth(){
	return el('divProgressScope').style.width.replace('px','');
}
function setProgressScopeWidth(nWidth){
	return el('divProgressScope').style.width = nWidth + 'px';
}
function fMoveProgress(){
	var vProgressMs = fMs('tProgress')+1000;
	var vDurationMs = fMs('tDuration');
	clearTimeout(gvProgressTimeout);
	if (vProgressMs<=vDurationMs){
		var sProgress = msToStr(vProgressMs);
		el('tProgress').value = sProgress;
		var nWidth = Math.floor((vProgressMs/vDurationMs)*getProgressScopeWidth());
		setProgressWidth(nWidth);
		gvProgressTimeout = setTimeout(fMoveProgress,1000);
		//el('x').innerText = vProgressMs + ', ' + vDurationMs;
	}
}
function fScrollAlbumName(){
	var vAlbum = document.getElementById('tAlbum');
	var sText = vAlbum.value;
	//alert(sText);
	var sChar = sText.substr(0,1);
	sText = sText.substr(1);
	vAlbum.value = sText + sChar;
	gvScrollAlbumNameTimeout = setTimeout(fScrollAlbumName,500);
}
function fScrollArtistName(){
	var vArtist = document.getElementById('tArtists');
	var sText = vArtist.value;
	//alert(sText);
	var sChar = sText.substr(0,1);
	sText = sText.substr(1);
	vArtist.value = sText + sChar;
	gvScrollArtistNameTimeout = setTimeout(fScrollArtistName,500);
}
function fScrollTrackName(){
	var vTrack = document.getElementById('tTrackName');
	var sText = vTrack.value;
	//alert(sText);
	var sChar = sText.substr(0,1);
	sText = sText.substr(1);
	vTrack.value = sText + sChar;
	gvScrollTrackNameTimeout = setTimeout(fScrollTrackName,500);
}
function getCover(psRetry,psHidePointer){
	//alert(psRetry);
	try{
		clearTimeout(vGetCoverTimeout);
		var sToken = document.getElementById('tAccessToken').value;
		var sUrl = 'https://api.spotify.com/v1/me/player/currently-playing?access_token=' + sToken;
		//el('x').innerText = sUrl;
		if (psRetry=='Retry'){
			setTimeout(retryGetCover,2000);
		}
		gsRetry = 'yes';
		$.get(
			"https://api.spotify.com/v1/me/player/currently-playing",
			{access_token : sToken},
			function(data) {
				try{
					gsRetry = 'no';
					//alert('page content: ' + data.item.album.name);
					//document.getElementById('divRes').innerHTML = data;
					var sImage = document.getElementById('imgCover').src;
					var d = new Date();
					var sRes = d.toLocaleString();
					var sTrackIdOld = document.getElementById('hidCompTrackId').value;
					sRes = sRes + '\r\n' + 'retryGs: ' + gsRetry;
					sRes = sRes + '\r\n' + 'retry: ' + psRetry;
					sRes = sRes + '\r\n' + 'track: ' + sTrackIdOld;
					var sTrackIdNew = data.item.id;
					document.getElementById('hidTrackId').value = sTrackIdNew;
					var sTrackName = data.item.name;
					el('tTrackName').value=sTrackName;
					//alert(sTrackName);
					sRes = sRes + '\r\n' + 'track: ' + sTrackIdNew;
					var vProgressMs = data.progress_ms;
					sRes = sRes + '\r\n' + 'progress_ms: ' + vProgressMs;
					var sProgress = msToStr(vProgressMs);
					el('tProgress').value = sProgress;
					var vDuration = data.item.duration_ms;
					var vProgressScopeLength = el('divProgressScope').style.width.replace('px','');
					var vProgressWidth = Math.floor((vProgressMs/vDuration)*vProgressScopeLength);
					el('divProgress').style.width = vProgressWidth + 'px';
					sRes = sRes + '\r\n' + 'duration_ms: ' + vDuration;
					clearTimeout(gvProgressTimeout);
					gvProgressTimeout = setTimeout(fMoveProgress,1000);
					//el('x').innerText = sIsPlaying;
					if (psRetry=='OncePP'){
						var sIsPlaying = data.is_playing.toString();
						if (sIsPlaying=='true'){
						}else{
							clearTimeout(gvProgressTimeout);
						};
					}
					var sDuration = msToStr(vDuration);
					el('tDuration').value = sDuration;
					var nTimeOut = data.item.duration_ms - data.progress_ms + 100;
					if (psRetry=='Retry'){
						if (sTrackIdNew==sTrackIdOld){
							nTimeOut = 500;
						};
					};
					sRes = sRes + '\r\n' + 'TimeOut: ' + nTimeOut;
					clearTimeout(vGetCoverTimeout);
					vGetCoverTimeout = setTimeout(getCover,nTimeOut,'Retry');
					var sAlbum = data.item.album.name;
					sRes = sRes + '\r\n' + 'track: ' + data.item.name;
					sRes = sRes + '\r\n' + 'album: ' + sAlbum;
					var sArtists = '';
					var sComma = '';
					for (var i=0;i<data.item.artists.length;i++){
						sArtists = sArtists + sComma + data.item.artists[i].name;
						sComma = ', ';
					}
					sRes = sRes + '\r\n' + 'artist(s): ' + sArtists;
					el('tArtists').value = sArtists;
					el('tAlbum').value = sAlbum;
					el('spAlbumName').innerText = sAlbum;
					el('spArtistName').innerText = sArtists;
					el('spTrackName').innerText = sTrackName;
					var nAlbumInputWidth = el('tAlbum').style.width.replace('px','');
					var nAlbumNameWidth = el('spAlbumName').offsetWidth;
					var nArtistInputWidth = el('tArtists').style.width.replace('px','');
					var nArtistNameWidth = el('spArtistName').offsetWidth;
					var nTrackInputWidth = el('tTrackName').style.width.replace('px','');
					var nTrackNameWidth = el('spTrackName').offsetWidth;
					clearTimeout(gvScrollAlbumNameTimeout);
					clearTimeout(gvScrollArtistNameTimeout);
					clearTimeout(gvScrollTrackNameTimeout);
					if (nAlbumNameWidth > nAlbumInputWidth){
						el('tAlbum').value = '      * * *      ' + sAlbum ;
						gvScrollAlbumNameTimeout = setTimeout(fScrollAlbumName,500);
					}
					//el('x').innerText = nTrackNameWidth + ', ' + nTrackInputWidth;
					if (nArtistNameWidth > nArtistInputWidth){
						el('tArtists').value = '      * * *      ' + sArtists;
						gvScrollArtisNameTimeout = setTimeout(fScrollArtistName,500);
					}
					if (nTrackNameWidth > nTrackInputWidth){
						el('tTrackName').value = '      * * *      ' + sTrackName;
						gvScrollTrackNameTimeout = setTimeout(fScrollTrackName,500);
					}
					for (var i=0;i<data.item.album.images.length;i++){
						sRes = sRes + '\r\n' + 'image' + i + ': ' + data.item.album.images[i].height + 'x' + data.item.album.images[i].width;
						if (Math.abs(data.item.album.images[i].height-600)<100){
							sRes = sRes + '\r\n' + 'image: ' + sImage;
							sRes = sRes + '\r\n' + 'image: ' + data.item.album.images[i].url;
							document.getElementById('imgCover').src = data.item.album.images[i].url;
						}
					}
					document.getElementById('divMsg').innerText = sRes;
					//var sFunc = 'fWinActivate;qqq';
					//fRunAhk(sFunc);
				}
				catch (err){
					el('divMsg').innerText = err.message;
					vGetCoverTimeout = setTimeout(getCover,2000,'Retry');
				}
			}
		);
		if (psHidePointer=='yes'){
			hidePointer();
		}
	}
	catch (err) {
		alert(err.message);
	}
};
