## Christian Arneson Take Home Code Formatter
This is my first pass solution for the take home code formatter. There is definitely still plenty of room for optimization and refactorization, but I think that would take me a little more time to learn about Typescript. This was my first time using Typescript, and there are still many things that I don't understand yet.

## Solution Overview
This is a brief overview of my first thoughts on a solution to this problem that I've implemented.
- For each line
    - split line by spaces, commas, semicolons, and parentheses so that only individual words are left
    - get reserved keywords by comparing to a list of pre-defined keywords
    - get variables by looking at the word after 'let', 'const', or 'var'
    - get numbers using parseInt and parseFloat
    - get strings by splitting the line by ' and "
    - get templates by splitting the line by `
    - put all of the above into an arrays, and make the array items unique

At this point, I first tried to then go through each line and match the text with each of the extracted syntax words above. After it found a match, I was trying to replace the matched text with a styled <span> element. Getting this to work without using dangerouslySetInnerHtml was not looking very promising, so I switched up my approach by continuing with the following:

- For each line, and for each syntax type (reserved, variable, ect.)
    - find the index range at which each syntax type apears on each line and store that range
    - now for every character index of the code string, we know what type of styling to apply to it

- Rendering
    - for each character in each line
        - check if the current index belongs to a certain syntax type
        - if yes, apply the respective style to that character
        - if no, render the character un-styled

And with that, we have the basic starter code rendering correctly

- Additional features
    - live editor, so that the assessor doesn't have to go in and manually change the 'lines' array
    - strings and string templates are differentiated, for example if there is a variable named myVar, the string 'This is myVar' will be styled as only green, whereas \`This is ${myVar}\` will be green except for the variable which will be blue

- Known issues
    - having a variable inside template quotes (``) will still render as blue even without wrapping it in ${}
    - having 2 variables, one being a substring in the other will cause a problem when formatted:
        - `let i = 0; let item = null;` will render as `let i = 0; let iitem = null;`
    - leading whitespace from the text editor is not preserved, so there is no indentation except for in the second line of the default provided code, which is indented because of the default styling

- Potential refactors
    - instead of having 5 seperate arrays for the different syntax types that each need to be looped through with repetetive code, I could condense them into an object. The reason I didn't do that here is that my Typescript knowledge is very limited, and I was running into some issues that would require a deeper understanding that I think would take a little more time than the scope of this project

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
