import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import { IonCard, IonCardTitle } from "@ionic/react";
import Persons from "../persons/persons";
import InsertPerson from "../persons/insertPerson";
import Load from "../load/load";
interface Step2Props {
    persons: Person[];
    setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
    bills: Bill[];
    setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const Step2 = ({ persons, bills, setPersons, setBills }: Step2Props) => {
    return (
        <>
            <IonCard
                style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <IonCardTitle className="ion-padding">
                    สรุปค่าใช้จ่าย
                </IonCardTitle>
                {persons.length == 0 ? (
                    <Load
                        height="102px"
                        title="ยังไม่มีคนในระบบ"
                        description="กรุณาเพิ่มคนก่อน"
                    />
                ) : (
                    <Persons
                        persons={persons}
                        bills={bills}
                        setBills={setBills}
                    />
                )}
                <InsertPerson setPersons={setPersons} />
            </IonCard>
        </>
    );
};

export default Step2;
