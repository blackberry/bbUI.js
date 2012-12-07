# Build Requirements

You will need to have [nodeJS][1] installed on your system. You can install it via the installers provided on the site
or follow the installation guide [here][2]

# Building

Building is done with [jake][3], JavaScript minifying is done with [Uglify-js](https://github.com/mishoo/UglifyJS) and CSS 
minifying is done with [CleanCSS](https://github.com/GoalSmashers/clean-css). 

Jake can be installed using npm with:

    npm install -g jake
    
Uglify-JS can be installed using npm with:

    npm install uglify-js
    
CleanCSS can be installed using npm with:

    npm install clean-css

and to build bbUI.js you just navigate to the bbUI.js directory via a comman dline and run:

    jake

or

    jake build

# Hacking

Finding your way around:

## src/

### core.js

Contains code for managing screens and managing the styling.

### bbUI.css

Contains all of the css rules for bbUI.

### plugins/

Contains all of the UI plugins.  Each plugin should be in the format of:

#### pluginName.js:
    bb.pluginName = {
        apply: function (elements) {
            //code to apply styling to the elements
        }
    };


  [1]: http://www.nodejs.org
  [2]: http://joyeur.com/2010/12/10/installing-node-and-npm/
  [3]: https://github.com/mde/jake

## screenshots/

Example screenshots for use in README.md

## samples/

An example app that showcases each of the bbUI.js plugins. 

## pkg/

The build location and also contains the current

## TODO:

- Fix the core.js registeration of plugins. Currently they are all hardcoded in the doLoad function
- Plugins should define their own css and have it built into bbUI.css
- More linting should be done
- add linting step into build


