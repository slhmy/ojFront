import Menu from './components/Menu';
import Page from './pages/Page';
import ProblemList from './pages/ProblemList';
import JudgeServerList from './pages/JudgeServerList';
import StatusList from './pages/StatusList';
import RankList from './pages/RankList';
import Problem from './pages/Problem';
import Status from './pages/Status';
import Register from './pages/Register';
import Unregister from './pages/Unregister';
import React from 'react';
import ContestList from './pages/ContestList';
import UserList from './pages/UserList';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/page/:name" component={Page} exact />
            <Route path="/ProblemList/:region" component={ProblemList} exact />
            <Route path="/Problem/:region/:id" component={Problem} exact />
            <Route path="/JudgeServerList" component={JudgeServerList} exact />
            <Route path="/StatusList/:region/:problemId/:userId" component={StatusList} exact />
            <Route path="/RankList/:region" component={RankList} exact />
            <Route path="/Status/:id" component={Status} exact />
            <Route path="/ContestList" component={ContestList} exact />
            <Route path="/Register/:region/:needPass" component={Register} exact />
            <Route path="/Unregister/:region" component={Unregister} exact />
            <Route path="/UserList" component={UserList} exact />
            <Redirect from="/" to="/ProblemList/global" exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
