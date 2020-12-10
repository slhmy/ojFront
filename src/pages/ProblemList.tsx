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
} from '@ionic/react';
import './ProblemList.css';
import { get_problem_list } from '../requests/GetProblemList';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline } from 'ionicons/icons';

export const ProblemList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [showLoading, setShowLoading] = useState(true);
  const [problemList, setProblemList] = useState<any>();

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_problem_list(region)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setProblemList(result.data);
        }, 0);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 500);
  }  
  
  useEffect(() => {
    get_problem_list(region)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setProblemList(result.data);
          setShowLoading(false);
        }, 500);
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
          <IonTitle>Problems</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          cssClass='my-custom-class'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait...'}
          duration={5000}
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
          {problemList === undefined ? undefined : 
            problemList.problemCatalog.elements[0].map((problem, index) => {
              let solutionState: any = undefined;
              let difficultyColor: any = undefined;
              if (problem.isPassed === true) { solutionState = "success"; }
              else if (problem.isTried === true) { solutionState = "warning"; }
              if (problem.difficulty === 'Navie') { difficultyColor = "medium"}
              else if (problem.difficulty === 'Easy') { difficultyColor = "primary"}
              else if (problem.difficulty === 'Middle') { difficultyColor = "tertiary"}
              else if (problem.difficulty === 'Hard') { difficultyColor = "danger"}
              if (problem.id != null) {
                return (
                  <IonItem href={format('/ProblemList/{}/{}', region, problem.id)} color={solutionState} key={index}>
                    <IonCol size="2"><p className="problem-id">{problem.id}</p></IonCol>
                    <IonCol size="4"><p className="problem-title">{problem.title}</p></IonCol>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="7" className="progress-bar">
                          <IonLabel>Pass Rate:</IonLabel>
                          <IonProgressBar value={problem.acceptRate}></IonProgressBar>
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