import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import _orderBy from 'lodash-es/orderBy';
import { useHistory } from 'react-router';
import ManageList from '../components/ManageList';
import ManageListItem from '../components/ManageListItem';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addQuiz,
  createQuizFromText,
  removeQuiz,
  renameQuiz,
  selectQuizzes,
} from '../store/slices/quizSlice';

const ManageQuizzes: React.FC = () => {
  const quizzes = useAppSelector(selectQuizzes);
  const dispatch = useAppDispatch();

  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Manage quizzes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ManageList
          itemType="quiz"
          useReorder={false}
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
                dispatch(
                  renameQuiz({ quiz: itemToEdit as Quiz, text: newItemText })
                );
              }}
              deleteItem={({ itemToEdit }) => {
                dispatch(removeQuiz(itemToEdit as Quiz));
              }}
            >
              <IonLabel>{quiz.text}</IonLabel>
              <IonLabel className="muted-text">
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
