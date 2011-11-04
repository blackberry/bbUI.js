# bbUI.js Tookit

The goal of the bbUI toolkit is to provide a BlackBerry&reg; look and feel for HTML5 applications using the 
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

**Requires BlackBerry WebWorks SDK for Smartphones v2.2 or higher**

## Philosophy

The toolkit is designed to progressively enhance its capability based on the abilities of the Web rendering engine 
on the BB5/BB6/BB7.  This means that in some cases toolbars are fixed, and in others they scroll with the content.  The 
CSS used to generate the user interface is handled by the bbUI toolkit so that you don't have to deal with the idiosyncrasies
of the different layout engines.

Each of the layouts and controls use custom attributes that begin with **x-bb-** so that the toolkit can determine the type of
control that is desired and then style it accordingly.  By not adding any kind of layout logic to the screen elements, bbUI can 
then modify the DOM in any way that it needs in order to achieve the desired result.

All DOM manipulation occurs while the HTML fragment is not attached to the **live DOM**.  This allows DOM manipulation to occur
VERY, VERY, FAST and it does not incur any Web view layout computation until the entire fragment is inserted into the DOM.  Layout 
computation during JavaScript DOM manipulation is one of the single most expensive operations that can slow down a Web based UI.

## Trackpad Navigation

bbUI is designed to take advantage of the WebWorks [Focus Based Navigation](http://developer.blackberry.com/html5/apis/blackberry.focus.html). 
The toolkit will automatically add the proper highlighting and focus based tags to your UI so that it provides standard BlackBerry trackpad navigation.

## Base Requirements for Config.xml

To properly use the functionality of bbUI in your application, you will need at least the following base capabilities declared in your application's 
[config.xml file](http://developer.blackberry.com/html5/documentation/ww_developing/working_with_config_xml_file_1866970_11.html). 

	<widget xmlns:rim="http://www.blackberry.com/ns/widgets" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">  
	  <name>My App Name</name>
	  <content src="mystartpage.htm" />
	  <rim:navigation mode="focus" />
	  <feature id="blackberry.system.event" />
	</widget>

## Managing Screens

the bbUI toolkit builds the application's UI in the most optimized fashion for the target operating system.  It follows a methodology of 
a single web page that has screens loaded into it as HTML fragments.  Each screen is its own HTML fragment file.  The toolkit then 
uses AJAX to **push** and **pop** screens off of the stack.  The toolkilt manages the screen stack and loading the content.  This ensures 
the best use of device memory.

To open a new screen in an appliction using bbUI you simply call **bb.pushScreen('mypage.htm', 'mypagename')**.  To close the top screen
you simply call **pp.popScreen()**.  The toolkit is designed to use the [Application Event](http://developer.blackberry.com/html5/apis/blackberry.app.event.html) 
WebWorks API so that it can trap the "back" hardware key and automatically handle popping the last screen off of the stack.

	<html>
		<head>
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbUI/bbUI.css"></link>
			<script type="text/javascript" src="bbUI/bbUI.js"></script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html
	
## Defining a Screen

Creating a screen to be used with bbUI is as simple as creating an HTML file and placing the screen fragment markup in the file.  A screen declaration
is simply a &lt;div&gt; with an attribute **x-bb-type="screen"**.  You then place all the contents for your screen inside this &lt;div&gt;.  There's also a **x-bb-title**
attribute where, if defined, a standard black screen title bar will appear showing the declared text.

	<div x-bb-type="screen" x-bb-title="User Interface Examples">
		
	</div>


## Loading Screen Specific CSS

If you have screen specific CSS that you would like to load with your screen, you can declare that CSS in one of two ways.

First is by declaring it inline with your screen contents:

	<div x-bb-type="screen">
		<style type="text/css">
			body, html {
				background-color: White;
			}
		</style>
	</div>

An alternative is to declare a linked in style sheet within your screen's content.  Just remember that the path to your style sheet will 
start from the main HTML page that you have loaded as the root of your application.  So you should make your paths relative to that root document.

	<div x-bb-type="screen">
		<link  rel="stylesheet" type="text/css" href="css/tabs.css"></link>
	</div>

	
## Loading Screen Specific JavaScript

One of the more common scenarios is to have specific JavaScript files that you want to use for a certain screen.  You really don't want to load up all of 
your screen's JavaScript on launch of your application, nor do you want to continue to use tons of memory to have your JavaScript objects sitting around
while you're not using them.

bbUI allows you to declare JavaScript files to include with your screen.  The toolkit will actually take care of including this JavaScript into your application
when the screen is pushed onto the stack, and it will remove this JavaScript when the screen is popped back off of the stack.  Just remember that the path to your JS file will 
start from the main HTML page that you have loaded as the root of your application.  So you should make your paths relative to that root document.

	<div x-bb-type="screen">
		<x-bb-script id="tabsJS" src="js/tabs.js"/>
	</div>

This is accomplished by adding the **x-bb-script** element into your DOM with an **id**, which is used by the toolkit to add and remove the JavaScript file, and the **src**
path to the JavaScript file itself.

If you have JavaScript that needs to perform some cleanup routines when your screen gets popped off of the stack, you can also declare JavaScript to be called before the screen
is popped off of the stack using the **onunload** attribute.

	<div x-bb-type="screen">
		<x-bb-script id="tabsJS" src="js/tabs.js" onunload="unloadPushListeners()"/>
	</div>


## Image Lists

Image lists are option items that give the user options that they can choose.  This user interface can seen in the BlackBerry options area.

![Image List](bbUI.js/raw/master/screenshots/imageList.png)

Creating an image list is really simple and begins with creating a &lt;div&gt; that has the attribute **x-bb-type="image-list"**.  Each item in the list is another 
&lt;div&gt; that has the attribute **x-bb-type="item"**.  Each item has an image (**x-bb-img**), a title (**x-bb-title**), and a description which is the inner contents
of the &lt;div&gt;.

	<div x-bb-type="screen">
		<div x-bb-type="image-list">
			<div x-bb-type="item" x-bb-img="icon1.png" x-bb-title="Input Controls">Use native looking input controls</div>
			<div x-bb-type="item" x-bb-img="icon2.png" x-bb-title="Inbox List">Style your list like the BlackBerry Inbox</div> 
			<div x-bb-type="item" x-bb-img="icon3.png" x-bb-title="Settings">Create native looking options screens</div> 
			<div x-bb-type="item" x-bb-img="icon5.png" x-bb-title="Tall List Items">Add some height to your list items</div> 
			<div x-bb-type="item" x-bb-img="icon6.png" x-bb-title="BBM Bubbles">Generate a chat window like BBM</div> 
			<div x-bb-type="item" x-bb-img="icon7.png" x-bb-title="Pill Buttons">Use pill buttons to organize your data</div> 
			<div x-bb-type="item" x-bb-img="icon8.png" x-bb-title="Charts">Add charts to your application</div> 
			<div x-bb-type="item" x-bb-img="icon9.png" x-bb-title="Guages">Use gauges and progress bars</div> 
			<div x-bb-type="item" x-bb-img="icon10.png" x-bb-title="Tab Controls">Use tabs to organize your data</div> 
			<div x-bb-type="item" x-bb-img="icon11.png" x-bb-title="Arrow List">Create a navigation list with arrows</div>
		</div>
	</div>

To add a click ation to one of the line items, simply add an onclick event to the &lt;div&gt;

	<div x-bb-type="item" onclic="alert('clicked')" x-bb-img="icon9.png" x-bb-title="Guages">Use gauges and progress bars</div> 


## Rounded Control Containers


## Buttons


## Arrow Lists


## Inbox Style Lists


## Twitter Style Lists


## Tabs


## Pill Buttons

