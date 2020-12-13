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
import { register } from '../requests/Register';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js');

export const Register: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  let needPass = useLocation().pathname.split('/')[3];
  const [showLoading, setShowLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [unrated, setUnrated] = useState(false);
  const [password, setPassword] = useState<string>();
  const [showRegisterSuccessToast, setShowRegisterSuccessToast] = useState<boolean>(false);
  const [showRegisterFailToast, setShowRegisterFailToast] = useState<boolean>(false);
  const [showEmptyPasswordToast, setShowEmptyPasswordToast] = useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{format("Registering {}", region)}</IonTitle>
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
                <IonLabel>Are you sure to Register?</IonLabel>
                <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} color="success"/>
            </IonItem>
            <IonItem lines="none">
                <IonLabel>Do you want to be unrated?</IonLabel>
                <IonToggle checked={unrated} onIonChange={e => setUnrated(e.detail.checked)} color="success"/>
            </IonItem>
            {needPass === "false" ? undefined : 
                <IonItem>
                    <IonInput value={password} placeholder="Enter Password" onIonChange={e => setPassword(e.detail.value!)}></IonInput>
                </IonItem>
            }
            <IonButton expand='block' color='primary' onClick={() => {
                if (password === '') {
                    setShowEmptyPasswordToast(false);
                    setShowEmptyPasswordToast(true);
                  } else {
                    register(
                      region,
                      unrated,
                      password,
                    )
                      .then(response => response.json())
                      .then(result => {
                        console.log(result);
                        if (result.data !== null) {
                            setShowRegisterSuccessToast(false);
                            setShowRegisterSuccessToast(true);
                            console.log(result.body)
                        } else {
                            setShowRegisterFailToast(false);
                            setShowRegisterFailToast(true);
                        }
                      }).catch(err => console.log(err));
                  }
            }} disabled={!checked}>Register</IonButton>
        </IonCard>

        <IonToast
          isOpen={showRegisterFailToast}
          onDidDismiss={() => {setShowRegisterFailToast(false)}}
          color='danger'
          duration={2000}
          message="Register Failed."
          position="bottom"
        />

        <IonToast
          isOpen={showRegisterSuccessToast}
          onDidDismiss={() => {
            setShowRegisterSuccessToast(false)
            window.location.href = "javascript:history.go(-1)";
          }}
          color='success'
          duration={2000}
          message="Register Successfully."
          position="bottom"
        />

        <IonToast
          isOpen={showEmptyPasswordToast}
          onDidDismiss={() => {setShowEmptyPasswordToast(false)}}
          color='warning'
          duration={2000}
          message="Password can't be empty'"
          position="bottom"
        />

      </IonContent>
    </IonPage>
  );
};

export default Register;