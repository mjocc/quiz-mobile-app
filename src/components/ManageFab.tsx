import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonAlert,
} from '@ionic/react';
import { add, close, create, reorderFour } from 'ionicons/icons';

interface ManageFabProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  createItem: (params: { newItemText: string }) => void;
  reorderMode: boolean;
  useReorder: boolean;
  setReorderMode: (value: boolean) => void;
}

const ManageFab: React.FC<ManageFabProps> = ({
  itemType,
  createItem,
  reorderMode,
  useReorder,
  setReorderMode,
}) => {
  const [present] = useIonAlert();

  return (
    <IonFab vertical="bottom" horizontal="end" slot="fixed">
      {useReorder ? (
        reorderMode ? (
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
                onClick={() => showCreateAlert(present, itemType, createItem)}
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
        )
      ) : (
        <IonFabButton
          onClick={() => showCreateAlert(present, itemType, createItem)}
        >
          <IonIcon icon={add} />
        </IonFabButton>
      )}
    </IonFab>
  );
};

const showCreateAlert = (
  present: Function,
  itemType: string,
  createItem: (params: { newItemText: string }) => void
) =>
  present({
    header: `Create ${itemType}`,
    inputs: [
      {
        name: 'newItemText',
        type: 'text',
        placeholder: `New ${itemType} text`,
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Create',
        handler({ newItemText }: { newItemText: string }) {
          createItem({ newItemText });
        },
      },
    ],
  });

export default ManageFab;
