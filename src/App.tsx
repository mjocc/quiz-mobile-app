import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { create, play } from 'ionicons/icons';
import Play from './pages/Play';
import ManageQuizzes from './pages/ManageQuizzes';
import ManageQuiz from './pages/ManageQuiz';
// import ManageQuestion from './pages/ManageQuestion';

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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/play" component={Play} />
          <Route exact path="/manage" component={ManageQuizzes} />
          <Route exact path="/manage/:quizId" component={ManageQuiz} />
          {/* <Route
            exact
            path="/manage/:quizId/:questionId"
            component={ManageQuestion}
          /> */}
          <Route exact path="/">
            <Redirect to="/play" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="play" href="/play">
            <IonIcon icon={play} />
            <IonLabel>Play</IonLabel>
          </IonTabButton>
          <IonTabButton tab="manage" href="/manage">
            <IonIcon icon={create} />
            <IonLabel>Manage</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
