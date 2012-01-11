# bbUI.js Tookit

The goal of the bbUI toolkit is to provide a BlackBerry&reg; look and feel for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows the UI guidelines
and looks at home on a BlackBerry with very little effort.

**This toolkit is currently in an incubation stage and I'm working on getting things up and going.  Focus is on BB6/BB7 and then back-port for BB5**

**Author(s)** 

* [Tim Neil](https://github.com/tneil)
* [Gord Tanner](https://github.com/gtanner)

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

Each of the layouts and controls use custom attributes that begin with **data-bb-** so that the toolkit can determine the type of
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
	  <feature id="blackberry.app" />
	</widget>

## Managing Screens

the bbUI toolkit builds the application's UI in the most optimized fashion for the target operating system.  It follows a methodology of 
a single web page that has screens loaded into it as HTML fragments.  Each screen is its own HTML fragment file.  The toolkit then 
uses AJAX to **push** and **pop** screens off of the stack.  The toolkilt manages the screen stack and loading the content.  This ensures 
the best use of device memory.

To open a new screen in an appliction using bbUI you simply call **bb.pushScreen('mypage.htm', 'mypagename')**.  To close the top screen
you simply call **bb.popScreen()**.  The toolkit is designed to use the [Application Event](http://developer.blackberry.com/html5/apis/blackberry.app.event.html) 
WebWorks API so that it can trap the "back" hardware key and automatically handle popping the last screen off of the stack.

If you want to override the back button handling, and substitute it with your own handler, you can simply call **bb.assignBackHandler(callback)** and your **callback** function will now
be invoked when the back button is clicked.  It is then up to you to handle all back button navigation.

	<html>
		<head>
			<meta name="x-blackberry-defaultHoverEffect" content="false" />
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbUI/bbUI.css"></link>
			<script type="text/javascript" src="bbUI/bbUI.js"></script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html>
	
You can also be notified when your screen, and all associated &lt;script&gt;> tags, are loaded and ready for manipulation.  The screen is still not contained in the DOM of the page 
at this point, but can be manipulated to modify its contents before the bbUI styling is applied. This minimizes layouts which are very expensive.

To subscribe to this event simply assign a function to the **bb.onscreenready** event.  You should make this subscription globally in your application and assign it only once.  The 
function will be called with the DOM element of your screen, and the id you have specified for that screen so that you can apply any screen specific changes.

	<html>
		<head>
			<meta name="x-blackberry-defaultHoverEffect" content="false" />
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbUI/bbUI.css"></link>
			<script type="text/javascript" src="bbUI/bbUI.js"></script>
			<script type="text/javascript">
			
				bb.onscreenready = function(element, id) {
						if (id == 'menu') {
							do_Menu_Specific_Loading_From_Loaded_Script_File();
						} else if (id == 'foo') {
							do_Foo_Specific_Loading_From_Foos_Loaded_Script_File();
						}
					}
			</script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html>
	
Since all of the script files for the specific screen are loaded before the **onscreenready** event is fired, you can place all your screen specific logic in those files
and only have one **onscreenready** global handler to act as the "traffic cop".

The **getElementById()** function has been added to the element object that is passed into **onscreenready** so that you can manipulate the DOM of the element before it is inserted
into the document.
	
## Defining a Screen

Creating a screen to be used with bbUI is as simple as creating an HTML file and placing the screen fragment markup in the file.  A screen declaration
is simply a &lt;div&gt; with an attribute **data-bb-type="screen"**.  You then place all the contents for your screen inside this &lt;div&gt;.  

A display effect can also be declared on your screen. Currently only **data-bb-effect="fade"** is supported.  This will fade in your screen when it displays.  This is 
supported both on BB6 &amp; BB7.  However, if your screen has &lt;input&gt; controls on it and you declare the &quot;fade&quot; effect, BB6 will not fade in the page.  This 
has been disabled on purpose in bbUI because the fade effect doesn&apos;t perform well on BB6 when input controls are on the screen.

You can also create a nested **data-bb-type="title"** &lt;div&gt; in your screen to declare a title bar. If defined, a standard black screen title bar will appear showing the declared text. 
The **data-bb-caption** attribute defines the text to show in this title area.

	<div data-bb-type="screen" data-bb-title="User Interface Examples" data-bb-effect="fade">
		<div data-bb-type="title" data-bb-caption="User Interface Examples" ></div>
	</div>
	
You can also add a **back** button to your title bar that will **ONLY** appear when you display your content on a PlayBook.  To define a back button in your title bar, add the caption of your back button to the
**data-bb-back-caption** attribute.

	<div data-bb-type="title" data-bb-caption="User Interface Examples" data-bb-back-caption="Back"></div>
	
This will appear as the standard back button in your UI as seen below:

![Image List](bbUI.js/raw/master/screenshots/backBtn.png)


## Loading Screen Specific CSS

If you have screen specific CSS that you would like to load with your screen, you can declare that CSS in one of two ways.

First is by declaring it inline with your screen contents:

	<div data-bb-type="screen">
		<style type="text/css">
			body, html {
				background-color: White;
			}
		</style>
	</div>

An alternative is to declare a linked in style sheet within your screen's content.  Just remember that the path to your style sheet will 
start from the main HTML page that you have loaded as the root of your application.  So you should make your paths relative to that root document.

	<div data-bb-type="screen">
		<link rel="stylesheet" type="text/css" href="css/tabs.css"></link>
	</div>

	
## Loading Screen Specific JavaScript

One of the more common scenarios is to have specific JavaScript files that you want to use for a certain screen.  You really don't want to load up all of 
your screen's JavaScript on launch of your application, nor do you want to continue to use tons of memory to have your JavaScript objects sitting around
while you're not using them.

bbUI allows you to declare JavaScript files to include with your screen.  The toolkit will actually take care of including this JavaScript into your application
when the screen is pushed onto the stack, and it will remove this JavaScript when the screen is popped back off of the stack.  Just remember that the path to your JS file will 
start from the main HTML page that you have loaded as the root of your application.  So you should make your paths relative to that root document.

	<div data-bb-type="screen">
		<script id="tabsJS" src="js/tabs.js"></script>
	</div>

This is accomplished by adding the &lt;script&gt; element into your DOM with an **id**, which is used by the toolkit to add and remove the JavaScript file, and the **src**
path to the JavaScript file itself.

If you have JavaScript that needs to perform some cleanup routines when your screen gets popped off of the stack, you can also declare JavaScript to be called before the screen
is popped off of the stack using the **onunload** attribute.

	<div data-bb-type="screen">
		<script id="tabsJS" src="js/tabs.js" onunload="unloadPushListeners()"></script>
	</div>


## Image Lists

Image lists give the user different options that they can choose.  This user interface can seen in the BlackBerry options area.

![Image List](bbUI.js/raw/master/screenshots/imageList.png)

Creating an image list is really simple and begins with creating a &lt;div&gt; that has the attribute **data-bb-type="image-list"**.  Each item in the list is another 
&lt;div&gt; that has the attribute **data-bb-type="item"**.  Each item has an image (**data-bb-img**), a title (**data-bb-title**), and a description which is the inner contents
of the &lt;div&gt;.

On High-Resolution screens, the image size is 48x48 pixels.  On a low resolution screen it is sized down to 32x32 pixels.  So it is best to create your image artwork at 
the 48x48 pixel size since downscaling typically looks better than stretching.

	<div data-bb-type="screen">
		<div data-bb-type="image-list">
			<div data-bb-type="item" data-bb-img="icon1.png" data-bb-title="Input Controls">Use native looking input controls</div>
			<div data-bb-type="item" data-bb-img="icon2.png" data-bb-title="Inbox List">Style your list like the BlackBerry Inbox</div> 
			<div data-bb-type="item" data-bb-img="icon3.png" data-bb-title="Settings">Create native looking options screens</div> 
			<div data-bb-type="item" data-bb-img="icon5.png" data-bb-title="Tall List Items">Add some height to your list items</div> 
			<div data-bb-type="item" data-bb-img="icon6.png" data-bb-title="BBM Bubbles">Generate a chat window like BBM</div> 
			<div data-bb-type="item" data-bb-img="icon7.png" data-bb-title="Pill Buttons">Use pill buttons to organize your data</div> 
			<div data-bb-type="item" data-bb-img="icon8.png" data-bb-title="Charts">Add charts to your application</div> 
			<div data-bb-type="item" data-bb-img="icon9.png" data-bb-title="Guages">Use gauges and progress bars</div> 
			<div data-bb-type="item" data-bb-img="icon10.png" data-bb-title="Tab Controls">Use tabs to organize your data</div> 
			<div data-bb-type="item" data-bb-img="icon11.png" data-bb-title="Arrow List">Create a navigation list with arrows</div>
		</div>
	</div>

To add a click event to one of the line items, simply add an onclick event to the &lt;div&gt;

	<div data-bb-type="item" onclick="alert('clicked')" data-bb-img="icon9.png" data-bb-title="Guages">Use gauges and progress bars</div> 


## Rounded Control Panels

Rounded control panel are found on many of the standard BlackBerry applications. They typically group different controls together into logical groupings. 
Below is a screen shot of a rounded control panel that has a button and some progress indicators nested inside of it.  

![Control Panel](bbUI.js/raw/master/screenshots/controlContainer.png)

To declare a rounded control panel you create a &lt;div&gt; with the **data-bb-type="round-panel"** attribute.  All content that you add to the inside of this 
&lt;div&gt; will appear inside the rounded control panel. 

Rounded control panels can either be a simple panel, or they can also have a title added to them.  To add a title add a &lt;div&gt; with the **data-bb-type="panel-header"**
attribute.  The text contained inside of this div will show up as a header on the panel.  An example of what this header looks like can be seen in the Label/Control Container section
below.

	<div data-bb-type="screen">
		<div data-bb-type="round-panel"> 
			<div data-bb-type="panel-header">My Header</div>
			
			
		</div>
	</div>


## Label/Control Container

Label/Control containers are used in conjuction with a Rounded Control Panel to provide rows of labels and controls as seen in applications such as Calendar and Contacts.
Currently there&apos;s **only** support for Labels to be left justified, buttons will be right justified, and inputs will stretch accordingly.

![Control Panel](bbUI.js/raw/master/screenshots/labelControlRow.png)


To use a Label/Control container you fist create a &lt;div&gt; with the **data-bb-type="label-control-container"** attribute. You then create a &lt;div&gt; with the **data-bb-type="label-control-horizontal-row"** attribute for 
each row you want to add to the container.  You then create another &lt;div&gt; for your label with the attribute **data-bb-type="label"** and the contents of this &lt;div&gt; are displayed as the text of the left justified label. 
The control is then added by adding another &lt;div&gt;.  In this example we are using a button and input box.  More on buttons later.

	<div data-bb-type="screen">
		<div data-bb-type="round-panel"> 
			<div data-bb-type="panel-header">Font Setting</div>
			<div data-bb-type="label-control-container">
				<div data-bb-type="row">
				   <div data-bb-type="label">Settings:</div>
				   <div data-bb-type="button" onclick="openEditScreen()">Edit</div>
			   </div>
			   <div data-bb-type="row">
				   <div data-bb-type="label">Your Name:</div>
				   <input type="text" value="Hello World"/>
			   </div>
			</div>
		</div>
	</div>

## Buttons and Dropdowns

![Control Panel](bbUI.js/raw/master/screenshots/buttons.png)

Buttons and Dropdowns can be used pretty much anywhere.  Creating a button starts by creating a &lt;div&gt; with the **data-bb-type="button"** attribute. By default a button 
will size itself to the text used for the caption.  You can however use the **data-bb-style="stretch"** setting for a button to make it stretch to the total width of
the container where it is embedded.  I wouldn't recommend using the "stretch" capability if you use a button in a Label/Control row.

You can disable in your initial markup by setting the **data-bb-disabled="true"** attribute.  When you want to dynamically change the state of your button you can
call it&apos;s **enable()** and **disable()** functions.

	document.getElementById('plain').enable();
	document.getElementById('plain').disable();

To add a click handler to the button simply add an "onclick" event to the &lt;div&gt;.

	<div data-bb-type="screen">
		<div data-bb-type="panel-header">Font</div>
		   <div data-bb-type="label-control-horizontal-row">
			   <div data-bb-type="label">Font Style:</div>
			   <div data-bb-type="button" onclick="alert('click');" id="plain">Plain</div>
		   </div>
		</div>
	</div>
	
Dropdowns are created by adding a &lt;select&gt; element to your screen.  You can also set the **data-bb-style="stretch"** attribute to the &lt;select&gt; to have it stretch 
to the width of its container.  Add an "onchange" event to your &lt;select&gt; element to capture when the user changes their selection.  To specify the default
selected item when the control first shows you can can use the **selected="true"** attribute on the desired &lt;option&gt; element.

	<div data-bb-type="screen">
		<div data-bb-type="panel-header">Font</div>
		   <div data-bb-type="label"> Font Family:</div>
		   <select data-bb-style="stretch" onchange="alert('changed')" id="fontfamily">
				<option value="bbalphasans" selected="true">BBAlpha Sans</option>
				<option value="arial">Arial</option>
				<option value="andalemono">Andale Mono</option>
		   </select>
		</div>
	</div>

To select an item in a dropdown from JavaScript you can use the **setValue()** function that has been added to the &lt;select&gt; object. In many browsers, the **onchange** event
is not fired on a &lt;select&gt; if the value is set from JavaScript.  Only if it is set from the interaction with the UI.  Because of this bbUI cannot listen to the change made 
from outside JavaScript and apply the styling in the UI. When you call the **setValue()** method, the **onchange** of the select will also fire.

An example of how to set the value of the &lt;select&gt; element seen in the above sample is as follows:

		document.getElementById('fontfamily').setValue('arial');

## Arrow Lists

An Arrow List is another common UI construct that you can use to give your user a choice of options.  It is much like the Image List but 
provides a very simple interface.

![Control Panel](bbUI.js/raw/master/screenshots/arrowList.png)

Much like the Image List, the Arrow list is a &lt;div&gt; that has the attribute **data-bb-type="text-arrow-list"**.  Each of its line items are
&lt;div&gt;&apos;s with the attribute **data-bb-type="item"**.  The contents of the &lt;div&gt; are shown as the label in the arrow list.

	<div data-bb-type="screen">
		<div style="margin:15px;color:Gray;">
			<p align="center">Below you will find an example of using an arrow list in a BlackBerry application</p>
		</div>
		<div data-bb-type="round-panel"> 
		
			 <div data-bb-type="text-arrow-list">
				<div data-bb-type="item" onclick="alert('click')">Sleepy</div>
				<div data-bb-type="item" onclick="alert('click')">Sneezy</div>
				<div data-bb-type="item" onclick="alert('click')">Dopey</div>
				<div data-bb-type="item" onclick="alert('click')">Grumpy</div>
				<div data-bb-type="item" onclick="alert('click')">Doc</div>
				<div data-bb-type="item" onclick="alert('click')">Bashful</div>
				<div data-bb-type="item" onclick="alert('click')">Happy</div>
			 </div>
			 
		</div>
	</div>


## Inbox Style Lists

The Inbox Sytle List is pretty self explainatory.  It provides the ability to create a list much like that of the email application 
found on a BlackBerry Smartphone.

![Control Panel](bbUI.js/raw/master/screenshots/inboxList.png)

The inbox list is again a &lt;div&gt; with an **data-bb-type="inbox-list"** attribute.  An inbox list can have both headers and line items.  A header
is declared by creating a &lt;div&gt; with a **data-bb-type="header"** attribute and the contents of the header are displayed as the label.  

Each line item is created with a **data-bb-type="item"** attribute and has values for an image to be displayed (**data-bb-img**), a title (**data-bb-title**), a 
time (**data-bb-time**) and the inner contents of the &lt;div&gt; are displayed as the description.

The line item image is displayed as a 32x32 pixel image on a High-Resolution screen. 

	<div data-bb-type="screen">
		<div data-bb-type="inbox-list">
			<div data-bb-type="header">Thu 27 May 2010</div>		
			<div data-bb-type="item" data-bb-img="opened.png" data-bb-title="Fred M." data-bb-time="4:33p" >My car just broke down</div> 
			<div data-bb-type="item" data-bb-img="opened.png" data-bb-title="Sue A." data-bb-time="4:15p" >Need to pick up Milk</div> 
			<div data-bb-type="header">Thu 28 May 2010</div>		
			<div data-bb-type="item" data-bb-img="new.png" data-bb-title="Tim N." data-bb-time="10:25a" data-bb-accent="true">Where do I find the new Document</div> 
		</div>
	</div>

## BBM Bubbles

The BBM Bubbles UI format allows you to create chat bubbles that look like the ones in BBM. This is a great option for any BBM connected application.

![Control Panel](bbUI.js/raw/master/screenshots/bbmBubbles.png)

A BBM bubble is created by adding a &lt;div&gt; with the **data-bb-type="bbm-bubble"** attribute.  You can set the direction of the bubble to either "right" or 
"left" by using the **data-bb-style** attribute.

The conversation line items that appear inside the BBM Bubble are simply &lt;div&gt;&apos;s that have the **data-bb-type="item"** attribute.  You can also specify an 
image to appear beside the line item by using the **data-bb-img** attribute. The contents of the line item &lt;div&gt; will be displayed as the line item text.

	<div data-bb-type="screen">
		<style type="text/css">
			body,html {
				background-color: #B5B2B5;
			}	
		</style>
		<div data-bb-type="bbm-bubble" data-bb-style="right">
			<div data-bb-type="item" data-bb-img="bullet.png">My car just broke down and I have one million things to do!!</div> 
			<div data-bb-type="item" data-bb-img="bullet.png">Why can&apos;t groceries just come to you?</div> 
		</div>
		<div data-bb-type="bbm-bubble" data-bb-style="left">
			<div data-bb-type="item" data-bb-img="read.png">The big island was fun.. We were there for our honeymoon.  One side of the island is pretty much desert grass and volcano ash, and the other side is rainforest</div> 
		</div>
	</div>


## Tall Lists

Tall lists are similar to those that you would find in the BlackBerry Twitter&reg; and Facebook&reg; applications.

![Control Panel](bbUI.js/raw/master/screenshots/tallList.png)

Tall lists are a &lt;div&gt; with a **data-bb-type="tall-list"** attribute.  Each line item is a &lt;div&gt; with an **data-bb-type="item"** attribute which allows for
a display image (**data-bb-img**), a title (**data-bb-title**), a time (**data-bb-time**) and the inner contents of the &lt;div&gt; are the description that appears.

	<div data-bb-type="screen">
		<style type="text/css">
			body, html {
				background-color: White;
			}
		</style>
		<div data-bb-type="tall-list">
			<div data-bb-type="item" data-bb-img="adamA.jpg" data-bb-title="Adam A." data-bb-time="10:24 PM May 22">My car just broke down and I have one million things to do!!</div> 
			<div data-bb-type="item" data-bb-img="brian.jpg" data-bb-title="Brian" data-bb-time="10:24 PM May 22">Need to pick up Milk.  Add one more thing to the &quot;Honey Do&quot; list!</div>
			<div data-bb-type="item" data-bb-img="tim.jpg" data-bb-title="Tim" data-bb-time="10:24 PM May 22">Time for some BBQ Ribs!!</div> 
			<div data-bb-type="item" data-bb-img="tim.jpg" data-bb-title="Tim" data-bb-time="10:24 PM May 22">Has anyone seen a good movie lately?  We're looking for something to do this weekend and I figured a movie would be good</div> 
			<div data-bb-type="item" data-bb-img="mike.jpg" data-bb-title="Mike" data-bb-time="10:24 PM May 22">Yes, I do Love BlackBerry! Check out BlackBerry App World</div> 
			<div data-bb-type="item" data-bb-img="douglas.jpg" data-bb-title="Douglas" data-bb-time="10:24 PM May 22">Blogging for BlackBerry is a ton of fun. </div> 
			<div data-bb-type="item" data-bb-img="adamA.jpg" data-bb-title="AdamA" data-bb-time="10:24 PM May 22">Gotta love BlackBerry WebWorks!</div>
		</div>
	</div>
	
## Pill Buttons

Pill Buttons can provide a "Tab Like" interface for quickly switching between multiple views of data.

![Control Panel](bbUI.js/raw/master/screenshots/pillButtons.png)

Pill Buttons are a &lt;div&gt; with a **data-bb-type="pill-buttons"** attribute.  Each pill button is then added to the container by creating a &lt;div&gt; with 
a **data-bb-type="pill-button"** attribute. The caption the button is determined by the contents of the &lt;div&gt;.  The bbUI tookit knows which button is first and
last to create the rounded ends of the pill button UI.  To handle the click of the button simply add an "onclick" handler.

To specify which button should be selected by default simply add the **data-bb-selected="true"** attribute to the default button.

	<div data-bb-type="screen">
		 <div data-bb-type="pill-buttons">
			<div data-bb-type="pill-button" data-bb-selected="true" onclick="selectContact()">Contact</div>
			<div data-bb-type="pill-button" onclick="selectAddress()">Address</div>
			<div data-bb-type="pill-button" onclick="selectPhone()">Phone</div>
		 </div>
	</div>


# Known Issues

**General**

* Tabs are not working in the samples
* No disabled dropdowns yet

**BB6/BB7**

* [Trackpad performance for scrolling is less than desirable on BB6/BB7](https://github.com/blackberry/WebWorks/issues/49)
* There is currently a touch delay on BB6 Torch devices when you select a button or a list item.  
* Dropdown button popups can currently only be interacted with using the touch screen for selection and not with the trackpad

**BB5**

* Label/Control Containers are not working
* Pill Buttons do not work yet
* Buttons that stretch the width of the screen don&apos;t work yet
* Background color sizing issues on BB5
* Button/list item highlighting not appearing on "touch" on a Storm device
* Input boxes are not aligning properly in the rounded panels and have not been styled
* There are various back button issues
* Focus based navigation mode can get confused when navigating between screens
* Dropdown buttons do not work
* Disabled buttons are not supported


# Contributing

To build and contribute to bbUI.js please see the HACKING.md file

