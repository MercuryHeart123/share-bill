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
import React from "react";
import { calculateColor } from "../../step/step1";
import { add, restaurant } from "ionicons/icons";
import { Bill, Person } from "../../../pages/Tab2";

interface BillModalProps {
  billModalOpen: boolean;
  setBillModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  persons: Person[];

  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  index: number;
  bill: Bill;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const BillModal = ({
  billModalOpen,
  setBillModalOpen,
  persons,
  setBills,
  index,
  bill,
  name,
  setName,
}: BillModalProps) => {
  const deleteBill = () => {
    // Remove the bill by filtering out the current one using the `index`
    setBills((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <IonModal
      isOpen={billModalOpen}
      onDidDismiss={() => setBillModalOpen(false)}
      breakpoints={[0.8]} // Set the breakpoints for the modal
      initialBreakpoint={0.8} // Set the initial breakpoint
    >
      <IonContent className="ion-padding">
        <IonCard className="ion-padding" style={{ borderRadius: "20px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            แก้ไขบิล
          </h2>

          <IonItem lines="full">
            <IonLabel position="stacked">ชื่อบิล</IonLabel>
            <IonInput
              placeholder="ใส่ชื่อบิล"
              value={name}
              onIonInput={(e) => {
                setName(e.detail.value || "");
              }}
            />
          </IonItem>
          <IonItem lines="none" style={{ padding: "0px" }}>
            ใครจ่ายบิลนี้
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
                const isPersonIsPayer = bill.payer?.id === person.id;
                return (
                  <IonChip
                    key={person.id}
                    style={{
                      ...(isPersonIsPayer
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
                      setBills((prev) =>
                        prev.map((rec, i) => {
                          if (i !== index) return rec;
                          return {
                            ...rec,
                            payer: person,
                          };
                        })
                      );
                    }}
                  >
                    {isPersonIsPayer ? (
                      <IonIcon
                        icon={restaurant}
                        style={{
                          margin: "0px",
                          ...(isPersonIsPayer
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
                  deleteBill();
                  setBillModalOpen(false);
                }}
              >
                ลบบิล
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
                  setBillModalOpen(false);
                }}
              >
                เสร็จสิ้น
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default BillModal;
