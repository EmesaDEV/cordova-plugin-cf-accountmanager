#!/usr/bin/env node
'use strict';

var fs = require('fs');
var cordovaCommon = require('cordova-common');

module.exports = function(context) {

	var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util'),
	ConfigParser = cordovaCommon.ConfigParser;,
	projectRoot = cordova_util.isCordova(),
	xml = cordova_util.projectConfig(projectRoot),
	cfg = new ConfigParser(xml),
	label = cfg.getPreference('AccountManagerLabel'),
	iconUrl = cfg.getPreference('AccountManagerIconUrl'),
	accountType = cfg.getPreference('AccountManagerType');

	fs.writeFileSync('platforms/android/res/drawable/acm_icon.png', fs.readFileSync(iconUrl));

	var authenticatorFile = fs.readFileSync('platforms/android/res/xml/authenticator.xml','utf8');
	authenticatorFile = authenticatorFile.replace(/android:icon="[ \S]*"/i, 'android:icon="@drawable/acm_icon"');
	authenticatorFile = authenticatorFile.replace(/android:smallIcon="[ \S]*"/i, 'android:smallIcon="@drawable/acm_icon"');
	authenticatorFile = authenticatorFile.replace(/android:accountType="[ \S]*"/i, 'android:accountType="'+accountType+'"');
	fs.writeFileSync('platforms/android/res/xml/authenticator.xml', authenticatorFile);

	var stringFile = fs.readFileSync('platforms/android/res/values/strings.xml','utf8');
	if(stringFile.indexOf('<string name="authLabel">') > -1){
		stringFile = stringFile.replace(/\<string name\=\"authLabel\"\>[ \S]*\<\/string\>/i, '<string name="authLabel">'+label+'</string>');
	}
	else{
		stringFile = stringFile.replace('</resources>', '<string name="authLabel">'+label+'</string></resources>');
	}
	
	fs.writeFileSync('platforms/android/res/values/strings.xml', stringFile);
};
