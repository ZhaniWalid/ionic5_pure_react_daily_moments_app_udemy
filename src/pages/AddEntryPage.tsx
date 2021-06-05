// Use this cmd: 'npm install react-hook-form' in the 'Integrated Terminal of VS CODE' or 'Terminal of Windows' to install it
// React Hook Form => Performant, flexible and extensible forms with easy-to-use validation.
//- Watch this tuto: https://medium.com/better-programming/how-to-use-react-hook-form-with-ionic-react-components-eaa4426d8a2d
import { useForm, Controller } from 'react-hook-form'; // Added by me (not from tuto) => To make the 'Form Validation on fields' 
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
    isPlatform
} from '@ionic/react';
// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
//-- useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue)... 
//-- ==> ...The returned object will persist for the full lifetime of the component.
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../auth';
import { firestore, firebaseCloudStorage } from '../firebase';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import '../css/InputDanger.css';
const { Camera } = Plugins; // Extract the 'Camera' Plugin from all 'Plugins' of '@capacitor/core'


// 'savePicture' => To save a picture on the 'Firebase Cloud Storage'
async function savePicture(blobUrl: any, userId: string) {
    // to 'save pictures' under this path `/users/${userId}/pictures/${Date.now()}` on the 'Firebase Cloud Storage'
    // '/${Date.now()' => To 'generate a unique ID' for' each picture uploaded' using the 'Date.now() method by milli-seconds'
    const pictureRef = firebaseCloudStorage.ref(`/users/${userId}/pictures/${Date.now()}`);
    const response = await fetch(blobUrl);
    const blobObj = await response.blob();
    const snapshotObj = await pictureRef.put(blobObj);
    const url = await snapshotObj.ref.getDownloadURL(); // Fetches a long lived download URL for this object.
    console.log('[savePicture] => Saved picture to Firebase Cloud Storage:', url);
    return url;
}

// React.FC => FC: Functionnal Component
const AddEntryPage: React.FC = () => {
    console.log('[AddEntryPage] rendered');
    // 'useHistory() Hook' => We can call it to get access to the 'browser history'
    const history = useHistory();
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    const { userId } = useAuth();
    //-- useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue)... 
    //-- ==> ...The returned object will persist for the full lifetime of the component.
    const pictureFileInputRef = useRef<HTMLInputElement>();

    // 'useState' => Allows us to manage 'State & Functional Components'
    const [date, setDate] = useState(new Date().toISOString()); // initial value = ' SysDate of Today's Date '
    const [title, setTitle] = useState(''); // initial value = ''
    const [pictureUrl, setPictureUrl] = useState('/assets/placeholder.png'); // initial value = '/assets/placeholder.png'
    const [description, setDescription] = useState(''); // initial value = ''
    const [status, setStatus] = useState({ loading: false, error: false }); // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'

    // NEXT #5 'const(s)' :: React Hook Form => For the 'Form Validation on fields'
    const initialValues = {
        title: '',
        description: ''
    };
    const { control, reset, handleSubmit, errors } = useForm({
        defaultValues: initialValues,
        mode: "onChange"
    });
    const onSubmit = (data: any) => {
        console.log('Validated values submitted => ', JSON.stringify(data, null, 2));
    };
    const onReset = () => {
        reset(initialValues);
    };
    const renderErrorMsg = (_key: string) => {
        let theErrors = (errors as any)[_key];
        return (
          <span style={{ color: "red" }}>
            {theErrors.message || "This is a required field"}
          </span>
        );
    };
    // On every render show 'react-hook-form' errors
    console.log('react-hook-form errors: ', errors);

    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {
        // Revoke a 'clean-up' func => to 'Revoke (Retirer)' an URL when we 'no longer needed to avoid memory consumption'
        //  => Wehenever we 'select a new picture (with new URL)' we 'Revoke (Retirer)' the 'Old One (Previous URL)'
        return () => {
            if (pictureUrl.startsWith('blob:')) {
                // '.revokeObjectURL(X)' => to 'Revoke (Retirer)' an URL when we 'no longer needed to avoid memory consumption'
                //  => Wehenever we 'select a new picture (with new URL)' we 'Revoke (Retirer)' the 'Old One (Previous URL)'
                URL.revokeObjectURL(pictureUrl);
                console.log('[handleFileChange] => Revoked pictureFileUrl:', pictureUrl);
            }
        };
        // [pictureUrl] => we specifed it as our 'dependencies' 
        //    => This only will re-run this effect [useEffect()] func => if 'pictureUrl' changed
    }, [pictureUrl]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X'

    const handleSave = async () => {
        try {

            if (title.length <= 0 || description.length <= 0) {
                console.log('[AddEntryPage] => Title AND/OR Description Field(s) are Required');
            } 
            if ( (title.length > 0 && title.length >= 4) && (description.length > 0 && description.length >= 10) ) {
                // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'
                // When waiting to 'Saving Data proccess' => show Spinner (loading: true) + No Error Msg (error: false)
                setStatus( { loading: true, error: false } );

                console.log('[AddEntryPage] => Should Save:', { title, description });
                const entriesRef = firestore.collection('users').doc(userId).collection('entries');

                /* NB: in our Daily Moments app we are using the Date as String to pass it to Firestore db
                    => but in Real Apps it’s recommended to use the timestamp instead of String 
                    => Link : https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp?authuser=0  */
                const entryData = { date, title, pictureUrl, description };
                
                // if (pictureUrl.startsWith('blob:')) {
                if (!pictureUrl.startsWith('/assets')) { // Here we want to say => if picture is not from '/assets' folder then take it (c à d: every picture != '/assets/placeholder.png')
                    // 'savePicture' => To save a picture on the 'Firebase Cloud Storage'
                    entryData.pictureUrl = await savePicture(pictureUrl, userId);
                }

                // Asynchronously 'add' a new document to a collection. => That return a 'Promise <firebase.firestore.DocumentReference>'
                // so above we should add 'async' key word + below we should add 'await' keyword
                const entryRef = await entriesRef.add(entryData);
                console.log('[AddEntryPage] => Entry Saved Successfully:', entryRef.id);

                // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'
                // Case:: 'Saving Data succeeded' => No Spinner (loading: false) + No Error Msg (error: false)
                setStatus( { loading: false, error: false } );

                // 'goBack()' => Will 'send the user' to the 'previous page' (in our case it's the 'Home Page')
                history.goBack();
            }
                      
        } catch (err) {
            // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'
            // Case:: 'Saving Data failed' => No Spinner (loading: false) + Show Error Msg (error: true)
            setStatus( { loading: false, error: true } );
            console.log('[AddEntryPage] => Firestore error: ', err);
        }    
    };

    // Handle the input file => for inputing images
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
            console.log('[handleFileChange] => input images files:', event.target.files);
            const file = event.target.files.item(0); // '.item(0)' => The 1st element on the list
            // 'URL.createObjectURL(file)' => Will create a 'blob URL' => exmple: 'blob:http://localhost:8100/473700df-61b8-4e4c-beed-b56e039e584d'
            const pictureFileUrl = URL.createObjectURL(file);
            console.log('[handleFileChange] => Created pictureFileUrl:', pictureFileUrl);
            setPictureUrl(pictureFileUrl);
        }  
    };

    // Handle the picture with Smartphone Devices => Either Select one from Gallery OR Take a new Photo with Camera
    const handlePictureClick = async () => {
        if (isPlatform('capacitor')) { // Case when using 'Capacitor' for 'Android/IOS' versions
            try {
                // Camera.'getPhoto' => Prompt the user to pick a photo from an album, or take a new photo with the camera.
                //- Asynchronously 'getPhoto'. => That return a 'Promise <CameraPhoto>'
                //- so above we should add 'async' key word + below we should add 'await' keyword
                const photo = await Camera.getPhoto({
                    resultType: CameraResultType.Uri,
                    //  CameraSource'.Prompt' => To give user choice between using 'Camera OR Photos from Gallery' 
                    //  => if we don't write this Line...that's no prob => because by default it's used
                    source: CameraSource.Prompt, 
                    width: 600
                });
                setPictureUrl(photo.webPath);
                console.log('Photo taken with Camera - VS Code:', photo.webPath);
            } catch (error) {
                console.log('Photo taken with Camera - Error - VS Code:', error)
            } 
        } else { // Case when using a 'regular Web browser'
            pictureFileInputRef.current.click();
            console.log('Photo taken with PC Hard Drive Disc (HDD) - VS Code:', pictureFileInputRef.current.files);
        }   
    };

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
                    <IonTitle>Add Moment</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* <form> */}
                <form onSubmit={handleSubmit(onSubmit)}>   
                    <IonList>
                        <IonItem>
                            <IonLabel position="floating">Date</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                            <IonDatetime value={date}
                                         onIonChange= {(event) => setDate(event.detail.value) } // 'onIonChange' == 'onChange' on 'HTML#5'  
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Title</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    // console.log("Title from react-hook-form: ", selected.detail.value);
                                    setTitle(selected.detail.value);
                                    return selected.detail.value;   
                                }}
                                onIonChange= {(event: any) => setTitle(event.detail.value) }
                                value={title}
                                name="title"
                                rules={{
                                    required: true,
                                    minLength: { value: 4, message: "Must be 4 chars long at least" }
                                }}
                            />
                            {/* <IonInput required
                                      value={title}                
                                      onIonChange= {(event) => setTitle(event.detail.value) } // 'onIonChange' == 'onChange' on 'HTML#5'  
                            /> */}
                        </IonItem>
                        {errors.title ? renderErrorMsg('title') : null}        
                        <IonItem>
                            <IonLabel position="floating">Picture</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                            <br />
                            <br />
                            {/* 'image/*' => Accept all types of images: .png/.jpeg...*/}
                            <input type="file" accept="image/*" onChange={handleFileChange} ref={pictureFileInputRef} hidden />
                            {/* 'onClick={() => pictureFileInputRef.current.click()}' => We are using the 'pictureFileInputRef'...
                                    ==> ...to 'select a file image' = the 'same as we are selecting from the <input type="file" /> tag'  
                                'style={{ cursor: 'pointer' }}' => To 'show' an 'small hand to be able to select an image' 
                                    ==> for the 'Web Browser' */}
                            <img src={pictureUrl}
                                 alt="" 
                                 style={{ cursor: 'pointer' }} 
                                 // onClick={() => pictureFileInputRef.current.click()}
                                 onClick={handlePictureClick} />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Description</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                            <Controller
                                as={<IonTextarea rows={3}></IonTextarea>}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    // console.log("Description from react-hook-form: ", selected.detail.value);
                                    setDescription(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                onIonChange= {(event: any) => setDescription(event.detail.value) }
                                value={description}
                                name="description"
                                rules={{
                                    required: true,
                                    minLength: { value: 10, message: "Must be 10 chars long at least" }
                                }}
                            />
                            {/* <IonTextarea required
                                         rows={3}
                                         value={description}
                                         onIonChange= {(event) => setDescription(event.detail.value) } // 'onIonChange' == 'onChange' on 'HTML#5'  
                            /> */}
                        </IonItem>
                        {errors.description ? renderErrorMsg('description') : null}                        
                        
                        {/* <IonButton expand="block" onClick={handleSave}>Save</IonButton> */}
                        <IonButton type="submit" expand="block" onClick={handleSave}>Save</IonButton>
                        <IonButton expand="block" onClick={onReset}>Reset</IonButton>
                    </IonList>
                </form>
                {/* // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'
                    '<IonLoading.../>' => To show us a 'loading screen' with a 'spinner' when 'user is waiting for an operation' */}
                <IonLoading isOpen={status.loading} />
            </IonContent>
        </IonPage>
    );
};

export default AddEntryPage;