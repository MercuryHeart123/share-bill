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
import Step2 from "../components/step/step2";
import Step3 from "../components/step/step3";

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

const StandAlone: React.FC = () => {
  const [step, setStep] = useState(1); // 🆕 Step control
  const [persons, setPersons] = useState<Person[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3)); // let's assume max 3 steps
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const sizeOfCol = step === 1 ? "12" : step === 2 ? "6" : "12";
  return (
    <IonPage style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>มาหารกัน</IonTitle>
          <IonProgressBar value={step / 3} />
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
          <Step2 persons={persons} bills={bills} setBills={setBills} />
        )}

        {step === 3 && <Step3 persons={persons} bills={bills} />}

        {/* Next Button */}
        <IonRow className="ion-padding">
          <IonCol size={sizeOfCol}>
            {step > 1 && (
              <IonButton expand="full" color="medium" onClick={prevStep}>
                ย้อนกลับ
              </IonButton>
            )}
          </IonCol>
          {step < 3 && (
            <IonCol size={sizeOfCol}>
              <IonButton expand="full" onClick={nextStep}>
                ถัดไป
              </IonButton>
            </IonCol>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default StandAlone;
