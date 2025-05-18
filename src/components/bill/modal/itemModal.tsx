import {
  IonButton,
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import { add, checkmark, personAdd } from "ionicons/icons";
import React from "react";
import { Item, Person } from "../../../pages/Tab2";
import { calculateColor } from "../../step/step1";

interface ItemModalProps {
  itemModalOpen: boolean;
  setItemModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  editingIndex: number | null;
  currentEdit: Item | null;
  setCurrentEditItem: React.Dispatch<React.SetStateAction<Item | null>>;
  addPersonName: string;
  setAddPersonName: React.Dispatch<React.SetStateAction<string>>;
}

const ItemModal = ({
  itemModalOpen,
  setItemModalOpen,
  persons,
  setPersons,
  setItems,
  editingIndex,
  currentEdit,
  setCurrentEditItem,
  addPersonName,
  setAddPersonName,
}: ItemModalProps) => {
  return (
    <IonModal
      isOpen={itemModalOpen}
      onDidDismiss={() => setItemModalOpen(false)}
      breakpoints={[0.8]} // Set the breakpoints for the modal
      initialBreakpoint={0.8} // Set the initial breakpoint
    >
      <IonContent
        className="ion-padding"
        scrollEvents={true}
        fullscreen={true}
        scrollY={true}
      >
        <IonCard
          className="ion-padding"
          style={{
            borderRadius: "20px",
            maxHeight: "50vh", // limit height to 70% of the viewport height
            overflowY: "auto", // allow internal scrolling
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            แก้ไขรายการ
          </h2>

          <IonItem lines="full">
            <IonLabel position="stacked">ชื่อรายการ</IonLabel>
            <IonInput
              placeholder="ใส่ชื่อรายการ"
              value={currentEdit?.item}
              onIonInput={(e) => {
                setCurrentEditItem((prev) =>
                  prev
                    ? {
                        ...prev,
                        item: e.detail.value || "",
                        sum: prev.sum,
                        persons: prev.persons,
                      }
                    : null
                );
              }}
            />
          </IonItem>

          <IonItem lines="full">
            <IonLabel position="stacked">จำนวนเงิน</IonLabel>
            <IonInput
              type="text" // Use text to handle formatted input
              inputMode="decimal"
              placeholder="0"
              value={
                currentEdit?.sum === 0
                  ? ""
                  : currentEdit?.sum.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
              }
              onIonInput={(e) => {
                const input = e.detail.value || "0";
                // Remove commas and limit to two decimal places
                const rawValue = input.replace(/,/g, "");
                const parsed = parseFloat(rawValue);
                const rounded = Math.floor(parsed * 100) / 100; // Limit to 2 decimal places

                setCurrentEditItem((prev) =>
                  prev
                    ? {
                        ...prev,
                        sum: isNaN(rounded) ? 0 : rounded,
                        item: prev.item,
                        persons: prev.persons,
                      }
                    : null
                );
              }}
            />
          </IonItem>
          {persons.length !== 0 && (
            <>
              <IonItem lines="none" style={{ padding: "0px" }}>
                คนที่หาร
              </IonItem>
              <IonItem lines="full">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap", // Allow chips to wrap to the next line
                    gap: "2px", // Optional: adds space between the chips
                    paddingBottom: "20px",
                  }}
                >
                  {persons.map((person) => {
                    const isPersonInList = currentEdit?.persons.includes(
                      person.id
                    );
                    return (
                      <IonChip
                        key={person.id}
                        style={{
                          ...(isPersonInList
                            ? {
                                color: calculateColor({
                                  color: person.color,
                                  isTextColor: true,
                                }),
                                backgroundColor: calculateColor({
                                  color: person.color,
                                  isTextColor: false,
                                }),
                              }
                            : {}),
                          borderRadius: "5px",
                        }}
                        onClick={() => {
                          if (!currentEdit) return;
                          setCurrentEditItem((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  persons: prev.persons.includes(person.id)
                                    ? prev.persons.filter(
                                        (id) => id !== person.id
                                      )
                                    : [...prev.persons, person.id],
                                }
                              : null
                          );
                        }}
                      >
                        {isPersonInList ? (
                          <IonIcon
                            icon={checkmark}
                            style={{
                              margin: "0px",
                              ...(isPersonInList
                                ? {
                                    color: calculateColor({
                                      color: person.color,
                                      isTextColor: true,
                                    }),
                                  }
                                : {}),
                            }}
                          />
                        ) : (
                          <IonIcon
                            icon={add}
                            style={{
                              margin: "0px",
                            }}
                          />
                        )}
                        {person.name || "ยังไม่ได้ระบุชื่อ"}
                      </IonChip>
                    );
                  })}
                </div>
              </IonItem>
            </>
          )}
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
                  setAddPersonName(newValue || "");
                }}
                color={addPersonName ? "primary" : "medium"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && addPersonName) {
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
                  }
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
                disabled={!addPersonName}
              >
                <IonIcon icon={personAdd} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
        <IonRow style={{ marginTop: "1.5rem" }}>
          <IonCol
            size="6"
            sizeMd="6"
            className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
          >
            {" "}
            <IonButton
              expand="block"
              color={"danger"}
              onClick={() => {
                setItems((prev) =>
                  prev.filter((_, idx) => idx !== editingIndex)
                );
                setItemModalOpen(false);
              }}
            >
              ลบรายการ
            </IonButton>
          </IonCol>
          <IonCol
            size="6"
            sizeMd="6"
            className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
          >
            <IonButton
              expand="block"
              onClick={() => {
                setItems((prev) =>
                  prev.map((it, i) => (i === editingIndex ? currentEdit! : it))
                );
                setItemModalOpen(false);
              }}
            >
              บันทึก
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};

export default ItemModal;
