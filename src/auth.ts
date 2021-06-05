//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
//-- 'useState' => Allows us to manage 'State & Functional Components'
import React, { useContext, useEffect, useState } from 'react';
import { firebaseAuth } from './firebase';

// We are defining here our 'Auth' object using the interface
interface Auth {
    loggedIn: boolean;
    // userId? => it's an optional property will only be available if 'loggedIn==true' ('?' => means 'userId' is optional)
    userId?: string;
}

// We are defining here our 'AuthInit' object using the interface
interface AuthInit {
    loading: boolean;
    auth?: Auth  
    // 'loggedIn: boolean;' => Replaced by 'auth?: Auth' because it's available when 'loading==false'
    //   '?' => means that 'auth' is optional
}

/* Context provides a way to pass data through the component tree without having to pass props down manually...
...at every level. */
export const AuthContext = React.createContext<Auth>({ loggedIn: false });

// A custom 'React Hook'
export function useAuth(): Auth {
    /* useContext(Context) => Accepts a context object (the value returned from React.createContext) and returns...
    the current context value, as given by the nearest context provider for the given context. */
    return useContext(AuthContext);
}

// A custom 'React Hook'
export function useAuthInit(): AuthInit {
  //-- 'useState' => Allows us to manage 'State & Functional Components'
  // const [authInit, setAuthInit] = useState<AuthInit>({ loading: true, loggedIn: false}); // initial value(s) = 'true, false'
  
  // 'loggedIn: false' => Removed because we now use 'auth?: Auth' above 
  //    => because There is no 'auth:Auth' (loggedIn) object availabe yet
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true}); // initial value(s) = 'true, false'
  //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
  //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
  useEffect(() => {
    // 'onAuthStateChanged'  => Adds an observer for changes to the user's sign-in state.
    return firebaseAuth.onAuthStateChanged((firebaseUser) => {
      // Boolean(firebaseUser) :: if 'firebaseUser==null' => 'setLoggedIn(false)' -elif- 'firebaseUser!=null' (firebaseUser==Object) => 'setLoggedIn(true)'
      //-- setLoggedIn(Boolean(firebaseUser));
      // setAuthInit({ loading: false, loggedIn: Boolean(firebaseUser) }); // replaced by this line below
       
      // 'loggedIn: boolean;' => Replaced by 'auth?: Auth' because it's available when 'loading==false'
      //   '?' => means that 'auth' is optional
      //--- setAuthInit({ loading: false, auth: { loggedIn: Boolean(firebaseUser) } });

      const auth = firebaseUser ? { loggedIn: true, userId: firebaseUser.uid } : { loggedIn: false };
      setAuthInit({ loading: false, auth });
      console.log('Firebase onAuthStateChanged => firebaseUser: ', firebaseUser);
    });
  }, []); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X' 
  return authInit;
}