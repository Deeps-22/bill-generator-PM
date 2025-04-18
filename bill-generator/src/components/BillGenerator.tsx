import React from "react";
import "../styles/BillGenerator.scss";
import BillForm from "./BillForm.tsx";

const BillGenerator = () => {
  return (
    <div className="bill-generator">
      <BillForm />
    </div>
  );
};

export default BillGenerator;
