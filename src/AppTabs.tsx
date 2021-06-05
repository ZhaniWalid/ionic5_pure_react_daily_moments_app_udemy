import {
    IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'
import React from 'react';
import HomePage from './pages/HomePage';
import EntryPage from './pages/EntryPage';
import SettingsPage from './pages/SettingsPage';
// Use this cmd: 'npm install --save react-router react-router-dom' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
import { Route, Redirect /* , BrowserRouter */  } from 'react-router-dom'; // Package for routing
//-- Use this cmd: 'npm install ionicons' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
// 'home & settings' => are icons from ' https://ionicons.com/ ' => Website specified for icons only for IONIC FRAMEWORK
import { home as homeIcon, settings as settingsIcon } from 'ionicons/icons';
import { useAuth } from './auth';
import AddEntryPage from './pages/AddEntryPage';
import EditEntryPage from './pages/EditEntryPage';

// React.FC => FC: Functionnal Component
const AppTabs: React.FC = () => {
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    /* useContext(Context) => Accepts a context object (the value returned from React.createContext) and returns...
    the current context value, as given by the nearest context provider for the given context. */
    const { loggedIn } = useAuth();
    if (!loggedIn) {
        return <Redirect to="/login" />;
    }
    return (
        // 'IonTabs' of 'Ionic' => Our router will be displayed into 'tabs'
        <IonTabs>
            {/* 'IonRouterOutlet' => it's add some 'transition effects' whenever we 'navigate' 'from one page to another' */}
            <IonRouterOutlet>
                {/* '<Route exact path="/home">' => if the path in the browser URL is exactly = "/home" then will show the 'HomePage' */}
                <Route exact path="/my/entries">
                    <HomePage />
                </Route>
                {/* '<Route exact path="/my/entries/add">' => if the path in the browser URL is exactly = "/my/entries/add" then will show the 'AddEntryPage' */}
                <Route exact path="/my/entries/add">
                    <AddEntryPage />
                </Route>
                {/* '<Route exact path="/my/entries/edit/:idEntry">' => if the path in the browser URL is exactly = "/my/entries/edit/:idEntry" then will show the 'EditEntryPage' */}
                <Route exact path="/my/entries/edit/:idEntry">
                    <EditEntryPage />
                </Route>
                {/* '<Route exact path="/entries/view/:idRoute">' => if the path in the browser URL is exactly = "/entries/view/:idRoute" then will show the 'EntryPage' 
                        '/:idRoute' => We get it from ['/EntryPage.tsx'] file => We pass the 'id' as a param*/}
                <Route exact path="/my/entries/view/:idRoute">
                    <EntryPage />
                </Route>
                {/* '<Route exact path="/settings">' => if the path in the browser URL is exactly = "/settings" then will show the 'SettingsPage' */}
                <Route exact path="/my/settings">
                    <SettingsPage />
                </Route>
                {/* '<Redirect... />' => if we are in this path="/" ==> We will be auto-redirected to this path="/home" */}
                <Redirect exact path="/" to="/my/entries"/>
            </IonRouterOutlet>
            {/* 'IonTabBar' of 'Ionic' => tab-bar that where we will display our pages links
                    slot="bottom"/"top" => Where we will put our tab-bar :: "bottom" ? "top" */}
            <IonTabBar slot="bottom">
                {/* 'IonTabButton' of 'Ionic' => We set the id(tab="home") & href="/home"("path") (should be the exact path put as in the 'Route' element)
                'IonLabel' of 'Ionic' => The 'Label' of the 'IonTabButton' */}
                <IonTabButton tab="home" href="/my/entries">
                    {/* <IonIcon /> => To use icons 
                            slot="start" => To make spacing between the 'icon' before the 'text' of the button
                            slot="end" => To make spacing between the 'icon' after the 'text' of the button  */}
                    <IonIcon icon={homeIcon}/>
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="settings" href="/my/settings">
                    <IonIcon icon={settingsIcon}/>
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>    
            </IonTabBar>  
        </IonTabs>
    );
};

export default AppTabs;