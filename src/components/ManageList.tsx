import { ItemReorderEventDetail } from '@ionic/core';
import { IonList, IonReorderGroup } from '@ionic/react';
import { createContext, useState } from 'react';
import ManageFab from './ManageFab';

export type CreateItem = (params: { newItemText: string }) => void;
export type RenameItem = (params: {
  itemToEdit: Item;
  newItemText: string;
}) => void;
export type DeleteItem = (params: { itemToEdit: Item }) => void;
interface ManageListProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  useReorder?: boolean;
  onReorder?: (event: CustomEvent<ItemReorderEventDetail>) => void;
  createItem: CreateItem;
  children: React.ReactNode;
}

const ManageListContext = createContext<{
  reorderMode: boolean;
  itemType: string;
}>({ reorderMode: false, itemType: 'item' });

const ManageList: React.FC<ManageListProps> = ({
  itemType,
  createItem,
  useReorder = true,
  onReorder,
  children,
}) => {
  let [reorderMode, setReorderMode] = useState<boolean>(false);

  return (
    <>
      <IonList lines="full">
        <IonReorderGroup disabled={!reorderMode} onIonItemReorder={onReorder}>
          <ManageListContext.Provider value={{ reorderMode, itemType }}>
            {children}
          </ManageListContext.Provider>
        </IonReorderGroup>
      </IonList>

      <ManageFab
        itemType={itemType}
        createItem={createItem}
        reorderMode={reorderMode}
        useReorder={useReorder}
        setReorderMode={setReorderMode}
      />
    </>
  );
};

export default ManageList;
export { ManageListContext };
