import { IonButton, IonCol, IonIcon, IonInput, IonRow } from "@ionic/react";
import { personAdd } from "ionicons/icons";
import React from "react";
import { Person } from "../../pages/Tab2";

interface PersonProps {
    setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
}
const InsertPerson = ({ setPersons }: PersonProps) => {
    const [addPersonName, setAddPersonName] = React.useState<string>("");

    return (
        <IonRow
            style={{
                height: "48px",
                borderRadius: "5px",
                overflow: "hidden",
            }}
        >
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
                        value={addPersonName}
                        type="text"
                        inputMode="text"
                        color={addPersonName ? "primary" : "medium"}
                        placeholder="ชื่อ"
                        style={{
                            height: "100%",
                        }}
                        onIonInput={(e) => {
                            const newValue = e.detail.value;
                            setAddPersonName(newValue || "");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && addPersonName) {
                                setPersons((prev) => [
                                    ...prev,
                                    {
                                        id: crypto.randomUUID(),
                                        name: addPersonName,
                                        amount: 0,
                                        color: `${Math.floor(55 + Math.random() * 200)}, ${55 + Math.floor(55 + Math.random() * 200)}, ${Math.floor(Math.random() * 200)}`,
                                    },
                                ]);
                                setAddPersonName("");
                            }
                        }}
                        className="ion-text-center"
                    />
                </div>
            </IonCol>
            <IonCol size="3" sizeMd="3" className="ion-align-self-stretch" style={{ padding: "0px" }}>
                <IonButton
                    expand="full"
                    className="border-radius-0"
                    style={{
                        height: "100%",
                        margin: "0px",
                    }}
                    disabled={!addPersonName}
                    onClick={() => {
                        setPersons((prev) => [
                            ...prev,
                            {
                                id: crypto.randomUUID(),
                                name: addPersonName,
                                amount: 0,
                                color: `${Math.floor(55 + Math.random() * 200)}, ${55 + Math.floor(55 + Math.random() * 200)}, ${Math.floor(Math.random() * 200)}`,
                            },
                        ]);
                        setAddPersonName("");
                    }}
                >
                    <IonIcon icon={personAdd} />
                    เพิ่มบุคคลเป็นหนี้
                </IonButton>
            </IonCol>
        </IonRow>
    );
};

export default InsertPerson;
