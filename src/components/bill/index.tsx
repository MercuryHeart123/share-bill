import { IonCard } from "@ionic/react";
import { useEffect, useState } from "react";
import { Bill, Item, Person } from "../../pages/Tab2";
import { Keyboard } from "@capacitor/keyboard";
import Table from "./table";
import Header from "./header";
import ItemInsert from "./itemInsert";
import ItemModal from "./modal/itemModal";
import BillModal from "./modal/billModal";

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

  return (
    <IonCard
      className="ion-padding"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Header bill={bill} openBillModal={openBillModal} />
      <Table items={items} openItemModal={openItemModal} persons={persons} />

      <ItemInsert
        addingItemName={addingItemName}
        items={items}
        setAddingItemName={setAddingItemName}
        setCurrentEditItem={setCurrentEditItem}
        setItems={setItems}
        setItemModalOpen={setItemModalOpen}
        setEditingItemIndex={setEditingItemIndex}
      />
      <ItemModal
        persons={persons}
        setPersons={setPersons}
        items={items}
        setItems={setItems}
        itemModalOpen={itemModalOpen}
        setItemModalOpen={setItemModalOpen}
        editingIndex={editingIndex}
        currentEdit={currentEdit}
        setCurrentEditItem={setCurrentEditItem}
        addPersonName={addPersonName}
        setAddPersonName={setAddPersonName}
      />
      <BillModal
        persons={persons}
        billModalOpen={billModalOpen}
        setBillModalOpen={setBillModalOpen}
        index={index}
        name={name}
        setName={setName}
        bill={bill}
        setBills={setBills}
      />
    </IonCard>
  );
};

export default BillComponent;
