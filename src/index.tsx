// Plugins => for 'Hiding the Splash Screen'
import { Plugins } from '@capacitor/core';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// These all CSS import => To apply the 'Core CSS' of 'Ionic Globally' on our app

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

//-- const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
const { SplashScreen } = Plugins;
ReactDOM.render(<App />, document.getElementById('root'));
/* By default, the Splash Screen is set to automatically hide after a certain amount of time (3 seconds). 
However, your app should boot much faster than this!
SplashScreen.hide() => for 'Hiding the Splash Screen' (SplashScreen => time loading before app start) */
SplashScreen.hide();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
