/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */


var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '847860513a584ff0a66a5dc036042382'; // Your client id
var client_secret = 'b8f52ce3eb724d2f9a6b246e6e776de2'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
//var client_id = 'aaa'; // Your client id
//var client_secret = 'xxx'; // Your secret
//var redirect_uri = 'aaa'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

var gvPath = require('path');
var gsHome = gvPath.resolve(__dirname);

/*
var sXml = '<root><el name"el1"></el></root>';
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();
var gvConfig = parser.parseFromString(sXml,"text/xml");
*/

app.get('/fRunAhk', function(req,res) {
	var sFunc = req.query.sFunc;
	fRunAhk(sFunc);
	res.send({'vRes': 'ok'});
});

function fRunAhk(sFunc){
	var cmd=require('node-cmd');
	var sCmd = '"C:/Program Files/AutoHotKey/autohotkey.exe" /f C:/Scripts/SpotifyApps/AhkHelper.ahk "' + sFunc;
	//sCmd = 'notepad.exe c:/tmp/f1.txt';
	cmd.run(sCmd);
	return;
}

function fClick (sX,sY){
	var sleep = require('system-sleep');
	fRunAhk("fWinActivate;Spotify");
	sleep(100);
	fRunAhk("fClick;" + sX + ";" + sY);
	sleep(100);
	fRunAhk("fWinActivate;qqq");
	//sleep(2000);
	//fRun "fMouseMove " & window.event.x & " " & window.event.y
}
app.get('/fTest', function(req,res) {
	var s = req.query.sP1;
	var sRes = fTest();
	res.send({'vRes': sRes});
});
function fTest(){
	var d = new Date();
	var fs = require('fs');
	var sPath = gsHome + '/appConfig.xml';
	var sExist = fs.existsSync(sPath);
	return sPath + ' ' +  sExist + ' (' + d.toLocaleString() + ')';
	var stream = fs.createWriteStream("c:/tmp/f1.txt");
	stream.once('open', function(fd) {
	  stream.write("My first row\n");
	  stream.write("My second row\n");
	  stream.write(d.toLocaleString());
	  stream.write(sHome);
	  stream.end();
	});	
}
app.get('/fFileExists', function(req,res) {
	var sPath = req.query.sPath;
	var sRes = fFileExists(sPath);
	res.send({'vRes': sRes});
});
function fFileExists(sPath){
	if (sPath.substr(0,7) == 'HomeDir'){
		sPath = gsHome + sPath.substr(7);
	}
	var sRes = 'ok';
	var fs = require('fs');
	var sExist = fs.existsSync(sPath);
	return sExist;
}
app.get('/fReadFile', function(req,res) {
	var sRes = 'ok';
	var sPath = truePath(req.query.sPath);
	sRes = fReadFile(sPath);
	//sRes = sPath;
	res.send({'vRes': sRes});
});
function fReadFile(sPath){
	//return 'ok';
	var sRes = 'ok';
	var fs = require('fs');
	var sRes = fs.readFileSync(sPath,{encoding: 'utf8'});
	return sRes;
}


app.get('/fWriteFile', function(req,res) {
	var sRes = 'ok';
	var sPath = truePath(req.query.sPath);
	var sText = req.query.sText;
	sRes = fWriteFile(sPath,sText);
	//sRes = sPath;
	res.send({'vRes': sRes});
});
function fWriteFile(sPath,sText){
	//return 'ok';
	var sRes = 'ok';
	var fs = require('fs');
	var stream = fs.createWriteStream(sPath);
	stream.once('open', function(fd) {
	stream.write(sText);
	stream.end();
	});
	return sRes;
}


/*
app.get('/fReadConfig', function(req,res) {
	var sRes = 'ok';
	var sPath = truePath(req.query.sPath);
	sRes = fReadConfig(sPath);
	res.send({'vRes': sRes});
});
function fReadConfig(sPath){
	//return 'ok';
	var sRes = 'ok';
	var fs = require('fs');
	var sXml = fs.readFileSync(sPath,{encoding: 'utf8'});
	var parser = new DOMParser();
	var gvConfig = parser.parseFromString(sXml,"text/xml");
	sRes = sXml;
	return sRes;
}
*/

function truePath(sPath){
	if (sPath.substr(0,7) == 'HomeDir'){
		sPath = gsHome + sPath.substr(7);
	}
	return sPath;
}

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});
app.get('/fNext', function(req,res) {
	fClick(445,550);
	res.send({'vRes': 'ok'});
});
app.get('/test', function(req, res) {
	var d = new Date();
	//fTest();
/*	var fs = require('fs');
	var stream = fs.createWriteStream("c:/tmp/f1.txt");
	stream.once('open', function(fd) {
	  stream.write("My first row\n");
	  stream.write("My second row\n");
	  stream.write(d.toLocaleString());
	  stream.end();
	});	*/
	res.send({
		'vRes': d.toLocaleString()
	});
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
