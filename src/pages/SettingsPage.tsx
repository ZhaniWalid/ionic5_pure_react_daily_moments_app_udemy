import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonFooter,
    IonHeader,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
  } from '@ionic/react';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { firebaseAuth } from '../firebase';

// React.FC => FC: Functionnal Component
const SettingsPage: React.FC = () => {
    const [getCurrentUserEmail, setGetCurrentUserEmail] = useState(''); // Added by me (not from tuto) => To get Current User Email

    // This 'useEffect()' method => Added by me (not from tuto) => To get Current User Email
    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {
        // These 3 Lines => Added by me (not from tuto) => To get Current User Email
        const currentUserEmail = firebaseAuth.currentUser.email;
        setGetCurrentUserEmail(currentUserEmail);
        console.log('[SettingsPage] => Current User Email:', currentUserEmail);
    }, []); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X' 
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Settings</IonTitle>
                    {/* '<IonLabel >....' => Added by me (not from tuto) => To get Current User Email */}
                    <IonLabel slot="end">
                        <h4>{getCurrentUserEmail}</h4>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Go to <Link to="/home">Home</Link> */}

                {/* 'IonRouterLink' of 'IonicReact' => Is similar to 'Link' of 'React' */}
                {/* Go to <IonRouterLink routerLink="/home">Home</IonRouterLink> */}
                
                Logout from here.
                <br></br>
                <br></br>
                {/* 'firebaseAuth.signOut()' => will use 'onAuthStateChanged' on 'useEffect()' in ['./App.tsx'] file
                    & update the values to { loading: false, loggedIn: false } & Redirect to "/login" auto */}
                <IonButton color="medium"
                           expand="block"
                           onClick={() => firebaseAuth.signOut()}>Logout</IonButton>
                <IonCard style={{ 'marginTop': '20px' }}>
                    <IonCardHeader>                  
                        <IonCardTitle>About</IonCardTitle>
                        <IonCardSubtitle style={{ 'paddingTop': '10px', 'fontWeight': 'bold' }}>Daily Moments App v1.0.5</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Capture your life, one moment every day.
                        <br></br>
                        <br></br>
                        Capture what matters : family, hobbies, travel or anything else.
                        Never forget a day of your life.
                        <br></br>
                        <br></br>
                        This simple app of Cross-Platform Technology (that works on Mobile and Web) is developped 
                        by <a href="https://www.linkedin.com/in/walid-zhani-54705612a/">Walid ZHANI</a>, using :
                        <br></br>
                        #Ionic v5 and #ReactJS v16.
                    </IonCardContent>
                </IonCard>
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonTitle className="ion-padding">
                        <p style={{ 'fontSize': '12.5px', 'fontWeight': 'bold' }}>Copyright Ⓒ 2021 - Walid ZHANI</p>
                    </IonTitle>
                </IonToolbar>       
            </IonFooter>
        </IonPage>
    );
};

export default SettingsPage;