import { ItemReorderEventDetail } from '@ionic/core';
import { IonList, IonRadioGroup, IonReorderGroup } from '@ionic/react';
import { createContext, useState } from 'react';
import { Item } from '../store/slices/quizSlice/slice';
import ManageFab from './ManageFab';

export type CreateItem = (params: { newItemText: string }) => void;
export type RenameItem<T extends Item> = (params: {
  itemToEdit: T;
  newItemText: string;
}) => void;
export type DeleteItem<T extends Item> = (params: { itemToEdit: T }) => void;
interface ManageListProps {
  itemType: string; // e.g. 'quiz' or 'question' etc.
  createItem: CreateItem;
  reorderMode?: boolean;
  setReorderMode?: (reorderMode: boolean) => void;
  onReorder?: (event: CustomEvent<ItemReorderEventDetail>) => void;
  activateReorder?: () => void;
  deactivateReorder?: () => void;
  radioValue?: string | null;
  setRadioValue?: (optionId: string) => void;
  children: React.ReactNode;
}

const ManageListContext = createContext<{
  reorderMode: boolean;
  itemType: string;
}>({ reorderMode: false, itemType: 'item' });

const ManageList: React.FC<ManageListProps> = ({
  itemType,
  createItem,
  reorderMode,
  setReorderMode,
  onReorder,
  activateReorder,
  deactivateReorder,
  radioValue,
  setRadioValue,
  children,
}) => {

  const listChildren =
    radioValue !== undefined && setRadioValue && !reorderMode ? (
      <IonRadioGroup
        value={radioValue}
        onIonChange={(e) => setRadioValue(e.detail.value)}
      >
        {children}
      </IonRadioGroup>
    ) : (
      children
    );

  return (
    <>
      <IonList lines="full">
        <IonReorderGroup disabled={!reorderMode} onIonItemReorder={onReorder}>
          <ManageListContext.Provider
            value={{
              reorderMode: reorderMode !== undefined ? reorderMode : false,
              itemType,
            }}
          >
            {listChildren}
          </ManageListContext.Provider>
        </IonReorderGroup>
      </IonList>

      <ManageFab
        itemType={itemType}
        createItem={createItem}
        reorderMode={reorderMode}
        setReorderMode={setReorderMode}
        activateReorder={activateReorder}
        deactivateReorder={deactivateReorder}
      />
    </>
  );
};

export default ManageList;
export { ManageListContext };
