import './ExploreContainer.css';
import { IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonInput, IonActionSheet, IonToast }  from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical, archive, options } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { delete_user } from '../requests/DeleteUser';
import { change_user } from '../requests/ChangeUser';

interface ContainerProps {
  colume: any;
}

const UserColume: React.FC<ContainerProps> = ({ colume }) => {
  var format = require('string-format')
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [tmpUserName, setTmpUserName] = useState<string>(colume.username);
  const [tmpMobile, setTmpMobile] = useState<string>(colume.mobile);
  const [tmpEmail, setTmpEmail] = useState<string>(colume.email);
  const [tmpRole, setTmpRole] = useState<string>(colume.role);
  const [tmpPassword, setTmpPassword] = useState<string>();
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState<boolean>(false);
  const [showDeleteFailToast, setShowDeleteFailToast] = useState<boolean>(false);
  const [showChangeSuccessToast, setShowChangeSuccessToast] = useState<boolean>(false);
  const [showChangeFailToast, setShowChangeFailToast] = useState<boolean>(false);
  
  return (
    <div>
        <IonItemSliding>
            <IonItem button onClick={() => {
                if (showDetails) {
                    setTmpUserName(colume.username);
                    setTmpMobile(colume.mobile);
                    setTmpEmail(colume.email);
                    setTmpRole(colume.role);
                    setTmpPassword(undefined);
                }
                setShowDetails(showDetails ? false : true);
            }} detail={false}>
                <IonLabel>{colume.username}</IonLabel>
                <IonLabel>{colume.mobile}</IonLabel>
            </IonItem>
                <IonItemOptions>
                    <IonItemOption color="primary" onClick={() => {
                        change_user(
                            colume.id,
                            tmpUserName,
                            tmpPassword,
                            tmpMobile,
                            tmpEmail,
                            tmpRole,
                        )
                        .then(response => {
                            if (response.status === 200) {
                                setShowChangeSuccessToast(false);
                                setShowChangeSuccessToast(true);
                            } else {
                                setShowChangeFailToast(false);
                                setShowChangeFailToast(true);
                            }
                        }).catch(err => console.log(err));
                    }}>Change</IonItemOption>
                    <IonItemOption color="danger" onClick={() => {
                        delete_user(colume.id)
                        .then(response => {
                            if (response.status === 200) {
                                setShowDeleteSuccessToast(false);
                                setShowDeleteSuccessToast(true);
                            } else {
                                setShowDeleteFailToast(false);
                                setShowDeleteFailToast(true);
                            }
                        }).catch(err => console.log(err));
                    }}>Delete</IonItemOption>
                </IonItemOptions>
        </IonItemSliding>
        
        {!showDetails ? undefined : 
            [colume].map((colume, index) => {
                return(
                    <div key={index}>
                        <IonItem color="dark">
                            <IonLabel>username:</IonLabel>
                            <IonInput value={tmpUserName} placeholder='new username' onIonChange={e => setTmpUserName(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem color="dark">
                            <IonLabel>mobile:</IonLabel>
                            <IonInput value={tmpMobile} placeholder='new mobile' onIonChange={e => setTmpMobile(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem color="dark">
                            <IonLabel>email:</IonLabel>
                            <IonInput value={tmpEmail} placeholder='new email' onIonChange={e => setTmpEmail(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem color="dark">
                            <IonLabel>password:</IonLabel>
                            <IonInput value={tmpPassword} type="password" placeholder='new password' onIonChange={e => setTmpPassword(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem color="dark" onClick={() => {
                            setShowActionSheet(true)
                        }}>
                            <IonLabel slot="start">{format("role:  {}", tmpRole)}</IonLabel>
                        </IonItem>

                        <IonActionSheet
                            isOpen={showActionSheet}
                            onDidDismiss={() => setShowActionSheet(false)}
                            cssClass='my-custom-class'
                            buttons={[{
                            text: 'admin',
                            handler: () => {
                                setTmpRole('admin');
                            }
                            }, {
                            text: 'teacher',
                            handler: () => {
                                setTmpRole('teacher');
                            }
                            }, {
                            text: 'student',
                            handler: () => {
                                setTmpRole('student');
                            }
                            }, {
                            text: 'net_friend',
                            handler: () => {
                                setTmpRole('net_friend');
                            }
                            }, {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                console.log('Cancel clicked');
                            }
                            }]}
                        >
                        </IonActionSheet>
                    </div>
                )
            })
        }

        <IonToast
          isOpen={showDeleteSuccessToast}
          onDidDismiss={() => {
            setShowDeleteSuccessToast(false)
          }}
          color='success'
          duration={2000}
          message="Delete Successfully."
          position="bottom"
        />

        <IonToast
          isOpen={showDeleteFailToast}
          onDidDismiss={() => {
            setShowDeleteFailToast(false)
          }}
          color='danger'
          duration={2000}
          message="Delete Failed."
          position="bottom"
        />

        <IonToast
          isOpen={showChangeSuccessToast}
          onDidDismiss={() => {
            setShowChangeSuccessToast(false)
          }}
          color='success'
          duration={2000}
          message="Change Successfully."
          position="bottom"
        />

        <IonToast
          isOpen={showChangeFailToast}
          onDidDismiss={() => {
            setShowChangeFailToast(false)
          }}
          color='danger'
          duration={2000}
          message="Change Failed."
          position="bottom"
        />     
    </div>
  );
};

export default UserColume;
