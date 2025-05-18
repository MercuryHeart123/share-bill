import { IonButton, IonCol, IonIcon, IonInput, IonRow } from "@ionic/react";
import { add } from "ionicons/icons";
import React from "react";
import { Item } from "../../pages/Tab2";

interface ItemInsertProps {
  addingItemName: string;
  setAddingItemName: React.Dispatch<React.SetStateAction<string>>;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setItemModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setCurrentEditItem: React.Dispatch<React.SetStateAction<Item | null>>;
  items: Item[];
}
const ItemInsert = ({
  addingItemName,
  setAddingItemName,
  setItems,
  setItemModalOpen,
  setEditingItemIndex,
  setCurrentEditItem,
  items,
}: ItemInsertProps) => {
  return (
    <IonRow
      style={{
        height: "48px",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      {" "}
      {/* Set fixed row height */}
      <IonCol
        size="9"
        sizeMd="9"
        className="ion-align-self-stretch ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        style={{
          padding: "0px",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--ion-color-step-100)",
          }}
        >
          <IonInput
            value={addingItemName}
            placeholder="ใส่ชื่อรายการ"
            color={addingItemName ? "primary" : "medium"}
            style={{
              height: "100%",
            }}
            onIonInput={(e) => {
              const newValue = e.detail.value;
              setAddingItemName(newValue || "");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && addingItemName) {
                setItems((prev) => [
                  ...prev,
                  {
                    item: addingItemName,
                    sum: 0,
                    persons: [],
                  },
                ]);
                setAddingItemName("");
                setItemModalOpen(true);
                setEditingItemIndex(items.length);
                setCurrentEditItem({
                  item: addingItemName,
                  sum: 0,
                  persons: [],
                });
              }
            }}
          />
        </div>
      </IonCol>
      <IonCol
        size="3"
        sizeMd="3"
        className="ion-align-self-stretch"
        style={{ padding: "0px" }}
      >
        <IonButton
          expand="full"
          disabled={!addingItemName}
          className="border-radius-0"
          style={{
            height: "100%",
            margin: "0px",
          }}
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
            setItemModalOpen(true);
            setEditingItemIndex(items.length);
            setCurrentEditItem({
              item: addingItemName,
              sum: 0,
              persons: [],
            });
          }}
        >
          <IonIcon icon={add} />
          เพิ่มรายการ
        </IonButton>
      </IonCol>
    </IonRow>
  );
};

export default ItemInsert;
