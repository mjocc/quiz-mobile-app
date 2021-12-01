import { IonActionSheet, useIonAlert } from '@ionic/react';
import { close, create, pencil, trash } from 'ionicons/icons';
import { useHistory } from 'react-router';

interface ManageActionSheetProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  itemToEdit: Item | undefined;
  setItemToEdit: (value: any) => void;
  renameItem: (params: { itemToEdit: Item, newItemText: string }) => void;
  deleteItem: (params: { itemToEdit: Item }) => void;
  getPath: (params: { itemToEdit: Item }) => string; // should return the path to manage 'itemToEdit'
}

const ManageActionSheet: React.FC<ManageActionSheetProps> = ({
  itemType,
  itemToEdit,
  setItemToEdit,
  renameItem,
  deleteItem,
  getPath,
}) => {
  const history = useHistory();
  const [present] = useIonAlert();

  return (
    <IonActionSheet
      isOpen={!!itemToEdit}
      buttons={[
        {
          text: 'Rename',
          icon: pencil,
          handler: () => {
            if (itemToEdit) {
              present({
                header: `Rename '${itemToEdit.text}'`,
                inputs: [
                  {
                    name: 'newItemText',
                    type: 'text',
                    placeholder: `New ${itemType} text`,
                    value: itemToEdit.text,
                  },
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      setItemToEdit(undefined);
                    },
                  },
                  {
                    text: 'Rename',
                    handler: ({ newItemText }) => {
                      renameItem({ itemToEdit, newItemText });
                    },
                  },
                ],
              });
            }
          },
        },
        {
          text: 'Edit',
          icon: create,
          handler: () => {
            if (itemToEdit) {
              const path = getPath({ itemToEdit });
              history.push(path);
            }
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: trash,
          handler: () => {
            if (itemToEdit) {
              present({
                header: `Are you sure you want to delete '${itemToEdit.text}'?`,
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      setItemToEdit(undefined);
                    },
                  },
                  {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                      deleteItem({ itemToEdit });
                      setItemToEdit(undefined);
                    },
                  },
                ],
              });
            }
          },
        },
        {
          text: 'Cancel',
          icon: close,
          role: 'cancel',
        },
      ]}
      onDidDismiss={() => setItemToEdit(undefined)}
    />
  );
};

export default ManageActionSheet;
