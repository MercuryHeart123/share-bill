import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import {
  IonCard,
  IonChip,
  IonCol,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { calculateColor } from "./step1";
interface Step2Props {
  persons: Person[];
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}
const Step2 = ({ persons, bills, setBills }: Step2Props) => {
  return (
    <>
      {bills.map((bill, billIndex) => (
        <IonCard key={billIndex}>
          <IonRow>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              รายการ
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              ราคา
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              รายชื่อ
            </IonCol>
          </IonRow>
          {bill.items.map((item, index) => (
            <IonRow key={index}>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                {item.item}
              </IonCol>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                {item.sum}
              </IonCol>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                {item.persons.map((iPerson, i) => {
                  const person = persons.find((p) => p.id === iPerson);
                  if (!person) return null;
                  return (
                    <IonChip
                      key={i}
                      style={{
                        backgroundColor: calculateColor({
                          color: person.color,
                          isTextColor: false,
                        }),
                        color: calculateColor({
                          color: person.color,
                          isTextColor: true,
                        }),
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      {person.name == "" ? "ยังไม่ได้ระบุชื่อ" : person.name}
                    </IonChip>
                  );
                })}
              </IonCol>
            </IonRow>
          ))}
          <IonItem>
            <IonSelect
              key={billIndex}
              value={bill.payer?.id}
              label="ใครจ่ายบิลนี้"
              labelPlacement="stacked"
              onIonInput={(e) => {
                const id = e.detail.value;
                const deepClonedBills = JSON.parse(
                  JSON.stringify(bills)
                ) as Bill[];
                const dBill = deepClonedBills[billIndex];
                dBill.payer = persons.find((iPerson) => iPerson.id === id);
                setBills(deepClonedBills);
              }}
            >
              {persons.map((person, index) => (
                <IonSelectOption key={index} value={person.id}>
                  {person.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonCard>
      ))}
    </>
  );
};

export default Step2;
