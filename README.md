# playglot-web-app
This is a Web-App, which i developed in a project work. The purpose was building a social media app, which connects people with the same game and language interests, in a kind of tandem method approach.

The code is divided into two parts. The frontend and the backend.

The Web App is available under https://playglot.web.app/.

## Backend - Firebase, Node.js
The endpoints and firebase cloud functions can be found in the index.js.

The methods for the different endpoints can be found in the methods folder. They are seperated by users, quests (the post of the web app), and messenger. Each contains the logic for their area.

The utilities folder contains every kind of helper methods or imports which are used widely in the project. It also contains the validators which help with validating the send data.

## Frontend - React, Redux, MUI
The main part of the project lives in the src folder.

The App.js contains all the components and maintains the switching between pages.

The pages folder contains all pages of the web app.

The redux folder contains the store, the reducers and the actions.

The components folders contains all main components which were used to build the web app.

The utilities folder contains some custom components and files which have a supporting role in the project.

