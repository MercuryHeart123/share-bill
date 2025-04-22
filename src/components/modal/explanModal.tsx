import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Bill, Person } from "../../pages/Tab2";
import { useEffect, useRef, useState } from "react";

interface ExplanModalProps {
  person: Person;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  onDismiss: () => void;
}

const ExplanModal = ({
  person,
  bills,
  setBills,
  onDismiss,
}: ExplanModalProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => {
      const initialCheckedItems: Record<string, boolean> = {};
      bills.forEach((bill, billIndex) => {
        bill.items.forEach((item, itemIndex) => {
          initialCheckedItems[`${billIndex}_${itemIndex}`] = item.persons.some(
            (iPerson) => iPerson === person.id // Replace with actual logic to check if the person is in the item
          );
        });
      });
      return initialCheckedItems;
    }
  );
  const toggleCheckbox = (billIndex: number, itemIndex: number) => {
    const key = `${billIndex}_${itemIndex}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const prevCheckedItemsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const prev = prevCheckedItemsRef.current;
    const changedKeys = Object.keys(checkedItems).filter(
      (key) => checkedItems[key] !== prev[key]
    );

    if (changedKeys.length > 0) {
      changedKeys.forEach((key) => {
        const [billIndex, itemIndex] = key.split("_").map(Number);
        const deepClonedBills = JSON.parse(JSON.stringify(bills)) as Bill[];
        const dItem = deepClonedBills[billIndex].items[itemIndex];
        //TO DO: dupe item fix pls
        if (checkedItems[key]) {
          dItem.persons.push(person.id);
        } else {
          dItem.persons = dItem.persons.filter(
            (iPerson) => iPerson !== person.id // Replace with actual logic to remove the person
          );
        }
        setBills(deepClonedBills);
      });

      // Optionally update bills or do other logic here
    }

    prevCheckedItemsRef.current = checkedItems;
  }, [checkedItems, bills, person, setBills]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายละเอียด</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {bills.map((bill, billIndex) => (
          <IonCard key={billIndex} className="ion-padding">
            <IonToolbar>
              <IonTitle>{bill.name}</IonTitle>
            </IonToolbar>

            <IonGrid>
              <IonRow>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  รายชการ
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  ราคา
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  จ่าย
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  หารกัน
                </IonCol>
              </IonRow>
              {bill.items.map((item, itemIndex) => {
                const key = `${billIndex}_${itemIndex}`;
                return (
                  <IonRow key={itemIndex}>
                    <IonCol size="3" sizeMd="3" className="ion-text-center">
                      {item.item}
                    </IonCol>
                    <IonCol size="3" sizeMd="3" className="ion-text-center">
                      {item.sum}
                    </IonCol>
                    <IonCol size="3" sizeMd="3" className="ion-text-center">
                      {item.persons.length > 0 && !!checkedItems[key]
                        ? Math.floor((item.sum / item.persons.length) * 100) /
                          100
                        : 0}
                    </IonCol>
                    <IonCol size="3" sizeMd="3" className="ion-text-center">
                      <IonCheckbox
                        checked={!!checkedItems[key]}
                        onIonChange={() => toggleCheckbox(billIndex, itemIndex)}
                      />
                    </IonCol>
                  </IonRow>
                );
              })}
              <IonRow>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  รวม
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  {bill.items.reduce((acc, item) => acc + item.sum, 0)}
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  {bill.items.reduce((acc, item) => {
                    const billSum = item.persons.reduce((sum, iPerson) => {
                      if (iPerson === person.id) {
                        return (
                          sum +
                          Math.floor((item.sum / item.persons.length) * 100) /
                            100
                        );
                      }
                      return sum;
                    }, 0);
                    return acc + billSum;
                  }, 0)}
                </IonCol>
                <IonCol size="3" sizeMd="3" className="ion-text-center">
                  {bill.items.reduce((acc, item) => {
                    const billSum = item.persons.reduce((sum, iPerson) => {
                      if (iPerson === person.id) {
                        return sum + 1;
                      }
                      return sum;
                    }, 0);
                    return acc + billSum;
                  }, 0)}{" "}
                  รายการ
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCard>
        ))}
        <IonButton expand="block" onClick={onDismiss}>
          ปิด
        </IonButton>
      </IonContent>
    </>
  );
};

export default ExplanModal;
