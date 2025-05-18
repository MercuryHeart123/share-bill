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
  IonIcon,
} from "@ionic/react";
import { useState } from "react";
import Step1 from "../components/step/step1";
import Step2 from "../components/step/step2";
import { receiptOutline } from "ionicons/icons";

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
  const [bills, setBills] = useState<Bill[]>([
    {
      name: "บิล 1",
      items: [],
    },
  ]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2)); // let's assume max 3 steps
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <IonPage style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>มาหารกัน</IonTitle>
          <IonProgressBar value={step / 2} />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        {step === 1 && (
          <Step1
            persons={persons}
            setPersons={setPersons}
            bills={bills}
            setBills={setBills}
          >
            <IonButton
              expand="block"
              className="ion-text-center"
              style={{
                margin: "10px",
              }}
              onClick={nextStep}
              color={"success"}
            >
              <div
                style={{
                  gap: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IonIcon icon={receiptOutline} />
                สรุปค่าใช้จ่าย
              </div>
            </IonButton>
          </Step1>
        )}

        {step === 2 && (
          <Step2
            persons={persons}
            bills={bills}
            setBills={setBills}
            setPersons={setPersons}
          />
        )}

        {/* Next Button */}
        <IonRow className="ion-padding">
          <IonCol size={"12"}>
            {step > 1 && (
              <IonButton expand="full" color="medium" onClick={prevStep}>
                ย้อนกลับ
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default StandAlone;
