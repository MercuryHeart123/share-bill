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
  useIonModal,
} from "@ionic/react";
import "./Tab2.css";
import { add, lockClosed, lockOpen } from "ionicons/icons";
import { useState } from "react";
import BillComponent from "../components/bill";
import ExplanModal from "../components/modal/explanModal";
export interface Person {
  id: string;
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
  persons: string[];
}

export interface Record {
  items: Item[];
  name: string;
}
const Tab2: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
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
  const [lockName, setLockName] = useState(false);
  const [openPerson, setOpenPerson] = useState<Person>();

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

  const handleDismiss = () => {
    dismiss();
  };

  const [present, dismiss] = useIonModal(ExplanModal, {
    person: openPerson,
    bills: bills,
    setBills: setBills,
    onDismiss: handleDismiss,
  });

  const calculateAmountByPerson = (person: Person) => {
    const sum = bills.reduce((acc, bill) => {
      const billSum = bill.items.reduce((billAcc, item) => {
        if (item.persons.some((iPerson) => iPerson === person.id)) {
          return (
            billAcc + Math.floor((item.sum / item.persons.length) * 100) / 100
          );
        }
        return billAcc;
      }, 0);
      return acc + billSum;
    }, 0);
    return sum;
  };
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
            persons={persons}
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
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              ชื่อ
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              เงินที่ต้องจ่าย
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              แอคชัน
            </IonCol>
          </IonRow>
          {persons.map((item, index) => (
            <IonRow key={index}>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
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
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                {calculateAmountByPerson(item)}
              </IonCol>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                <IonButton
                  color="danger"
                  onClick={() => {
                    setPersons((prev) => prev.filter((_, i) => i != index));
                  }}
                >
                  ลบ
                </IonButton>
                <IonButton
                  color="primary"
                  onClick={() => {
                    setPersons((prev) =>
                      prev.map((rec, i) =>
                        i === index
                          ? {
                              ...rec,
                              color: `rgba(${Math.floor(
                                Math.random() * 255
                              )}, ${Math.floor(
                                Math.random() * 255
                              )}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                            }
                          : rec
                      )
                    );
                  }}
                >
                  เปลี่ยนสี
                </IonButton>
                <IonButton
                  color={"secondary"}
                  onClick={() => {
                    setOpenPerson(item);
                    present();
                  }}
                >
                  แจกแจง
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
              <IonIcon
                icon={add}
                size="large"
                onClick={() => {
                  setPersons((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
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
