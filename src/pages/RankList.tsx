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
} from '@ionic/react';
import './RankList.css';
import { get_rank_list } from '../requests/GetRankList';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, keyOutline } from 'ionicons/icons';
import RankColume from '../components/RankColume';

export const RankList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [showLoading, setShowLoading] = useState(true);
  const [rankList, setRankList] = useState<any>();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_rank_list(region)
      .then(response => response.json())
      .then(result => {
        setRankList(undefined);
        setRankList(result.data);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_rank_list(region)
      .then(response => response.json())
      .then(result => {
        setRankList(result.data);
        setShowLoading(false);
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
          <IonTitle>Ranks</IonTitle>
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

        <IonCard>
        {rankList === undefined ? undefined :
          <IonItem color="primary">
            <IonLabel>Rank</IonLabel>
            <IonLabel>User</IonLabel>
            <IonLabel>Ac</IonLabel>
            <IonLabel>Penalty</IonLabel>
          </IonItem>
        }
        {rankList === undefined ? undefined : 
          rankList.acmRank.columes[0].map((colume, index) => {
            return(
              <div key={index}>
                <RankColume colume={colume} />
              </div>
            )
          }
        )}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RankList;