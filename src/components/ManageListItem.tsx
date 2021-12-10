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
import {
  MouseEventHandler,
  useContext,
  useRef,
  MutableRefObject,
  ReactElement,
} from 'react';
import { Item } from '../store/slices/quizSlice/slice';
import { DeleteItem, ManageListContext, RenameItem } from './ManageList';

interface ManageListItemProps<T extends Item> {
  onRowClick?: MouseEventHandler<HTMLIonRowElement>;
  itemToEdit: T;
  renameItem: RenameItem<T>;
  deleteItem: DeleteItem<T>;
  children: React.ReactNode;
}

const ManageListItem = <T extends Item>({
  onRowClick,
  itemToEdit,
  renameItem,
  deleteItem,
  children,
}: ManageListItemProps<T>): ReactElement | null => {
  const { reorderMode, itemType } = useContext(ManageListContext);
  const itemSlidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const ionAlert = useIonAlert();

  const component = (
    <IonItemSliding disabled={reorderMode} ref={itemSlidingRef}>
      <IonItem button={!reorderMode} onClick={onRowClick}>
        <div className="list-item">{children}</div>
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
            showDeleteConfirmation(
              ionAlert,
              itemToEdit,
              deleteItem,
              itemSlidingRef
            )
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

const showRenameAlert = <T extends Item>(
  [present]: UseIonAlertResult,
  itemType: string,
  itemToEdit: T,
  renameItem: RenameItem<T>,
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

const showDeleteConfirmation = <T extends Item>(
  [present]: UseIonAlertResult,
  itemToEdit: T,
  deleteItem: DeleteItem<T>,
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
