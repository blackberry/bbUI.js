![logo](https://raw.github.com/wiki/blackberry/bbUI.js/images/bbUI_100x403.png)

<table>
<tr>
<td><i><b>For the latest features:</b></i></td>
<td>v0.9.6</td>
<td><i>BETA</i></td>
<td><a href="https://github.com/blackberry/bbUI.js/archive/master.zip">Download as ZIP</a></td>
<td><a href="https://github.com/blackberry/bbUI.js/archive/master.tar.gz">Download as TAR.GZ</a></td>
</tr>
<tr>
<td><i><b>Last published version (v0.9.5):</b></i></td>
<td>v0.9.5</td>
<td><i>BETA</i></td>
<td><a href="https://github.com/blackberry/bbUI.js/archive/v0.9.5.zip">Download as ZIP</a></td>
<td><a href="https://github.com/blackberry/bbUI.js/archive/v0.9.5.tar.gz">Download as TAR.GZ</a></td>
</tr>
</table> 

## BlackBerry 10 Support Requires WebWorks 2.X

[You can download WebWorks 2.X here](https://developer.blackberry.com/html5/download/)

You can find both of the necessary JavaScript and CSS files for your application in the _**pkg**_ directory. If you are using BlackBerry 10 [Context Menus](https://github.com/blackberry/bbUI.js/wiki/Context-Menus) you
will also need to include the WebWorks extension outlined in the [extension README](pkg/bb10/). As of v0.9.5 this includes both the full version and minified versions of the bbUI files.  The **samples** directory will 
give you examples of how to use the bbUI toolkit. You can also [download other previous releases as a zip or tar.gz](https://github.com/blackberry/bbUI.js/tags)

All changes can be found in the [Commit History](https://github.com/blackberry/bbUI.js/commits/master) for this repo or in the [Change Log](CHANGELOG.md).

## Project Goals

The objective of the bbUI toolkit is to provide a BlackBerry&reg; User Experience and Design Language for HTML5 applications using the 
[BlackBerry WebWorks](http://developer.blackberry.com/html5) framework.  It provides common UI constructs that
are found on the BlackBerry operating system so that you can create an application that follows system UI guidelines
and looks at home on a BlackBerry with very little effort.

The bbUI project is an incubation project where we experiment with application constructs and CSS to create a BlackBerry user experience.  We experiment with different methods
of building an application UI using HTML5/CSS to squeeze out the most performance possible and adapt to the different idiosyncrasies of the BlackBerry browser following its transformation from BlackBerry 5 to 
BlackBerry 10.  This helps us find areas of improvement in the web rendering and animation engine. We also take our learnings from bbUI and apply them outward as contributions into mainstream 
JavaScript frameworks such as [jQuery Mobile](https://github.com/blackberry/jQueryMobile-BB10-Theme), Sencha and Dojo. Development focus in bbUI is on BB10 -> PlayBook -> BB7 -> BB6 and then back-port for BB5.  

**Please read the [Issues List](https://github.com/blackberry/bbUI.js/issues) for details on known issues, feature requests and planned improvements**

## Authors

You can find the [list of Contributors to bbUI here](https://github.com/blackberry/bbUI.js/graphs/contributors) 

Icons in "samples/images/icons" are [Plastique Icons by Scott Lewis](http://iconify.it/) under the [Creative Commons Attribution-Share Alike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/legalcode) as 
[specified here](http://www.iconfinder.com/browse/iconset/plastique-icons/#readme).


## Showcase Your Application

Have a bbUI application that you would like to showcase to other potential bbUI developers. Feel free to promote your appliation or check out what others
have accomplished in the [bbUI Showcase](https://github.com/blackberry/bbUI.js/issues/442)!

## Handy Image Resources

Both RIM and community members have provided some images that you can use on your BlackBerry 10 action bars:
* [RIM provided images](https://developer.blackberry.com/design/bb10/)
* [Community provided images](http://devblog.blackberry.com/2012/12/blackberry-10-icon-sets/)

## Philosophy

The bbUI toolkit is designed to progressively enhance its capability based on the abilities of the Web rendering engine 
on BB5/BB6/BB7/PlayBook and BlackBerry 10.  This means that in some cases toolbars are fixed, and in others they scroll with the content.  The 
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

* [READ ME FIRST before doing anything else](https://github.com/blackberry/bbUI.js/wiki/Application-Structure)
* [Config.xml Requirements](https://github.com/blackberry/bbUI.js/wiki/Config.xml-Requirements)
* [Toolkit Initialization](https://github.com/blackberry/bbUI.js/wiki/Toolkit-Initialization)
* [Screens](https://github.com/blackberry/bbUI.js/wiki/Screens)
* [Screen Specific CSS and JavaScript](https://github.com/blackberry/bbUI.js/wiki/Screen-Specific-CSS-and-JavaScript)
* [Data- Attribute Reference](https://github.com/blackberry/bbUI.js/wiki/Data-Attribute-Reference)
* [WebWorks Config.xml Reference](http://developer.blackberry.com/html5/documentation/ww_developing/Working_with_Config_XML_file_1866970_11.html)

### BlackBerry 10 "Only" controls

These controls are only supported on BlackBerry 10 devices or a PlayBook that has specified that it would like to use BlackBerry 10 styling

[ActionBar](https://github.com/blackberry/bbUI.js/wiki/Action-Bar) &nbsp;&nbsp; [ActivityIndicator](https://github.com/blackberry/bbUI.js/wiki/Activity-Indicator) &nbsp;&nbsp; [ContextMenu](https://github.com/blackberry/bbUI.js/wiki/Context-Menus)  &nbsp;&nbsp; [GridList](https://github.com/blackberry/bbUI.js/wiki/Grid-List)


### Common Controls

These common controls and layouts are supported across BB6/BB7/PlayBook/BB10

[BBMBubbles](https://github.com/blackberry/bbUI.js/wiki/BBM-Bubbles) &nbsp;&nbsp; [Button](https://github.com/blackberry/bbUI.js/wiki/Buttons)
 &nbsp;&nbsp; [Checkbox](https://github.com/blackberry/bbUI.js/wiki/Checkboxes) &nbsp;&nbsp; [ControlGroup](https://github.com/blackberry/bbUI.js/wiki/Control-Groups) &nbsp;&nbsp; [DropDown](https://github.com/blackberry/bbUI.js/wiki/DropDowns) &nbsp;&nbsp; [ImageList](https://github.com/blackberry/bbUI.js/wiki/Image-List)
 &nbsp;&nbsp; [Inputs](https://github.com/blackberry/bbUI.js/wiki/Inputs) &nbsp;&nbsp;[LabelControlContainer](https://github.com/blackberry/bbUI.js/wiki/Label-Control-Container) &nbsp;&nbsp; [PillButtons](https://github.com/blackberry/bbUI.js/wiki/Pill-Buttons)
 &nbsp;&nbsp; [ProgressIndicator](https://github.com/blackberry/bbUI.js/wiki/Progress-Indicator) &nbsp;&nbsp; [RadioButtons](https://github.com/blackberry/bbUI.js/wiki/Radio-Buttons) &nbsp;&nbsp;[ScreenMenu](https://github.com/blackberry/bbUI.js/wiki/Screen-Menus) 
 &nbsp;&nbsp; [ScrollPanel](https://github.com/blackberry/bbUI.js/wiki/Scroll-Panel) &nbsp;&nbsp; [Slider](https://github.com/blackberry/bbUI.js/wiki/Sliders) &nbsp;&nbsp; [Title Bars](https://github.com/blackberry/bbUI.js/wiki/Title-Bars) &nbsp;&nbsp; [ToggleButton](https://github.com/blackberry/bbUI.js/wiki/Toggle-Buttons)


## Tested On

* BlackBerry 10.3.0.440 (Beta)
* BlackBerry 10.2.1.2102 
* BlackBerry 10.2.0.339 
* BlackBerry 10.1.0.273
* BlackBerry 10.0.10.672
* BlackBerry PlayBook v2.1.x.x
* BlackBerry Torch 9860 v7.0.0.x
* BlackBerry Curve 9360 v7.0.0.x
* BlackBerry Bold 9700 v6.0.0.546

## Bug Reporting and Feature Requests
If you find a bug or have an enhancement request, please fill out a [github Issue](https://github.com/blackberry/bbUI.js/issues).


## Contributing

To build and contribute to bbUI.js please see the [HACKING.md](HACKING.md) file

If you would like to contribute code to the bbUI.js project please follow the [How to Contribute](http://blackberry.github.com/howToContribute.html) instructions for contributor agreements.

## Disclaimer
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
