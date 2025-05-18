import { IonChip, IonIcon, IonToolbar } from "@ionic/react";
import { pencil, restaurant } from "ionicons/icons";
import React from "react";
import { calculateColor } from "../step/step1";
import { Bill } from "../../pages/Tab2";

interface HeaderProps {
  bill: Bill;
  openBillModal: () => void;
}

const Header = ({ bill, openBillModal }: HeaderProps) => {
  return (
    <IonToolbar>
      <div
        onClick={openBillModal}
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            alignItems: "center",
          }}
        >
          {bill.name}{" "}
          <IonIcon
            style={{
              marginLeft: "10px",
            }}
            icon={pencil}
          />
        </div>
        <IonChip
          style={{
            borderRadius: "10px",
            ...(bill.payer && {
              color: calculateColor({
                color: bill.payer.color,
                isTextColor: true,
              }),
              backgroundColor: calculateColor({
                color: bill.payer.color,
                isTextColor: false,
              }),
            }),
          }}
          color={bill.payer ? "primary" : "danger"}
        >
          <IonIcon
            icon={restaurant}
            style={{
              margin: "0px",

              ...(bill.payer && {
                color: calculateColor({
                  color: bill.payer.color,
                  isTextColor: true,
                }),
                backgroundColor: calculateColor({
                  color: bill.payer.color,
                  isTextColor: false,
                }),
              }),
            }}
          />
          ผู้จ่ายบิลนี้:{" "}
          {bill.payer ? bill.payer.name || "ยังไม่ได้ระบุชื่อ" : "-"}
        </IonChip>
      </div>
    </IonToolbar>
  );
};

export default Header;
