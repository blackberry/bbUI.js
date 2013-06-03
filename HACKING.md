# Build Requirements

You will need to have [nodeJS][1] installed on your system. You can install it via the installers provided on the site
or follow the installation guide [here][2]

# Building

Building is done with [jake][3], JavaScript minifying is done with [Uglify-js](https://github.com/mishoo/UglifyJS) and CSS 
minifying is done with [CleanCSS](https://github.com/GoalSmashers/clean-css). 

If you don't already have Jake installed, first install it using npm with:

    npm install -g jake
    
Next, ensure you're in the root directory of the project then install development dependencies with:

    npm install
    
Finally, build bbUI.js by navigating to the **src** directory of your choosing and:

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


