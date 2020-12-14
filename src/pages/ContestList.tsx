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
import './ContestList.css';
import { get_contest_list } from '../requests/GetContestList';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, keyOutline } from 'ionicons/icons';

export const ContestList: React.FC = () => {
  var format = require('string-format')
  const [showLoading, setShowLoading] = useState(true);
  const [contestList, setContestList] = useState<any>();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_contest_list()
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setContestList(undefined);
          setContestList(result.data);
        }, 0);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_contest_list()
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setContestList(result.data);
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
          <IonTitle>Contests</IonTitle>
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

        {contestList === undefined ? undefined : 
          contestList.contestCatalog.elements[0].map((contest, index) => {
            let startTime = new Date(parseInt(contest.startTime) * 1000);
            let endTime = new Date(parseInt(contest.endTime) * 1000);
            let stateColor = "light";
            if (contest.state === "Ended") {
                if (contest.isRegistered) { stateColor = "medium"; }
                else { stateColor = "light"; }
            }
            if (contest.state === "Running") {
                if (contest.isRegistered) { stateColor = "success"; }
                else { stateColor = "warning"; }
            }
            if (contest.state === "Preparing") {
                if (contest.isRegistered) { stateColor = "secondary"; }
                else { stateColor = "primary"; }
            }
            
            let startTimeString = format("{}-{}-{} {}:{}:{}", 
              startTime.getUTCFullYear(),
              startTime.getUTCMonth() + 1 < 10 ? format("0{}", startTime.getUTCMonth() + 1) : startTime.getUTCMonth() + 1,
              startTime.getUTCDate() + 1 < 10 ? format("0{}", startTime.getUTCDate() + 1) : startTime.getUTCDate() + 1,
              startTime.getUTCHours() < 10 ? format("0{}", startTime.getUTCHours()) : startTime.getUTCHours(),
              startTime.getUTCMinutes() < 10 ? format("0{}", startTime.getUTCMinutes()) : startTime.getUTCMinutes(),
              startTime.getUTCSeconds() < 10 ? format("0{}", startTime.getUTCSeconds()) : startTime.getUTCSeconds(),
            );

            let endTimeString = format("{}-{}-{} {}:{}:{}", 
              endTime.getUTCFullYear(),
              endTime.getUTCMonth() + 1 < 10 ? format("0{}", endTime.getUTCMonth() + 1) : endTime.getUTCMonth() + 1,
              endTime.getUTCDate() + 1 < 10 ? format("0{}", endTime.getUTCDate() + 1) : endTime.getUTCDate() + 1,
              endTime.getUTCHours() < 10 ? format("0{}", endTime.getUTCHours()) : endTime.getUTCHours(),
              endTime.getUTCMinutes() < 10 ? format("0{}", endTime.getUTCMinutes()) : endTime.getUTCMinutes(),
              endTime.getUTCSeconds() < 10 ? format("0{}", endTime.getUTCSeconds()) : endTime.getUTCSeconds()
            );

            return(
            <IonCard key={index} href={(contest.isRegistered && contest.state !== "Preparing") || (contest.state === "Ended" && !contest.needPass) ? 
              format('/ProblemList/{}', contest.region) : 
              (contest.isRegistered && contest.state === "Preparing" ?
              format('/Unregister/{}', contest.region) : 
              format('/Register/{}/{}', contest.region, contest.needPass))
            }>
              <IonItem color={stateColor}>
                <IonLabel><p className="contest-title">{contest.name}</p></IonLabel>
                {!contest.needPass ? null :
                  <IonIcon icon={keyOutline}></IonIcon>
                }
              </IonItem>
              <IonItem>
                <IonLabel>Start Time:</IonLabel>
                <IonDatetime displayFormat="YYYY-MM-DD HH:mm:ss" value={startTimeString} readonly={true}></IonDatetime>
              </IonItem>
              <IonItem>
                <IonLabel>End Time:</IonLabel>
                <IonDatetime displayFormat="YYYY-MM-DD HH:mm:ss" value={endTimeString} readonly={true}></IonDatetime>
              </IonItem>
            </IonCard>)
          }
        )}
      </IonContent>
    </IonPage>
  );
};

export default ContestList;