import React from "react";
import { Bill, Person } from "../../pages/Tab2";
import { IonCard, IonCardTitle, IonChip, IonCol, IonRow } from "@ionic/react";
import { calculateColor } from "./step1";
interface Step3Props {
  persons: Person[];
  bills: Bill[];
}

interface SimplifiedPayments {
  [payer: string]: {
    [receiver: string]: number;
  };
}

const Step3 = ({ persons, bills }: Step3Props) => {
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
      acc[bill.payer?.name] = sumBill;
      return acc;
    }, {} as Record<string, number>);
    acc[person.name] = all;
    return acc;
  }, {} as SimplifiedPayments);

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

  return (
    <IonCard>
      <IonCardTitle className="ion-padding">สรุปค่าใช้จ่าย</IonCardTitle>
      {Object.entries(simplified).length === 0 ? (
        <p className="ion-padding">
          No payments needed. All debts are settled.
        </p>
      ) : (
        <>
          <IonRow>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              ผู้จ่าย
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              ผู้รับเงิน
            </IonCol>
            <IonCol size="4" sizeMd="4" className="ion-text-center">
              รวม
            </IonCol>
          </IonRow>
          {Object.entries(simplified).map(([payer, receivers]) => (
            <IonRow key={`${payer}`} className="ion-padding">
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                <IonChip
                  style={{
                    backgroundColor: calculateColor({
                      color:
                        persons.find((person) => person.name === payer)
                          ?.color || "",
                      isTextColor: false,
                    }),
                    color: calculateColor({
                      color:
                        persons.find((person) => person.name === payer)
                          ?.color || "",
                      isTextColor: true,
                    }),
                  }}
                >
                  {payer}
                </IonChip>
              </IonCol>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                {Object.entries(receivers).map(([receiver, amount]) => (
                  <IonChip
                    style={{
                      backgroundColor: calculateColor({
                        color:
                          persons.find((person) => person.name === receiver)
                            ?.color || "",
                        isTextColor: false,
                      }),
                      color: calculateColor({
                        color:
                          persons.find((person) => person.name === receiver)
                            ?.color || "",
                        isTextColor: true,
                      }),
                    }}
                  >
                    {receiver} - ฿{amount.toFixed(2)}
                  </IonChip>
                ))}
              </IonCol>
              <IonCol size="4" sizeMd="4" className="ion-text-center">
                <IonChip
                  style={{
                    backgroundColor: calculateColor({
                      color: "green",
                      isTextColor: false,
                    }),
                    color: calculateColor({
                      color: "green",
                      isTextColor: true,
                    }),
                  }}
                >
                  {Object.values(receivers)
                    .reduce((acc, amount) => acc + amount, 0)
                    .toFixed(2)}{" "}
                  บาท
                </IonChip>
              </IonCol>
            </IonRow>
          ))}
        </>
      )}
    </IonCard>
  );
};

export default Step3;
