import { ItemReorderEventDetail } from '@ionic/core';

const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  event.detail.complete();
};

const useReorder = () => ({ doReorder });

export { useReorder };
