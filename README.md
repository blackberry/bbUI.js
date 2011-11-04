# bbUI.js Tookit

The goal of the bbUI toolkit is to provide a BlackBerry look and feel for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows the UI guidelines
and looks at home on a BlackBerry with very little effort.

**Milestones**

This toolkit is currently in an incubation stage and I'm working on getting things up and going.  Milestones for added
functionality can be found here:

* [bbUI Milestones](bbUI.js/issues/milestones)

**Author(s)** 

* [Tim Neil](https://github.com/tneil)

## Tested On

* BlackBerry Torch 9860 v7.0.0.x

These examples have been designed for a Smartphone screen size and **not** for the BlackBerry&reg; PlayBook&trade;

**Requires BlackBerry WebWorks SDK for Smartphones v2.0 or higher**

## Philosophy

The toolkit is designed to progressively enhance its capability based on the abilities of the Web rendering engine 
on the BB5/BB6/BB7.  This means that in some cases toolbars are fixed, and in others they scroll with the content.  The 
CSS used to generate the user interface is handled by the bbUI toolkit so that you don't have to deal with the idiosyncrasies
of the different layout engines.

Each of the layouts and controls use custom attributes that begin with **bb-** so that the toolkit can determine the type of
control that is desired and then style it accordingly.  By not adding any kind of layout logic to the screen elements, bbUI can 
then modify the DOM in any way that it needs in order to achieve the desired result.

All DOM manipulation occurs while the HTML fragment is not attached to the **live DOM**.  This allows DOM manipulation to occur
VERY, VERY, FAST and it does not incur any Web view layout computation until the entire fragment is inserted into the DOM.  Layout 
computation during JavaScript DOM manipulation is one of the single most expensive operations that can slow down a Web based UI.

## Managing Screens

the bbUI toolkit builds the application UI in the most optimized fashion for the operating system.  It follows a methodology of 
a single web page that has screens loaded into it as HTML fragments.  Each screen is its own HTML fragment file.  The toolkit then 
uses AJAX to **push** and **pop** screens off of the stack.  The toolkilt manages the screen stack and loading the content.

To open a new screen in an appliction using bbUI you simply call **bb.pushScreen('mypage.htm', 'mypagename')**.  To close the top screen
you simply call **pp.popScreen()**.  The toolkit is designed to use the [Application Event](http://developer.blackberry.com/html5/apis/blackberry.app.event.html) 
WebWorks API so that it can trap the "back" hardware key and automatically handle popping the last screen off of the stack.

	<html>
		<head>
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbUI/bbUI.css"><link />
			<script type="text/javascript" src="bbUI/bbUI.js"></script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html
	
## Defining a Screen


## Loading Screen Specific CSS


## Loading Screen Specific JavaScript



## Image Lists


## Rounded Control Containers


## Buttons


## Arrow Lists


## Inbox Style Lists


## Twitter Style Lists

