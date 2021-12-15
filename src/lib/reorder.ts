import { ItemReorderEventDetail } from '@ionic/core';
import _clone from 'lodash-es/clone';
import { useState } from 'react';

type ItemOrders = string[];
type SetItemOrders = React.Dispatch<React.SetStateAction<string[] | null>>;
export type OrderTransformations = { itemId: string; order: number }[];

const doReorder = (
  event: CustomEvent<ItemReorderEventDetail>,
  itemOrders: ItemOrders,
  setItemOrders: SetItemOrders
) => {
  const tempItemOrders = _clone(itemOrders);
  event.detail.complete(tempItemOrders);
  setItemOrders(tempItemOrders);
};

const activateReorder = (itemIds: string[], setItemOrders: SetItemOrders) => {
  setItemOrders(itemIds);
};

const deactivateReorder = (
  itemOrders: ItemOrders,
  setItemOrders: SetItemOrders,
  doTransformations: (orderTransformations: OrderTransformations) => void
) => {
  const orderTransformations = itemOrders.map((itemId, index) => ({
    itemId,
    order: index + 1,
  }));
  doTransformations(orderTransformations);
  setItemOrders(null);
};

const useReorder = () => {
  const [reorderMode, setReorderMode] = useState<boolean>(false);
  const [itemOrders, setItemOrders] = useState<ItemOrders | null>(null);

  return {
    doReorder,
    reorderMode,
    setReorderMode,
    itemOrders,
    setItemOrders,
    activateReorder,
    deactivateReorder,
  };
};

export { useReorder };
