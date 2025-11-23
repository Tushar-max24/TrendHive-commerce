import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("🧾 TrendHive Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 36);
  doc.text(`Customer Email: ${order.userEmail}`, 14, 42);

  // Table data
  const tableRows = order.items.map((item) => [
    item.name,
    `₹${item.price}`,
    item.qty,
    `₹${item.price * item.qty}`,
  ]);

  // Add table
  autoTable(doc, {
    startY: 50,
    head: [["Product", "Price", "Qty", "Total"]],
    body: tableRows,
  });

  // Total Price
  doc.text(
    `Total Amount: ₹${order.totalAmount}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  doc.save(`Invoice-${order.id}.pdf`);
};
