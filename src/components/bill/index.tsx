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
import { useEffect, useMemo, useRef, useState } from "react";
import {
  add,
  pencil,
  trashBin,
  alertCircleOutline,
  checkmark,
  personAdd,
} from "ionicons/icons";
import { Bill, Item, Person } from "../../pages/Tab2";
import { calculateColor } from "../step/step1";
import { Keyboard } from "@capacitor/keyboard";

interface BillComponentProps {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  index: number;
  bill: Bill;
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const BillComponent = ({
  persons,
  setPersons,
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
  const [addingItemName, setAddingItemName] = useState("");
  const [addPersonName, setAddPersonName] = useState("");
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

  useMemo(() => {
    openItemModal(items.length === 0 ? 0 : items.length - 1);
  }, [items.length]);

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
          size="9"
          sizeMd="9"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonInput
            value={addingItemName}
            placeholder="ใส่ชื่อรายการ"
            onIonInput={(e) => {
              const newValue = e.detail.value;
              if (!newValue) return;
              setAddingItemName(newValue);
            }}
          />
        </IonCol>
        <IonCol
          size="3"
          sizeMd="3"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonButton
            expand="full"
            onClick={() => {
              setItems((prev) => [
                ...prev,
                {
                  item: addingItemName,
                  sum: 0,
                  persons: [],
                },
              ]);
              setAddingItemName("");
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
            <IonItem lines="full">
              <IonLabel position="stacked">คนที่หาร</IonLabel>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap", // Allow chips to wrap to the next line
                  gap: "2px", // Optional: adds space between the chips
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
                </IonButton>
              </IonCol>
            </IonRow>
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
                onIonInput={(e) => {
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
