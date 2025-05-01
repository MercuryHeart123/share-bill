import {
  IonButton,
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { add, pencil, trashBin, alertCircleOutline } from "ionicons/icons";
import { Bill, Item, Person } from "../../pages/Tab2";
import { calculateColor } from "../step/step1";
import { Keyboard } from "@capacitor/keyboard";

interface BillComponentProps {
  persons: Person[];
  index: number;
  bill: Bill;
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const BillComponent = ({
  persons,
  index,
  bill,
  setBills,
}: BillComponentProps) => {
  const [items, setItems] = useState<Item[]>(bill.items);
  const [name, setName] = useState(bill.name);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingIndex, setEditingItemIndex] = useState<number | null>(null);
  const [currentEdit, setCurrentEditItem] = useState<Item | null>(null);
  const itemModalRef = useRef<HTMLIonModalElement>(null);
  const billModalRef = useRef<HTMLIonModalElement>(null);

  const openItemModal = (index: number) => {
    setEditingItemIndex(index);
    setCurrentEditItem(items[index]);
    setItemModalOpen(true);
  };

  const openBillModal = () => {
    setBillModalOpen(true);
  };
  useEffect(() => {
    setBills((prev) =>
      prev.map((rec, i) => {
        if (i !== index) return rec;
        return {
          ...rec,
          items: items,
        };
      })
    );
  }, [items, setBills, index]);

  useEffect(() => {
    setBills((prev) =>
      prev.map((rec, i) => {
        if (i !== index) return rec;
        return {
          ...rec,
          name: name,
        };
      })
    );
  }, [name, setBills, index]);

  useEffect(() => {
    setItems(bill.items);
  }, [bill]);
  useEffect(() => {
    Keyboard.setScroll({ isDisabled: false }); // Allow automatic scroll
  }, []);

  const deleteBill = () => {
    // Remove the bill by filtering out the current one using the `index`
    setBills((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const k = async () => {
      const showSub = await Keyboard.addListener("keyboardWillShow", () => {
        if (itemModalOpen) itemModalRef.current?.setCurrentBreakpoint(0.8);
        if (billModalOpen) billModalRef.current?.setCurrentBreakpoint(0.8);
      });
      const hideSub = await Keyboard.addListener("keyboardWillHide", () => {
        if (itemModalOpen) itemModalRef.current?.setCurrentBreakpoint(0.5);
        if (billModalOpen) billModalRef.current?.setCurrentBreakpoint(0.5);
      });
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    };

    k();
    return () => {
      Keyboard.removeAllListeners();
    };
  }, [billModalOpen, itemModalOpen]);

  return (
    <IonCard className="ion-padding">
      <IonToolbar>
        <IonTitle onClick={openBillModal}>
          {name} <IonIcon icon={pencil} />
        </IonTitle>
      </IonToolbar>
      <IonGrid>
        <IonRow>
          <IonCol size="4" className="ion-text-center">
            รายการ
          </IonCol>
          <IonCol size="4" className="ion-text-center">
            ราคา
          </IonCol>
          <IonCol size="4" className="ion-text-center">
            รายชื่อ
          </IonCol>
        </IonRow>

        {items.map((item, iIndex) => (
          <IonItemSliding key={crypto.randomUUID()}>
            <IonItem>
              <IonRow
                style={{ width: "100%" }}
                onClick={() => openItemModal(iIndex)}
              >
                <IonCol
                  size="4"
                  className="ion-text-center ion-align-self-center"
                >
                  {item.item || "—"}
                </IonCol>
                <IonCol
                  size="4"
                  className="ion-text-center ion-align-self-center"
                >
                  {(item.sum || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </IonCol>
                <IonCol
                  size="4"
                  className="ion-text-center ion-align-self-center"
                >
                  {item.persons.length === 0 ? (
                    <IonChip color="danger">
                      <IonIcon
                        style={{ margin: "0px" }}
                        icon={alertCircleOutline}
                      />
                    </IonChip>
                  ) : (
                    item.persons.map((iPerson, i) => {
                      const person = persons.find((p) => p.id === iPerson);
                      return person ? (
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
                          {person.name || "ยังไม่ได้ระบุชื่อ"}
                        </IonChip>
                      ) : null;
                    })
                  )}
                </IonCol>
              </IonRow>
            </IonItem>

            <IonItemOptions side="end">
              <IonItemOption
                color="danger"
                onClick={() => {
                  setItems((prev) => prev.filter((_, idx) => idx !== iIndex));
                }}
              >
                <IonIcon icon={trashBin} slot="icon-only" />
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonGrid>

      <IonRow>
        <IonCol
          size="12"
          sizeMd="12"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonButton
            expand="full"
            onClick={() => {
              setItems((prev) => [
                ...prev,
                {
                  item: "",
                  sum: 0,
                  persons: [],
                },
              ]);
            }}
          >
            <IonIcon icon={add} />
            เพิ่มรายการ
          </IonButton>
        </IonCol>
      </IonRow>
      <IonModal
        isOpen={itemModalOpen}
        onDidDismiss={() => setItemModalOpen(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.5}
        ref={itemModalRef}
      >
        <IonContent
          className="ion-padding"
          scrollEvents={true}
          fullscreen={true}
          scrollY={true}
        >
          <IonCard className="ion-padding" style={{ borderRadius: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              แก้ไขรายการ
            </h2>

            <IonItem lines="full">
              <IonLabel position="stacked">ชื่อรายการ</IonLabel>
              <IonInput
                placeholder="ใส่ชื่อรายการ"
                value={currentEdit?.item}
                onIonChange={(e) => {
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
                onIonChange={(e) => {
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
                      prev.map((it, i) =>
                        i === editingIndex ? currentEdit! : it
                      )
                    );
                    setItemModalOpen(false);
                  }}
                >
                  บันทึก
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCard>
        </IonContent>
      </IonModal>
      <IonModal
        isOpen={billModalOpen}
        onDidDismiss={() => setBillModalOpen(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.5}
        ref={billModalRef}
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
                onIonChange={(e) => {
                  setName(e.detail.value || "");
                }}
              />
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
    </IonCard>
  );
};

export default BillComponent;
