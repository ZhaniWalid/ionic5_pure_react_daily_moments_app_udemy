import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
// import { Link } from 'react-router-dom';
// import { entries } from '../data';
import { firestore, firebaseAuth } from '../firebase';
import { Entry, toEntry } from '../models';
//-- Use this cmd: 'npm install ionicons' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
// 'add' => is an icon from ' https://ionicons.com/ ' => Website specified for icons only for IONIC FRAMEWORK
import { add as addIcon } from 'ionicons/icons';
import { formatDate } from '../dateFormatUS';


// React.FC => FC: Functionnal Component
const HomePage: React.FC = () => {
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    const { userId } = useAuth();
    // 'useState' => Allows us to manage 'State & Functional Components'
    const [entries, setEntries] = useState<Entry[]>([]); // initial value = [] (list of 'entries' is initially empty until we get Data from firestore)
    const [getCurrentUserEmail, setGetCurrentUserEmail] = useState(''); // Added by me (not from tuto) => To get Current User Email

    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {
        // Added flag by me to avoid 'memory leak' on 'unmounted component on useEffect()' => Error :
        /* Warning: Can't perform a React state update on an unmounted component.
        This is a no-op, but it indicates a memory leak in your application.
        To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
        => Link: https://juliangaramendy.dev/blog/use-promise-subscription#:%7E:text=To%20fix%2C%20cancel%20all%20subscriptions,the%20cleanup%20function%20of%20useEffect%20. */
        let isSubscribed = true;

        // These 3 Lines => Added by me (not from tuto) => To get Current User Email
        const currentUserEmail = firebaseAuth.currentUser.email;
        setGetCurrentUserEmail(currentUserEmail);
        console.log('[HomePage] => Current User Email:', currentUserEmail);

        // collection('entries/users') => 'entries/users' :: is our 'CollectionId(s)' on 'firestore db'
        const entriesRef = firestore.collection('users').doc(userId).collection('entries');
        //-- Like this 'we are not receiving Updates' from 'Firestore in Real Time' => we 'SHOULD RELOAD' the 'HomePage'...
        //   ...after adding a new 'Entry'
        // entriesRef.get().then( ({ docs }) => setEntries(docs.map(toEntry)) );

        // Like this using 'onSnapshot()' => 'we are receiving Updates' from 'Firestore in Real Time' 
        //                                => 'WITHOUT' the 'need' of 'RELOADING' 
        // ...the 'HomePage' after adding a new 'Entry' => Auto Refreshed
        //- entriesRef.orderBy('date', 'desc').'limit(7)'.onSnapshot(xxx)
        //- => Creates and returns a new Query that only returns the first #7 matching documents 
        //- => in our case 'return' the 'limit = 7 last entries after the orderBy()'
        //- ==> i ve 'deleted the limit(7)' from the query because i 'want to see all the Data'
        ////entriesRef.orderBy('date', 'desc').onSnapshot( ({ docs }) => setEntries(docs.map(toEntry)) );
        entriesRef.orderBy('date', 'desc').onSnapshot( ({ docs }) => ( isSubscribed ? setEntries(docs.map(toEntry)) : null ) );
        
        // Make a clean after the 'component is unmounted' to avoid 'memory leak' 
        return () => (isSubscribed = false); 

        /* // 'const entry' => Exported to file '../models.ts' as func 'toEntry()' & replaced with Line above
        entriesRef.get().then((snapshot) => {
            // console.log('snapshot:', snapshot);
            snapshot.docs.forEach((doc) => console.log(doc.id, doc.data()));
            const entries = snapshot.docs.map((doc) => ({
                id: doc.id,
                // '...' (= Spread Operator) => copy old properties + keeping other properties + Adding them as elements to a new array
                ...doc.data() // Copy & Distribute the entire old 'doc.data()' => keeping other properties
            }));
            setEntries(entries);
            console.log('entries:', entries);
        }); */

        // [userId] => we specifed them as our 'dependencies' 
        //    => This only will re-run this effect [useEffect()] func => if 'userId' changed
    }, [userId]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X' 
    console.log('[HomePage] => render entries:', entries);
    
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Home</IonTitle>
                {/* '<IonLabel >....' => Added by me (not from tuto) => To get Current User Email */}
                <IonLabel slot="end">
                    <h4>{getCurrentUserEmail}</h4>
                </IonLabel>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            {/* Go to <Link to="/settings">Settings</Link> */}

            {/* 'IonRouterLink' of 'IonicReact' => Is similar to 'Link' of 'React' */}
            {/* Go to <IonRouterLink routerLink="/settings">Settings</IonRouterLink> */}

            {/* '<IonList'><IonItem>...</IonItem></IonList>' :: of 'Ionic' => Like '<li><ul>...</ul></li>' of 'HTML5' 
                    '<IonItem button..' => 'button' to make the 'item' clickable
            */}
            {entries.length > 0 ? 
                <IonList>
                    {entries.map((entry) =>
                        <IonItem button key={entry.id} routerLink={`/my/entries/view/${entry.id}`}>
                            {/* <IonThumbnail /> ==> To show a small images (with small sizes)  */}
                            <IonThumbnail slot="end">
                                {/* <IonImg src={entry.pictureUrl} /> */}
                                {entry.pictureUrl ? <IonImg src={entry.pictureUrl} /> : <IonImg src="/assets/placeholder.png" />}                       
                            </IonThumbnail>
                            <IonLabel>
                                <h2>{formatDate(entry.date)}</h2>
                                <h3>{entry.title}</h3>
                            </IonLabel>
                        </IonItem> 
                    )}
                </IonList>
            : <h4>No entries found to show.</h4> }
            
            {/* '<IonFab /> <IonFabButton />' of 'Ionic'=> To set a 'Floating Action Button (FAB)'
                'slot="fixed"' => To Fix the 'Button' on it's position whenever we scroll-down/up 
                    => link: https://ionicframework.com/docs/api/fab */}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton routerLink="/my/entries/add">
                    <IonIcon icon={addIcon} />
                </IonFabButton>
            </IonFab>
        </IonContent>
        </IonPage>
    );
};

export default HomePage;