import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { camera } from "ionicons/icons";
import { useState } from "react";

const Tab3: React.FC = () => {
  // State to store the scanned barcode result
  const [barcode, setBarcode] = useState<Record<string, string>>({});

  function convertToObject(input: string): Record<string, string> {
    const obj: Record<string, string> = {};

    for (let i = 0; i < input.length; i += 4) {
      const key = input.slice(i, i + 2);
      const valueLength = parseInt(input.slice(i + 2, i + 2 + 2));
      const data = input.slice(i + 4, i + 4 + valueLength);
      i += valueLength;
      obj[key] = data;
    }

    return obj;
  }

  // Function to start scanning
  const requestPermissions = async () => {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === "granted" || camera === "limited";
  };
  const startScanning = async () => {
    console.log("Starting barcode scanning...");
    const granted = await requestPermissions();

    if (!granted) {
      console.error("Camera permission not granted");
      return;
    }
    try {
      const { barcodes } = await BarcodeScanner.scan();
      const val = convertToObject(barcodes[0]?.rawValue || "");
      console.log("Scanned barcode:", val);

      setBarcode(val); // Store the scanned barcode result
    } catch (error) {
      console.error("Error scanning barcode:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Barcode Scanning</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Display the barcode result if a barcode has been scanned */}
        {barcode && (
          <IonText color="primary">
            <p>{barcode["54"]}</p>
            <p></p>
          </IonText>
        )}

        {/* Button to start scanning */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={startScanning}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
