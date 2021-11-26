import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonReorder,
  IonRow,
} from '@ionic/react';
import { reorderThree } from 'ionicons/icons';
import { MouseEventHandler } from 'react';

type QuizListItemProps = {
  name: string;
  modified: Date;
  reorderMode: boolean;
  onClick: MouseEventHandler<HTMLIonItemElement>;
};

const QuizListItem: React.FC<QuizListItemProps> = ({
  name,
  modified,
  reorderMode,
  onClick,
}) => {
  const component = (
    <IonGrid>
      <IonRow>
        <IonCol size="8">
          <IonLabel>{name}</IonLabel>
        </IonCol>
        <IonCol size="4">
          <IonLabel className="ion-float-right ion-text-right">
            {modified.toLocaleDateString('en-UK')}
          </IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

  if (reorderMode) {
    return (
      <IonReorder>
        <IonItem>{component}</IonItem>
      </IonReorder>
    );
  }
  return (
    <IonItem button onClick={onClick}>
      {component}
    </IonItem>
  );
};

export default QuizListItem;
