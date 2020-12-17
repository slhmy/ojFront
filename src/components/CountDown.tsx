import React from 'react';
import './CountDown.css';

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
  import { useState, useEffect } from 'react';

interface ContainerProps {
    curContest: any;
}

const CountDown: React.FC<ContainerProps> = ({ curContest }) => {
    var format = require('string-format')
    const [curTime, setCurTime] = useState(new Date());
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
    useEffect(() => {
        setTimeout(() => {
        setCurTime(new Date());
        }, 500)
    }, [curTime]);

  return (

        <IonCard className="container">
        <IonItem>
            <IonLabel>Cur Time:</IonLabel>
            <IonDatetime displayFormat="YYYY-MM-DD HH:mm:ss" value={curTimeString} readonly={true}></IonDatetime>
        </IonItem>
        <IonItem><IonProgressBar
            value={(curTimeValue - startTimeValue) / (endTimeValue - startTimeValue)}
            color={curContest.state === "Ended" ? "danger" : "success"}
            className="contest_progress"
        ></IonProgressBar></IonItem>
        </IonCard>
  );
};

export default CountDown;
