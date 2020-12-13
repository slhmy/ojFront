import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  IonIcon,
} from '@ionic/react';
import './JudgeServerList.css';
import { get_judge_server_list } from '../requests/GetJudgeServerList';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, linkOutline, link } from 'ionicons/icons';

export const JudgeServerList: React.FC = () => {
  var format = require('string-format')
  const [showLoading, setShowLoading] = useState(true);
  const [judgeServerList, setJudgeServerList] = useState<any>();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_judge_server_list()
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
            setJudgeServerList(result.data);
        }, 0);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_judge_server_list()
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setJudgeServerList(result.data);
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
          <IonTitle>JudgeServers</IonTitle>
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
          {judgeServerList === undefined ? undefined : 
            judgeServerList.judgeServers.map((judgeServer, index) => {
              let isDeprecatedState: any = undefined;
              if (judgeServer.isDeprecated === true) { isDeprecatedState = "danger"; }
              else { isDeprecatedState = "success"; }
              if (judgeServer.hostname != null) {
                return (
                  <IonItem color={isDeprecatedState} key={index}>
                    <IonCol size="1"><IonIcon ios={linkOutline} md={link}></IonIcon></IonCol>
                    <IonCol size="5"><p className="judge_server-id">{judgeServer.hostname}</p></IonCol>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="10" className="progress-bar">
                          <IonLabel>Task Load:</IonLabel>
                          <IonProgressBar value={judgeServer.taskNumber / (judgeServer.cpuCore * 2.0)} className="task_load"></IonProgressBar>
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

export default JudgeServerList;