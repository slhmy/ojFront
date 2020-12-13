import './ExploreContainer.css';
import { IonItem, IonLabel }  from '@ionic/react';
import React, { useState, useEffect } from 'react';

interface ContainerProps {
  colume: any;
}

const RankColume: React.FC<ContainerProps> = ({ colume }) => {
  var format = require('string-format')
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div>
        <IonItem button onClick={() => {
            setShowDetails(showDetails ? false : true);
        }} detail={false}>
            <IonLabel>{colume.isUnrated ? '*' : colume.rank}</IonLabel>
            <IonLabel>{colume.userPreviews.username}</IonLabel>
            <IonLabel>{colume.totalAccepted}</IonLabel>
            <IonLabel>{colume.totalPenalty}</IonLabel>
        </IonItem>
        {!showDetails ? undefined : 
            colume.solutionPreviews.map((solutionPreview, index) => {
                let stateColor = "dark"
                if (solutionPreview.state === "Accepted") { stateColor = "success" }            
                else if (solutionPreview.state === "Unaccepted") { stateColor = "danger" }
                else if (solutionPreview.state === "Sealed") { stateColor = "secondary" }
                return(
                    <IonItem key={index} color={stateColor}>
                        <IonLabel>{format("Pid: {}", solutionPreview.problemId)}</IonLabel>
                        <IonLabel>{format("{} tries", solutionPreview.tryTimes)}</IonLabel>
                        <IonLabel>{format("Cost: {} s", solutionPreview.solveTime)}</IonLabel>
                    </IonItem>
                )
            })
        }
    </div>
  );
};

export default RankColume;
