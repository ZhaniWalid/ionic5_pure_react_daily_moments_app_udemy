import {
  getPlatforms,
  IonApp, IonLoading
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
import React from 'react';
// Use this cmd: 'npm install --save react-router react-router-dom' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
import { Route, Redirect, Switch /* , BrowserRouter */ } from 'react-router-dom'; // Package for routing
import { IonReactRouter } from '@ionic/react-router';
import { AuthContext, useAuthInit } from './auth';
import AppTabs from './AppTabs';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';


// React.FC => FC: Functionnal Component
const App: React.FC = () => {
  // return (
  //   <IonApp>
  //     <IonHeader>
  //       <IonToolbar>
  //         <IonTitle>My App</IonTitle>
  //       </IonToolbar>
  //     </IonHeader>
  //     <IonContent className="ion-padding">
  //       Add some content here…
  //     </IonContent>
  //   </IonApp>
  // );

  /*---- This hole code is moved to ['auth.ts'] file on the 'func useAuthInit()' and replaced by the line below
  //-- 'useState' => Allows us to manage 'State & Functional Components'
  // const [loggedIn, setLoggedIn] = useState(false); // initial value = 'false'
  const [authState, setAuthState] = useState({ loading: true, loggedIn: false}); // initial value(s) = 'true, false'
  //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
  //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
  useEffect(() => {
    // 'onAuthStateChanged'  => Adds an observer for changes to the user's sign-in state.
    firebaseAuth.onAuthStateChanged((user) => {
      //-- Boolean(user) :: if 'user==null' => 'setLoggedIn(false)' -elif- 'user!=null' (user==Object) => 'setLoggedIn(true)'
      // setLoggedIn(Boolean(user));
      setAuthState({ loading: false, loggedIn: Boolean(user) });
      console.log('Firebase onAuthStateChanged: ', user);
    });
  }, []); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X' 
   */

  // const authState = useAuthInit(); // initial value(s) = 'true, false' 
  const { loading, auth } = useAuthInit();

  // console.log(`Rendering App with loggedIn=${ loggedIn }`);
  //-- console.log(`Rendering App with authState=`, authState);
  
  // When we are 'connected' & we are on 'Home Tab' => When we 'refresh' the page we want to 'stay on Home Tab' & 'showing a spinner for a while'
  // => 'Instead' of 'showing' the 'Login Page for a while' (like this 'bug') then 'returning' to 'Home Tab'
  //-- if (authState.loading) {
  if (loading) {
    // '<IonLoading.../>' => To show us a 'loading screen' with a 'spinner' when 'user is waiting for an operation'
    return <IonLoading isOpen />;
  }
  console.log('Platforms - VS Code:', getPlatforms());
  console.log(`Rendering App with { loading, auth }=`, { loading, auth });

  return (
    <IonApp>
      {/* <AuthContext.'Provider' /> => It provide the 'Context' to all 'Components' inside it */}
      {/* <AuthContext.Provider value={{ loggedIn }} > */}

      {/* 'loggedIn: boolean;' => Replaced by 'auth?: Auth' because it's available when 'loading==false'
        '?' => means that 'auth' is optional ==> on ['auth.ts'] file ==> replaced by This line below
      <AuthContext.Provider value={{ loggedIn: authState.loggedIn }} > */}

      <AuthContext.Provider value={auth} > 
        {/* 'IonReactRouter' of 'IonicReact' => Is similar to 'BrowserRouter' of 'React' */}
        <IonReactRouter>
        {/* <BrowserRouter> */}
            {/* 'IonRouterOutlet' => it's add some 'transition effects' whenever we 'navigate' 'from one page to another'
                => If we will use '<Switch />' we should delete '<IonRouterOutlet />' => because they don't work together  */}
            {/* <IonRouterOutlet> */}

            {/* Switch tells React: 'Please load 1 of the routes, the 1st one actually'
                => The 1st that match the given path will be loaded
                => AND then after 'React' stop analysing the routes and don't render them
                => NB: the order of 'Routes' if very important for 'Switch' 
                => 'Specific Routes' (exmpl: '/A/B') should be 'before General Route' (exmpl: '/A') */}
            <Switch>
              {/* '<Route exact path="/login">' => if the path in the browser URL is exactly = "/login" then will show the 'LoginPage' */}
              <Route exact path="/login">
                {/* 'onLogin' => a param passed on the ['LoginPage.tsx'] file */}
                {/* {loggedIn ? <Redirect to="/entries" /> : <LoginPage onLogin={() => setLoggedIn(true)} />} */}
                {/* <LoginPage onLogin={() => setLoggedIn(true)} /> */}
                <LoginPage />
              </Route>
              {/* '<Route exact path="/register">' => if the path in the browser URL is exactly = "/register" then will show the 'RegisterPage' */}
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              {/* For the paths that start with "/my" => it will delegates to the '<AppTabs' ... /> */}
              <Route path="/my">
                <AppTabs />
              </Route>
              {/* '<Redirect... />' => if we are in this path="/" ==> We will be auto-redirected to this path="/home" */}
              <Redirect exact path="/" to="/my/entries"/>
              {/* This 'Route' is without specifing a 'path' => Matches every possible 'path'
                  => This last 'Route' will only be used if 'none of the other Routes above matches' */}
              <Route>
                <NotFoundPage />
              </Route>
            {/* </IonRouterOutlet> */}
            </Switch>
        {/* </BrowserRouter> */}
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
