# bbUI.js Tookit

The goal of the bbUI toolkit is to provide a BlackBerry&reg; look and feel for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows the UI guidelines
and looks at home on a BlackBerry with very little effort.

**This toolkit is currently in an incubation stage and I'm working on getting things up and going.**

**Author(s)** 

* [Tim Neil](https://github.com/tneil)

## Tested On

* BlackBerry Torch 9860 v7.0.0.x
* BlackBerry Curve 9360 v7.0.0.x
* BlackBerry Bold 9700 v6.0.0.546
* BlackBerry Bold 9700 v5.0.0.979 
* BlackBerry Storm 9520 v5.0.0.713

**Please read the known issues list at the bottom of this page**

These examples have been designed for a Smartphone screen size and **not** for the BlackBerry&reg; PlayBook&trade;

**Requires BlackBerry WebWorks SDK for Smartphones v2.2 or higher**

## Philosophy

The bbUI toolkit is designed to progressively enhance its capability based on the abilities of the Web rendering engine 
on BB5/BB6/BB7.  This means that in some cases toolbars are fixed, and in others they scroll with the content.  The 
CSS used to generate the user interface is handled by the bbUI toolkit so that you don't have to deal with the idiosyncrasies
of the different layout engines.

Each of the layouts and controls use custom attributes that begin with **x-bb-** so that the toolkit can determine the type of
control that is desired and then style it accordingly.  By not adding any kind of layout logic to the screen elements, bbUI can 
then modify the DOM in any way that it needs in order to achieve the desired result.

All DOM manipulation occurs while the HTML fragment is not attached to the **live DOM**.  This allows DOM manipulation to occur
VERY, VERY, FAST and it does not incur any WebView layout computation until the entire fragment is inserted into the DOM.  Layout 
computation during JavaScript DOM manipulation is one of the single most expensive operations that can slow down a Web based UI.

## Trackpad Navigation

bbUI is designed to take advantage of the WebWorks [Focus Based Navigation](http://developer.blackberry.com/html5/apis/blackberry.focus.html). 
The toolkit will automatically add the proper highlighting and focus based tags to your UI so that it provides standard BlackBerry trackpad navigation.

## Base Requirements for your Config.xml

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
you simply call **bb.popScreen()**.  The toolkit is designed to use the [Application Event](http://developer.blackberry.com/html5/apis/blackberry.app.event.html) 
WebWorks API so that it can trap the "back" hardware key and automatically handle popping the last screen off of the stack.

	<html>
		<head>
			<meta name="x-blackberry-defaultHoverEffect" content="false" />
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
		<link rel="stylesheet" type="text/css" href="css/tabs.css"></link>
	</div>

	
## Loading Screen Specific JavaScript

One of the more common scenarios is to have specific JavaScript files that you want to use for a certain screen.  You really don't want to load up all of 
your screen's JavaScript on launch of your application, nor do you want to continue to use tons of memory to have your JavaScript objects sitting around
while you're not using them.

bbUI allows you to declare JavaScript files to include with your screen.  The toolkit will actually take care of including this JavaScript into your application
when the screen is pushed onto the stack, and it will remove this JavaScript when the screen is popped back off of the stack.  Just remember that the path to your JS file will 
start from the main HTML page that you have loaded as the root of your application.  So you should make your paths relative to that root document.

	<div x-bb-type="screen">
		<script id="tabsJS" src="js/tabs.js"></script>
	</div>

This is accomplished by adding the &lt;script&gt; element into your DOM with an **id**, which is used by the toolkit to add and remove the JavaScript file, and the **src**
path to the JavaScript file itself.

If you have JavaScript that needs to perform some cleanup routines when your screen gets popped off of the stack, you can also declare JavaScript to be called before the screen
is popped off of the stack using the **onunload** attribute.

	<div x-bb-type="screen">
		<script id="tabsJS" src="js/tabs.js" onunload="unloadPushListeners()"></script>
	</div>


## Image Lists

Image lists give the user different options that they can choose.  This user interface can seen in the BlackBerry options area.

![Image List](bbUI.js/raw/master/screenshots/imageList.png)

Creating an image list is really simple and begins with creating a &lt;div&gt; that has the attribute **x-bb-type="image-list"**.  Each item in the list is another 
&lt;div&gt; that has the attribute **x-bb-type="item"**.  Each item has an image (**x-bb-img**), a title (**x-bb-title**), and a description which is the inner contents
of the &lt;div&gt;.

On High-Resolution screens, the image size is 48x48 pixels.  On a low resolution screen it is sized down to 32x32 pixels.  So it is best to create your image artwork at 
the 48x48 pixel size since downscaling typically looks better than stretching.

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

To add a click event to one of the line items, simply add an onclick event to the &lt;div&gt;

	<div x-bb-type="item" onclick="alert('clicked')" x-bb-img="icon9.png" x-bb-title="Guages">Use gauges and progress bars</div> 


## Rounded Control Panels

Rounded control panel are found on many of the standard BlackBerry applications. They typically group different controls together into logical groupings. 
Below is a screen shot of a rounded control panel that has a button and some progress indicators nested inside of it.  

![Control Panel](bbUI.js/raw/master/screenshots/controlContainer.png)

To declare a rounded control panel you create a &lt;div&gt; with the **x-bb-type="round-panel"** attribute.  All content that you add to the inside of this 
&lt;div&gt; will appear inside the rounded control panel. 

Rounded control panels can either be a simple panel, or they can also have a title added to them.  To add a title add a &lt;div&gt; with the **x-bb-type="panel-header"**
attribute.  The text contained inside of this div will show up as a header on the panel.  An example of what this header looks like can be seen in the Input Rows section
below.

	<div x-bb-type="screen">
		<div x-bb-type="round-panel"> 
			<div x-bb-type="panel-header">My Header</div>
			
			
		</div>
	</div>


## Label/Control Rows

Label/Control rows are used in conjuction with a Rounded Control Panel to provide a label for a control and then a control to perform the interaction.
Currently there&apos;s **only** support for Horizontal alignment where the Label is left justified, and the control is right justified.

![Control Panel](bbUI.js/raw/master/screenshots/labelControlRow.png)


To use a Label/Control row you create a &lt;div&gt; with the **x-bb-type="label-control-horizontal-row"** attribute.  You then create another &lt;div&gt; for
your label with the attribute **x-bb-type="label"** and the contents of this &lt;div&gt; are displayed as the text of the left justified label.  The control is then
added by adding another &lt;div&gt;.  In this example we are using a button.  More on buttons later.

	<div x-bb-type="screen">
		<div x-bb-type="round-panel"> 
			<div x-bb-type="panel-header">Font Setting</div>
			<div x-bb-type="label-control-horizontal-row">
			   <div x-bb-type="label">Settings</div>
			   <div x-bb-type="button" onclick="openEditScreen()">Edit</div>
		   </div>
		</div>
	</div>

## Buttons

![Control Panel](bbUI.js/raw/master/screenshots/buttons.png)

Buttons can be used pretty much anywhere.  Creating a button starts by creating a &lt;div&gt; with the **x-bb-type="button"** attribute. By default a button 
will size itself to the text used for the caption.  You can however use the **x-bb-style="stretch"** setting for a button to make it stretch to the total width of
the container where it is embedded.  I wouldn't recommend using the "stretch" capability if you use a button in a Label/Control row.

To add a click handler to the button simply add an onclick event to the &lt;div&gt;.

	<div x-bb-type="screen">
		<div x-bb-type="panel-header">Font</div>
			<div style="margin-bottom:4px;">
			   <div x-bb-type="label"> Font Family:</div>
			   <div x-bb-type="button" x-bb-style="stretch">BBAlpha Sans</div>
		   </div>
		   <div x-bb-type="label-control-horizontal-row">
			   <div x-bb-type="label">Font Size:</div>
			   <div x-bb-type="button" onclick="alert('click');">7</div>
		   </div>
		</div>
	</div>

## Arrow Lists

An Arrow List is another common UI construct that you can use to give your user a choice of options.  It is much like the Image List but 
provides a very simple interface.

![Control Panel](bbUI.js/raw/master/screenshots/arrowList.png)

Much like the Image List, the Arrow list is a &lt;div&gt; that has the attribute **x-bb-type="text-arrow-list"**.  Each of its line items are
&lt;div&gt;&apos;s with the attribute **x-bb-type="item"**.  The contents of the &lt;div&gt; are shown as the label in the arrow list.

	<div x-bb-type="screen">
		<div style="margin:15px;color:Gray;">
			<p align="center">Below you will find an example of using an arrow list in a BlackBerry application</p>
		</div>
		<div x-bb-type="round-panel"> 
		
			 <div x-bb-type="text-arrow-list">
				<div x-bb-type="item" onclick="alert('click')">Sleepy</div>
				<div x-bb-type="item" onclick="alert('click')">Sneezy</div>
				<div x-bb-type="item" onclick="alert('click')">Dopey</div>
				<div x-bb-type="item" onclick="alert('click')">Grumpy</div>
				<div x-bb-type="item" onclick="alert('click')">Doc</div>
				<div x-bb-type="item" onclick="alert('click')">Bashful</div>
				<div x-bb-type="item" onclick="alert('click')">Happy</div>
			 </div>
			 
		</div>
	</div>


## Inbox Style Lists

The Inbox Sytle List is pretty self explainatory.  It provides the ability to create a list much like that of the email application 
found on a BlackBerry Smartphone.

![Control Panel](bbUI.js/raw/master/screenshots/inboxList.png)

The inbox list is again a &lt;div&gt; with an **x-bb-type="inbox-list"** attribute.  An inbox list can have both headers and line items.  A header
is declared by creating a &lt;div&gt; with a **x-bb-type="header"** attribute and the contents of the header are displayed as the label.  

Each line item is created with a **x-bb-type="item"** attribute and has values for an image to be displayed (**x-bb-img**), a title (**x-bb-title**), a 
time (**x-bb-time**) and the inner contents of the &lt;div&gt; are displayed as the description.

The line item image is displayed as a 32x32 pixel image on a High-Resolution screen. 

	<div x-bb-type="screen">
		<div x-bb-type="inbox-list">
			<div x-bb-type="header">Thu 27 May 2010</div>		
			<div x-bb-type="item" x-bb-img="opened.png" x-bb-title="Fred M." x-bb-time="4:33p" >My car just broke down</div> 
			<div x-bb-type="item" x-bb-img="opened.png" x-bb-title="Sue A." x-bb-time="4:15p" >Need to pick up Milk</div> 
			<div x-bb-type="header">Thu 28 May 2010</div>		
			<div x-bb-type="item" x-bb-img="new.png" x-bb-title="Tim N." x-bb-time="10:25a" x-bb-accent="true">Where do I find the new Document</div> 
		</div>
	</div>

## BBM Bubbles

The BBM Bubbles UI format allows you to create chat bubbles that look like the ones in BBM. This is a great option for any BBM connected application.

![Control Panel](bbUI.js/raw/master/screenshots/bbmBubbles.png)

A BBM bubble is created by adding a &lt;div&gt; with the **x-bb-type="bbm-bubble"** attribute.  You can set the direction of the bubble to either "right" or 
"left" by using the **x-bb-style** attribute.

The conversation line items that appear inside the BBM Bubble are simply &lt;div&gt;&apos;s that have the **x-bb-type="item"** attribute.  You can also specify an 
image to appear beside the line item by using the **x-bb-img** attribute. The contents of the line item &lt;div&gt; will be displayed as the line item text.

	<div x-bb-type="screen">
		<style type="text/css">
			body,html {
				background-color: #B5B2B5;
			}	
		</style>
		<div x-bb-type="bbm-bubble" x-bb-style="right">
			<div x-bb-type="item" x-bb-img="bullet.png">My car just broke down and I have one million things to do!!</div> 
			<div x-bb-type="item" x-bb-img="bullet.png">Why can&apos;t groceries just come to you?</div> 
		</div>
		<div x-bb-type="bbm-bubble" x-bb-style="left">
			<div x-bb-type="item" x-bb-img="read.png">The big island was fun.. We were there for our honeymoon.  One side of the island is pretty much desert grass and volcano ash, and the other side is rainforest</div> 
		</div>
	</div>


## Tall Lists

Tall lists are similar to those that you would find in the BlackBerry Twitter&reg; and Facebook&reg; applications.

![Control Panel](bbUI.js/raw/master/screenshots/tallList.png)

Tall lists are a &lt;div&gt; with a **x-bb-type="tall-list"** attribute.  Each line item is a &lt;div&gt; with an **x-bb-type="item"** attribute which allows for
a display image (**x-bb-img**), a title (**x-bb-title**), a time (**x-bb-time**) and the inner contents of the &lt;div&gt; are the description that appears.

	<div x-bb-type="screen">
		<style type="text/css">
			body, html {
				background-color: White;
			}
		</style>
		<div x-bb-type="tall-list">
			<div x-bb-type="item" x-bb-img="adamA.jpg" x-bb-title="Adam A." x-bb-time="10:24 PM May 22">My car just broke down and I have one million things to do!!</div> 
			<div x-bb-type="item" x-bb-img="brian.jpg" x-bb-title="Brian" x-bb-time="10:24 PM May 22">Need to pick up Milk.  Add one more thing to the &quot;Honey Do&quot; list!</div>
			<div x-bb-type="item" x-bb-img="tim.jpg" x-bb-title="Tim" x-bb-time="10:24 PM May 22">Time for some BBQ Ribs!!</div> 
			<div x-bb-type="item" x-bb-img="tim.jpg" x-bb-title="Tim" x-bb-time="10:24 PM May 22">Has anyone seen a good movie lately?  We're looking for something to do this weekend and I figured a movie would be good</div> 
			<div x-bb-type="item" x-bb-img="mike.jpg" x-bb-title="Mike" x-bb-time="10:24 PM May 22">Yes, I do Love BlackBerry! Check out BlackBerry App World</div> 
			<div x-bb-type="item" x-bb-img="douglas.jpg" x-bb-title="Douglas" x-bb-time="10:24 PM May 22">Blogging for BlackBerry is a ton of fun. </div> 
			<div x-bb-type="item" x-bb-img="adamA.jpg" x-bb-title="AdamA" x-bb-time="10:24 PM May 22">Gotta love BlackBerry WebWorks!</div>
		</div>
	</div>
	
## Pill Buttons

Pill Buttons can provide a "Tab Like" interface for quickly switching between multiple views of data.

![Control Panel](bbUI.js/raw/master/screenshots/pillButtons.png)

Pill Buttons are a &lt;div&gt; with a **x-bb-type="pill-buttons"** attribute.  Each pill button is then added to the container by creating a &lt;div&gt; with 
a **x-bb-type="pill-button"** attribute. The caption the button is determined by the contents of the &lt;div&gt;.  The bbUI tookit knows which button is first and
last to create the rounded ends of the pill button UI.  To handle the click of the button simply add an "onclick" handler.

<div x-bb-type="screen">
	 <div x-bb-type="pill-buttons">
		<div x-bb-type="pill-button" onclick="selectContact()">Contact</div>
		<div x-bb-type="pill-button" onclick="selectAddress()">Address</div>
		<div x-bb-type="pill-button" onclick="selectPhone()">Phone</div>
	 </div>
</div>


# Known Issues

* [Trackpad performance for scrolling is less than desirable on BB6/BB7](https://github.com/blackberry/WebWorks/issues/49)
* Tabs and Pill Buttons are not working yet in the samples
* Input boxes are not aligning properly in the rounded panels and have not been styled
* There are various back button issues
* Focus based navigation mode can get confused on BB5 devices when navigating between screens
* Button scaling is not completed on hi-res/low-res devices for BB6/BB7
* Button/list item highlighting not appearing on "touch" on a Storm device
* Background color sizing issues on BB5
* There is currently a touch delay on BB6 Torch devices when you select a button or a list item.  


