import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonPopover,
} from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import _orderBy from 'lodash-es/orderBy';
import { useHistory } from 'react-router';
import ManageList from '../components/ManageList';
import ManageListItem from '../components/ManageListItem';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addQuiz,
  removeQuiz,
  renameQuiz,
} from '../store/slices/quizSlice/slice';
import { createQuizFromText } from '../store/slices/quizSlice/helpers';
import { selectQuizzes } from '../store/slices/quizSlice/selectors';

const ExportPopover: React.FC = () => (
  <IonList>
    <IonListHeader>Manage saves</IonListHeader>
    <IonItem button>Save quizzes</IonItem>
    <IonItem button>Load quizzes</IonItem>
  </IonList>
);

const ManageQuizzes: React.FC = () => {
  const quizzes = useAppSelector(selectQuizzes);
  const dispatch = useAppDispatch();
  const [present, dismiss] = useIonPopover(ExportPopover);
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Manage quizzes</IonTitle>
          {isPlatform('hybrid') && (
            <IonButtons slot="end">
              <IonButton
                onClick={(e) =>
                  present({
                    event: e.nativeEvent,
                  })
                }
              >
                <IonIcon
                  slot="icon-only"
                  ios={ellipsisHorizontal}
                  md={ellipsisVertical}
                />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ManageList
          itemType="quiz"
          createItem={({ newItemText }) => {
            dispatch(addQuiz(createQuizFromText(newItemText)));
          }}
        >
          {_orderBy(quizzes, ['modified'], ['desc']).map((quiz) => (
            <ManageListItem
              key={quiz.id}
              onRowClick={() => history.push(`/manage/${quiz.id}`)}
              itemToEdit={quiz}
              renameItem={({ itemToEdit, newItemText }) => {
                dispatch(renameQuiz({ quiz: itemToEdit, text: newItemText }));
              }}
              deleteItem={({ itemToEdit }) => {
                dispatch(removeQuiz(itemToEdit));
              }}
            >
              <IonLabel>{quiz.text}</IonLabel>
              <IonLabel
                style={{ flexShrink: 0, textAlign: 'right' }}
                className="muted-text"
              >
                {new Date(quiz.modified).toLocaleDateString('en-UK')}
              </IonLabel>
            </ManageListItem>
          ))}
        </ManageList>
      </IonContent>
    </IonPage>
  );
};

export default ManageQuizzes;
