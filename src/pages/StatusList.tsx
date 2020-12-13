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
  IonButtons,
  IonMenuButton,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import './StatusList.css';
import { get_status_list } from '../requests/GetStatusList';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, chevronBackCircleOutline } from 'ionicons/icons';

export const StatusList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  let problemId = useLocation().pathname.split('/')[3];
  let userId = useLocation().pathname.split('/')[4];
  const [showLoading, setShowLoading] = useState(true);
  const [statusList, setStatusList] = useState<any>();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_status_list(region, problemId, userId)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setStatusList(result.data);
        }, 0);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_status_list(region, problemId, userId)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setStatusList(result.data);
          setShowLoading(false);
        }, 0);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>StatusList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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

        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => {
            window.location.href = format('/Problem/{}/{}/{}', region, problemId);
          }}>
            <IonIcon icon={chevronBackCircleOutline} />
          </IonFabButton>
        </IonFab>

        <IonCard>
          {statusList === undefined ? undefined : 
            statusList.statusCatalog.elements.map((status, index) => {
              let state: any = undefined;
              let resultColor: any = undefined;
              if (status.state === "Waiting") { state = "medium"; }
              else if (status.state === "Pending") { state = "light"; }
              else { state = undefined; }
              if (status.result === 'Accepted') { resultColor = "success"}
              else if (status.result === 'Unaccepted') { resultColor = "danger"}
              else { resultColor = "warning"}
              if (status.id != null) {
                return (
                  <IonItem href={format('/Status/{}', status.id)} color={state} key={index}>
                    <IonCol size="6"><p className="status-submitTime">{status.submitTime}</p></IonCol>
                    <IonCol size="2"><p className="status-language">{status.language}</p></IonCol>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="4" className="ion-align-self-end">
                          <IonBadge color={resultColor}>{status.result}</IonBadge>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                );
              }
              return null;
            }
          )}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default StatusList;