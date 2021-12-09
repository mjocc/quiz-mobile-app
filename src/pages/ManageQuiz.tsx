import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react';
import _orderBy from 'lodash-es/orderBy';
import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router';
import ManageList from '../components/ManageList';
import ManageListItem from '../components/ManageListItem';
import { useReorder } from '../hooks/reorder';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createQuestionFromText } from '../store/slices/quizSlice/helpers';
import {
  makeSelectQuestions,
  selectQuizName
} from '../store/slices/quizSlice/selectors';
import {
  addQuestion,
  removeQuestion,
  renameQuestion
} from '../store/slices/quizSlice/slice';

const ManageQuiz: React.FC = () => {
  const { quizId }: { quizId: string } = useParams();
  const quizName = useAppSelector(selectQuizName(quizId));
  const selectQuestions = useMemo(makeSelectQuestions, []);
  const questions = useAppSelector((state) => selectQuestions(state, quizId));
  const dispatch = useAppDispatch();

  const history = useHistory();
  const [present, dismiss] = useIonToast();
  const { doReorder } = useReorder();

  if (questions !== null) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/manage" />
            </IonButtons>
            <IonTitle>Manage quiz - '{quizName}'</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <ManageList
            itemType="question"
            onReorder={doReorder}
            createItem={({ newItemText }) => {
              dispatch(
                addQuestion({
                  question: createQuestionFromText(newItemText, questions),
                  quizId,
                })
              );
            }}
          >
            {_orderBy(questions, ['order'], ['asc']).map((question) => (
              <ManageListItem
                key={question.id}
                onRowClick={() =>
                  history.push(`/manage/${quizId}/${question.id}`)
                }
                itemToEdit={question}
                renameItem={({ itemToEdit, newItemText }) => {
                  dispatch(
                    renameQuestion({
                      question: itemToEdit,
                      quizId,
                      text: newItemText,
                    })
                  );
                }}
                deleteItem={({ itemToEdit }) => {
                  dispatch(removeQuestion({ question: itemToEdit, quizId }));
                }}
              >
                <IonLabel>{question.text}</IonLabel>
              </ManageListItem>
            ))}
          </ManageList>
        </IonContent>
      </IonPage>
    );
  } else {
    present({ message: "Selected quiz doesn't exist" });
    setTimeout(() => {
      dismiss();
    }, 3500);
    history.push('/manage');
    return null;
  }
};

export default ManageQuiz;
