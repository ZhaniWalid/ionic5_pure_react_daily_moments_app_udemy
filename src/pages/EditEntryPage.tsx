//--- This 'EditEntryPage' = is Added by me (not from tuto) => To Edit an Existing Entry ---//

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
import { useHistory, useParams } from 'react-router';
import { useAuth } from '../auth';
import { firestore, firebaseCloudStorage } from '../firebase';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { Entry, toEntry } from '../models';
import { formatDate } from '../dateFormatUS';
const { Camera } = Plugins; // Extract the 'Camera' Plugin from all 'Plugins' of '@capacitor/core'

// We are defining here our 'RouteParams' object using the interface
interface RouteParamsEntry {
    idEntry: string;
}

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
const EditEntryPage: React.FC = () => {
    console.log('[EditEntryPage] rendered');
    // 'useHistory() Hook' => We can call it to get access to the 'browser history'
    const history = useHistory();
    // const { X } = Y; => This is an 'Object Distructure (Distructuring)' --> Means that we want to extract properties from 'Y' & Store them on 'X'
    const { userId } = useAuth();
    //-- useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue)... 
    //-- ==> ...The returned object will persist for the full lifetime of the component.
    const pictureFileInputRef = useRef<HTMLInputElement>();

    //- The 'idEntry' => Will be passed to the ['/App.tsx'] file
    const { idEntry } = useParams<RouteParamsEntry>(); // 'useParams()' Hook => To access to 'params'
    // 'useState' => Allows us to manage 'State & Functional Components'
    const [entry, setEntry] = useState<Entry>(); // initial value = ''

    // 'useState' => Allows us to manage 'State & Functional Components'
    const [pictureUrl, setPictureUrl] = useState('/assets/placeholder.png'); // initial value = '/assets/placeholder.png'
    const [status, setStatus] = useState({ loading: false, error: false }); // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data After Editing it'

    // NEXT #4 'const(s)' :: React Hook Form => For the 'Form Validation on fields'
    const { control, handleSubmit, errors, setValue } = useForm({
        mode: "onChange"
    });
    const onSubmit = (data: any) => {
        console.log('Validated values updated => ',JSON.stringify(data, null, 2));
    };
    const onReset = () => {
        setEntry(prevState => ({ ...prevState, title: '' }));
        setEntry(prevState => ({ ...prevState, description: '' }));
    };
    const renderErrorMsg = (_key: string) => {
        let theErrors = (errors as any)[_key];
        return (
          <span style={{ color: "red"}}>
            {theErrors.message || "This is a required field"}
          </span>
        );
    };
    // On every render show react-hook-form errors
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
                console.log('[handleFileChange] => Revoked Edited pictureFileUrl:', pictureUrl);
            }
        };
        // [pictureUrl] => we specifed it as our 'dependencies' 
        //    => This only will re-run this effect [useEffect()] func => if 'pictureUrl' changed
    }, [pictureUrl]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X'

    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {
        // collection('entries') => 'entries' :: is our 'CollectionId' on 'firestore db'
        const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(idEntry);
        entryRef.get().then( (doc) => setEntry(toEntry(doc)) );

        console.log('[EditEntryPage] => { useEffect() } => Firestore Collection:', entryRef);

        // [idRoute, userId] => we specifed them as our 'dependencies' 
        //    => This only will re-run this effect [useEffect()] func => if 'idRoute, userId' changed
    }, [idEntry, userId]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X'

    //- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
    //- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
    useEffect(() => {
      // 'setValue' :: it's from the 'React Hook Form' => For the 'Form Validation on fields'
      //   => Will set the values of " name='title' & name='description' " on the 'Controller(s)' below
      //   => == to == when using " <IonInput value={entry?.title} /> & <IonTextarea value={entry?.description} /> "
      //   => When the Entry is loaded to edit it
      setValue('title', entry?.title);
      setValue('description', entry?.description);

      // [entry, setValue] => we specifed them as our 'dependencies' 
      //    => This only will re-run this effect [useEffect()] func => if 'entry, setValue' changed
    }, [entry, setValue]); // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE when the 'Component' is MOUNTED (after the 1st render) -> to AVOID looping without infinite on calling 'X'

    const handleSaveAfterEdit = async () => {
        try {

          if (entry?.title.length <= 0 || entry?.description.length <= 0) {
            console.log('[AddEntryPage] => Title AND/OR Description Field(s) are Required');
          }
          if ( (entry?.title.length > 0 && entry?.title.length >= 4) && (entry?.description.length > 0 && entry?.description.length >= 10) ) {
            // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data after Editing it'
            // When waiting to 'Saving Data proccess' => show Spinner (loading: true) + No Error Msg (error: false)
            setStatus({ loading: true, error: false });

            let pictureUrlUpdate = null;
            // if (pictureUrl.startsWith('blob:')) {
            if (!pictureUrl.startsWith('/assets')) { // Here we want to say => if picture is not from '/assets' folder then take it (c à d: every picture != '/assets/placeholder.png')
                // 'savePicture' => To save a picture on the 'Firebase Cloud Storage'
                pictureUrlUpdate = await savePicture(pictureUrl, userId);
            } else {
                pictureUrlUpdate = entry?.pictureUrl;
            }
            
            const entryToUpdate = {
              date: entry?.date,
              title: entry?.title,
              pictureUrl: pictureUrlUpdate,
              description: entry?.description
            };

            // collection('entries') => 'entries' :: is our 'CollectionId' on 'firestore db'
            const entryRef = firestore.collection('users').doc(userId).collection('entries').doc(idEntry);
            //-- Asynchronously 'update' an existing document of a collection. => That return a 'Promise <void>'
            //-- so above we should add 'async' key word + below we should add 'await' keyword
            await entryRef.update(entryToUpdate)
                          .then(() => {
                            console.log('[EditEntryPage] => Entry Updated Successfully:', entryRef.id);                
                          })
                          .catch(() => {
                            console.log('[EditEntryPage] => Entry Updated Failed:', entryRef.id);
                          });
            console.log('[EditEntryPage] => entryToUpdate:', entryToUpdate);
            
            // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data after Editing it'
            // Case:: 'Saving Data succeeded' => No Spinner (loading: false) + No Error Msg (error: false)
            setStatus({ loading: false, error: false });
            console.log('We are going back to Home Page');

            // '.push' => This way of 'Redirect' will 'replace' the 'current Page'
            //   =>  Let You back to the Prev Page => When you click on the back arrow of the 'Browser' 
            //   =>  Will be redirected to '/my/entries' (HomePage.tsx)
            history.push('/my/entries');
          }
               
        } catch (err) {
            // Added by me (not from tuto) => To show spinner while waiting for 'Saving Data'
            // Case:: 'Saving Data failed' => No Spinner (loading: false) + Show Error Msg (error: true)
            setStatus( { loading: false, error: true } );
            console.log('[EditEntryPage] => Firestore Edited error: ', err);
        }    
    };

    // Handle the input file => for inputing images
    const handleFileEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //-- preventDefault() => To 'prevent' the 'reloading of the page'
        // event.preventDefault();
        if (event.target.files.length > 0) {
            console.log('[handleFileEditChange] => input images files:', event.target.files);
            const file = event.target.files.item(0); // '.item(0)' => The 1st element on the list
            // 'URL.createObjectURL(file)' => Will create a 'blob URL' => exmple: 'blob:http://localhost:8100/473700df-61b8-4e4c-beed-b56e039e584d'
            const pictureFileUrl = URL.createObjectURL(file);
            console.log('[handleFileEditChange] => Edited pictureFileUrl:', pictureFileUrl);
            setEntry(prevState => ({
               ...prevState,
               pictureUrl: pictureFileUrl 
            }));
            setPictureUrl(pictureFileUrl);
        }    
    };

    // Handle the picture with Smartphone Devices => Either Select one from Gallery OR Take a new Photo with Camera
    const handlePictureEditClick = async () => {
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
                setEntry(prevState => ({
                  ...prevState,
                  pictureUrl: photo.webPath 
                }));
                setPictureUrl(photo.webPath);
                console.log('Photo taken with Camera - Edit - VS Code:', photo.webPath);
            } catch (error) {
                console.log('Photo taken with Camera - Edit - Error - VS Code:', error)
            } 
        } else { // Case when using a 'regular Web browser'
            pictureFileInputRef.current.click();
            console.log('Photo taken with PC Hard Drive Disc (HDD) - Edit - VS Code:', pictureFileInputRef.current.files);
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
            <IonTitle>Edit Moment: {formatDate(entry?.date)}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* <form> */}
          <form onSubmit={handleSubmit(onSubmit)}> 
            <IonList>
              <IonItem>
                <IonLabel position="floating">Date</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                <IonDatetime
                  value={entry?.date}
                  onIonChange={ (event) => setEntry(prevState => ({ ...prevState, date: event.detail.value })) } // 'onIonChange' == 'onChange' on 'HTML#5'
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
                        setEntry(prevState => ({ ...prevState, title: selected.detail.value }));
                        return selected.detail.value; 
                    }}
                    onIonChange= { (event: any) => setEntry(prevState => ({ ...prevState, title: event.detail.value })) }
                    name="title"
                    rules={{
                        required: true,
                        minLength: { value: 4, message: "Must be 4 chars long at least" }
                    }}
                />
                {/* <IonInput required
                      value={entry?.title} 
                      onIonChange={ (event) => setEntry(prevState => ({ ...prevState, title: event.detail.value })) } // 'onIonChange' == 'onChange' on 'HTML#5'
                /> */}
              </IonItem>
              {errors.title ? renderErrorMsg('title') : null}
              <IonItem>
                <IonLabel position="floating">Picture</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                <br />
                <br />
                {/* 'image/*' => Accept all types of images: .png/.jpeg...*/}
                <input type="file" accept="image/*" onChange={handleFileEditChange} ref={pictureFileInputRef} hidden />
                {/* 'onClick={() => pictureFileInputRef.current.click()}' => We are using the 'pictureFileInputRef'...
                                ==> ...to 'select a file image' = the 'same as we are selecting from the <input type="file" /> tag'  
                            'style={{ cursor: 'pointer' }}' => To 'show' an 'small hand to be able to select an image' 
                                ==> for the 'Web Browser' */}
                
                {entry?.pictureUrl ? (
                  <img
                    src={entry?.pictureUrl}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={handlePictureEditClick}
                  />
                ) : (
                  <img
                    src={pictureUrl} // src="/assets/placeholder.png"
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={handlePictureEditClick}
                  />
                )}

              </IonItem>
              <IonItem>
                <IonLabel position="floating">Description</IonLabel> {/* '<IonLabel/>' == '<label/>' on 'HTML#5' */}
                <Controller
                  as={<IonTextarea rows={3}></IonTextarea>}
                  control={control}
                  onChangeName="onIonChange"
                  onChange={([selected]) => {
                      // console.log("Description from react-hook-form: ", selected.detail.value);
                      setEntry(prevState => ({ ...prevState, description: selected.detail.value }));
                      return selected.detail.value;
                  }}
                  onIonChange= { (event: any) => setEntry(prevState => ({ ...prevState, description: event.detail.value })) }
                  name="description"
                  rules={{
                      required: true,
                      minLength: { value: 10, message: "Must be 10 chars long at least" }
                  }}
                />
                {/* <IonTextarea required
                        value={entry?.description}
                        rows={3}                  
                        onIonChange={ (event) => setEntry(prevState => ({ ...prevState, description: event.detail.value })) } // 'onIonChange' == 'onChange' on 'HTML#5'
                /> */}
              </IonItem>
              {errors.description ? renderErrorMsg('description') : null}

              {/* <IonButton expand="block" onClick={handleSaveAfterEdit}>Update</IonButton> */}
              <IonButton type="submit" expand="block" onClick={handleSaveAfterEdit}>Update</IonButton>
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

export default EditEntryPage;