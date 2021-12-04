import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonReorder,
  IonRow,
  useIonAlert,
  UseIonAlertResult,
} from '@ionic/react';
import { pencil, trash } from 'ionicons/icons';
import { MouseEventHandler, useContext, useRef, MutableRefObject } from 'react';
import { DeleteItem, ManageListContext, RenameItem } from './ManageList';

interface ManageListItemProps {
  onRowClick: MouseEventHandler<HTMLIonRowElement>;
  itemToEdit: Item;
  renameItem: RenameItem;
  deleteItem: DeleteItem;
  children: React.ReactNode;
}

const ManageListItem: React.FC<ManageListItemProps> = ({
  onRowClick,
  itemToEdit,
  renameItem,
  deleteItem,
  children,
}) => {
  const { reorderMode, itemType } = useContext(ManageListContext);
  const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const ionAlert = useIonAlert();

  const component = (
    <IonItemSliding disabled={reorderMode} ref={itemSlidingRef}>
      <IonItem button={!reorderMode}>
        <IonRow className="list-item" onClick={onRowClick}>
          {children}
        </IonRow>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption
          onClick={() =>
            showRenameAlert(
              ionAlert,
              itemType,
              itemToEdit,
              renameItem,
              itemSlidingRef
            )
          }
        >
          <IonIcon icon={pencil} className="icon-button-padding" />
        </IonItemOption>
        <IonItemOption
          color="danger"
          onClick={() =>
            showDeleteConfirmation(ionAlert, itemToEdit, deleteItem, itemSlidingRef)
          }
        >
          <IonIcon icon={trash} className="icon-button-padding" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );

  if (reorderMode) {
    return <IonReorder>{component}</IonReorder>;
  }
  return component;
};

type SlidingItemRefType = MutableRefObject<HTMLIonItemSlidingElement | null>;

const closeSlidingItem = (itemRef: SlidingItemRefType) => {
  if (itemRef.current) {
    itemRef.current.close();
  }
};

const showRenameAlert = (
  [present]: UseIonAlertResult,
  itemType: string,
  itemToEdit: Item,
  renameItem: RenameItem,
  itemSlidingRef: SlidingItemRefType
) =>
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
        handler() {
          closeSlidingItem(itemSlidingRef);
        },
      },
      {
        text: 'Rename',
        handler({ newItemText }) {
          renameItem({ itemToEdit, newItemText });
          closeSlidingItem(itemSlidingRef);
        },
      },
    ],
  });

const showDeleteConfirmation = (
  [present]: UseIonAlertResult,
  itemToEdit: Item,
  deleteItem: DeleteItem,
  itemSlidingRef: SlidingItemRefType
) =>
  present({
    header: `Are you sure you want to delete '${itemToEdit.text}'?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler() {
          closeSlidingItem(itemSlidingRef);
        },
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler() {
          deleteItem({ itemToEdit });
        },
      },
    ],
  });

export default ManageListItem;
