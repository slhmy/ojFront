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
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonListHeader,
  IonTextarea,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToast,
} from '@ionic/react';
import './ProblemList.css';
import MarkdownLaTexContainer from '../components/MarkdownLaTexContainer';
import { get_problem } from '../requests/GetProblem';
import { RefresherEventDetail } from '@ionic/core';
import { chevronDownCircleOutline, pulseOutline } from 'ionicons/icons';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { submit } from '../requests/Submit';
import { me } from '../requests/Me';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js');


export const Problem: React.FC = () => {
  var format = require('string-format')
  let region = useLocation().pathname.split('/')[2];
  let id = useLocation().pathname.split('/')[3];
  const [showLoading, setShowLoading] = useState(true);
  const [problemInfo, setProblemInfo] = useState<any>();
  const [highlightMode, setHighlightMode] = useState<string>('clike');
  const [language, setLanguage] = useState<string>('cpp');
  const [srcCode, setSrcCode] = useState<string>("");
  const [showSubmitSuccessToast, setShowSubmitSuccessToast] = useState<boolean>(false);
  const [showSubmitFailToast, setShowSubmitFailToast] = useState<boolean>(false);
  const [showEmptyCodeToast, setShowEmptyCodeToast] = useState<boolean>(false);
  const [selfInfo, setSelfInfo] = useState<any>();

  useEffect(() => {
    me()
      .then(response => {
        if (response.status === 200) { response.json().then(result => { setSelfInfo(result); }) }
        else { setSelfInfo(undefined); }
      })
      .catch(err => {
        console.log(err);
      });
  }, [problemInfo]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      get_problem(region, id)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          setProblemInfo(undefined);
          setProblemInfo(result.data);
        }, 0);
      })
      .catch(err => console.log(err));
      setShowLoading(false);
      event.detail.complete();
    }, 0);
  }  
  
  useEffect(() => {
    get_problem(region, id)
      .then(response => response.json())
      .then(result => {
        setTimeout(() => {
          console.log(result);
          setProblemInfo(result.data);
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
          <IonTitle>{problemInfo === undefined ? undefined : problemInfo.problem.title}</IonTitle>
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

        {selfInfo === undefined ? undefined : <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => {
            me()
            .then(response => {
              if (response.status === 200) { 
                response.json().then(result => { 
                  setSelfInfo(result);

                  window.location.href = format('/StatusList/{}/{}/{}', region, id, result.id);
                })
              }
              else { setSelfInfo(undefined); }
            })
            .catch(err => {
              console.log(err);
            });
          }}>
            <IonIcon icon={pulseOutline} />
          </IonFabButton>
        </IonFab>}

        {problemInfo === undefined ? undefined : 
          [problemInfo.problem].map((problem, index) => {
            let description: string = problem.problemContext.description === null ? '' : problem.problemContext.description;
            let inputExplain: string = problem.problemContext.inputExplain === null ? '' : problem.problemContext.inputExplain;
            let outputExplain: string = problem.problemContext.outputExplain === null ? '' : problem.problemContext.outputExplain;
            return (
              <div key={index}><IonCard>
                <IonListHeader>Description:</IonListHeader>
                <IonItem>
                  <MarkdownLaTexContainer raw={description}/>
                </IonItem>
                <IonListHeader>Input:</IonListHeader>
                <IonItem>
                  <MarkdownLaTexContainer raw={inputExplain}/>
                </IonItem>
                <IonListHeader>Output:</IonListHeader>
                <IonItem>
                  <MarkdownLaTexContainer raw={outputExplain}/>
                </IonItem>
                <IonListHeader>Examples:</IonListHeader>
                <IonGrid>
                  {problem.problemContext.examples.map((example, index) => {
                      return (
                        <IonRow key={index}>
                          <IonCol size="12">
                            <IonItem lines="none" color="medium">
                              <IonCol size="8"><IonText>{format("Input #{}", index)}</IonText></IonCol>
                            </IonItem>
                            <IonItem color="light">
                              <IonTextarea id={format("Input #{}", index)} value={example.inputExample} readonly></IonTextarea>
                            </IonItem>
                          </IonCol>
                          
                          <IonCol size="12">
                            <IonItem lines="none" color="medium">
                              <IonCol size="8"><IonText>{format("Output #{}", index)}</IonText></IonCol>
                            </IonItem>
                            <IonItem lines="none" color="light">
                              <IonTextarea value={example.outputExample} readonly></IonTextarea>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      )
                  })}
                </IonGrid>
              </IonCard>

              <IonCard>
                <IonItem><IonLabel>Language:</IonLabel>
                <IonSelect value={language} placeholder="Select Language" onIonChange={e => {
                  setLanguage(e.detail.value);
                  if (e.detail.value === "c" || e.detail.value === "cpp" || e.detail.value === "java") {setHighlightMode('clike')}
                  else {setHighlightMode('python')}
                  console.log(e.detail.value)
                }}>
                  <IonSelectOption value="c">C</IonSelectOption>
                  <IonSelectOption value="cpp">C++</IonSelectOption>
                  <IonSelectOption value="java">Java</IonSelectOption>
                  <IonSelectOption value="py2">Python2</IonSelectOption>
                  <IonSelectOption value="py3">Python3</IonSelectOption>
                </IonSelect></IonItem>
                <CodeMirror
                  options={{
                    mode: highlightMode,
                    theme: 'material',
                    lineNumbers: false,
                    indentUnit: 4,
                  }}
                  onChange={(_editor, _data, value) => {
                    setSrcCode(value)
                  }}
                />
                <IonButton expand='block' color='primary' onClick={() => {
                    if (srcCode === '') {
                      setShowEmptyCodeToast(false);
                      setShowEmptyCodeToast(true);
                    } else {
                      console.log(srcCode);
                      submit(
                        id,
                        region,
                        srcCode,
                        language,
                        'ACM',
                        problem.opaqueOutput
                      )
                        .then(response => {
                        if (response.status === 200) {
                          setShowSubmitSuccessToast(false);
                          setShowSubmitSuccessToast(true);
                          console.log(response.body)
                        } else {
                          setShowSubmitFailToast(false);
                          setShowSubmitFailToast(true);
                        }
                        }).catch(err => console.log(err));
                    }
                }}>Submit</IonButton>
              </IonCard></div>
            )
          }
        )}

        <IonToast
          isOpen={showSubmitFailToast}
          onDidDismiss={() => {setShowSubmitFailToast(false)}}
          color='danger'
          duration={2000}
          message="Submit Failed."
          position="bottom"
        />

        <IonToast
          isOpen={showSubmitSuccessToast}
          onDidDismiss={() => {setShowSubmitSuccessToast(false)}}
          color='success'
          duration={2000}
          message="Submit Successfully."
          position="bottom"
        />

        <IonToast
          isOpen={showEmptyCodeToast}
          onDidDismiss={() => {setShowEmptyCodeToast(false)}}
          color='warning'
          duration={2000}
          message="Code can't be empty'"
          position="bottom"
        />

      </IonContent>
    </IonPage>
  );
};

export default Problem;