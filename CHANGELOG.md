# Change Log

Below you will find all the different changes that have been added since the first introduction of versioning for the bbUI toolkit.

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
 