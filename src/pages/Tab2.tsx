import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab2.css";
import { add, lockClosed, lockOpen } from "ionicons/icons";
import { useState } from "react";
import BillComponent from "../components/bill";

export interface Person {
  name: string;
  color: string;
  amount: number;
}

export interface Bill {
  name: string;
  items: Item[];
}

export interface Item {
  item: string;
  sum: number;
  persons: Person[];
}

export interface Record {
  items: Item[];
  name: string;
}
const Tab2: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [lockName, setLockName] = useState(false);

  // const [currentPerson, setCurrentPerson] = useState("");

  // useMemo(() => {
  //   const tempPersons = JSON.parse(JSON.stringify(persons)) as {
  //     name: string;
  //     color: string;
  //     amount: number;
  //   }[];
  //   setPersons(
  //     tempPersons.map((item) => {
  //       const sum = records.reduce((acc, rec) => {
  //         if (rec.sharePerson.includes(item.name)) {
  //           return (
  //             acc + Math.floor((rec.sum / rec.sharePerson.length) * 100) / 100
  //           );
  //         }
  //         return acc;
  //       }, 0);
  //       return {
  //         ...item,
  //         amount: sum,
  //       };
  //     })
  //   );
  // }, [records]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>มาหารกัน</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {bills.map((item, index) => (
          <BillComponent
            index={index}
            key={index}
            bill={item}
            setBills={setBills}
          />
        ))}
        <IonButton
          expand="full"
          fill="clear"
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
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="6" className="ion-text-center">
              ชื่อ
            </IonCol>
            <IonCol size="6" sizeMd="6" className="ion-text-center">
              เงินที่ต้องจ่าย
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
                  style={{
                    backgroundColor: lockName ? item.color : "",
                    color: lockName ? "white" : "",
                  }}
                  readonly={lockName}
                  onClick={() => {
                    if (!lockName) return;
                    // setCurrentPerson(item.name);
                  }}
                />
              </IonCol>
              <IonCol size="6" sizeMd="6" className="ion-text-center">
                <IonInput
                  value={item.amount}
                  type="number"
                  placeholder="0"
                  readonly
                  className="ion-text-center"
                  inputMode="numeric"
                />
              </IonCol>
            </IonRow>
          ))}
          {!lockName && (
            <IonRow>
              <IonCol
                size="12"
                sizeMd="12"
                className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
              >
                <IonIcon
                  icon={add}
                  size="large"
                  onClick={() => {
                    setPersons((prev) => [
                      ...prev,
                      {
                        name: "",
                        amount: 0,
                        color: `rgba(${Math.floor(
                          Math.random() * 255
                        )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
                          Math.random() * 255
                        )}, 0.5)`,
                      },
                    ]);
                  }}
                />
              </IonCol>
            </IonRow>
          )}
          <IonRow>
            <IonCol
              size="12"
              sizeMd="12"
              className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
            >
              <IonIcon
                icon={lockName ? lockClosed : lockOpen}
                size="large"
                onClick={() => {
                  setLockName((prev) => !prev);
                  // setCurrentPerson("");
                  setPersons((prev) => prev.filter((item) => item.name != ""));
                }}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
