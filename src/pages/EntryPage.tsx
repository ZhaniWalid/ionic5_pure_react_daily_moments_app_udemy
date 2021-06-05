import {
    IonAlert,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAuth } from '../auth';
// import { Link } from 'react-router-dom';
// import { entries } from '../data';
import { firestore } from '../firebase';
import { Entry, toEntry } from '../models';
//-- Use this cmd: 'npm install ionicons' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
// 'trash & createOutline' => icons from ' https://ionicons.com/ ' => Website specified for icons only for IONIC FRAMEWORK
import { trash as trashIcon, createOutline as editIcon } from 'ionicons/icons';
import { formatDate } from '../dateFormatUS';

// We are defining here our 'RouteParams' object using the interface
interface RouteParams {
    idRoute: string;
}

// React.FC => FC: Functionnal Component
const EntryPage: React.FC = () => {
    // 'useHistory() Hook' => We can call it to get access to the 'browser history'
    const history = useHistory();
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    const { userId } = useAuth();
    //- The 'idRoute' => Will be passed to the ['/App.tsx'] file
    const { idRoute } = useParams<RouteParams>(); // 'useParams()' Hook => To access to 'params'

    /* Replaced by 'fetching Entry Data from firestore' in NEXT Line
    // if the 'id' passed as a param == an 'id' from the 'entries' list => Then return the 'Entry'
    const entry = entries.find((entryEl) => entryEl.id === idRoute);
    if (!entry) {
        throw new Error(`No such Entry with id: ${entry.id}`);
    } */

    // 'useState' => Allows us to manage 'State & Functional Components'
    const [entry, setEntry] = useState<Entry>(); // initial value = ''
    const [showAlertDelete, setShowAlertDelete] = useState(false); // Added by me (not from tuto) => To 'show alert before Deleting an Entry'
    const [showAlertEdit, setShowAlertEdit] = useState(false); // Added by me (not from tuto) => To 'show alert before Editing an Entry'
    const [toastEditLater, setToastEditLater] = useState(false); // Added by me (not from tuto) => To 'show a toast message that EditEntryPage.tsx will be fixed later'

    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {  
        // collection('entries') => 'entries' :: is our 'CollectionId' on 'firestore db'
        const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(idRoute);
        // This is not updating well the 'Entry' after Editing it on the 'EditEntryPage.tsx'
        //-- entryRef.get().then( (doc) => setEntry(toEntry(doc)) );

        // Like this using 'onSnapshot()' => 'we are receiving Updates' from 'Firestore in Real Time' 
        //                                => 'WITHOUT' the 'need' of 'RELOADING' 
        entryRef.onSnapshot( (doc) => setEntry(toEntry(doc)) );
        
        /* // 'const entry' => Exported to file '../models.ts' as func 'toEntry()' & replaced with Line above
        entryRef.get().then((doc) => {
            const entry = {
                id: doc.id,
                // '...' (= Spread Operator) => copy old properties + keeping other properties + Adding them as elements to a new array
                ...doc.data() // Copy & Distribute the entire old 'doc.data()' => keeping other properties
            } as Entry; // 'as Entry' => casting 'entry' as an 'Entry' object to let know Type-Script of it
            setEntry(entry);
        }); */

        // [idRoute, userId] => we specifed them as our 'dependencies' 
        //    => This only will re-run this effect [useEffect()] func => if 'idRoute, userId' changed
    }, [idRoute, userId]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X'

    const handleDelete = async () => {
        const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(idRoute);
        // Asynchronously 'delete' a document from a collection. => That return a 'Promise <void>'
        // so above we should add 'async' key word + below we should add 'await' keyword
        await entryRef.delete();
        //-- 'goBack()' => Will 'send the user' to the 'previous page' (in our case it's the 'Home Page')
        // history.goBack();

        // '.push' => This way of 'Redirect' will 'replace' the 'current Page'
        //   =>  Let You back to the Prev Page => When you click on the back arrow of the 'Browser' 
        //   =>  Will be redirected to '/my/entries' (HomePage.tsx)
        history.push('/my/entries');    
        console.log('[EntryPage] => { handleDelete() func } => Entry Deleted:', entryRef);
    };

    const redirectToEditEntryPage = () => {
        // '.push' => This way of 'Redirect' will 'replace' the 'current Page'
        //   =>  Let You back to the Prev Page => When you click on the back arrow of the 'Browser' 
        //   =>  Will be redirected to '/my/entries/edit/:idEntry' (EditEntryPage.tsx)
        history.push(`/my/entries/edit/${entry.id}`);

        // if we use '.replace' instead of '.push' => Does the same as 'Redirecting' 
        //    => but Will NOT Let You back to the Prev Page
        // history.replace('/my/entries/edit');
    };

    console.log('[EntryPage] rendered');
    console.log('[EntryPage] => pictureUrl:', entry?.pictureUrl);    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* <IonButtons slot="start" => To make the group of buttons at the 'start' of 'IonTollbar'
                    <IonButtons slot="end"   => To make the group of buttons at the 'end' of 'IonTollbar'
                    <IonBackButton /> ==> To add the back button on the 'IonToolbar' */}
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                {/*  <IonTitle>{entry.title}</IonTitle> */}
                    <IonTitle>{formatDate(entry?.date)}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowAlertEdit(true)}>
                            <IonIcon icon={editIcon} slot="icon-only"/>
                        </IonButton>
                        {/* <IonButton onClick={handleDelete}> */}
                        <IonButton onClick={() => setShowAlertDelete(true)}>
                            <IonIcon icon={trashIcon} slot="icon-only"/>
                        </IonButton>                    
                    </IonButtons>
                </IonToolbar>
                <IonAlert
                    isOpen={showAlertDelete}
                    onDidDismiss={() => setShowAlertDelete(false)}
                    // cssClass='my-custom-class'
                    header={'Confirm Delete ?'}
                    message={'Do you really want to <strong>Delete</strong> this item ?'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                console.log('[EntryPage] => { <IonAlert /> } => Cancel Delete Confirmed');
                            }
                        },{
                            text: 'Delete',
                            handler: () => {
                                handleDelete();
                                console.log('[EntryPage] => { <IonAlert /> } => Proceeding Delete Confirmed');
                            }
                        }
                    ]}
                />
                <IonAlert
                    isOpen={showAlertEdit}
                    onDidDismiss={() => setShowAlertEdit(false)}
                    // cssClass='my-custom-class'
                    header={'Confirm Edit ?'}
                    message={'Do you really want to <strong>Edit</strong> this item ?'}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                console.log('[EntryPage] => { <IonAlert /> } => Cancel Edit Confirmed');
                            }
                        },{
                            text: 'Edit',
                            handler: () => {
                                //-- Will be used later => coz in the 'EditEntryPage.tsx' there is a problem of typing + Getting images
                                 redirectToEditEntryPage();

                                // setToastEditLater(true);
                                console.log(` [EntryPage] => { <IonAlert /> } => Proceeding Edit Confirmed...Redirecting to="/my/entries/edit/${entry.id}" `);
                            }
                        }
                    ]}
                />
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Go to <Link to="/home">Home</Link> */}

                {/* 'IonRouterLink' of 'IonicReact' => Is similar to 'Link' of 'React' */}
                {/* Go to <IonRouterLink routerLink="/home">Home</IonRouterLink> */}

                {/* {entry.description} */}

                {/* '?' => an optional chaining operator 
                    => if 'entry' is defined then uses it's 'description/title(above)' else 'return=undefined'(display nothing) */}        
                <h2>{entry?.title}</h2>
                {/* <img src={entry?.pictureUrl} alt={entry?.title} /> */}
                {entry?.pictureUrl ? <img src={entry?.pictureUrl} alt={entry?.title} /> : <img src="/assets/placeholder.png"  alt="" />}      
                <p>{entry?.description}</p>
                <IonToast isOpen={toastEditLater}
                          onDidDismiss={() => setToastEditLater(false)}
                          message="The 'Edit Entry Page' [ '/EditEntryPage.tsx' ] will be fixed later after completing the course 100%."
                          duration={5500} />
            </IonContent>
        </IonPage>
    );
};

export default EntryPage;