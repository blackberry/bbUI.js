# Change Log

Below you will find all the different changes that have been added since the first introduction of versioning for the bbUI toolkit.

## Latest Working Version 0.9.6

* _**Compatibility Changes:**_ 
	* bbUI has now been broken into 3 different builds in the **pkg** directory.  One for BB10, BBOS and PlayBook
	* bb10ForPlayBook has now been removed. If you want BB10 styling for PlayBook, simply include the BB10 build of bbUI.js to your application
	* Context Menus: 
	    * No longer have the peek() and show() functions.  All functionality is now tied into the framework.  
	    * You now require the bbUI WebWorks plug-in from the _ext_ directory for the context menu functionality on BlackBerry 10 smartphones
	* Light colored action bars, context menus and screen menus are no longer supported. Only dark styling is allowed to match BB10 UX guidelines
	* Control Groups/Round Panels have now changed their styling for BlackBerry 10.  This could impact the look and feel of your application
	* BB10 Input fields are now wrapped with a container after they have been styled. 
		* This may affect code that was showing/hiding/disabling inputs via JavaScript. 
		* New JavaScript interfaces have been added to input controls for BB10.
		* Inputs now grow to their container size. You may need to adjust container sizing to get the desired layout result
	* BB10 data-bb-image-effect="fade" for image lists have been removed for performance reasons
* Notable Updates
	* Improved animation smoothness for tab overflow show/hide
	* Improved speed when scrolling large image lists of up to around 100 items
	* Toggle Buttons, Pill Buttons and Progress bars animate their state after the screen transition ends. This helps for screen transition smooth animations
	* Improved screen transition animation speeds when using BB10 grids, image lists and title bars with images
	* Added the _data-bb-indicator_ attribute to a BB10 screen that will show the indicator while your content loads
* BlackBerry 10 Styling
	* Screen Resolution adjustments are now applied with CSS media queries to reduce the size of bbUI.css
	* Updated sizing for all controls for BlackBerry Q10 720x720 screen resolution
	* Updated Pill Button styling
	* Input field styling updates (fonts and control behaviour)
	* Label/Control container title font size updated
	* Updated the clear button on input fields
	* Grid lists now load their images as the user scrolls items into view
	* Updated headers on grid and image lists to better match the sizing and coloring on BB10
	* Updated Action Bars to have a minimized version when in landscape
	* Image list selection highlighting on touch and press-and-hold updated to match Cascades
	* Action Bar styling improvements to better match Cascades
		* This includes press and hold pop-up tips for the caption on action bar items for Q10
	* DropDown controls now allow for a second line of text using the data-bb-accent text property on an &lg;option&gt;
	* Control Groups/Round Panels have now been updated to the latest styling
	* Application/Screen menu now behaves like the Cascades version
* JavaScript Interfaces
	* **Radio Buttons:** Added ability to style dynamically using bb.radio.style()
	* **BBM Bubbles:** Added clear(), getitems() and ability to style dynamically using bb.bbmBubble.style()
		* Items: Added getCaption(), setCaption(), getImage(), setImage() and remove() functions
	* **Action Bar:** Added show(), hide() functions
		* Buttons and Tabs: Added show(), hide() functions
	* **DropDown:** Added getCaption() function
	* **BB10 Inputs:** Added show(), hide(), remove(), enable(), disable() functions and ability to style dynamically using bb.textInput.style()
	* **Context Menu:** Added hide(), show() functions to menu items
	* **Pill Buttons:** Added clear(), appendButton() and ability to style dynamically using bb.pillButtons.style()
		* Button: Added getCaption(), setCaption functions for BB10 pill buttons
	* **Buttons:** Added getCaption(), getImage() functions
	* **Screens:** Added getActionBarHeight(), getTitleBarHeight() functions that return standard heights in pixels
	* **BB6/7 Title Bars:** Added getCaption(), setCaption() functions
* Samples
	* Created dedicated sample page for Pill Button JavaScript interfaces
	* Updated samples to allow for a simple switch in code to use the dark or light theme for BlackBerry 10
* Noteable Bug Fixes: 
    * BB10 Back button highlighting more responsive and doesn't get blocked by screen animation
	* Tab overflow menu "tinted" overlay no longer allows for touch events to propagate down to the screen below it
	* Clicking the context menu when peeked now shows the title area of the context menu.
	* Action bar is now hidden when the virtual keyboard shows
	* The screen's scrollToElement() function has now been fixed
	* Clear button on input fields no longer gets in the way of long text in the field
	* Wrapping of back caption on action bars is now fixed
	* Fixed a bug where script tags with text/template were trying to be evaluated 
	
## Version 0.9.5

* _**Compatibility Changes:**_ 
	* Image List items now only highlight if they have an associated onclick for the item or context menu assigned to the list
	* Image List images are now 109x109 pixels instead of the 119x119 for BlackBerry 10 devices in bbUI 0.9.4
	* Including bbUI now only needs bbUI.js and bbUI.css files. The version numbers are now part of the comments in the files instead of the file name
* Notable Updates
	* Minified versions of the JavaScript and CSS files are now available in the "pkg" directory
	* Jake files updated to now use Uglify.js and CleanCSS to minify JS/CSS files and add the build version
	* The _**next**_ branch has now been removed and the latest features will be added to the master branch with an easier way of downloading the latest code
* BlackBerry 10 Styling
	* Updated Action Bar back button and "button actions" to have a highlight when touched
	* Updated grids:
        * Now allow for a specified number of columns in a row
		* Provide horizontal carousel scrolling
	* Context menus, action overflow and tab overflow menus now scroll content when there are more actions than what will fit on the screen
	* Action overflow and context menu highlighting has been updated to match BB10 UX
	* Image list item height changed to match UX specs
	* Updated title bars:
		* Height of the bar and buttons changed to match UX specs
		* Allows for a colored option using titleBarColor in the bb.init() function
	* Toggle Buttons now can be disabled using the data-bb-disabled="true" attribute
* JavaScript Interfaces
	* **Checkboxes:** Added show(), hide(), remove(), enable(), disable() functions and ability to style dynamically using bb.checkbox.style()
	* **Toggle Buttons:** Added show(), hide(), remove(), setOnCaption(), setOffCaption(), getOnCaption(), getOffCaption(), enable(), disable() functions  and ability to style dynamically using bb.toggle.style()
	* **Radio Buttons:** Added show(), hide(), remove(), enable(), disable(), isEnabled(), enableGroup(), disableGroup() functions
	* **Action Bars:** Added setBackCaption(), setSelectedTab() functions
		* **Buttons/Tabs:** Added getCaption(), getImage() functions
	* **Scroll Panels:** Added show(), hide(), remove() functions
	* **Grid Lists:** Added show(), hide(), remove() functions
	* **Progress Indicator:** Added show(), hide(), remove() functions
	* **Pill Buttons:** Added show(), hide(), remove(), getButtons() functions
	* **Control Groups/Round Panels:** Added show(), hide(), remove() functions
	* **Image Lists:** Added show(), hide(), remove(), refresh() functions
	* **Label Control Containers:** Added show(), hide(), remove() functions
	* **BBM Bubbles:** Added show(), hide(), remove(), getStyle(), setStyle() functions
	* **Progress Bars:** Added show(), hide(), remove(), setMax() functions and ability to style dynamically using bb.progress.style()
	* **Title Bars:** Added getAccentText() function
* Samples
	* Updated samples for dynamic control manipulation
	* Added sample to show how to make static pill buttons in your title area
	* Main index.htm updated to show how to include webworks.js for BB10 and also fire the "webworksready" for non BB10 devices
* Noteable Bug Fixes: 
    * Hack added to sample index.htm to show how to deal with Ripple known issue of firing "webworksready" multiple times causing problems with bbUI in Ripple
	* Fixed wrapping of text in long title bar caption and title bar accent text

## Version 0.9.4

* _**Compatibility Changes:**_ 
	* bb10ActionBarDark changed to actionBarDark for bb.init()
	* bb10ControlsDark changed to controlsDark for bb.init()
	* bb10ListsDark changed to listsDark for bb.init()
	* bb10HighlightColor changed to highlightColor for bb.init()
	* You no longer specify a viewport meta tag in your main index.htm.  This is now supplied by the toolkit at runtime based on the OS version
	* BlackBerry 10 title bars now take on the control coloring
	* You no longer need to specify a unique **id** for your script tags used with screens.
	* Scroll Panel JavaScript interfaces have been modified
	* If you were calling bb.scroller.refresh() you will want to change your code to "if (bb.scroller) bb.scroller.refresh();"
* BlackBerry 10 Styling
	* Updated DropDown look to match Cascades
	* Added new Title Bar styling for screens
	* Grid view items display either one or two level of titles depending on what is provided in markup
	* Added accent text to tab overflow items now allowing for a title and optional accent text for an action
	* Truncated text on image lists now use a "fade" instead of an "ellipsis" on BB10 phones. Other devices still use "ellipsis"
* PlayBook 2.0 Styling
    * Added Activity Indicator 
	* Text Input updates
	* Image List updates
	* Button updates
* JavaScript Interfaces
	* **Image List:** Added clear() function
	* **Buttons:** Added show(), hide(), remove() functions as well as a dynamic way to create/style buttons
	* **DropDowns:** Added enable(), disable(), show(), hide(), remove(), refresh(), setCaption(), setSelectedText() functions as well as a dynamic way to create/style dropdowns
	* **Action Bar:** Added setCaption(), setImage() to actions
	* **Context Menu:** Added setCaption(), setImage() to actions
	* **Screens:** Added refresh(), scrollTo(), scrollToElement()
	* **Activity Indicator:** Added show(), hide(), remove()
	* Added bb.refresh() to refresh scrolling for the current screen
	* Added the ability to pass custom parameters to pushScreen() and read them in ondomready and onscreenready
* Samples
	* Added sample screen for dynamic button manipulation
	* Added sample screen for dynamic dropdown manipulation
	* Added sample screen for dynamic action bar manipulation
* Noteable Bug Fixes: 
    * Back button used to have problems when you were more than 2 screens deep
	* Back button used to have issues when screens did not have unique id's
	* Context menu was not showing when doing a right-to-left swipe if it was on the same screen with an Action Bar that had action overflow items
	* Sliders would sometimes would not color correctly and/or jump back to zero after you set their initial value in the DOM
	* BlackBerry 6/7 Dropdowns now emulate properly in Ripple

## Version 0.9.3

* _**Compatibility Changes:**_ 
    * Default for control colors changed from dark to light
    * The progress bar _pause()_ function has been removed and replaced with _setState(state)_
	* Action Bar Overflow menu must now be configured
	* Arrow Lists have now been merged into the Image List control
	* By default screens are white unless you explicitly set their style
	* BlackBerry 10 Buttons no longer stretch by default
* Action Bar: 
    * Back buttons now have a colored slash &quot;/&quot;
    * Dark gradient area at the top of the overflow menu has been removed. This only appears on the press-and-hold context menu
    * Overflow and Context Menu items are now centered in the menu
    * Overflow and Context Menu can now "pin" an action to the bottom of the menu
    * Now supports Tab Overflow Menus
* Image List:
	* Now supports (default | arrowlist | arrowbuttons | addbuttons | removebuttons) styling
	* Added JavaScript interface to list and items
	* Onbtnclick events are now availble for image lists that have secondary action buttons
	* Now re-adjust alignment when no description is given
* Buttons:
	* BB10 styling now supports: text only | image only | text + image
	* BB10 styling now has a setImage() function added to buttons
	* setCaption() function added to buttons for all OS versions
	* PlayBook buttons have now been resized to better suit the screen resolution
* File Input: BlackBerry 10 button styling applied to input of type "file"
* Toggle Buttons: BlackBerry 10 styling added for toggle buttons
* Activity Indicator: Added new BlackBerry 10 Activity Indicator
* TitleBar: Added setCaption(value), getCaption(), setBackCaption(value), getBackCaption(), setActionCaption(value), getActionCaption()
* CheckBoxes: 
	* Added new BlackBerry 10 styling to check boxes
	* Added getChecked(), setChecked(value) javascript functions
* RadioButtons: Added getChecked(), setChecked(value) javascript functions
* Grid Layout: Added animation to images on orientation change for grid layouts
* Scroll Panel: Added panel where all inner contents will scroll
* Screen Transitions: Slide screen transitions are now supported for BlackBerry 10 and PlayBook 
* Noteable Bug Fixes: 
    * Action Bar overflow used to appear briefly when changing orientation
    * Solid headers on image lists used to have a JavaScript exception
    * Jake file for building used to paste the wrong license file text causing exceptions in JavaScript
	* Increased Trackpad navigation speeds on input controls for BB7 devices (had to remove border radius on inputs)


## Version 0.9.2

* Grid list margins corrected
* Grid list now supports square 1:1 ratio images
* Grid list now will only show overlay if either a title or sub-title is provided
* Grid list now has press-and-hold context menu support
* Large text for title/description on context menu now truncated with an ellipsis 
* Large text for label on text arrow lists now truncated with an ellipsis
* Bug fixes for swipe down menu
* HTML5 input fields now supported in a Label/Control container
* Added slider styling for BlackBerry 10
* Added progress indicators for BlackBerry 5/6/7/PlayBook/10
* Supplying a back caption in a title bar no longer creates an action bar with a back button
* Added title bar support to BB10
* Added placeholder image support for image lists
* Added image effect on image lists for BB10
* Added support for images lists to just have text and no images
* Added radio button styling for BB10
* Added header styling (normal, solid) to the BB10 image and grid list
* Changed header text justification on the image and grid list
* Changed list highlighting for BB10 to match UX specs


## Version 0.9.1

* First version number provided for the toolkit
* Modified menus to require both a caption and an image for PlayBook 2.x and BlackBerry 10 to follow UX guidelines
* Image List item text will now add an Ellipsis "..." to the end of text that is too long for the list item on devices that support it
* Merged the Inbox style list into the Image List control
* Removed the tall list layout... This will be merging into a feature of the Image List in a upcoming release
* Added sub title text to the image list control
* JS and CSS files now renamed to match the toolkit version
* Updated all the samples to show how to handle BB10 color themes while supporting non-BB10 devices at the same time
* New **manditory bb.int(options)** function to initialize the toolkit allowing for overrides of properties and events
* bb.onscreenready has now been removed and added as an option for the bb.init() function
* New header item support for the image list
* New grid view for BlackBerry 10 
* New action bar for BlackBerry 10 with dark and light themes. Support for back button, highlight tabs, and action buttons
* New highlight and accent colors for BlackBerry 10
* New BlackBerry 10 button & pill button styling with dark and light themes
* New BlackBerry 10 swipe down menu styling
* New BlackBerry 10 Context Menu
* New BlackBerry 10 Press and hold Context Menu integration into Image Lists
* New BlackBerry 10 styled inputs with "delete" button and styled placeholder text
* Added screen and list coloring for BB10 with dark and light themes
* New **ondomready** event which fires after your screen has been loaded into the DOM
* Changed all of the isBB5/isBB6/etc functions to boolean properties. This avoids a scenario where these may evaluate to true simply because the function was assigned
* Sample: Added a fun random color changer for highlight and accent colors on BlackBerry 10
* Sample: Added BlackBerry 10 grid
* Sample: Added BlackBerry 10 action bar
* Sample: Grouped items on main menu screen
 
