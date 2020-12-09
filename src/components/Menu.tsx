import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonButton,
  IonRow,
  IonCol,
  IonToast,
  IonActionSheet,
  IonAlert,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  planetOutline, planet, close,
} from 'ionicons/icons';
import './Menu.css';
import { me } from '../requests/Me';
import { login } from '../requests/Login';
import { logout } from '../requests/Logout';
import { get_verification_code } from '../requests/GetVerificationCode';
import { quick_login } from '../requests/QuickLogin';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Problems',
    url: '/ProblemList/global',
    iosIcon: planetOutline,
    mdIcon: planet
  },
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu: React.FC = () => {
  const [tempMobile, setTempMobile] = useState("");
  const [showNormalLoginAlert, setShowNormalLoginAlert] = useState(false);
  const [showMobileVerificationLoginAlert1, setShowMobileVerificationLoginAlert1] = useState(false);
  const [showMobileVerificationLoginAlert2, setShowMobileVerificationLoginAlert2] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showLoginSucessToast, setShowLoginSucessToast] = useState(false);
  const [showQuickLoginFailToast, setShowQuickLoginFailToast] = useState(false);
  const [showSendVerificationSucessToast, setShowSendVerificationSucessToast] = useState(false);
  const [showLoginFailToast, setShowLoginFailToast] = useState(false);
  const [showSendVerificationFailToast, setShowSendVerificationFailToast] = useState(false);
  const [showLogoutSucessToast, setShowLogoutSucessToast] = useState(false);
  const [showNormalLoginWarningToast, setShowNormalLoginWarningToast] = useState(false);
  const [showMobileWarningToast, setShowMobileWarningToast] = useState(false);
  const [showVerificationCodeWarningToast, setShowVerificationCodeWarningToast] = useState(false);
  const [selfInfo, setSelfInfo] = useState<any>();
  
  const location = useLocation();

  useEffect(() => {
    setSelfInfo(undefined);
  }, [showLogoutSucessToast]);

  useEffect(() => {
    me()
      .then(response => {
        if (response.status === 200) { response.json().then(result => { setSelfInfo(result); }) }
      })
      .catch(err => {
        console.log(err);
      });
  }, [showLoginSucessToast]);
  
  function handleLogButtionClick() {
    if (selfInfo === undefined) {
      setShowActionSheet(true);
    } else {
      logout()
        .then(response => {
          if (response.status === 200) {
            setShowLogoutSucessToast(false);
            setShowLogoutSucessToast(true);
          }
        }).catch(err => console.log(err));
    }
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonRow>
            <IonCol>
              <IonListHeader>{selfInfo === undefined ? 'Unknown' : selfInfo.username}</IonListHeader>
            </IonCol>
            <IonCol size="4">
              <IonButton size="small" expand="full" onClick={handleLogButtionClick}>{selfInfo === undefined ? 'Login' : 'Logout'}</IonButton>
            </IonCol>
          </IonRow>
          <IonNote>{selfInfo === undefined ? 'Please login first' : 'Welcome'}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonToast
          isOpen={showLogoutSucessToast}
          onDidDismiss={() => {setShowLogoutSucessToast(false)}}
          color='dark'
          duration={2000}
          message='Logout successfully.'
          position="bottom"
        />

        <IonToast
          isOpen={showLoginSucessToast}
          onDidDismiss={() => {setShowLoginSucessToast(false)}}
          color='success'
          duration={2000}
          message='Login successfully.'
          position="bottom"
        />

        <IonToast
          isOpen={showSendVerificationSucessToast}
          onDidDismiss={() => {setShowSendVerificationSucessToast(false)}}
          color='success'
          duration={2000}
          message='Verification code sent successfully.'
          position="bottom"
        />

        <IonToast
          isOpen={showNormalLoginWarningToast}
          onDidDismiss={() => {setShowNormalLoginWarningToast(false)}}
          onDidPresent={() => {setShowNormalLoginAlert(true)}}
          color='warning'
          duration={2000}
          message="UserIdentity and Password are incorrect."
          position="bottom"
        />

        <IonToast
          isOpen={showMobileWarningToast}
          onDidDismiss={() => {setShowMobileWarningToast(false)}}
          onDidPresent={() => {setShowMobileVerificationLoginAlert1(true)}}
          color='warning'
          duration={2000}
          message="Mobile is incorrect."
          position="bottom"
        />

        <IonToast
          isOpen={showVerificationCodeWarningToast}
          onDidDismiss={() => {setShowVerificationCodeWarningToast(false)}}
          onDidPresent={() => {setShowMobileVerificationLoginAlert2(true)}}
          color='warning'
          duration={2000}
          message="Verifation code is incorrect."
          position="bottom"
        />  

        <IonToast
          isOpen={showLoginFailToast}
          onDidDismiss={() => {setShowLoginFailToast(false)}}
          onDidPresent={() => {setShowNormalLoginAlert(true)}}
          color='danger'
          duration={2000}
          message="Login failed. Please try again. Your verificaion didn't match with the identity."
          position="bottom"
        />

        <IonToast
          isOpen={showQuickLoginFailToast}
          onDidDismiss={() => {setShowQuickLoginFailToast(false)}}
          onDidPresent={() => {setShowMobileVerificationLoginAlert2(true)}}
          color='danger'
          duration={2000}
          message="Login failed. Please try again. Your verificaion didn't match with the identity."
          position="bottom"
        />

        <IonToast
          isOpen={showSendVerificationFailToast}
          onDidDismiss={() => {setShowSendVerificationFailToast(false)}}
          color='danger'
          duration={2000}
          message="Send verification code failed. Please try again. Your mobile is not supported."
          position="bottom"
        />
      </IonContent>

      <IonAlert
          isOpen={showNormalLoginAlert}
          onDidDismiss={() => setShowNormalLoginAlert(false)}
          cssClass='my-custom-class'
          header={'Nomal Login'}
          backdropDismiss={false}
          inputs={[
            {
              name: 'identity_info',
              type: 'text',
              placeholder: 'username | email | mobile',
            },
            {
              name: 'password',
              type: 'password',
              placeholder: 'password'
            },
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Ok',
              handler: (data) => {
                if (data.identity_info === '' || data.password === '') {
                  setShowNormalLoginWarningToast(false);
                  setShowNormalLoginWarningToast(true);
                } else {
                  login(data.identity_info, data.password)
                    .then(response => {
                      if (response.status === 200) {
                        setShowLoginSucessToast(false)
                        setShowLoginSucessToast(true);
                      } else {
                        setShowLoginFailToast(false)
                        setShowLoginFailToast(true);
                      }
                    }).catch(err => console.log(err));
                }
              }
            }
          ]}
      />

      <IonAlert
        isOpen={showMobileVerificationLoginAlert1}
        onDidDismiss={() => setShowMobileVerificationLoginAlert1(false)}
        cssClass='my-custom-class'
        header={'Enter your Mobile and get Verification Code'}
        backdropDismiss={false}
        inputs={[
          {
            name: 'mobile',
            type: 'text',
            placeholder: 'mobile',
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Get Verification Code',
            handler: (data) => {
              if (data.mobile === '') {
                setShowMobileWarningToast(false);
                setShowMobileWarningToast(true);
              } else {
                get_verification_code(data.mobile)
                .then(response => {
                  if (response.status === 200) {
                    setTempMobile(data.mobile);
                    setShowSendVerificationSucessToast(false);
                    setShowSendVerificationSucessToast(true);
                    setShowMobileVerificationLoginAlert2(true);
                  } else {
                    setShowMobileWarningToast(false);
                    setShowMobileWarningToast(true);
                  }
                }).catch(err => console.log(err));
              }
            }
          }
        ]}
      />

      <IonAlert
        isOpen={showMobileVerificationLoginAlert2}
        onDidDismiss={() => setShowMobileVerificationLoginAlert2(false)}
        cssClass='my-custom-class'
        header={'Enter the Verification Code'}
        backdropDismiss={false}
        inputs={[
          {
            name: 'verification_code',
            type: 'text',
            placeholder: 'verfication code',
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'OK',
            handler: (data) => {
              if (data.verification_code === '') {
                setShowVerificationCodeWarningToast(false);
                setShowVerificationCodeWarningToast(true);
              } else {
                quick_login(tempMobile, data.verification_code)
                .then(response => {
                  if (response.status === 200) {
                    setShowLoginSucessToast(false)
                    setShowLoginSucessToast(true);
                  } else {
                    setShowQuickLoginFailToast(false)
                    setShowQuickLoginFailToast(true);
                  }
                }).catch(err => console.log(err));
              }
            }
          }
        ]}
      />

      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        cssClass='my-custom-class'
        buttons={[{
          text: 'Normal Login',
          handler: () => {
            setShowNormalLoginAlert(true);
          }
        }, {
          text: 'Mobile Login/Register',
          handler: () => {
            setShowMobileVerificationLoginAlert1(true);
          }
        }, {
          text: 'Cancel',
          icon: close,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]}
      >
      </IonActionSheet>
    </IonMenu>
  );
};

export default Menu;
