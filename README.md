![logo](https://raw.github.com/wiki/blackberry/bbUI.js/images/bbUI_100x403.png)

_**Current version: 0.9.2 BETA**_ 

The goal of the bbUI toolkit is to provide a BlackBerry&reg; User Experience and Design Language for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows the UI guidelines
and looks at home on a BlackBerry with very little effort.

All changes can be found in the [Commit History](https://github.com/blackberry/bbUI.js/commits/master) for this repo or in the [Change Log](bbUI.js/blob/master/CHANGELOG.md).

This toolkit is currently in an incubation stage and we're working on getting things up and going.  Focus is on BB6/BB7/PlayBook/BB10 and then back-port for BB5.  

**Please read the [Issues List](https://github.com/blackberry/bbUI.js/issues) for details on known issues, feature requests and planned improvements**

**Author(s)** 

* [Tim Neil](https://github.com/tneil) follow me on Twitter [@brcewane](https://twitter.com/#!/brcewane)
* [Gord Tanner](https://github.com/gtanner) follow me on Twitter [@gordtanner](https://twitter.com/#!/gordtanner)
* [Ken Wallis](https://github.com/kwallis) follow me on Twitter [@ken_wallis](https://twitter.com/#!/ken_wallis)
* [David Sosby](https://github.com/dsosby) follow me on Twitter [@ramdump](https://twitter.com/#!/ramdump)
* [Rory Craig-Barnes](https://github.com/glasspear) follow me on Twitter [@roryboy](https://twitter.com/#!/roryboy)
* [Justin Tokarchuk](https://github.com/jtokarchuk) follow me on Twitter [@jtokarchuk](https://twitter.com/#!/jtokarchuk)
* [James Blashill](https://github.com/jblashill) 

Icons in "samples/images/icons" are [Plastique Icons by Scott Lewis](http://iconify.it/) under the [Creative Commons Attribution-Share Alike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/legalcode) as 
[specified here](http://www.iconfinder.com/browse/iconset/plastique-icons/#readme).

## Source files to include

You can find both the JS and CSS files that you need to add to your page in the "pkg" directory in this repository.  You can also [download the current release as a zip](https://github.com/blackberry/bbUI.js/tags)

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

Each screen you create is an HTML fragment that gets loaded into the application via AJAX to keep the size of the DOM small and memory
usage to a minimum.

## Trackpad Navigation

bbUI is designed to take advantage of the WebWorks [Focus Based Navigation](http://developer.blackberry.com/html5/apis/blackberry.focus.html). 
The toolkit will automatically add the proper highlighting and focus based tags to your UI so that it provides standard BlackBerry trackpad navigation.

## Documentation

We've provided documentation for each of the controls in our wiki and you can check out the table of contents below to find the information you're looking for:

### The Basics

* [Config.xml Requirements](https://github.com/blackberry/bbUI.js/wiki/Config.xml-Requirements)
* [Toolkit Initialization](https://github.com/blackberry/bbUI.js/wiki/Toolkit-Initialization)
* [Screens](https://github.com/blackberry/bbUI.js/wiki/Screens)
* [Screen Specific CSS and JavaScript](https://github.com/blackberry/bbUI.js/wiki/Screen-Specific-CSS-and-JavaScript)
* [Data- Attribute Reference](https://github.com/blackberry/bbUI.js/wiki/Data-Attribute-Reference)
* [WebWorks Config.xml Reference](http://developer.blackberry.com/html5/documentation/ww_developing/Working_with_Config_XML_file_1866970_11.html)

### BlackBerry 10 "Only" controls

These controls are only supported on BlackBerry 10 devices or a PlayBook that has specified that it would like to use BlackBerry 10 styling

[ActionBar](https://github.com/blackberry/bbUI.js/wiki/Action-Bar) &nbsp;&nbsp; [ContextMenu](https://github.com/blackberry/bbUI.js/wiki/Context-Menus)  &nbsp;&nbsp; [GridList](https://github.com/blackberry/bbUI.js/wiki/Grid-List)


### Common Controls

These common controls and layouts are supported across BB6/BB7/PlayBook/BB10

[ArrowList](https://github.com/blackberry/bbUI.js/wiki/Arrow-List) &nbsp;&nbsp; [BBMBubbles](https://github.com/blackberry/bbUI.js/wiki/BBM-Bubbles) &nbsp;&nbsp; [Button](https://github.com/blackberry/bbUI.js/wiki/Buttons)
 &nbsp;&nbsp; [ControlGroup](https://github.com/blackberry/bbUI.js/wiki/Control-Groups) &nbsp;&nbsp; [DropDown](https://github.com/blackberry/bbUI.js/wiki/DropDowns) &nbsp;&nbsp; [ImageList](https://github.com/blackberry/bbUI.js/wiki/Image-List)
 &nbsp;&nbsp; [LabelControlContainer](https://github.com/blackberry/bbUI.js/wiki/Label-Control-Container) &nbsp;&nbsp; [PillButtons](https://github.com/blackberry/bbUI.js/wiki/Pill-Buttons)
 &nbsp;&nbsp; [ProgressIndicator](https://github.com/blackberry/bbUI.js/wiki/Progress-Indicator) &nbsp;&nbsp; [RadioButtons](https://github.com/blackberry/bbUI.js/wiki/Radio-Buttons) &nbsp;&nbsp;[ScreenMenu](https://github.com/blackberry/bbUI.js/wiki/Screen-Menus) &nbsp;&nbsp; [Slider](https://github.com/blackberry/bbUI.js/wiki/Sliders)


## Tested On

* BlackBerry Dev Alpha
* BlackBerry PlayBook v2.0.1.x
* BlackBerry Torch 9860 v7.0.0.x
* BlackBerry Curve 9360 v7.0.0.x
* BlackBerry Bold 9700 v6.0.0.546


## Contributing

To build and contribute to bbUI.js please see the HACKING.md file

If you would like to contribute code to the bbUI.js project please follow the [How to Contribute](http://blackberry.github.com/howToContribute.html) instructions for contributor agreements.

