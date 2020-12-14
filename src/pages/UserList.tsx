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
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonDatetime,
  IonCardHeader,
  IonIcon,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonAlert,
  IonToast,
} from '@ionic/react';
import './UserList.css';
import { get_user_list } from '../requests/GetUserList';
import { create_user } from '../requests/CreateUser';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, addOutline } from 'ionicons/icons';
import UserColume from '../components/UserColume';

export const UserList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [showLoading, setShowLoading] = useState(true);
  const [userList, setUserList] = useState<any>();
  const [searchUsername, setSearchUsername] = useState<any>();
  const [showCreateAlert, setShowCreateAlert] = useState<any>(false);
  const [showCreateSucessToast, setShowCreateSucessToast] = useState<any>(false);
  const [showCreateFailToast, setShowCreateFailToast] = useState<any>(false);
  const [showEmptyInfoToast, setShowEmptyInfoToast] = useState<any>(false);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_user_list(region, searchUsername)
      .then(response => response.json())
      .then(result => {
        setUserList(result.data);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_user_list(region, searchUsername)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUserList(result.data);
        setShowLoading(false);
      })
      .catch(err => console.log(err));
  }, [searchUsername]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Users</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchUsername} onIonChange={e => setSearchUsername(e.detail.value!)}></IonSearchbar>

        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton size="small" onClick={() => {setShowCreateAlert(true)}}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonLoading
          cssClass='my-custom-class'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait...'}
          duration={0}
        />

        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing...">
          </IonRefresherContent>
        </IonRefresher>

        <IonCard>
        {userList === undefined ? undefined :
          <IonItem color="primary">
            <IonLabel>Username</IonLabel>
            <IonLabel>Mobile</IonLabel>
          </IonItem>
        }
        {userList === undefined ? undefined : 
          userList.userCatalog.elements[0].map((colume, index) => {
            return(
              <div key={index}>
                <UserColume colume={colume} />
              </div>
            )
          }
        )}
        </IonCard>

        <IonAlert
          isOpen={showCreateAlert}
          onDidDismiss={() => setShowCreateAlert(false)}
          cssClass='my-custom-class'
          header={'Create new account'}
          backdropDismiss={false}
          inputs={[
            {
              name: 'username',
              type: 'text',
              placeholder: 'username',
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
                if (data.username === '' || data.password === '') {
                    setShowEmptyInfoToast(false);
                    setShowEmptyInfoToast(true);
                } else {
                    create_user(data.username, data.password)
                    .then(response => {
                      if (response.status === 200) {
                        setShowCreateSucessToast(false)
                        setShowCreateSucessToast(true);
                      } else {
                        setShowCreateFailToast(false)
                        setShowCreateFailToast(true);
                      }
                    }).catch(err => console.log(err));
                }
              }
            }
          ]}
      />

        <IonToast
          isOpen={showEmptyInfoToast}
          onDidDismiss={() => {setShowEmptyInfoToast(false)}}
          color='warning'
          duration={2000}
          message="Info can't be empty."
          position="bottom"
        />

        <IonToast
          isOpen={showCreateSucessToast}
          onDidDismiss={() => {setShowCreateSucessToast(false)}}
          color='success'
          duration={2000}
          message="Create user successfully."
          position="bottom"
        />

        <IonToast
          isOpen={showCreateFailToast}
          onDidDismiss={() => {setShowCreateFailToast(false)}}
          color='danger'
          duration={2000}
          message="Create user failed."
          position="bottom"
        />  

      </IonContent>
    </IonPage>
  );
};

export default UserList;