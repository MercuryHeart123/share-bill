import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import { IonCard, IonCardTitle } from "@ionic/react";
import Persons from "../bill/persons";
interface Step3Props {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const Step3 = ({ persons, bills, setPersons, setBills }: Step3Props) => {
  return (
    <>
      <IonCard>
        <IonCardTitle className="ion-padding">สรุปค่าใช้จ่าย</IonCardTitle>

        <Persons
          persons={persons}
          setPersons={setPersons}
          bills={bills}
          setBills={setBills}
        />
      </IonCard>
    </>
  );
};

export default Step3;
