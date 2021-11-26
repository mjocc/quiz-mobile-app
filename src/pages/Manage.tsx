import { ItemReorderEventDetail } from '@ionic/core';
import {
  IonActionSheet,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add, create, reorderFour, trash, close, pencil } from 'ionicons/icons';
import { useState } from 'react';
import QuizListItem from '../components/QuizListItem';
import './Manage.scss';

const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  event.detail.complete();
};

const Manage: React.FC = () => {
  let [quizToEdit, setQuizToEdit] = useState<string>();
  let [reorderMode, setReorderMode] = useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Manage quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList lines="full">
          <IonReorderGroup disabled={!reorderMode} onIonItemReorder={doReorder}>
            <QuizListItem
              name="First quiz"
              modified={new Date('2021-01-01')}
              onClick={() => setQuizToEdit('first-quiz')}
              reorderMode={reorderMode}
            />
            <QuizListItem
              name="Second quiz"
              modified={new Date('2021-01-02')}
              onClick={() => setQuizToEdit('second-quiz')}
              reorderMode={reorderMode}
            />
            <QuizListItem
              name="Third quiz"
              modified={new Date('2021-01-03')}
              onClick={() => setQuizToEdit('third-quiz')}
              reorderMode={reorderMode}
            />
            <QuizListItem
              name="Fourth quiz"
              modified={new Date('2021-01-04')}
              onClick={() => setQuizToEdit('fourth-quiz')}
              reorderMode={reorderMode}
            />
            <QuizListItem
              name="Fifth quiz"
              modified={new Date('2021-01-05')}
              onClick={() => setQuizToEdit('fifth-quiz')}
              reorderMode={reorderMode}
            />
          </IonReorderGroup>
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          {reorderMode ? (
            <IonFabButton
              onClick={() => {
                setReorderMode(false);
              }}
            >
              <IonIcon icon={close} />
            </IonFabButton>
          ) : (
            <>
              <IonFabButton>
                <IonIcon icon={create} />
              </IonFabButton>
              <IonFabList side="top">
                <IonFabButton
                  onClick={() => {
                    console.log('create quiz');
                  }}
                >
                  <IonIcon icon={add} />
                </IonFabButton>
                <IonFabButton
                  onClick={() => {
                    setReorderMode(true);
                  }}
                >
                  <IonIcon icon={reorderFour} />
                </IonFabButton>
              </IonFabList>
            </>
          )}
        </IonFab>

        <IonActionSheet
          isOpen={!!quizToEdit}
          buttons={[
            {
              text: 'Rename',
              role: 'destructive',
              icon: pencil,
              handler: () => {
                if (quizToEdit) {
                  // renameQuiz(quizToEdit);
                  console.log(`rename ${quizToEdit}`);
                  setQuizToEdit(undefined);
                }
              },
            },
            {
              text: 'Edit',
              role: 'destructive',
              icon: create,
              handler: () => {
                if (quizToEdit) {
                  // editQuiz(quizToEdit);
                  console.log(`edit ${quizToEdit}`);
                  setQuizToEdit(undefined);
                }
              },
            },
            {
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (quizToEdit) {
                  // deleteQuiz(quizToEdit);
                  console.log(`delete ${quizToEdit}`);
                  setQuizToEdit(undefined);
                }
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
            },
          ]}
          onDidDismiss={() => setQuizToEdit(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Manage;
