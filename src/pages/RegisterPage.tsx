import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
    // IonRouterLink
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'  
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useAuth } from '../auth';
import { firebaseAuth } from '../firebase';
//-- Use this cmd: 'npm install ionicons' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
// 'eyeOutline & eyeOffOutline' => icons from ' https://ionicons.com/ ' => Website specified for icons only for IONIC FRAMEWORK
import { eyeOutline as eyeOn, eyeOffOutline as eyeOff } from 'ionicons/icons';
// import { Link } from 'react-router-dom';

// We are defining here our 'Props' object using the interface
/* interface Props {
    onLogin: () => void;
} */

// React.FC => FC: Functionnal Component
//- const LoginPage: React.FC<Props> = ({ onLogin }) => {
const RegisterPage: React.FC = () => {
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    /* useContext(Context) => Accepts a context object (the value returned from React.createContext) and returns...
    the current context value, as given by the nearest context provider for the given context. */
    const { loggedIn } = useAuth();
    // 'useState' => Allows us to manage 'State & Functional Components'
    const [email, setEmail] = useState(''); // initial value = ''
    const [password, setPassword] = useState(''); // initial value = ''
    // const [error, setError] = useState(false); // initial value = 'false'
    const [status, setStatus] = useState({ loading: false, error: false }); // initial value(s) = 'false'
    // Added by me (not from tuto) => To 'show/hide password' using the 'eye icon'
    const [showPassword, setShowPassword] = useState(false); // initial value = 'false'

    // Added by me (not from tuto) => To 'show/hide password' using the 'eye icon'
    const onPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        // console.log('Should login with: ', { email, password });

        try {
            // setError(false);

            // When waiting to logIn proccess => show Spinner (loading: true) + No Error Msg (error: false)
            setStatus({ loading: true, error: false });
            // Asynchronously 'create User With Email And Password'. => That return a 'Promise <firebase.auth.UserCredential>'
            // so above we should add 'async' key word + below we should add 'await' keyword
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            // Case:: Login succeeded => No Spinner (loading: false) + No Error Msg (error: false)
            //-- setStatus({ loading: false, error: false }); // We don't need these 2 anymore...
            //-- onLogin(); // ...because we are using 'onAuthStateChanged' on 'useEffect()' in ['./App.tsx'] file
            console.log('Register => userCredential: ', userCredential);            
        } catch (err) {
            // setError(true);

            // Case:: Login failed => No Spinner (loading: false) + Show Error Msg (error: true)
            setStatus({ loading: false, error: true });
            console.log('Firebase error: ', err);
        }      
    };
    if (loggedIn) {
        return <Redirect to="/my/entries" />;
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
            {/* Go to <Link to="/home">Home</Link> */}

            {/* 'IonRouterLink' of 'IonicReact' => Is similar to 'Link' of 'React' */}
            {/* Go to <IonRouterLink routerLink="/home">Home</IonRouterLink>*/}
            <form>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                        <IonInput type="email" 
                                value={email}
                                onIonChange= {(event) => setEmail(event.detail.value) } // 'onIonChange' == 'onChange' on 'HTML#5'  
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                        <IonInput /* type="password" */
                                type={ showPassword ? "text" : "password" } // Added by me (not from tuto) => To 'show/hide password' using the 'eye icon' 
                                value={password}
                                onIonChange= {(event) => setPassword(event.detail.value) } // 'onIonChange' == 'onChange' on 'HTML#5'  
                        >
                            {/* Added by me (not from tuto) => To 'show/hide password' using the 'eye icon' */}
                            <IonButtons slot="end" style={{ 'position': 'absolute', 'right': '0' }}>
                                <IonButton onClick={onPasswordToggle} slot="end" >
                                    <IonIcon icon={ showPassword ? eyeOff : eyeOn } slot="icon-only" size="small"/>
                                </IonButton> 
                            </IonButtons>       
                        </IonInput>
                    </IonItem>
                </IonList>
            </form>
            {/* Only if the 'error==true' => show '<IonText.../>' */}
            {status.error && <IonText color="danger">Registration failed</IonText>}  {/* ==== {error ? <IonText ... /> : null} */}    
            <IonButton expand="block" onClick={handleRegister}>Create New Account</IonButton>
            <IonButton expand="block" fill="clear" routerLink="/login">Already have an account ?</IonButton>
            {/* '<IonLoading.../>' => To show us a 'loading screen' with a 'spinner' when 'user is waiting for an operation' */}
            <IonLoading isOpen={status.loading} />
            </IonContent>
        </IonPage>
    );
};

export default RegisterPage;