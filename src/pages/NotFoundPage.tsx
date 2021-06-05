import {
    IonContent,
    IonPage
  } from '@ionic/react';
import React from 'react';
// import { Link } from 'react-router-dom';

// React.FC => FC: Functionnal Component
const NotFoundPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent className="ion-padding">
                404 Page not found.
            </IonContent>
        </IonPage>
    );
};

export default NotFoundPage;