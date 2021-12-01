import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonAlert
} from '@ionic/react';
import { add, close, create, reorderFour } from 'ionicons/icons';

interface ManageFabProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  createItem: (params: { newItemText: string }) => void;
  reorderMode: boolean;
  setReorderMode: (value: boolean) => void;
}

const ManageFab: React.FC<ManageFabProps> = ({
  itemType,
  createItem,
  reorderMode,
  setReorderMode,
}) => {
  const [present] = useIonAlert();

  return (
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
                      handler: ({ newItemText }) => {
                        createItem({ newItemText });
                      },
                    },
                  ],
                });
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
  );
};

export default ManageFab;
