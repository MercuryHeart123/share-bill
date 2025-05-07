import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from "@ionic/react";
import React from "react";
import BillComponent from "../bill";
import { Bill, Person } from "../../pages/Tab2";
import { add } from "ionicons/icons";
import Persons from "../bill/persons";

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
  return (
    <>
      <IonCard>
        <h2 style={{ margin: "1rem" }}>รายการบิลทั้งหมด</h2>
      </IonCard>
      {bills.map((item, index) => (
        <BillComponent
          persons={persons}
          setPersons={setPersons}
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
            <IonCol size="12" sizeMd="12" className="ion-text-center">
              ชื่อ
            </IonCol>
            {/* <IonCol size="6" sizeMd="6" className="ion-text-center" style={{}}>
              เงินที่ต้องจ่าย
            </IonCol> */}
          </IonRow>
          <Persons
            persons={persons}
            setPersons={setPersons}
            bills={bills}
            setBills={setBills}
          />
        </IonGrid>
      </IonCard>
    </>
  );
};

export default Step1;
