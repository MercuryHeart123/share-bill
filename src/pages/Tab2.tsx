import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab2.css";
import { usePhotoGallery } from "../hook/usePhotoGallery";
import { camera } from "ionicons/icons";
import { createWorker } from "tesseract.js";
import { useEffect, useState } from "react";
import axios from "axios";

const exampleSchema = [
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
          const json = JSON.parse(cleaned);
          console.log(json);
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
            {photos.map((photo) => (
              <IonCol size="6" key={photo.filepath}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
          {allText}
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
