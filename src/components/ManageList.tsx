import { ItemReorderEventDetail } from '@ionic/core';
import { IonList, IonReorderGroup } from '@ionic/react';
import { createContext, useState } from 'react';
import ManageActionSheet from './ManageActionSheet';
import ManageFab from './ManageFab';

interface ManageListProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  itemToEdit: Item | undefined;
  setItemToEdit: (value: any) => void;
  createItem: (params: { newItemText: string }) => void;
  renameItem: (params: { itemToEdit: Item; newItemText: string }) => void;
  deleteItem: (params: { itemToEdit: Item }) => void;
  getPath: (params: { itemToEdit: Item }) => string; // should return the path to manage 'itemToEdit'
  onReorder: (event: CustomEvent<ItemReorderEventDetail>) => void;
  children: React.ReactNode;
}

const ReorderContext = createContext<boolean>(false);

const ManageList: React.FC<ManageListProps> = ({
  itemType,
  itemToEdit,
  setItemToEdit,
  createItem,
  renameItem,
  deleteItem,
  getPath,
  onReorder,
  children,
}) => {
  let [reorderMode, setReorderMode] = useState<boolean>(false);

  return (
    <>
      <IonList lines="full">
        <IonReorderGroup disabled={!reorderMode} onIonItemReorder={onReorder}>
          <ReorderContext.Provider value={reorderMode}>
            {children}
          </ReorderContext.Provider>
        </IonReorderGroup>
      </IonList>

      <ManageFab
        itemType={itemType}
        createItem={createItem}
        reorderMode={reorderMode}
        setReorderMode={setReorderMode}
      />

      <ManageActionSheet
        itemType={itemType}
        itemToEdit={itemToEdit}
        setItemToEdit={setItemToEdit}
        renameItem={renameItem}
        deleteItem={deleteItem}
        getPath={getPath}
      />
    </>
  );
};

export default ManageList;
export { ReorderContext };
