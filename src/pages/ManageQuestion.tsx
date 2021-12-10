import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonRadio,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import _orderBy from 'lodash-es/orderBy';
import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router';
import ManageList from '../components/ManageList';
import ManageListItem from '../components/ManageListItem';
import { useReorder } from '../hooks/reorder';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createOptionFromText } from '../store/slices/quizSlice/helpers';
import {
  makeSelectOptions,
  selectCorrectQuestion,
  selectQuestionName,
} from '../store/slices/quizSlice/selectors';
import {
  addOption,
  removeOption,
  renameOption,
  setCorrectOption,
} from '../store/slices/quizSlice/slice';

const ManageQuestion: React.FC = () => {
  const { quizId, questionId }: { quizId: string; questionId: string } =
    useParams();
  const questionName = useAppSelector(selectQuestionName(questionId));
  const correctOptionId = useAppSelector(selectCorrectQuestion(questionId));
  const selectOptions = useMemo(makeSelectOptions, []);
  const options = useAppSelector((state) => selectOptions(state, questionId));
  const dispatch = useAppDispatch();

  const history = useHistory();
  const [present, dismiss] = useIonToast();
  const { doReorder } = useReorder();

  if (options !== null) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/manage" />
            </IonButtons>
            <IonTitle>Manage question - '{questionName}'</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <ManageList
            itemType="option"
            onReorder={doReorder}
            radioValue={correctOptionId}
            setRadioValue={(optionId) => {
              dispatch(setCorrectOption({ optionId, questionId, quizId }));
            }}
            createItem={({ newItemText }) => {
              dispatch(
                addOption({
                  option: createOptionFromText(
                    newItemText,
                    options,
                    options.length === 0
                  ),
                  questionId,
                  quizId,
                })
              );
            }}
          >
            {_orderBy(options, ['order'], ['asc']).map((option) => (
              <ManageListItem
                key={option.id}
                itemToEdit={option}
                renameItem={({ itemToEdit, newItemText }) => {
                  dispatch(
                    renameOption({
                      option: itemToEdit,
                      quizId,
                      text: newItemText,
                    })
                  );
                }}
                deleteItem={({ itemToEdit }) => {
                  dispatch(
                    removeOption({ option: itemToEdit, questionId, quizId })
                  );
                }}
              >
                <IonLabel>{option.text}</IonLabel>
                <IonRadio slot="end" value={option.id} />
              </ManageListItem>
            ))}
          </ManageList>
        </IonContent>
      </IonPage>
    );
  } else {
    present({ message: "Selected question doesn't exist" });
    setTimeout(() => {
      dismiss();
    }, 3500);
    history.push(`/manage/${quizId}`);
    return null;
  }
};

export default ManageQuestion;
