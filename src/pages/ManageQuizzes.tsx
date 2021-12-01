import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import ManageListItem from '../components/ManageListItem';
import ManageList from '../components/ManageList';
import { useReorder } from '../hooks/reorder';
import _orderBy from 'lodash-es/orderBy';
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
  const { doReorder } = useReorder();
  let [quizToEdit, setQuizToEdit] = useState<Quiz>();

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
          itemToEdit={quizToEdit}
          setItemToEdit={setQuizToEdit}
          createItem={({ newItemText }) => {
            dispatch(addQuiz(createQuizFromText(newItemText, quizzes)));
          }}
          renameItem={({ itemToEdit, newItemText }) => {
            dispatch(renameQuiz({ id: itemToEdit.id, text: newItemText }));
          }}
          deleteItem={({ itemToEdit }) => {
            dispatch(removeQuiz(itemToEdit.id));
          }}
          getPath={({ itemToEdit }) => `/manage/${itemToEdit.id}`}
          onReorder={doReorder}
        >
          {_orderBy(quizzes, ['order'], ['asc']).map((quiz) => (
            <ManageListItem
              key={quiz.id}
              onButtonClick={() => setQuizToEdit(quiz)}
              onRowClick={() => history.push(`/manage/${quiz.id}`)}
            >
              <IonLabel>{quiz.text}</IonLabel>
              <IonLabel>
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
