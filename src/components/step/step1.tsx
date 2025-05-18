import { IonButton, IonCard, IonIcon } from "@ionic/react";
import React from "react";
import BillComponent from "../bill";
import { Bill, Person } from "../../pages/Tab2";
import { add } from "ionicons/icons";

interface Step1Props {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  children?: React.ReactNode; // ✅ add this line to receive children
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
const Step1 = ({
  persons,
  setPersons,
  bills,
  setBills,
  children,
}: Step1Props) => {
  return (
    <>
      <IonCard
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: "1rem" }}>รายการบิลทั้งหมด</h2>
        {children}
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
      <IonButton
        expand="block"
        className="ion-text-center"
        style={{
          margin: "10px",
        }}
        onClick={() => {
          setBills((prev) => [
            ...prev,
            {
              name: `บิล ${prev.length + 1}`,
              items: [],
            },
          ]);
        }}
      >
        <IonIcon icon={add} />
        เพิ่มบิล
      </IonButton>
    </>
  );
};

export default Step1;
