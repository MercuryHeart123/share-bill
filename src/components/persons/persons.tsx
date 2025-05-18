import {
  IonButton,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonModal,
  IonRow,
} from "@ionic/react";
import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import { personAdd } from "ionicons/icons";
import ExplanModal from "../modal/explanModal";
import { calculateColor } from "../step/step1";

interface PersonProps {
  persons: Person[];
  setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

interface SimplifiedPayments {
  [payer: string]: {
    [receiver: string]: number;
  };
}

const Persons = ({ persons, setPersons, bills, setBills }: PersonProps) => {
  const [addPersonName, setAddPersonName] = React.useState<string>("");
  const [personsModalOpen, setPersonsModalOpen] = React.useState(false);
  const [currentPerson, setCurrentPerson] = React.useState<Person | null>(null);

  const payments = persons.reduce((acc, person) => {
    const all = bills.reduce((acc, bill) => {
      if (bill.payer?.id == person.id || !bill.payer) return acc;

      const sumBill = bill.items.reduce((acc, item) => {
        if (item.persons.some((iPerson) => iPerson === person.id)) {
          const sum = Math.floor((item.sum / item.persons.length) * 100) / 100;
          return acc + sum;
        }
        return acc;
      }, 0);
      acc[bill.payer?.id] = sumBill;
      return acc;
    }, {} as Record<string, number>);
    acc[person.id] = all;
    return acc;
  }, {} as SimplifiedPayments);
  console.log("payments", payments);

  type Transactions = Record<string, Record<string, number>>;

  function simplifyTransactions(transactions: Transactions): Transactions {
    const balance: Record<string, number> = {};

    // Step 1: Calculate net balance for each person
    for (const from in transactions) {
      for (const to in transactions[from]) {
        const amount = transactions[from][to];
        balance[from] = (balance[from] || 0) - amount;
        balance[to] = (balance[to] || 0) + amount;
      }
    }

    // Step 2: Split into debtors and creditors
    const debtors: [string, number][] = [];
    const creditors: [string, number][] = [];

    for (const person in balance) {
      const amount = balance[person];
      if (amount < 0) debtors.push([person, -amount]);
      else if (amount > 0) creditors.push([person, amount]);
    }

    // Step 3: Settle debts
    const result: Transactions = {};

    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const [debtor, debtAmount] = debtors[i];
      const [creditor, creditAmount] = creditors[j];

      const settled = Math.min(debtAmount, creditAmount);

      if (!result[debtor]) result[debtor] = {};
      result[debtor][creditor] = settled;

      debtors[i][1] -= settled;
      creditors[j][1] -= settled;

      if (debtors[i][1] === 0) i++;
      if (creditors[j][1] === 0) j++;
    }

    return result;
  }

  const simplified = simplifyTransactions(payments);
  console.log("simplified", simplified);

  const calculateSum = (payer: string) => {
    const sumDebt = Object.values(simplified[payer])
      .reduce((acc, amount) => acc + amount, 0)
      .toFixed(2);
    return sumDebt + " บาท";
  };
  return (
    <IonGrid>
      {/* Header row with styles and rounded top corners */}
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
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          ชื่อ
        </IonCol>
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          ผู้รับเงิน
        </IonCol>
        <IonCol size="4" sizeMd="4" className="ion-text-center">
          เงินที่ต้องจ่ายทั้งหมด
        </IonCol>
      </IonRow>

      {Object.entries(payments).map(([payer], iIndex) => {
        const person = persons.find((person) => person.id === payer);
        if (!person) return null;

        // Determine even/odd for alternating background colors
        const isEven = iIndex % 2 === 0;
        // Check if last element for bottom border radius
        const isLast = iIndex === Object.entries(payments).length - 1;

        return (
          <IonRow
            key={payer}
            onClick={() => {
              setCurrentPerson(person);
              setPersonsModalOpen(true);
            }}
            style={{
              background: isEven
                ? "var(--ion-color-step-50)"
                : "var(--ion-color-step-100)",
              margin: "4px 0",
              padding: "8px 0",
              cursor: "pointer",
              borderBottomLeftRadius: isLast ? "10px" : "0",
              borderBottomRightRadius: isLast ? "10px" : "0",
            }}
          >
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              <div
                style={{
                  color: calculateColor({
                    color: person.color,
                    isTextColor: true,
                  }),
                }}
              >
                {person.name || "—"}
              </div>
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              {simplified[payer] &&
                Object.entries(simplified[payer]).map(([receiver, amount]) => {
                  const receiverPerson = persons.find(
                    (person) => person.id === receiver
                  );
                  if (!receiverPerson) return null;
                  return (
                    <IonChip
                      key={receiver}
                      style={{
                        backgroundColor: `rgba(${receiverPerson.color}, 0.1)`,
                        color: calculateColor({
                          color: receiverPerson.color,
                          isTextColor: true,
                        }),
                      }}
                    >
                      {receiverPerson.name === ""
                        ? "ยังไม่ได้ระบุชื่อ"
                        : receiverPerson.name}{" "}
                      : {amount} บาท
                    </IonChip>
                  );
                })}
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              {simplified[payer] ? calculateSum(payer) : "เย้ย!! ไม่มีหนี้"}
            </IonCol>
          </IonRow>
        );
      })}

      {/* The last input and button row - keep as is or style separately */}
      <IonRow>
        <IonCol
          size="9"
          sizeMd="9"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonInput
            value={addPersonName}
            type="text"
            inputMode="text"
            placeholder="ชื่อ"
            onIonInput={(e) => {
              const newValue = e.detail.value;
              if (!newValue) return;
              setAddPersonName(newValue);
            }}
            className="ion-text-center"
          />
        </IonCol>
        <IonCol
          size="3"
          sizeMd="3"
          className="ion-text-center ion-align-self-center ion-justify-content-center d-flex"
        >
          <IonButton
            expand="full"
            className="ion-text-center"
            onClick={() => {
              setPersons((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  name: addPersonName,
                  amount: 0,
                  color: `${Math.floor(55 + Math.random() * 200)}, ${
                    55 + Math.floor(55 + Math.random() * 200)
                  }, ${Math.floor(Math.random() * 200)}`,
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

      {/* Modal remains unchanged */}
      <IonModal
        isOpen={personsModalOpen && currentPerson !== null}
        onDidDismiss={() => setPersonsModalOpen(false)}
        breakpoints={[0, 0.5, 0.8]}
        initialBreakpoint={0.5}
      >
        {currentPerson && (
          <ExplanModal
            person={currentPerson}
            onDismiss={() => setPersonsModalOpen(false)}
            bills={bills}
            setBills={setBills}
          />
        )}
      </IonModal>
    </IonGrid>
  );
};

export default Persons;
