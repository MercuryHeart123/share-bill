import {
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonModal,
  IonRow,
} from "@ionic/react";
import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import { personAdd } from "ionicons/icons";
import ExplanModal from "../modal/explanModal";
import { calculateColor } from "../step/step1";

interface PersonProps {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const Persons = ({ persons, setPersons, bills, setBills }: PersonProps) => {
  const [addPersonName, setAddPersonName] = React.useState<string>("");
  const [personsModalOpen, setPersonsModalOpen] = React.useState(false);
  const [currentPerson, setCurrentPerson] = React.useState<Person | null>(null);
  return (
    <>
      {persons.map((person, index) => (
        <IonRow
          key={index}
          onClick={() => {
            setCurrentPerson(person);
            setPersonsModalOpen(true);
          }}
        >
          <IonCol size="12" sizeMd="12" className="ion-text-center">
            <div
              style={{
                color: calculateColor({
                  color: person.color,
                  isTextColor: true,
                }),
              }}
            >
              {person.name || "—"}
            </div>

            {/* <IonInput
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
                  onIonInput={(e) => {
                    const newValue = e.detail.value;
                    if (!newValue) return;
                    setPersons((prev) =>
                      prev.map((rec, i) =>
                        i === index ? { ...rec, name: newValue } : rec
                      )
                    );
                  }}
                  className="ion-text-center"
                /> */}
          </IonCol>
          {/* <IonCol size="6" sizeMd="6" className="ion-text-center">
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
                setOpenPerson(person);
                present();
              }}
            >
              <IonIcon icon={fastFood} />
            </IonButton>
          </IonCol> */}
        </IonRow>
      ))}
      <IonRow>
        <IonCol
          size="9"
          sizeMd="9"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonInput
            value={addPersonName}
            type="text"
            inputMode="text"
            placeholder="ชื่อ"
            onIonInput={(e) => {
              const newValue = e.detail.value;
              if (!newValue) return;
              setAddPersonName(newValue);
            }}
            className="ion-text-center"
          />
        </IonCol>
        <IonCol
          size="3"
          sizeMd="3"
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
                  name: addPersonName,
                  amount: 0,
                  color: `${Math.floor(55 + Math.random() * 200)}, ${
                    55 + Math.floor(55 + Math.random() * 200)
                  }, ${Math.floor(Math.random() * 200)}`,
                },
              ]);
              setAddPersonName("");
            }}
          >
            <IonIcon icon={personAdd} />
            เพิ่มบุคคลเป็นหนี้
          </IonButton>
        </IonCol>
      </IonRow>

      <IonModal
        isOpen={personsModalOpen && currentPerson !== null}
        onDidDismiss={() => setPersonsModalOpen(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.5}
        //   ref={billModalRef}
      >
        {currentPerson && (
          <ExplanModal
            person={currentPerson}
            onDismiss={() => setPersonsModalOpen(false)}
            bills={bills}
            setBills={setBills}
          />
        )}
      </IonModal>
    </>
  );
};

export default Persons;
