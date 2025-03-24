import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Input from "../../components/form/input/InputField";

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

type LineItem = {
  description: string;
  quantity: string;
  um: string;
  unitCost: string;
  total: string;
  jobEquipNotes: string;
  costCode: string;
  payItem: string;
};

export default function Home() {


  const [formData, setFormData] = useState({
    masterPO: false,
    PO: "",
    //Left Section
    date: "",
    vendor: "",
    address1: "",
    attention: "",
    tel: "",
    ext: "",
    email: "",
    holdToShipYes: false,
    holdToShipNo: false,
    pickUp: false,
    shipTo: false,
    driverContact: "",
    driverTel: "",
    siteContact: "",
    siteTel: "",
    address2: "",
    deliveryNotes: "",
    date1: "",
    time1: "",
    date2: "",
    time2: "",
    date3: "",
    time3: "",
    date4: "",
    time4: "",

    //Right Section
    jobNumber: "",
    jobName: "",
    jobTask: "",
    officeContact: "",
    officeTel: "",
    requestedBy: "",
    orderedBy: "",
    rightDate: "",
    rightTime: "",
    coCe: "",
    rightNotes: "",
    approxCost: "",
    amex: false,
    amexText: "",
    cod: false,
    onAccount: false,
    other: false,
    otherText: "",
    taxExemptYes: false,
    taxExemptNo: false,
    vendorQuoteYes: false,
    vendorQuoteNo: false,
    ccPo: "",
    author: "",
    authorSignature: "",
    pmName: "",
    pmSignature: "",
    approvedBy: "",
    approvedDate: "",
    rightBottomNotes: "",

    //Middle and Bottom Section
    lineItems: [
      {
        description: "",
        quantity: "",
        um: "",
        unitCost: "",
        total: "",
        jobEquipNotes: "",
        costCode: "",
        payItem: "",
      },
    ],
    subtotal: "",
    delivery: "",
    salesTax: "",
    bottomOther: "",
    grandTotal: "",
    sign: "",
    signDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLineItemChange = (
    index: number,
    field: keyof LineItem,
    value: string
  ) => {
    const updatedItems = [...formData.lineItems];
    updatedItems[index][field] = value;
    const quantityRaw = updatedItems[index].quantity;
    const unitCostRaw = updatedItems[index].unitCost;

    const quantity = parseFloat(quantityRaw);
    const unitCost = parseFloat(unitCostRaw);

    if (
      !isNaN(quantity) &&
      !isNaN(unitCost) &&
      quantityRaw.trim() !== "" &&
      unitCostRaw.trim() !== ""
    ) {
      updatedItems[index].total = (quantity * unitCost).toFixed(2);
    } else {
      updatedItems[index].total = "0.00"; // fallback
    }
    setFormData({ ...formData, lineItems: updatedItems });
  };

  const generatePdf = async () => {
    const existingPdfBytes = await fetch("/company-template.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPages()[0];

    const draw = (text: string, x: number, y: number) => {
      if (!text || typeof text !== "string") return;
      page.drawText(text, {
        x,
        y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });
    };
    const form = pdfDoc.getForm();
    const drawCheckbox = (
      name: string,
      checked: boolean,
      x: number,
      y: number
    ) => {
      if (checked) {
        page.drawRectangle({
          x: x - 1,
          y: y - 1,
          width: 13,
          height: 13,
          color: rgb(1, 1, 0), // Yellow (R=1, G=1, B=0)
          borderColor: rgb(1, 1, 0),
          borderWidth: 1,
          opacity: 1, // Fully visible
        });
      }

      const checkbox = form.createCheckBox(name);
      checkbox.addToPage(page, { x, y, width: 11, height: 11 });
      if (checked) checkbox.check();
    };

    // 🔧 Estimated coordinates – adjust as needed

    drawCheckbox("checkbox.masterPO", formData.masterPO, 395, 715);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const poText = formData.masterPO ? `${formData.PO} M` : formData.PO;

    page.drawText(poText, {
      x: 510,
      y: 749,
      size: 10,
      font: boldFont,
      color: formData.masterPO ? rgb(1, 0, 0) : rgb(1, 0, 0), // red if masterPO
    });

    draw(formData.date, 78, 703);
    draw(formData.vendor, 78, 688);
    draw(formData.address1, 78, 673);
    draw(formData.attention, 78, 643);
    draw(formData.tel, 78, 628);
    draw(formData.ext, 244, 628);
    draw(formData.email, 78, 613);

    drawCheckbox("checkbox.holdToShipYes", formData.holdToShipYes, 150, 595);
    drawCheckbox("checkbox.holdToShipNo", formData.holdToShipNo, 210, 595);
    drawCheckbox("checkbox.pickUp", formData.pickUp, 42, 580);
    drawCheckbox("checkbox.shipTo", formData.shipTo, 160, 580);

    draw(formData.driverContact, 98, 565);
    draw(formData.driverTel, 215, 565);
    draw(formData.siteContact, 115, 550);
    draw(formData.siteTel, 215, 550);
    draw(formData.address2, 88, 538);
    draw(formData.deliveryNotes, 97, 505);

    const drawHighlightedText = (
      text: string,
      x: number,
      y: number,
      width = 32
    ) => {
      if (!text || text.trim() === "") return;

      page.drawRectangle({
        x: x,
        y: y - 3,
        width,
        height: 11,
        color: rgb(1, 1, 0),
      });

      draw(text, x, y);
    };

    drawHighlightedText(formData.date1, 65, 476);
    drawHighlightedText(formData.time1, 122, 476);
    drawHighlightedText(formData.date2, 65, 462);
    drawHighlightedText(formData.time2, 122, 462);
    drawHighlightedText(formData.date3, 190, 476);
    drawHighlightedText(formData.time3, 250, 476);
    drawHighlightedText(formData.date4, 190, 462);
    drawHighlightedText(formData.time4, 250, 462);

    draw(formData.jobNumber, 400, 703);
    draw(formData.jobName, 400, 688);
    draw(formData.jobTask, 400, 673);
    draw(formData.officeContact, 380, 658);
    draw(formData.officeTel, 495, 658);
    draw(formData.requestedBy, 370, 643);
    draw(formData.orderedBy, 495, 643);
    draw(formData.rightDate, 360, 628);
    draw(formData.rightTime, 495, 628);
    draw(formData.coCe, 360, 613);
    draw(formData.rightNotes, 478, 613);
    draw(formData.approxCost, 360, 596);

    drawCheckbox("checkbox.amex", formData.amex, 462, 595);
    draw(formData.amexText, 508, 596);
    drawCheckbox("checkbox.cod", formData.cod, 318, 579);
    drawCheckbox("checkbox.onAccount", formData.onAccount, 375, 579);
    drawCheckbox("checkbox.other", formData.other, 462, 579);
    draw(formData.otherText, 508, 580);

    drawCheckbox("checkbox.taxExemptYes", formData.taxExemptYes, 462, 564);
    drawCheckbox("checkbox.taxExemptNo", formData.taxExemptNo, 520, 564);

    drawCheckbox("checkbox.vendorQuoteYes", formData.vendorQuoteYes, 462, 549);
    drawCheckbox("checkbox.vendorQuoteNo", formData.vendorQuoteNo, 520, 549);

    draw(formData.ccPo, 395, 538);
    draw(formData.author, 350, 521);
    draw(formData.authorSignature, 498, 521);
    draw(formData.pmName, 350, 505);
    draw(formData.pmSignature, 478, 505);
    draw(formData.approvedBy, 365, 490);
    draw(formData.approvedDate, 525, 490);
    draw(formData.rightBottomNotes, 335, 476);

    const startY = 430;
    const rowHeight = 15;

    formData.lineItems.forEach((item, idx) => {
      const y = startY - idx * rowHeight;
      draw(item.description, 35, y);
      draw(item.quantity, 245, y);
      draw(item.um, 275, y);
      draw(`$${item.unitCost}`, 300, y);
      draw(`$${item.total}`, 340, y);
      draw(item.jobEquipNotes, 390, y);
      draw(item.costCode, 510, y);
      draw(item.payItem, 560, y);
    });

    draw(formData.subtotal, 335, 123);
    draw(formData.delivery, 335, 108);
    draw(formData.salesTax, 335, 93);
    draw(formData.bottomOther, 335, 78);
    draw(formData.grandTotal, 335, 63);

    draw(formData.sign, 33, 28);
    draw(formData.signDate, 270, 28);

    if (formData.taxExemptYes) {
      const extraPdfBytes = await fetch("/tax-exempt.pdf").then((res) =>
        res.arrayBuffer()
      );
      const extraPdf = await PDFDocument.load(extraPdfBytes);
      const copiedPages = await pdfDoc.copyPages(
        extraPdf,
        extraPdf.getPageIndices()
      );

      copiedPages.forEach((page, index) => {
        // Only draw on page 0
        if (index === 0) {
          page.drawText(formData.vendor, {
            x: 100,
            y: 620,
            font,
            size: 11,
          });
          page.drawText(formData.date, {
            x: 430,
            y: 620,
            font,
            size: 11,
          });
          page.drawText(formData.address1, {
            x: 100,
            y: 593,
            font,
            size: 11,
          });
        }

        // ✅ Only add each page once
        pdfDoc.addPage(page);
      });
    }

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadBlob(blob, "PurchaseOrder.pdf");
   
    
  };

  const [uploadedQuotePdf, setUploadedQuotePdf] = useState<File | null>(null);

  return (
    <>
      <PageMeta
        title="Purhcase Order  | Create PDF of the Purchase Order"
        description="Create PDF of the Purchase Order."
      />
      <div className="p-6 w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Purchase Order
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 flex gap-6 items-center">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="masterPO"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Check Box if Master PO</span>
            </label>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="PO"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              PO Number
            </label>
            <Input
              id="PO"
              name="PO"
              placeholder="PO"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <Input
              id="date"
              name="date"
              placeholder="Date"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="vendor"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Vendor
            </label>
            <Input
              id="vendor"
              name="vendor"
              placeholder="Vendor"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="address1"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Address
            </label>
            <Input
              id="address1"
              name="address1"
              placeholder="Address"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="attention"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Attention
            </label>
            <Input
              id="attention"
              name="attention"
              placeholder="Attention"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="tel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Telephone
            </label>
            <Input
              id="tel"
              name="tel"
              placeholder="Tel"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="ext"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Extension
            </label>
            <Input
              id="ext"
              name="ext"
              placeholder="Ext"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 flex flex-wrap gap-6 items-center">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="holdToShipYes"
                checked={formData.holdToShipYes}
                onChange={() =>
                  setFormData({
                    ...formData,
                    holdToShipYes: true,
                    holdToShipNo: false,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Hold till notified to ship: Yes</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="holdToShipNo"
                checked={formData.holdToShipNo}
                onChange={() =>
                  setFormData({
                    ...formData,
                    holdToShipYes: false,
                    holdToShipNo: true,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Hold till notified to ship: No</span>
            </label>

            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="pickUp"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Pick up at location</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="shipTo"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Ship to location</span>
            </label>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="driverContact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Driver Contact
            </label>
            <Input
              id="driverContact"
              name="driverContact"
              placeholder="Driver Contact"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="driverTel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Driver Telephone
            </label>
            <Input
              id="driverTel"
              name="driverTel"
              placeholder="Driver Tel"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="siteContact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Site Contact
            </label>
            <Input
              id="siteContact"
              name="siteContact"
              placeholder="Site Contact (Super)"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="siteTel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Site Telephone
            </label>
            <Input
              id="siteTel"
              name="siteTel"
              placeholder="Site Tel"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="address2"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Address (2)
            </label>
            <Input
              id="address2"
              name="address2"
              placeholder="Address (2)"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-1.5">
            <label
              htmlFor="deliveryNotes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery Notes
            </label>
            <textarea
              id="deliveryNotes"
              name="deliveryNotes"
              placeholder="Delivery Notes"
              rows={2}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>

          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Delivery Dates and Times
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date1"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  1) Date
                </label>
                <Input
                  id="date1"
                  name="date1"
                  placeholder="1) Date"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="time1"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Time
                </label>
                <Input
                  id="time1"
                  name="time1"
                  placeholder="Time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date2"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  3) Date
                </label>
                <Input
                  id="date2"
                  name="date2"
                  placeholder="3) Date"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="time2"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Time
                </label>
                <Input
                  id="time2"
                  name="time2"
                  placeholder="Time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date3"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  2) Date
                </label>
                <Input
                  id="date3"
                  name="date3"
                  placeholder="2) Date"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="time3"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Time
                </label>
                <Input
                  id="time3"
                  name="time3"
                  placeholder="Time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date4"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  4) Date
                </label>
                <Input
                  id="date4"
                  name="date4"
                  placeholder="4) Date"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="time4"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Time
                </label>
                <Input
                  id="time4"
                  name="time4"
                  placeholder="Time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="jobNumber"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job # / Equip #
            </label>
            <Input
              id="jobNumber"
              name="jobNumber"
              placeholder="Job # / Equip #"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="jobName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Name / Equip Name
            </label>
            <select
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">-- Select Job Name --</option>
              <option value="Roundabout">Roundabout</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="jobTask"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Task / Use
            </label>
            <Input
              id="jobTask"
              name="jobTask"
              placeholder="Job Task / Use"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="officeContact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Office Contact
            </label>
            <Input
              id="officeContact"
              name="officeContact"
              placeholder="Office Contact"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="officeTel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Office Telephone
            </label>
            <Input
              id="officeTel"
              name="officeTel"
              placeholder="Tel"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="requestedBy"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Requested By
            </label>
            <Input
              id="requestedBy"
              name="requestedBy"
              placeholder="Requested By"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="orderedBy"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Ordered By
            </label>
            <Input
              id="orderedBy"
              name="orderedBy"
              placeholder="Ordered By"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="rightDate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <Input
              id="rightDate"
              name="rightDate"
              placeholder="Date"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="rightTime"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time
            </label>
            <Input
              id="rightTime"
              name="rightTime"
              placeholder="Time"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="coCe"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              CO / CE #
            </label>
            <Input
              id="coCe"
              name="coCe"
              placeholder="CO / CE #"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="rightNotes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <Input
              id="rightNotes"
              name="rightNotes"
              placeholder="Notes"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="approxCost"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Approx Cost
            </label>
            <Input
              id="approxCost"
              name="approxCost"
              placeholder="Approx Cost"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 flex flex-wrap gap-4 items-center">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="amex"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />{" "}
              AMEX
            </label>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="amexText"
                name="amexText"
                placeholder="AMEX Details"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="cod"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              COD
            </label>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="onAccount"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>On Account</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="other"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Other</span>
            </label>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="otherText"
                name="otherText"
                placeholder="Other Details"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="col-span-2 flex gap-6">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="taxExemptYes"
                checked={formData.taxExemptYes}
                onChange={() =>
                  setFormData({
                    ...formData,
                    taxExemptYes: true,
                    taxExemptNo: false,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Tax Exempt: Yes</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="taxExemptNo"
                checked={formData.taxExemptNo}
                onChange={() =>
                  setFormData({
                    ...formData,
                    taxExemptYes: false,
                    taxExemptNo: true,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Tax Exempt: No</span>
            </label>
          </div>

          <div className="col-span-2 flex gap-6">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="vendorQuoteYes"
                checked={formData.vendorQuoteYes}
                onChange={() =>
                  setFormData({
                    ...formData,
                    vendorQuoteYes: true,
                    vendorQuoteNo: false,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Vendor Quote: Yes</span>
            </label>

            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="vendorQuoteNo"
                checked={formData.vendorQuoteNo}
                onChange={() =>
                  setFormData({
                    ...formData,
                    vendorQuoteYes: false,
                    vendorQuoteNo: true,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span>Vendor Quote: No</span>
            </label>
          </div>
          {formData.vendorQuoteYes && (
            <div
              className="col-span-2 p-4 border-2 border-dashed border-gray-400 rounded text-center cursor-pointer hover:bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type === "application/pdf") {
                  setUploadedQuotePdf(file);
                } else {
                  alert("Please drop a valid PDF file.");
                }
              }}
              onClick={() => document.getElementById("quoteUpload")?.click()}
            >
              <input
                type="file"
                id="quoteUpload"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type === "application/pdf") {
                    setUploadedQuotePdf(file);
                  } else {
                    alert("Please select a valid PDF file.");
                  }
                }}
              />
              {uploadedQuotePdf ? (
                <p className="text-green-600 font-medium">
                  {uploadedQuotePdf.name} uploaded ✅
                </p>
              ) : (
                <p>📄 Drag & drop or click to upload vendor quote PDF</p>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="ccPo"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              CC PO to Grade Team
            </label>
            <Input
              id="ccPo"
              name="ccPo"
              placeholder="CC PO to Grade Team"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="author"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Author
            </label>
            <Input
              id="author"
              name="author"
              placeholder="Author"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="authorSignature"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Author Signature
            </label>
            <Input
              id="authorSignature"
              name="authorSignature"
              placeholder="Author Signature"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="pmName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              PM Name
            </label>
            <Input
              id="pmName"
              name="pmName"
              placeholder="PM Name"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="pmSignature"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              PM Signature
            </label>
            <Input
              id="pmSignature"
              name="pmSignature"
              placeholder="PM Signature"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="approvedBy"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Approved By
            </label>
            <Input
              id="approvedBy"
              name="approvedBy"
              placeholder="Approved By"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="approvedDate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Approved Date
            </label>
            <Input
              id="approvedDate"
              name="approvedDate"
              placeholder="Approved Date"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-1.5">
            <label
              htmlFor="rightBottomNotes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes (bottom)
            </label>
            <textarea
              id="rightBottomNotes"
              name="rightBottomNotes"
              placeholder="Notes (bottom)"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Line Items
            </h4>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {formData.lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4 p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                  >
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`description-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <Input
                        id={`description-${index}`}
                        name={`description-${index}`}
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`quantity-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Quantity
                      </label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        name={`quantity-${index}`}
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`um-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Unit Measure
                      </label>
                      <Input
                        id={`um-${index}`}
                        name={`um-${index}`}
                        placeholder="UM"
                        value={item.um}
                        onChange={(e) =>
                          handleLineItemChange(index, "um", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`unitCost-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Unit Cost
                      </label>
                      <Input
                        id={`unitCost-${index}`}
                        type="number"
                        name={`unitCost-${index}`}
                        placeholder="Unit Cost"
                        value={item.unitCost}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "unitCost",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`total-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Total
                      </label>
                      <Input
                        id={`total-${index}`}
                        name={`total-${index}`}
                        placeholder="Total"
                        value={item.total}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`jobEquipNotes-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Notes
                      </label>
                      <Input
                        id={`jobEquipNotes-${index}`}
                        name={`jobEquipNotes-${index}`}
                        placeholder="Notes"
                        value={item.jobEquipNotes}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "jobEquipNotes",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`costCode-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Cost Code
                      </label>
                      <Input
                        id={`costCode-${index}`}
                        name={`costCode-${index}`}
                        placeholder="Cost Code"
                        value={item.costCode}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "costCode",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={`payItem-${index}`}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Pay Item #
                      </label>
                      <Input
                        id={`payItem-${index}`}
                        name={`payItem-${index}`}
                        placeholder="Pay Item #"
                        value={item.payItem}
                        onChange={(e) =>
                          handleLineItemChange(index, "payItem", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  lineItems: [
                    ...formData.lineItems,
                    {
                      description: "",
                      quantity: "",
                      um: "",
                      unitCost: "",
                      total: "",
                      jobEquipNotes: "",
                      costCode: "",
                      payItem: "",
                    },
                  ],
                })
              }
              className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
            >
              <span className="mr-1">+</span> Add another item
            </button>
          </div>

          <div className="col-span-2 my-6 border-t border-gray-300 dark:border-gray-700"></div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="subtotal"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subtotal
            </label>
            <Input
              id="subtotal"
              name="subtotal"
              placeholder="Subtotal"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="delivery"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery
            </label>
            <Input
              id="delivery"
              name="delivery"
              placeholder="Delivery"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="salesTax"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sales Tax
            </label>
            <Input
              id="salesTax"
              name="salesTax"
              placeholder="Sales Tax"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="bottomOther"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Other
            </label>
            <Input
              id="bottomOther"
              name="bottomOther"
              placeholder="Other"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="grandTotal"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Grand Total
            </label>
            <Input
              id="grandTotal"
              name="grandTotal"
              placeholder="Grand Total"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="sign"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sign
            </label>
            <Input
              id="sign"
              name="sign"
              placeholder="Sign"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="signDate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <Input
              id="signDate"
              name="signDate"
              placeholder="Date"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="button"
            onClick={generatePdf}
            className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 px-6 rounded-md shadow-sm transition-colors font-medium col-span-2 w-full sm:w-auto justify-self-center"
          >
            Download Filled PDF
          </button>
        </form>
       
      </div>
    </>
  );
}
