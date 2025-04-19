import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
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
import { usePhotoGallery } from "../hook/usePhotoGallery";
import { add, camera, lockClosed, lockOpen } from "ionicons/icons";
import { createWorker } from "tesseract.js";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface Record {
  item: string;
  qty: number;
  price: number;
  sum: number;
  sharePerson?: string[];
}

const exampleSchema: Record[] = [
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

const Tab2: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery();
  const [allText, setAllText] = useState("");
  const [records, setRecords] = useState<
    {
      item: string;
      sum: number;
      sharePerson: string[];
    }[]
  >([]);
  const [persons, setPersons] = useState<
    {
      name: string;
      color: string;
      amount: number;
    }[]
  >([]);

  const [lockName, setLockName] = useState(false);

  const [currentPerson, setCurrentPerson] = useState("");
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
        console.log(res);

        const { data } = res;
        const { message } = data;
        const { content } = message;
        const cleaned = content
          .replace(/^```json\s*/i, "") // remove starting ```json
          .replace(/^```\s*/i, "") // just in case it's ``` with no language
          .replace(/```$/, "") // remove ending ```
          .trim();

        try {
          const json = JSON.parse(cleaned) as Record[];
          setRecords((prev) => [
            ...prev,
            ...json.map((item) => ({
              item: item.item,
              sum: item.sum,
              sharePerson: [],
            })),
          ]);
          console.log("Parsed JSON:", json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          console.log("Raw content:", content);
        }
      }
      await worker.terminate();
      return allText;
    };
    fetchData().then((text) => {
      setAllText(text.replace(" ", ""));
    });
  }, [photos, setAllText]);

  useMemo(() => {
    const tempPersons = JSON.parse(JSON.stringify(persons)) as {
      name: string;
      color: string;
      amount: number;
    }[];
    setPersons(
      tempPersons.map((item) => {
        const sum = records.reduce((acc, rec) => {
          if (rec.sharePerson.includes(item.name)) {
            return (
              acc + Math.floor((rec.sum / rec.sharePerson.length) * 100) / 100
            );
          }
          return acc;
        }, 0);
        return {
          ...item,
          amount: sum,
        };
      })
    );
  }, [records]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              คนหาร
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              รายการ
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              ราคา
            </IonCol>
          </IonRow>
          {records.map((item, index) => (
            <IonRow
              key={index}
              onClick={() => {
                if (!currentPerson) return;
                console.log("currentPerson", currentPerson);

                setRecords((prev) => {
                  return prev.map((rec, i) => {
                    if (i !== index) return rec;

                    if (rec.sharePerson.length > 0) {
                      const sharePerson = JSON.parse(
                        JSON.stringify(rec.sharePerson)
                      ) as string[];
                      const index = sharePerson.indexOf(currentPerson);
                      if (index > -1) {
                        sharePerson.splice(index, 1);
                        console.log("delete", sharePerson);
                      } else {
                        sharePerson.push(currentPerson);
                      }
                      console.log("sharePerson", sharePerson, index, i);

                      return {
                        ...rec,
                        sharePerson: sharePerson,
                      };
                    }
                    return {
                      ...rec,
                      sharePerson: [currentPerson],
                    };
                  });
                });
              }}
            >
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                <>
                  {item.sharePerson.map((person, i) => {
                    const personData = persons.find(
                      (item) => item.name === person
                    );
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: personData?.color,
                          color: "white",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {person}
                      </div>
                    );
                  })}
                </>
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
                    setRecords((prev) =>
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
                    setRecords((prev) =>
                      prev.map((rec, i) =>
                        i === index
                          ? { ...rec, sum: parseFloat(newValue) }
                          : rec
                      )
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
                  setRecords((prev) => [
                    ...prev,
                    {
                      item: "",
                      sum: 0,
                      sharePerson: [],
                    },
                  ]);
                }}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
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
                    setCurrentPerson(item.name);
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
                  setCurrentPerson("");
                  setPersons((prev) => prev.filter((item) => item.name != ""));
                }}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton
            onClick={() => {
              takePhoto();
            }}
          >
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
