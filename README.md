![logo](bbUI.js/raw/master/logos/bbUI_100x403.png)

_**Current version: 0.9.1 BETA**_ 

The goal of the bbUI toolkit is to provide a BlackBerry&reg; look and feel for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows the UI guidelines
and looks at home on a BlackBerry with very little effort.

All changes can be found in the [Commit History](https://github.com/blackberry/bbUI.js/commits/master) for this repo or in the [Change Log](bbUI.js/blob/master/CHANGELOG.md).

_**NOTE: bbUI DropDowns on BB5/BB6/B7 require BlackBerry WebWorks SDK v2.3 for Smartphones or higher**_

This toolkit is currently in an incubation stage and we're working on getting things up and going.  Focus is on BB6/BB7/PlayBook/BB10 and then back-port for BB5.  

**Author(s)** 

* [Tim Neil](https://github.com/tneil) follow me on Twitter [@brcewane](https://twitter.com/#!/brcewane)
* [Gord Tanner](https://github.com/gtanner) follow me on Twitter [@gordtanner](https://twitter.com/#!/gordtanner)
* [Ken Wallis](https://github.com/kwallis) follow me on Twitter [@ken_wallis](https://twitter.com/#!/ken_wallis)
* [David Sosby](https://github.com/dsosby) follow me on Twitter [@ramdump](https://twitter.com/#!/ramdump)
* [Rory Craig-Barnes](https://github.com/glasspear) follow me on Twitter [@roryboy](https://twitter.com/#!/roryboy)

Icons in "samples/images/icons" are [Plastique Icons by Scott Lewis](http://iconify.it/) under the [Creative Commons Attribution-Share Alike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/legalcode) as 
[specified here](http://www.iconfinder.com/browse/iconset/plastique-icons/#readme).

## Tested On

* BlackBerry Dev Alpha
* BlackBerry Torch 9860 v7.0.0.x
* BlackBerry Curve 9360 v7.0.0.x
* BlackBerry Bold 9700 v6.0.0.546
* BlackBerry Bold 9700 v5.0.0.979 
* BlackBerry Storm 9520 v5.0.0.713
* BlackBerry PlayBook v2.0.0.7971

**Please read the [Issues List](https://github.com/blackberry/bbUI.js/issues) for details on known issues, feature requests and planned improvements**

## Source files to include

You can find both the JS and CSS files that you need to add to your page in the "pkg" directory in this repository

## Philosophy

The bbUI toolkit is designed to progressively enhance its capability based on the abilities of the Web rendering engine 
on BB5/BB6/BB7/PlayBook.  This means that in some cases toolbars are fixed, and in others they scroll with the content.  The 
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

Additionally, if you use dropdowns in your application, you will need to include the additional feature: 

	<feature id="blackberry.ui.dialog" />
	
For menus to work on Smartphones you will need to include the feature:

	<feature id="blackberry.ui.menu"/>
	
For menus to work on PlayBook and BlackBerry 10 you will need to include the feature:

	<feature id="blackberry.app.event"/>


## Toolkit Initialization

To initialize bbUI you need to call the **bb.init()** function before you start loading UI elements into your application. **THIS IS MANDITORY**  The bb.int() function takes one parameter which is a JSON
structure containing any of the options you wish to override.  If you want to simply use the default configuration call the initialization function with no parameters _bb.init()_. 

The default values of the options which can be overriden are:

    {
		onbackkey: null, 				// Custom handler for back key on BlackBerry 5/6/7 smartphones
		onscreenready: null,			// Manipulate your screen before it's inserted into the DOM
		ondomready: null,				// Manipulate your screen after it's inserted into the DOM
		bb10ActionBarDark: true, 		// If set to true, the action bar will use the dark theme
		bb10ControlsDark: true,			// If set to true, the controls will use the dark theme
		bb10ListsDark: false,			// If set to true, lists will use the dark theme (you need a dark background)
		bb10ForPlayBook: false,			// If set to true, PlayBook will be considered a BB10 device
		bb10AccentColor: '#2D566F',		// An accent color to be used for headers and other areas
		bb10HighlightColor: '#00A8DF'	// A highlight color to use when a user selects an item
	}
	
You can be notified when your screen, and all associated &lt;script&gt; tags, are loaded and ready for manipulation before styling is applied using the **onscreenready** event.  The screen is still not 
contained in the DOM of the page at this point, but can be manipulated to modify its contents before the bbUI styling is applied. This allows you to perform your data manipulation **before** the screen has
been displayed to the user and minimizes rendering engine layouts which are very expensive.

You can also be notified when your screen, and all associated &lt;script&gt; tags, have been inserted into the DOM using the **ondomready** event.  This allows you to perform your data manipulation **after** 
the screen has been displayed to the user.

To subscribe to this event simply assign a function to the **onscreenready** parameter of the init function.  The function will be called with the DOM element of your screen, and 
the id you have specified for that screen so that you can apply any screen specific changes.

Since all of the script files for the specific screen are loaded before the **onscreenready** or **ondomready* events are fired, you can place all your screen specific logic in those files
and only have one **onscreenready** and **ondomready** global handler to act as the "traffic cop".

The **getElementById()** function has been added to the element object that is passed into **onscreenready** and **ondomready* events so that you can manipulate the DOM of the element passed into the event.

	<html>
		<head>
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbui-0.9.1.css"></link>
			<script type="text/javascript" src="bbui-0.9.1.js"></script>
			<script type="text/javascript">
			
				bb.init(onscreenready : function(element, id) {
							if (id == 'menu') {
								doMenuLoadingBeforeInsert(element);
							} 
						},
						ondomready: function(element, id) {
							if (id == 'menu') {
								doMenuLoadingAfterInsert(element);
							} 
						});
			</script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html>
	



	
	
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
			<meta name="viewport" content="initial-scale=1.0,width=device-width,user-scalable=no,target-densitydpi=device-dpi" />
			<link  rel="stylesheet" type="text/css" href="bbui-0.9.1.css"></link>
			<script type="text/javascript" src="bbui-0.9.1.js"></script>
		</head>
		<body onload="bb.pushScreen('menu.htm', 'menu');">	
		</body>
	</html>
	
	
## Defining a Screen

Creating a screen to be used with bbUI is as simple as creating an HTML file and placing the screen fragment markup in the file.  A screen declaration
is simply a &lt;div&gt; with an attribute **data-bb-type="screen"**.  You then place all the contents for your screen inside this &lt;div&gt;.  

A display effect can also be declared on your screen. Currently only **data-bb-effect="fade"** is supported.  This will fade in your screen when it displays.  This is 
supported both on BB7 and up.  This has been disabled on purpose in bbUI because the fade effect doesn&apos;t perform well on devices below BB7.

You can also create a nested **data-bb-type="title"** &lt;div&gt; in your screen to declare a title bar. If defined, a standard black screen title bar will appear showing the declared text. 
The **data-bb-caption** attribute defines the text to show in this title area.

_NOTE: Title bars are not available for BlackBerry 10 yet for bbUI_

	<div data-bb-type="screen" data-bb-title="User Interface Examples" data-bb-effect="fade">
		<div data-bb-type="title" data-bb-caption="User Interface Examples" ></div>
	</div>
	
You can also add a **back** button to your title bar that will **ONLY** appear when you display your content on a PlayBook.  To define a back button in your title bar, add the caption of your back button to the
**data-bb-back-caption** attribute.  When running on BlackBerry 10, if you provide a back button in your title bar it will automatically create an action bar with a back button on it "if" there are no tabs on your action
bar.

	<div data-bb-type="title" data-bb-caption="User Interface Examples" data-bb-back-caption="Back"></div>
	
This will appear as the standard back button in your UI as seen below:

![Back Button](bbUI.js/raw/master/screenshots/backBtn.png)


## Screen Scrolling Effects

Inertial screen scrolling effects with elastic ends are implemented by default for **PlayBook only** (this means no scrolling effects for other devices at the moment).  This has been accomplished by integrating iScroll into bbUI.  
This will provide a native scrolling experience on each of your screens.  If you do not want the scrolling effects applied to a screen you can simply turn them off using the **data-bb-scroll-effect="off"** attribute on the 
&lt;screen&gt; element.  You may want to remove these effects on screens where you want all the content within the screen to be fixed without providing an elastic pull down effect on the content.

	<div data-bb-type="screen" data-bb-scroll-effect="off">

	</div>


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

You can also use in-line script tags with your screen. The bbUI framework will load and unload these from scope when the screen is pushed or popped.

	<div data-bb-type="screen">
		<script type="text/javascript">
			function foo() {
				alert('foo');
			}	
		</script>
	</div>


## BlackBerry 10 Grid Layouts

Grid layouts allow you to present your information in a graphical and cinematic way.  **Grid layouts are currently only supported on PlayBook and BB10 devices**. 

![Grid Layout](bbUI.js/raw/master/screenshots/grid.png)

If you have multiple images to show you can arrange them in groups and rows. A grouping of information can have a header title which will be the color provided by the **bb10AccentColor** property
used in the **bb.init()** function.  Highlights of items will use the **bb10HighlightColor**.

Each group has one or more rows. Each row can have up to 3 items.  Currently the layout assumes that images are a 16:9 aspect ratio.  For example if a row has only one item in it, it's width will be the full width of
the size of the grid.  A row with 2 items will be 1/6, and 3 items will be 1/9 the height of the screen.  All images are currently set to be stretched to the size of their container.

Every item in the grid has an image, a title and a sub-title which is provided as the contents of the &lt;div&gt;.  Each item can also provide an **onclick** handler for when the user 
selects the item.

    <div data-bb-type="grid-layout">
		<div data-bb-type="group" data-bb-title="My Title">
			<div data-bb-type="row">
				<div data-bb-type="item" data-bb-img="images/grid/1.jpg" data-bb-title="Hello" onclick="alert('You clicked me');">World</div>
			</div>
			<div data-bb-type="row">
				<div data-bb-type="item" data-bb-img="images/grid/2.png" data-bb-title="Hello">World</div> 
				<div data-bb-type="item" data-bb-img="images/grid/3.jpg" data-bb-title="Hello">World</div> 
			</div>
		</div>
		<div data-bb-type="group" data-bb-title="Recently Added">
			<div data-bb-type="row">
				<div data-bb-type="item" data-bb-img="images/grid/4.jpg" data-bb-title="Hello">World</div>		
				<div data-bb-type="item" data-bb-img="images/grid/5.jpg" data-bb-title="Hello">World</div> 
				<div data-bb-type="item" data-bb-img="images/grid/6.jpg" data-bb-title="Hello">World</div>
			</div>
		</div>
	</div>
	
	
## BlackBerry 10 Action Bar

The BlackBerry 10 action bar allow for a combination of buttons and tabs.  **Action Bars are currently only supported on PlayBook and BB10 devices**. It is essentially a toolbar that appears at the bottom of the screen 
allowing for scrolling content above it.

![Action Bar](bbUI.js/raw/master/screenshots/actionBar.png)
 
If you have a title bar with a back button specified for PlayBook, and an action bar is not already specified for your screen, an action bar will be created with a back button as long as you don't already have an
action bar defined with tabs.  Action bars allow you to both navigate back to the previous screen but also provide tabs and/or buttons for your user.  

_NOTE: Combining a back button and tabs on an action bar is not allowed_

If you provide a **data-bb-back-caption** attribute on the action bar, a back button will automatically be created.  If 
you are using tabs on your screen, you can specify their tab styles using the **data-bb-tab-style** attribute.  Currently only "highlight" is supported.  Each item on the bar is defined as a **data-bb-type="action"** and its
type is defined by the **data-bb-style** attribute which can either be a "tab" or a "button".  Tabs automatically handle the highlighting of the selected tab.  it is recommended that you group your tabs and buttons together
to provide a clean user interface.

You can handle the selection of the action by assigning an **onclick** event handler.  

The color style of the action bar is either a dark or light theme.  This is applied using the **bb10ActionBarDark** property in the **bb.int()** function. Simply set bb10ActionBarDark to true/false to have the dark or light theme. This
theme will be carried over for the entire application to ensure a consistent look and feel.

    <div data-bb-type="action-bar" data-bb-tab-style="highlight">
		<div data-bb-type="action" data-bb-style="tab" data-bb-img="images/actionBar/cog_dark_theme.png">Library</div>
		<div data-bb-type="action" data-bb-style="tab" data-bb-selected="true" data-bb-img="images/actionBar/cog_dark_theme.png">Smart</div>
		<div data-bb-type="action" data-bb-style="button" data-bb-img="images/actionBar/cog_dark_theme.png" onclick="alert('Find');">Find</div>
	</div>
	
### Action Item Image Sizes

Images used for Actions will be scaled to the following resolutions and centered on the action bar items.

* BlackBerry PlayBook - 40 x 40 pixels
* BlackBerry 10 - 80 x 80 pixels
	
### Action Overflow Menu

If there are more than 5 total actions that are added to the action bar (including the back button) an overflow action menu will be created on the far right of the action bar.  This button will trigger a slide in overflow menu
that will contain the remaining items that were defined on the action bar.

## Loading Screen Specific Menus
bbUI handles loading of screen specific menus on both PlayBook, BlackBerry 10 and Smartphones with the same code. Each screen must have a menu defined if you want it displayed. Clean-up occurs on bb.popScreen and bb.pushScreen.

**Smartphone**

![Menu Phone](bbUI.js/raw/master/screenshots/menuBar-phone.png)

**PlayBook**

![Menu PlayBook](bbUI.js/raw/master/screenshots/menuBar-playbook.png)

Creating a menu is straight forward. Start by creating a &lt;div&gt; that has the attribute **data-bb-type="menu"**. Each item in the menu is another &lt;div&gt; that has the attribute **data-bb-type="menu-item"**. For a menu item 
to appear on PlayBook 2.x or BlackBerry 10 it must have **both** an image (data-bb-img) and a caption (data-bb-caption) or it will be ignored. The on a Smartphone it must have a caption (data-bb-caption). In both cases the _onclick()_ event is the function 
that will fire when the menu item is selected.  On BlackBerry 5/6/7 smartphones you can add the attribute **data-bb-selected="true"** which makes that the default item when the menu is displayed.

There is an additional type of item you can use **data-bb-type="menu-separator"** which creates a menu separator on PlayBook 2.x and BlackBerry 5/6/7 smartphones.  

_NOTE: BlackBerry 10 will ignore separators and will only allow a maximum of 5 menu items_

	<div data-bb-type="screen">
		<div data-bb-type="menu">
	 		<div data-bb-type="menu-item" data-bb-img="icon1.png" onclick="foo();">Foo</div>
	 		<div data-bb-type="menu-item" data-bb-img="icon2.png" onclick="bar();" data-bb-selected="true">Bar</div>
	 		<div data-bb-type="menu-item" data-bb-img="icon3.png" onclick="fooBar();">FooBar</div>
	 		<div data-bb-type="menu-separator"></div>
	 		<div data-bb-type="menu-item" onclick="barFoo();">BarFoo</div>
		</div>
	</div>

### PlayBook and BlackBerry 10 menu image sizes

When styling is applied to menus on **BlackBerry 10** the images used for menus will be scaled to the following resolutions and centered on the menu items.

* BlackBerry PlayBook - 40 x 40 pixels
* BlackBerry 10 - 80 x 80 pixels

When styling is applied to menus on PlayBook 2.x with BlackBerry 10 styling turned off images will be scaled to the following resolutions and centered on the menu items.

* BlackBerry PlayBook 2.x - 65 x 65 pixels
	

## BlackBerry 10 Context Menu

BlackBerry 10 allows for a press and hold context menu that is very similar to the action bar overflow menu.  If you add one of these menus to your screen you can also automatically 
wire up your image lists to the control.  _**NOTE: You can only have one context menu on a screen**_

When wired to an image list, pressing and holding on the image list item will "peek" the context menu and passing it the selected element.  Peeking the
context menu will show the row of action icons that can be clicked and part of the context information in the header of the menu.

When the user swipes from right to left it will pull the full menu into view if they want to see the text labels for all the items.

Markup for the context menu looks a lot like the action bar markup.  You are able to create a **data-bb-type="context-menu"** that has a series of **data-bb-type="action"** elements.  An action item consists
of an image and text.  To react to the clicking of an action simply assign an **onclick** handler to the action element.

    <div data-bb-type="context-menu">
		<div data-bb-type="action" data-bb-img="images/actionBar/cog_dark_theme.png">Email Work</div>
		<div data-bb-type="action" data-bb-img="images/actionBar/cog_dark_theme.png">Invite to Meeting</div>
		<div data-bb-type="action" data-bb-img="images/actionBar/cog_dark_theme.png">Call Work</div>
		<div data-bb-type="action" data-bb-img="images/actionBar/cog_dark_theme.png">View details</div>
		<div data-bb-type="action" data-bb-img="images/actionBar/cog_dark_theme.png" onclick="alert('Delete');">Delete</div>
	</div>
	

### Interacting with the context menu from JavaScript

![Context Menu](bbUI.js/raw/master/screenshots/contextMenu.png)

Each context menu has the ability to be both **peeked** and **shown** using JavaScript.  These methods are called with a parameter that contains a title, description and selected DOM element.  

To **peek** the icons on the context menu use the following code:
	
    var context = document.getElementById('mycontextmenu');
	context.menu.peek({title:'My Title', description: 'My Description', selected: mySelectedDOMElement});
	
To **show** the full context menu use the following code:

    var context = document.getElementById('mycontextmenu');
	context.menu.show({title:'My Title', description: 'My Description', selected: mySelectedDOMElement});

To grab the item that was selected from within your **onclick** of an action item.  This selected object is the one that was passed into the peek or show functions. You can refer to the **selected** property of the menu like in the following code:

    function myclick() {
		var selectedItem,
			context = document.getElementById('mycontextmenu');
		selectedItem  = context.menu.selected;
		if (selectedItem) {
			//... do something
		}
	}
	
	
### Image Sizes

Images for actions on the context menu will be scaled the same as the action bar.

* BlackBerry PlayBook - 40 x 40 pixels
* BlackBerry 10 - 80 x 80 pixels


## Image Lists

Image lists give the user different options that they can choose.  This user interface can seen in the BlackBerry options area.

![Image List](bbUI.js/raw/master/screenshots/imageList.png) ![Image List](bbUI.js/raw/master/screenshots/inboxList.png)

Creating an image list is really simple and begins with creating a &lt;div&gt; that has the attribute **data-bb-type="image-list"**.  Each item in the list is another 
&lt;div&gt; that has the attribute **data-bb-type="item"**.  Each item has an image (**data-bb-img**), a title (**data-bb-title**), accent text that floats in the top right (**data-bb-accent-text**), and a description which is the inner contents
of the &lt;div&gt;.  An image list can have both headers and line items. A header is declared by creating a &lt;div&gt; with a **data-bb-type="header"** attribute and the contents of the header are displayed as the label.  
Headers have their text centered by default.  To left justify your header text add the **data-bb-justify="left"** or to right justify your text add the **data-bb-justify="right"**attribute to your header.

### Image Sizes

* BlackBerry 5 &amp; 6 - 60 x 60 pixels 
* BlackBerry PlayBook &amp; BlackBerry 7 - 70 x 70 pixels
* BlackBerry PlayBook with BB10 styling - 64 x 64 pixels
* BlackBerry 10 - 119 x 119 pixels


If you want to attach a BlackBerry 10 context menu to your image list you can add the **data-bb-context="true"** attribute.  This will automatically hook up your image list to the 
press and hold context menu that you have declared for the screen.  When the image list item is pressed and held for 667ms it will **peek** the screen's context menu passing the 
title and description of the list item along with a handle to the item element.  See the Context Menu area for mor details of interacting with the menu.  

**NOTE: The context menu integration with the image list only works on BlackBerry 10**

	<div data-bb-type="screen">
		<div data-bb-type="image-list" data-bb-context="true">
			<div data-bb-type="header">My sample header</div>
			<div data-bb-type="item" data-bb-img="icon1.png" data-bb-title="Input Controls">Use native looking input controls</div>
			<div data-bb-type="item" data-bb-img="icon2.png" data-bb-title="Inbox List">Style your list like the BlackBerry Inbox</div> 
			<div data-bb-type="item" data-bb-img="icon3.png" data-bb-title="Settings">Create native looking options screens</div> 
			<div data-bb-type="header">Look at me</div>
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


To use a Label/Control container you first create a &lt;div&gt; with the **data-bb-type="label-control-container"** attribute. You then create a &lt;div&gt; with the **data-bb-type="label-control-horizontal-row"** attribute for 
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
	
BlackBerry 10 has an additional feature where you can specify a **data-bb-label="my label"** to have the label text appear in the dropdown control.

To select an item in a dropdown from JavaScript you can use the **setSelectedItem()** function that has been added to the &lt;select&gt; object. In many browsers, the **onchange** event
is not fired on a &lt;select&gt; if the value is set from JavaScript.  Only if it is set from the interaction with the UI.  Because of this bbUI cannot listen to the change made 
from outside JavaScript and apply the styling in the UI. When you call the **setSelectedItem()** method, the **onchange** of the select will also fire.

An example of how to select an item of the &lt;select&gt; element seen in the above sample is as follows:

		document.getElementById('fontfamily').setSelectedItem(1); //Parameter is the index of the item in the list

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


# Contributing

To build and contribute to bbUI.js please see the HACKING.md file

If you would like to contribute code to the bbUI.js project please follow the [How to Contribute](http://blackberry.github.com/howToContribute.html) instructions for contributor agreements.

