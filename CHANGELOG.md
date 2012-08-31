# Change Log

Below you will find all the different changes that have been added since the first introduction of versioning for the bbUI toolkit.


## Version 0.9.4

* _**Compatibility Changes:**_ 
	* bb10ActionBarDark changed to actionBarDark for bb.init()
	* bb10ControlsDark changed to controlsDark for bb.init()
	* bb10ListsDark changed to listsDark for bb.init()
	* bb10HighlightColor changed to highlightColor for bb.init()
	* You no longer specify a viewport meta tag in your main index.htm.  This is now supplied by the toolkit at runtime based on the OS version
* PlayBook 2.0 Styling
    * Added Activity Indicator 
	* Text Input updates
	* Image List updates
	* Button updates
* JavaScript Interfaces
	* Image List: Added clear() function
	* Buttons: Added show(), hide(), remove() functions as well as a dynamic way to create/style buttons
	* DropDowns: Added enable(), disable(), show(), hide(), remove(), refresh(), setCaption(), setSelectedText() functions as well as a dynamic way to create/style dropdowns
	* Added bb.refresh() to refresh scrolling for the current screen
* Samples
	* Added sample screen for dynamic button manipulation
	* Added sample screen for dynamic dropdown manipulation
* Noteable Bug Fixes: 
    * Back button used to have problems when you were more than 2 screens deep
	* Back button used to have issues when screens did not have unique id's

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
 