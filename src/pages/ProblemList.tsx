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
  IonFabButton,
  IonFab,
  IonIcon,
} from '@ionic/react';
import './ProblemList.css';
import { get_problem_list } from '../requests/GetProblemList';
import { get_contest } from '../requests/GetContest';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, trophyOutline } from 'ionicons/icons';

export const ProblemList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [showLoading, setShowLoading] = useState(true);
  const [problemList, setProblemList] = useState<any>();
  const [contest, setContest] = useState<any>();
  const [curTime, setCurTime] = useState(new Date());

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setProblemList(undefined);
      setContest(undefined);

      get_problem_list(region)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setProblemList(undefined);
          setProblemList(result.data);
        }, 0);
      })
      .catch(err => console.log(err));

      get_contest(region)
      .then(response => response.json())
      .then(result => {
        setContest(result.data.contest);
      })
      .catch(err => console.log(err))

      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    setContest(undefined);
    get_contest(region)
      .then(response => response.json())
      .then(result => {
        if (result.data != null) { setContest(result.data.contest) };
      })
      .catch(err => console.log(err))
  }, [region]);

  useEffect(() => {
    setProblemList(undefined);
    get_problem_list(region)
      .then(response => response.json())
      .then(result => {
        if (result.data != null) { 
          setProblemList(result.data);
          setShowLoading(false);
        };
      })
      .catch(err => console.log(err))
  }, [region]);

  useEffect(() => {
    setTimeout(() => {
      setCurTime(new Date());
    }, 500)
  }, [curTime]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{contest === undefined ? 'Problems' : contest.name}</IonTitle>
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

        {contest === undefined ? undefined : <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => {
            window.location.href = format('/RankList/{}', region);
          }}>
            <IonIcon icon={trophyOutline} />
          </IonFabButton>
        </IonFab>}

        {contest === undefined ? undefined :
          [contest].map((curContest, index) => {
            let curTime = new Date();
            let offset = curTime.getTimezoneOffset() * 60 * 1000;
            let curTimeValue = curTime.getTime() - offset;
            let startTimeValue = parseInt(curContest.startTime) * 1000;
            let endTimeValue = parseInt(curContest.endTime) * 1000;

            let curTimeString = format("{}-{}-{} {}:{}:{}", 
              curTime.getFullYear(),
              curTime.getMonth() + 1 < 10 ? format("0{}", curTime.getMonth() + 1) : curTime.getMonth() + 1,
              curTime.getDate() < 10 ? format("0{}", curTime.getDate()) : curTime.getDate(),
              curTime.getHours() < 10 ? format("0{}", curTime.getHours()) : curTime.getHours(),
              curTime.getMinutes() < 10 ? format("0{}", curTime.getMinutes()) : curTime.getMinutes(),
              curTime.getSeconds() < 10 ? format("0{}", curTime.getSeconds()) : curTime.getSeconds(),
            );

            return(
              <IonCard key={index}>
                <IonItem>
                  <IonLabel>Cur Time:</IonLabel>
                  <IonDatetime displayFormat="YYYY-MM-DD HH:mm:ss" value={curTimeString} readonly={true}></IonDatetime>
                </IonItem>
                <IonItem><IonProgressBar 
                  value={(curTimeValue - startTimeValue) / (endTimeValue - startTimeValue)}
                  color={contest.state === "Ended" ? "danger" : "success"}
                  className="contest_progress"
                ></IonProgressBar></IonItem>
              </IonCard>
            )
          })
        }

        <IonCard>
          {problemList === undefined ? undefined : 
            problemList.problemCatalog.elements[0].map((problem, index) => {
              let solutionState: any = undefined;
              let difficultyColor: any = undefined;
              if (problem.isPassed === true) { solutionState = "success"; }
              else if (problem.isTried === true) { solutionState = "warning"; }
              if (problem.difficulty === 'Naive') { difficultyColor = "medium"}
              else if (problem.difficulty === 'Easy') { difficultyColor = "primary"}
              else if (problem.difficulty === 'Middle') { difficultyColor = "tertiary"}
              else if (problem.difficulty === 'Hard') { difficultyColor = "danger"}
              if (problem.id != null) {
                return (
                  <IonItem href={format('/Problem/{}/{}', region, problem.id)} color={solutionState} key={index}>
                    <IonCol size="2"><p className="problem-id">{problem.id}</p></IonCol>
                    <IonCol size="4"><p className="problem-title">{problem.title}</p></IonCol>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="7" className="progress-bar">
                          <IonLabel>Pass Rate:</IonLabel>
                          <IonProgressBar value={problem.acceptRate} className="accept-rate"></IonProgressBar>
                        </IonCol>
                        <IonCol size="3" className="ion-align-self-end">
                          <IonBadge color={difficultyColor}>{problem.difficulty}</IonBadge>
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

export default ProblemList;