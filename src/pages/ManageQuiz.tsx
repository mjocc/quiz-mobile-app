import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ManageListItem from '../components/ManageListItem';
import ManageList from '../components/ManageList';
import { useReorder } from '../hooks/reorder';
import _orderBy from 'lodash-es/orderBy';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addQuestion,
  createQuestionFromText,
  removeQuestion,
  renameQuestion,
  selectQuestions,
  selectQuizName,
} from '../store/slices/quizSlice';

const ManageQuiz: React.FC = () => {
  const { quizId }: { quizId: string } = useParams();
  const quizName = useAppSelector(selectQuizName(quizId));
  const questions = useAppSelector(selectQuestions(quizId));
  const dispatch = useAppDispatch();

  const history = useHistory();
  const [present, dismiss] = useIonToast();
  const { doReorder } = useReorder();
  let [questionToEdit, setQuestionToEdit] = useState<Question>();

  if (questions !== null) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Manage quiz - '{quizName}'</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <ManageList
            itemType="question"
            itemToEdit={questionToEdit}
            setItemToEdit={setQuestionToEdit}
            createItem={({ newItemText }) => {
              dispatch(
                addQuestion(createQuestionFromText(newItemText, questions))
              );
            }}
            renameItem={({ itemToEdit, newItemText }) => {
              dispatch(
                renameQuestion({ id: itemToEdit.id, text: newItemText })
              );
            }}
            deleteItem={({ itemToEdit }) => {
              dispatch(removeQuestion(itemToEdit.id));
            }}
            getPath={({ itemToEdit }) => `/manage/${itemToEdit.id}`}
            onReorder={doReorder}
          >
            {_orderBy(questions, ['order'], ['asc']).map((question) => (
              <ManageListItem
                key={question.id}
                onButtonClick={() => setQuestionToEdit(question)}
                onRowClick={() =>
                  history.push(`/manage/${quizId}/${question.id}`)
                }
              >
                <IonLabel>{question.text}</IonLabel>
              </ManageListItem>
            ))}
          </ManageList>
        </IonContent>
      </IonPage>
    );
  } else {
    present({ message: 'Something went wrong' });
    setTimeout(() => {
      dismiss();
    }, 3500);
    return null;
  }
};

export default ManageQuiz;
