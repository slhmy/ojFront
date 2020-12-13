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
  IonFab,
  IonFabButton,
  IonIcon,
  IonBadge,
  IonLoading,
} from '@ionic/react';
import './StatusList.css';
import { get_status } from '../requests/GetStatus';
import { chevronBackCircleOutline } from 'ionicons/icons';
import { UnControlled as CodeMirror } from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js');


export const Status: React.FC = () => {
  var format = require('string-format')
  let id = useLocation().pathname.split('/')[2];
  const [statusSrc, setStatusSrc] =  useState<any>();
  const [statusJudgeResult, setStatusJudgeResult] = useState<any>();
  const [stautsErrResult, setStautsErrResult] = useState<any>();
  const [highlightMode, setHighlightMode] = useState<string>('clike');
  const [showLoading, setShowLoading] = useState(true);
  
  useEffect(() => {
    get_status(id)
      .then(response => response.json())
      .then(result => {
          console.log(result);
          let language = result.data.status.language
          if (language === "c" || language === "cpp" || language === "java") {setHighlightMode('clike')}
          else { setHighlightMode('python')}
          setStatusSrc(result.data.status.src);
          setStatusJudgeResult(result.data.status.judgeResult);
          setStautsErrResult(result.data.status.errResult);
          setShowLoading(false);
      })
      .catch(err => console.log(err));
  }, [statusSrc]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{id}</IonTitle>
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

        <IonFab vertical="top" horizontal="end" slot="fixed" edge>
          <IonFabButton onClick={() => { window.location.href = "javascript:history.go(-1)"; }}>
            <IonIcon icon={chevronBackCircleOutline} />
          </IonFabButton>
        </IonFab>
        
        {statusSrc === null || statusSrc === undefined ? undefined : 
          [statusSrc].map((src, index) => {
            return (
              <div key={index}><IonCard>
                <CodeMirror
                  value={src}
                  options={{
                    mode: highlightMode,
                    theme: 'material',
                    lineNumbers: false,
                    indentUnit: 4,
                    readonly: 'nocursor'
                  }}
                />
              </IonCard></div>
            )
          }
        )}

        {stautsErrResult === null || stautsErrResult === undefined ? undefined : 
          [stautsErrResult].map((errResult, index) => {
            return (
              <div key={index}><IonCard>
                <IonItem>
                  <IonBadge color='warning'>{errResult.err}</IonBadge>
                </IonItem>
                <IonItem>
                  <p>{errResult.data}</p>
                </IonItem>
              </IonCard></div>
            )
          }
        )}

        {statusJudgeResult === null || statusJudgeResult === undefined ? undefined : 
          statusJudgeResult.data.map((judgeResult, index) => {
            return (
              <div key={index}><IonCard>
                <IonItem color="medium">
                  <IonLabel>{format("TestCase #{}:", index)}</IonLabel>
                  <IonBadge color={judgeResult.result === "SUCCESS" ? "success" : "danger"}>{judgeResult.result}</IonBadge>
                </IonItem>
                <IonItem>
                  <p>{format("CpuTime: {} ms", judgeResult.cpuTime)}</p>
                </IonItem>
                <IonItem>
                  <p>{format("Memory: {} bytes", judgeResult.memory)}</p>
                </IonItem>
                {judgeResult.output === null ? undefined : 
                  <div><IonItem color="dark">
                    <p>Src Output:</p>
                  </IonItem>
                  <IonItem color="dark">
                    <p>{judgeResult.output}</p>
                  </IonItem></div>
                }
              </IonCard></div>
            )
          }
        )}

      </IonContent>
    </IonPage>
  );
};

export default Status;