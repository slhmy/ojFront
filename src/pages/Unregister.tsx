import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonBadge,
  IonLoading,
  IonButton,
  IonToggle,
  IonInput,
  IonToast,
} from '@ionic/react';
import './StatusList.css';
import { get_status } from '../requests/GetStatus';
import { chevronBackCircleOutline } from 'ionicons/icons';
import { UnControlled as PasswordMirror } from 'react-codemirror2';
import { unregister } from '../requests/Unregister';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js');

export const Unregister: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [checked, setChecked] = useState(false);
  const [showUnregisterSuccessToast, setShowUnregisterSuccessToast] = useState<boolean>(false);
  const [showUnregisterFailToast, setShowUnregisterFailToast] = useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{format("Unregistering {}", region)}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => { window.location.href = "javascript:history.go(-1)"; }}>
            <IonIcon icon={chevronBackCircleOutline} />
          </IonFabButton>
        </IonFab>
        <IonCard>
            <IonItem lines="none">
                <IonLabel>Are you sure to Unregister?</IonLabel>
                <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} color="success"/>
            </IonItem>
            
            <IonButton expand='block' color='primary' onClick={() => {
                unregister(
                    region,
                )
                .then(response => response.json())
                .then(result => {
                console.log(result);
                if (result.data !== null) {
                    setShowUnregisterSuccessToast(false);
                    setShowUnregisterSuccessToast(true);
                    console.log(result.body)
                } else {
                    setShowUnregisterFailToast(false);
                    setShowUnregisterFailToast(true);
                }
                }).catch(err => console.log(err));
            }} disabled={!checked}>Unregister</IonButton>
        </IonCard>

        <IonToast
          isOpen={showUnregisterFailToast}
          onDidDismiss={() => {setShowUnregisterFailToast(false)}}
          color='danger'
          duration={2000}
          message="Unregister Failed."
          position="bottom"
        />

        <IonToast
          isOpen={showUnregisterSuccessToast}
          onDidDismiss={() => {
            setShowUnregisterSuccessToast(false)
            window.location.href = "javascript:history.go(-1)";
          }}
          color='success'
          duration={2000}
          message="Unregister Successfully."
          position="bottom"
        />

      </IonContent>
    </IonPage>
  );
};

export default Unregister;