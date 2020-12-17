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
  IonFabList,
  IonIcon,
  IonSearchbar,
  IonPicker,
  IonCheckbox,
  IonAlert,
  IonActionSheet,
} from '@ionic/react';
import './ProblemList.css';
import { get_problem_list } from '../requests/GetProblemList';
import { get_contest } from '../requests/GetContest';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, trophyOutline, chevronBackOutline, pawOutline, funnelOutline } from 'ionicons/icons';
import CountDown from '../components/CountDown'

export const ProblemList: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  const [showLoading, setShowLoading] = useState(true);
  const [problemList, setProblemList] = useState<any>();
  const [contest, setContest] = useState<any>();
  const [searchProblemTitle, setSearchProblemTitle] = useState<any>();
  const [selectDifficulty, setSelectDifficulty] = useState<any>();
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectTags, setSelectTags] = useState<any[]>([]);
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const Tags = ["入门", "I/O", "test", "Navie", "asjdiw", "asdc", "入门"]

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setProblemList(undefined);
      setContest(undefined);

      get_problem_list(region, searchProblemTitle, selectDifficulty)
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
        if (result.data != null) { setContest(result.data.contest) }
      })
      .catch(err => console.log(err))
  }, [region]);

  useEffect(() => {
    setProblemList(undefined);
    get_problem_list(region, searchProblemTitle, selectDifficulty)
      .then(response => response.json())
      .then(result => {
        if (result.data != null) {
          setProblemList(result.data);
          setShowLoading(false);
        }
      })
      .catch(err => console.log(err))
  }, [region, searchProblemTitle, selectDifficulty]);

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

        {/* 比赛排名 */}
        {contest === undefined ? undefined : <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => {
            window.location.href = format('/RankList/{}', region);
          }}>
            <IonIcon icon={trophyOutline} />
          </IonFabButton>
        </IonFab>}

        
        

        {/* 题库里通过题目标题搜索 */}
        {contest !== undefined ? undefined :
          <IonSearchbar
            value={searchProblemTitle}
            onIonChange={e => setSearchProblemTitle(e.detail.value!)}
            placeholder="Problem Title"
          />
        }

        {/* 题库里通过难度，标签筛选 */}
        {contest !== undefined ? undefined :
          <IonFab vertical="top" horizontal="end" slot="fixed" edge>
            <IonFabButton>
              <IonIcon icon={chevronBackOutline} />
            </IonFabButton>
            <IonFabList side="start">
              <IonFabButton onClick={() => setShowPicker(true)}>
                <IonIcon icon={pawOutline} />
              </IonFabButton>
              <IonFabButton>
                <IonIcon icon={funnelOutline} />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        }

        {/* 选择题目难度 */}
        <IonPicker
          isOpen={showPicker}
          onDidDismiss={(e) => {
            setShowPicker(false)
            e.detail.role === "cancel" ? console.log('Cancel clicked') : setSelectDifficulty(e.detail.data.Difficulty.value);
          }}
          columns={[{
            name: 'Difficulty',
            options: [
              { text: 'All Difficulty', value: '' },
              { text: 'Naive', value: 'Naive' },
              { text: 'Easy', value: 'Easy' },
              { text: 'Middle', value: 'Middle' },
              { text: 'Hard', value: 'Hard' },
            ]
          }]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Done'
            }
          ]}
        ></IonPicker>

        {/* 选择题目标签 */}
        {/* {Tags.map((tag, index) => (
          <IonItem key={index}>
            <IonLabel>{tag}</IonLabel>
            <IonCheckbox
              slot="start"
              value={tag}
              checked={checked[index]}
              onIonChange={(e) => {
                let tep = checked
                tep[index] = e.detail.checked
                setChecked(tep)
                let tags = Tags
                for (let i = tags.length - 1; i >= 0; i--) {
                  if (tep[i] === false) {
                    tags.splice(i, 1)
                  }
                }
                setSelectTags(tags)
              }}
            />
          </IonItem>
        ))
        } */}
        {/* 倒计时 */}
        {contest === undefined ? undefined : <CountDown curContest={contest}/> }

        {/* 题目列表 */}
        <IonCard>
          {problemList === undefined ? undefined :
            problemList.problemCatalog.elements[0].map((problem, index) => {
              let solutionState: any = undefined;
              let difficultyColor: any = undefined;
              if (problem.isPassed === true) { solutionState = "success"; }
              else if (problem.isTried === true) { solutionState = "warning"; }
              if (problem.difficulty === 'Naive') { difficultyColor = "medium" }
              else if (problem.difficulty === 'Easy') { difficultyColor = "primary" }
              else if (problem.difficulty === 'Middle') { difficultyColor = "tertiary" }
              else if (problem.difficulty === 'Hard') { difficultyColor = "danger" }
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