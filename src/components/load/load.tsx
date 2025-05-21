import { IonCol, IonIcon, IonRow } from "@ionic/react";
import { alertCircleOutline } from "ionicons/icons";
import React from "react";

interface LoadProps {
    height?: string;
    title?: string;
    description?: string;
}
const Load = ({ height, title, description }: LoadProps) => {
    return (
        <IonRow
            style={{
                height: height || "102px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--ion-color-step-150)",
                borderRadius: "10px",
                textAlign: "center",
            }}
        >
            <IonCol size="12">
                <IonIcon
                    icon={alertCircleOutline}
                    size="large"
                    style={{
                        marginBottom: "6px",
                        color: "var(--ion-color-primary)",
                    }}
                />
                <div
                    style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "var(--ion-text-color)",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: "13px",
                        color: "var(--ion-color-medium)",
                    }}
                >
                    {description}
                </div>
            </IonCol>
        </IonRow>
    );
};

export default Load;
