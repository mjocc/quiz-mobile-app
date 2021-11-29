import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem, IonReorder
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { MouseEventHandler, useContext } from 'react';
import { ReorderContext } from './ManageList';

interface ManageListItemProps {
  onRowClick: MouseEventHandler<HTMLIonItemElement>;
  onButtonClick: MouseEventHandler<HTMLIonButtonElement>;
  children: React.ReactNode;
}

const ManageListItem: React.FC<ManageListItemProps> = ({
  onRowClick,
  onButtonClick,
  children,
}) => {
  const reorderMode = useContext(ReorderContext)

  const component = (
    <>
      <IonCol onClick={onRowClick}>
        {children}
      </IonCol>
      <IonButton
        color="dark"
        fill="clear"
        disabled={reorderMode}
        onClick={onButtonClick}
      >
        <IonIcon icon={ellipsisVertical} />
      </IonButton>
    </>
  );

  if (reorderMode) {
    return (
      <IonReorder>
        <IonItem>{component}</IonItem>
      </IonReorder>
    );
  }
  return <IonItem button>{component}</IonItem>;
};

export default ManageListItem;
