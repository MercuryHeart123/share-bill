import { IonChip, IonCol, IonGrid, IonRow } from "@ionic/react";
import { Item, Person } from "../../pages/Tab2";
import { calculateColor } from "../step/step1";
import Load from "../load/load";

interface ItemProps {
    items: Item[];
    persons: Person[];
    openItemModal: (index: number) => void;
}

const Table = ({ items, persons, openItemModal }: ItemProps) => {
    return (
        <IonGrid
            style={{
                padding: "0px",
                width: "100%",
                border: "1px solid var(--ion-color-step-150)",
                borderRadius: "10px",
            }}
        >
            {items.length > 0 ? (
                <>
                    {
                        <IonRow
                            style={{
                                backgroundColor: "var(--ion-color-step-150)",
                                color: "var(--ion-text-color)",
                                fontWeight: "bold",
                                padding: "10px 0",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                            }}
                        >
                            <IonCol size="4" className="ion-text-center">
                                รายการ
                            </IonCol>
                            <IonCol size="4" className="ion-text-center">
                                ราคา
                            </IonCol>
                            <IonCol size="4" className="ion-text-center">
                                ราคาต่อคน
                            </IonCol>
                        </IonRow>
                    }

                    {items.map((item, iIndex) => {
                        const isEven = iIndex % 2 === 0;
                        const isLast = iIndex === items.length - 1;

                        return (
                            <IonRow
                                key={iIndex}
                                onClick={() => openItemModal(iIndex)}
                                style={{
                                    width: "100%",
                                    background: isEven
                                        ? "var(--ion-color-step-50)"
                                        : "var(--ion-color-step-100)",
                                    padding: "8px 0",
                                    cursor: "pointer",
                                    borderBottomLeftRadius: isLast
                                        ? "10px"
                                        : "0",
                                    borderBottomRightRadius: isLast
                                        ? "10px"
                                        : "0",
                                }}
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
                                    {item.persons.length !== 0
                                        ? (
                                              (item.sum || 0) /
                                              item.persons.length
                                          ).toLocaleString("en-US", {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                          })
                                        : "—"}{" "}
                                    บาท
                                </IonCol>
                                {item.persons.length !== 0 && (
                                    <IonCol
                                        size="12"
                                        className="ion-align-self-center"
                                        style={{
                                            paddingLeft: "18px",
                                        }}
                                    >
                                        คนที่หาร:{" "}
                                        {item.persons.map((iPerson, i) => {
                                            const person = persons.find(
                                                (p) => p.id === iPerson
                                            );
                                            return person ? (
                                                <IonChip
                                                    key={i}
                                                    style={{
                                                        backgroundColor:
                                                            calculateColor({
                                                                color: person.color,
                                                                isTextColor:
                                                                    false,
                                                            }),
                                                        color: calculateColor({
                                                            color: person.color,
                                                            isTextColor: true,
                                                        }),
                                                        padding: "5px",
                                                        borderRadius: "5px",
                                                        marginLeft: "0px",
                                                    }}
                                                >
                                                    {person.name ||
                                                        "ยังไม่ได้ระบุชื่อ"}
                                                </IonChip>
                                            ) : null;
                                        })}
                                    </IonCol>
                                )}
                            </IonRow>
                        );
                    })}
                </>
            ) : (
                <Load
                    height="96px"
                    title="ไม่มีรายการในบิลนี้"
                    description="กรุณาเพิ่มรายการในบิลนี้"
                />
            )}
        </IonGrid>
    );
};

export default Table;
