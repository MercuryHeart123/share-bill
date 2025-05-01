import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonRow,
  useIonModal,
} from "@ionic/react";
import React, { useState } from "react";
import BillComponent from "../bill";
import { Bill, Person } from "../../pages/Tab2";
import ExplanModal from "../modal/explanModal";
import { add, personAdd, fastFood, trashBin } from "ionicons/icons";

interface Step1Props {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}
export const calculateColor = ({
  color,
  isTextColor,
}: {
  color: string;
  isTextColor: boolean;
}) => {
  const rgbaColor = `rgba(${color}, ${isTextColor ? 1 : 0.1})`;

  return rgbaColor;
};
const Step1 = ({ persons, setPersons, bills, setBills }: Step1Props) => {
  const [openPerson, setOpenPerson] = useState<Person>();

  // const calculateAmountByPerson = (person: Person) => {
  //   const sum = bills.reduce((acc, bill) => {
  //     const billSum = bill.items.reduce((billAcc, item) => {
  //       if (item.persons.some((iPerson) => iPerson === person.id)) {
  //         return (
  //           billAcc + Math.floor((item.sum / item.persons.length) * 100) / 100
  //         );
  //       }
  //       return billAcc;
  //     }, 0);
  //     return acc + billSum;
  //   }, 0);
  //   return sum;
  // };
  const handleDismiss = () => {
    dismiss();
  };

  const [present, dismiss] = useIonModal(ExplanModal, {
    person: openPerson,
    bills: bills,
    setBills: setBills,
    onDismiss: handleDismiss,
  });

  return (
    <>
      <IonCard>
        <h2 style={{ margin: "1rem" }}>รายการบิลทั้งหมด</h2>
      </IonCard>
      {bills.map((item, index) => (
        <BillComponent
          persons={persons}
          index={index}
          key={index}
          bill={item}
          setBills={setBills}
        />
      ))}
      <IonCard>
        <IonButton
          expand="full"
          className="ion-text-center"
          onClick={() => {
            setBills((prev) => [
              ...prev,
              {
                name: `บิล ${prev.length + 1}`,
                items: [
                  {
                    item: "",
                    sum: 0,
                    persons: [],
                  },
                ],
              },
            ]);
          }}
        >
          <IonIcon icon={add} />
          เพิ่มบิล
        </IonButton>
      </IonCard>
      <IonCard>
        <h2 style={{ margin: "1rem" }}>รายชื่อทั้งหมด</h2>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="6" className="ion-text-center">
              ชื่อ
            </IonCol>
            {/* <IonCol size="6" sizeMd="6" className="ion-text-center" style={{}}>
              เงินที่ต้องจ่าย
            </IonCol> */}
            <IonCol size="6" sizeMd="6" className="ion-text-center">
              แอคชัน
            </IonCol>
          </IonRow>
          {persons.map((item, index) => (
            <IonRow key={index}>
              <IonCol size="6" sizeMd="6" className="ion-text-center">
                <IonInput
                  value={item.name}
                  type="text"
                  inputMode="text"
                  placeholder="ชื่อ"
                  style={{
                    backgroundColor: calculateColor({
                      color: item.color,
                      isTextColor: false,
                    }),
                    color: calculateColor({
                      color: item.color,
                      isTextColor: true,
                    }),
                  }}
                  onIonChange={(e) => {
                    const newValue = e.detail.value;
                    if (!newValue) return;
                    setPersons((prev) =>
                      prev.map((rec, i) =>
                        i === index ? { ...rec, name: newValue } : rec
                      )
                    );
                  }}
                  className="ion-text-center"
                />
              </IonCol>
              {/* <IonCol size="6" sizeMd="6" className="ion-text-center">
                {calculateAmountByPerson(item)}
              </IonCol> */}
              <IonCol size="6" sizeMd="6" className="ion-text-center">
                <IonButton
                  color="danger"
                  onClick={() => {
                    setPersons((prev) => prev.filter((_, i) => i != index));
                  }}
                >
                  <IonIcon icon={trashBin} />
                </IonButton>

                <IonButton
                  color={"secondary"}
                  onClick={() => {
                    setOpenPerson(item);
                    present();
                  }}
                >
                  <IonIcon icon={fastFood} />
                </IonButton>
              </IonCol>
            </IonRow>
          ))}
          <IonRow>
            <IonCol
              size="12"
              sizeMd="12"
              className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
            >
              <IonButton
                expand="full"
                className="ion-text-center"
                onClick={() => {
                  setPersons((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      name: "",
                      amount: 0,
                      color: `${Math.floor(Math.random() * 255)}, ${Math.floor(
                        Math.random() * 255
                      )}, ${Math.floor(Math.random() * 255)}`,
                    },
                  ]);
                }}
              >
                <IonIcon icon={personAdd} />
                เพิ่มบุคคลเป็นหนี้
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    </>
  );
};

export default Step1;
