import {
  IonCard,
  IonChip,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  IonInput,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { usePhotoGallery } from "../../hook/usePhotoGallery";
import axios from "axios";
import { add, camera, pencil } from "ionicons/icons";
import { Bill, Item, Person } from "../../pages/Tab2";
import NameInput from "../input/name";

interface OcrRecord {
  item: string;
  qty: number;
  price: number;
  sum: number;
}

const exampleSchema: OcrRecord[] = [
  {
    item: "น้ำดื่ม",
    qty: 1,
    price: 10,
    sum: 10,
  },
  {
    item: "ข้าวผัด",
    qty: 1,
    price: 50,
    sum: 50,
  },
  {
    item: "น้ำอัดลม",
    qty: 2,
    price: 20,
    sum: 40,
  },
];

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
  const [isEditingName, setIsEditingName] = useState(false);
  const { photos, takePhoto } = usePhotoGallery();

  useEffect(() => {
    const fetchData = async () => {
      const worker = await createWorker(["eng", "tha"]);
      worker.setParameters({
        preserve_interword_spaces: "1",
      });
      for (const photo of photos) {
        if (!photo.webviewPath) continue;

        const blob = await fetch(photo.webviewPath).then((r) => r.blob());
        const result = await worker.recognize(blob);
        const text = result.data.text;

        const body = {
          model: "llama3.2:latest",
          messages: [
            {
              role: "system",
              content:
                "Provide output in valid json. the data schema should be like this: " +
                JSON.stringify(exampleSchema) +
                " it is array of object. Do not include any other text.",
            },
            {
              role: "user",
              content: `Extract the items, quantity, price, sum from this Thai bill: ${text} Format as:[{ "item": "...", "qty": .., "price": ..., "sun": ...}, …]`,
            },
          ],
          stream: false,
        };
        const res = await axios.post("http://localhost:11434/api/chat", body);

        const { data } = res;
        const { message } = data;
        const { content } = message;
        const cleaned = content
          .replace(/^```json\s*/i, "") // remove starting ```json
          .replace(/^```\s*/i, "") // just in case it's ``` with no language
          .replace(/```$/, "") // remove ending ```
          .trim();

        try {
          const json = JSON.parse(cleaned) as OcrRecord[];
          setItems((prev) => [
            ...prev,
            ...json.map((item) => ({
              item: item.item,
              sum: item.sum,
              persons: [],
            })),
          ]);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          console.log("Raw content:", content);
        }
      }
      await worker.terminate();
    };
    fetchData();
  }, [photos]);

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
    console.log("bill on change", bill);

    setItems(bill.items);
  }, [bill]);
  return (
    <IonCard className="ion-padding">
      <IonToolbar>
        <IonTitle>
          {isEditingName ? (
            <NameInput
              name={name}
              setName={setName}
              isEditingName={isEditingName}
              onClose={() => setIsEditingName(false)}
            />
          ) : (
            <>
              {name}{" "}
              <IonIcon
                icon={pencil}
                onClick={() => setIsEditingName(true)}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </>
          )}
        </IonTitle>
      </IonToolbar>
      <IonRow>
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          รายชื่อ
        </IonCol>
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          รายการ
        </IonCol>
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          ราคา
        </IonCol>
      </IonRow>
      {items.map((item, index) => (
        <IonRow key={index}>
          <IonCol size="4" sizeMd="4" className="ion-text-center">
            {item.persons.map((iPerson, i) => {
              const person = persons.find((p) => p.id === iPerson);
              if (!person) return null;
              return (
                <IonChip
                  key={i}
                  style={{
                    backgroundColor: person.color,
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {person.name}
                </IonChip>
              );
            })}
          </IonCol>
          <IonCol size="4" sizeMd="4" className="ion-text-center">
            <IonInput
              value={item.item}
              type="text"
              inputMode="text"
              placeholder="รายการ"
              onIonChange={(e) => {
                const newValue = e.detail.value;
                if (!newValue) return;
                setItems((prev) =>
                  prev.map((rec, i) =>
                    i === index ? { ...rec, item: newValue } : rec
                  )
                );
              }}
              className="ion-text-center"
            />
          </IonCol>
          <IonCol size="4" sizeMd="4" className="ion-text-center">
            <IonInput
              value={item.sum}
              type="number"
              placeholder="0"
              onIonChange={(e) => {
                const newValue = e.detail.value;
                if (!newValue) return;
                setItems(
                  (prev) =>
                    prev.map((rec, i) =>
                      i === index ? { ...rec, sum: parseFloat(newValue) } : rec
                    ) as Item[]
                );
              }}
              className="ion-text-center"
              inputMode="numeric"
            />
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
              setItems((prev) => [
                ...prev,
                {
                  item: "",
                  sum: 0,
                  persons: [],
                },
              ]);
            }}
          />
        </IonCol>
      </IonRow>
      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton
          onClick={() => {
            takePhoto();
          }}
        >
          <IonIcon icon={camera}></IonIcon>
        </IonFabButton>
      </IonFab>
    </IonCard>
  );
};

export default BillComponent;
