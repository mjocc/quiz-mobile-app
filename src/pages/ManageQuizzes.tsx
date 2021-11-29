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
import { getTestData } from '../hooks/testData';

const ManageQuizzes: React.FC = () => {
  const { quizzes } = getTestData();

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
          createItem={({ newItemName }) => {}}
          renameItem={({ itemToEdit, newItemName }) => {}}
          deleteItem={({ itemToEdit }) => {}}
          getPath={({ itemToEdit }) => `/manage/${itemToEdit.id}`}
          onReorder={doReorder}
        >
          {quizzes.map((quiz) => (
            <ManageListItem
              key={quiz.id}
              onButtonClick={() => setQuizToEdit(quiz)}
              onRowClick={() => history.push(`/manage/${quiz.id}`)}
            >
              <IonLabel>{quiz.text}</IonLabel>
              <IonLabel>{quiz.modified.toLocaleDateString('en-UK')}</IonLabel>
            </ManageListItem>
          ))}
        </ManageList>
      </IonContent>
    </IonPage>
  );
};

export default ManageQuizzes;
