import {
  IonProgressBar,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useState } from "react";
import Step1 from "../components/step/step1";

export interface Person {
  id: string;
  name: string;
  color: string;
  amount: number;
}

export interface Bill {
  name: string;
  items: Item[];
  payer?: Person;
}

export interface Item {
  item: string;
  sum: number;
  persons: string[];
}

export interface Record {
  items: Item[];
  name: string;
}
const Tab2: React.FC = () => {
  const [step, setStep] = useState(1); // 🆕 Step control
  const [persons, setPersons] = useState<Person[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      color: `${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}`,
      amount: 0,
    },
  ]);
  const [bills, setBills] = useState<Bill[]>([
    {
      name: "บิล 1",
      items: [
        {
          item: "",
          sum: 0,
          persons: [],
        },
      ],
    },
  ]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4)); // let's assume max 3 steps
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const sizeOfCol = step === 1 ? "12" : step === 2 ? "6" : "12";
  return (
    <IonPage style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>มาหารกัน</IonTitle>
          {/* 🆕 Step Progress */}
          <IonProgressBar value={step / 4} />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        {step === 1 && (
          <Step1
            persons={persons}
            setPersons={setPersons}
            bills={bills}
            setBills={setBills}
          />
        )}

        {step === 2 && (
          <>
            <h2>สรุปรายการ</h2>
            {/* Example: show a summary, total amount, etc. */}
          </>
        )}

        {step === 3 && (
          <>
            <h2>เสร็จสิ้น</h2>
            {/* Example: Confirmation page */}
          </>
        )}

        {/* Next Button */}
        <IonRow className="ion-padding">
          <IonCol size={sizeOfCol}>
            {step > 1 && (
              <IonButton expand="full" color="medium" onClick={prevStep}>
                ย้อนกลับ
              </IonButton>
            )}
          </IonCol>
          <IonCol size={sizeOfCol}>
            <IonButton expand="full" onClick={nextStep}>
              {step < 3 ? "ถัดไป" : "เสร็จสิ้น"}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
