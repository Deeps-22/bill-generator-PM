import React from "react";
import "../styles/BillPreview.scss";
import DataTable from "react-data-table-component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BillPreview = ({ values }) => {
  const { name, address, phone, eventDate, eventName, eventVenue, items } =
    values;

  const excludedTypes = ["total", "gst", "final"];

  const columns = [
    {
      name: "S.No",
      cell: (row: any, index: number) =>
        !excludedTypes.includes(row.type) && index + 1,
      width: "70px",
      center: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      isSummary: false,
    },
    {
      name: "Amount",
      selector: (row: any) => row.amount,
      isSummary: false,
    },
  ];

  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

  const gstPercentage = 18;

  const gstAmount = (totalAmount * gstPercentage) / 100;

  const finalAmount = totalAmount + gstAmount;

  const tableData = [
    ...items,
    {
      description: "Total",
      amount: totalAmount,
      isSummary: true,
      type: "total",
    },
    {
      description: `GST (${gstPercentage}%)`,
      amount: gstAmount,
      isSummary: true,
      type: "gst",
    },
    {
      description: "Final Amount",
      amount: finalAmount,
      isSummary: true,
      type: "final",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row: any) => row.type === "total",
      style: {
        fontWeight: "bold",
      },
    },
    {
      when: (row: any) => row.type === "gst",
      style: {
        fontWeight: "bold",
      },
    },
  ];
  const downloadPDF = () => {
    const element = document.getElementById("invoice-preview");

    if (element) {
      html2canvas(element, {
        useCORS: true, // Enable CORS to handle external images
        scrollX: 0,
        scrollY: -window.scrollY, // Avoid capturing page scroll
        scale: 2, // High quality for canvas
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("bill_preview.pdf"); // Save the PDF with a name
      });
    }
  };

  return (
    <div className="invoice-preview" id="invoice-preview">
      <div className="invoice-header">
        <div className="logo">Your Logo</div>
        <div className="company-info">
          <h3>Vistara Studios</h3>
        </div>
      </div>

      <div className="invoice-meta">
        <div className="issued-to">
          <p>
            <strong>ISSUED TO:</strong>
            <br />
            {name}
            <br />
            {address}
            <br />
            {phone}
          </p>
        </div>
        <div className="invoice-details">
          <p>
            <strong>INVOICE NO:</strong> {phone}
          </p>
          <p>
            <strong>DATE:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      <div>
        <p>Event Name: {eventName}</p>
        <p>Event Venue: {eventVenue}</p>
        <p>Event Date: {eventDate}</p>
      </div>
      <div className="invoice-table">
        <h5>Billing Details</h5>
        <DataTable
          columns={columns}
          data={tableData}
          style={{ margin: "0 auto", width: "80%" }}
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
      <div className="download-button">
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default BillPreview;
