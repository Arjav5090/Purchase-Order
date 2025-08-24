import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

// import { Modal } from "../../components/ui/modal";
// import AddVendorModalContent from "./Modal";
// import { format, parse } from 'date-fns';
// import { DatePickerDemo } from "./DatePicker";

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
    officeTel: "(973) 925-4021",
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

  const fieldConfigs: { [key: string]: number } = {
    attention: 45,
    ext: 6,
    email: 50,
    deliveryNotes: 75,
    requestedBy: 15,
    orderedBy: 15,
    coCe: 15,
    rightNotes: 75,
    approxCost: 15,
    amexText: 30,
    otherText: 20,
    ccPo: 80,
    author: 18,
    authorSignature: 20,
    address2: 100,
    jobTask: 100,
    pmName: 18,
    pmSignature: 22,
    approvedBy: 20,
    rightBottomNotes: 75,
  };

  // const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // const [vendorDetails, setVendorDetails] = useState<
  //   {
  //     vendor: string;
  //     address1: string;
  //   }[]
  // >([
  //   {
  //     vendor: "Vendor 1",
  //     address1:
  //       "1234 Westwood Drive, Apt 502, Sunset Park Brooklyn, New York 11220, USA",
  //   },
  //   {
  //     vendor: "Vendor 2",
  //     address1:
  //       "5678 Elm Street, Apt 101, Sunset Park Brooklyn, New York 11220, USA",
  //   },
  //   {
  //     vendor: "Vendor 3",
  //     address1:
  //       "91011 Maple Avenue, Apt 202, Sunset Park Brooklyn, New York 11220, USA",
  //   },
  //   {
  //     vendor: "Vendor 4",
  //     address1:
  //       "1213 Oak Lane, Apt 303, Sunset Park Brooklyn, New York 11220, USA",
  //   },
  // ]);

  const jobDetails: {
    jobOrEquip: string;
    jobName: string;
  }[] = [
    {
      jobOrEquip: "20-1209",
      jobName: "Burn",
    },
    { jobOrEquip: "20-1242", jobName: "East 25th" },
    { jobOrEquip: "21-1545", jobName: "HL-45 & HL 46" },
    {
      jobOrEquip: "22-152",
      jobName: "Water Main",
    },
    {
      jobOrEquip: "22-197",
      jobName: "Jernee Mill",
    },
    { jobOrEquip: "22-225", jobName: "Coles" },
    {
      jobOrEquip: "22-231",
      jobName: "Gravesite",
    },
    {
      jobOrEquip: "22-252",
      jobName: "Little Falls",
    },
    {
      jobOrEquip: "22-304",
      jobName: "Thornall",
    },
    { jobOrEquip: "22-312", jobName: "Colonial" },
    { jobOrEquip: "23-286", jobName: "HL-48" },
    {
      jobOrEquip: "23-292",
      jobName: "Roundabout",
    },
    {
      jobOrEquip: "24-115",
      jobName: "Madison",
    },

    {
      jobOrEquip: "24-242",
      jobName: "Main St.",
    },
    { jobOrEquip: "24-311", jobName: "New Providence" },
    { jobOrEquip: "24-302", jobName: "Johnson Park" },
    { jobOrEquip: "24-316", jobName: "Green Lane Park" },
    { jobOrEquip: "24-363", jobName: "Barnegat" },
    { jobOrEquip: "24-371", jobName: "Doty" },
    { jobOrEquip: "24-367", jobName: "Lower Road" },
    { jobOrEquip: "24-380", jobName: "Concrete South" },
    { jobOrEquip: "24-417", jobName: "Glenside" },
    { jobOrEquip: "25-154", jobName: "Rt. 15" },
    { jobOrEquip: "25-119", jobName: "Johnson Hackensack" },
  ];

  // const taxExemptFiles: { [jobOrEquip: string]: string } = {
  //   "20-1209": "/tax-exempt/20-1209 ST-13 BLANK Burn Building.pdf",
  //   "20-1242": "/tax-exempt/20-1242 ST-13 BLANK East 25th.pdf",
  //   "21-1545": "/tax-exempt/21-1545 ST-13 BLANK Bridge HL-45 & 46.pdf",
  //   "22-152": "/tax-exempt/22-152 ST-13 BLANK Water Main.pdf",
  //   "22-173": "/tax-exempt/22-173 ST-13 BLANK Downtown Streetscape.pdf",
  //   "22-197": "/tax-exempt/22-197 ST-13 BLANK Jernee Mill.pdf",
  //   "22-231": "/tax-exempt/22-231 ST-13 BLANK Gravesite.pdf",
  //   "22-252": "/tax-exempt/22-252 ST-13 BLANK Downtown Streetscape 3.pdf",
  //   "22-304": "/tax-exempt/22-304 ST-13 BLANK Thornall St.pdf",
  //   "22-312": "/tax-exempt/22-312 ST-13 BLANK Colonial Dr.pdf",
  //   "23-286": "/tax-exempt/23-286 ST-13 BLANK Bridge X-48.pdf",
  //   "23-292": "/tax-exempt/23-292 ST-13 BLANK Roundabout Princeton.pdf",
  //   "24-115": "/tax-exempt/24-115 ST-13 BLANK Madison St.pdf",
  //   "24-242": "/tax-exempt/24-242 ST-13 BLANK Main St.pdf",
  //   "24-302": "/tax-exempt/24-302 ST-13 BLANK Johnson Park Field 8.pdf",
  //   "24-308": "/tax-exempt/24-308 ST-13 BLANK South Maintenance.pdf",
  //   "24-311": "/tax-exempt/24-311 ST-13 BLANK New Providence Bridge.pdf",
  //   "24-316": "/tax-exempt/24-316 ST-13 BLANK Green Lane.pdf",
  //   "24-363": "/tax-exempt/24-363 ST-13 BLANK Barnegat Branch Trail.pdf",
  //   "24-367": "/tax-exempt/24-367 ST-13 BLANK Lower Minor Road.pdf",
  //   "24-371": "/tax-exempt/24-371 ST-13 BLANK Doty Road.pdf",
  //   "24-417": "/tax-exempt/24-417 ST-13 BLANK Glenside Ave.pdf",
  //   "25-119": "/tax-exempt/25-119 ST-13 BLANK Johnson Park Sports Complex.pdf",
  //   "25-154": "/tax-exempt/25-154 ST-13 BLANK Route 15 Bridge.pdf",
  //   // Optional fallback
  //   default: "",
  // };
  type TeamMemberOption = {
    value: string;
    label: string;
    phone: string;
  };

  const teamMembers: TeamMemberOption[] = [
    { value: "Aditya N", label: "Aditya (Adi) Nakrani", phone: "201-566-1941" },
    {
      value: "Christopher S",
      label: "Christopher Squirlock",
      phone: "973-567-8462",
    },
    { value: "Maria S", label: "Maria Squirlock", phone: "201-396-4379" },
    { value: "Mohit R", label: "Mohit Ruhil", phone: "201-421-5426" },
    { value: "Nimanshu B", label: "Nimanshu Bhanderi", phone: "551-263-5975" },
    { value: "Ralph D", label: "Ralph Diaco", phone: "973-766-4942" },
    { value: "Michael L", label: "Michael Loia", phone: "973-907-3365" },
    { value: "Rissa P", label: "Rissa Privitera", phone: "516-459-7860" },
    { value: "Robert J", label: "Robert (Bob) Janecek", phone: "551-427-2639" },
    { value: "Pablo S", label: "Pablo Sousa", phone: "973-951-9323" },
    { value: "Henil S", label: "Henil Shah", phone: "551-286-8867" },
    { value: "Dev M", label: "Dev Moradia", phone: "973-600-0240" },
    { value: "Deep S", label: "Deep Shah", phone: "973-634-3120" },
    { value: "Goncalo D", label: "Goncalo (G) Duarte", phone: "201-638-9888" },
    {
      value: "Adenilson F",
      label: "Adenilson (Nilson) Fernandes",
      phone: "973-907-4441",
    },
    { value: "Anderson F", label: "Anderson Fonseca", phone: "973-494-1977" },
    {
      value: "Edilson D",
      label: "Edilson (Eddie) DaSilva",
      phone: "973-524-0838",
    },
    { value: "Joao C", label: "Joao (John) Corticeiro", phone: "973-303-6537" },
    { value: "Patrick A", label: "Patrick Araujo", phone: "973-900-0717" },
    { value: "Luigi C", label: "Luigi Catalanotto", phone: "973-951-6354" },
    {
      value: "Manuel C",
      label: "Manuel (Anthony) Castro",
      phone: "484-588-1741",
    },
    {
      value: "Humberto D",
      label: "Humberto DeCarvalho",
      phone: "732-912-9066",
    },
    { value: "Jamie P", label: "Jamie Phemsint", phone: "201-681-2712" },
    { value: "John L", label: "John LaRiccia", phone: "201-888-4033" },
    { value: "Mario C", label: "Mario Costa", phone: "732-766-4838" },
    { value: "Victor P", label: "Victor Pinho", phone: "908-838-6505" },
  ];

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
      updatedItems[index].total = ""; // fallback
    }
    setFormData({ ...formData, lineItems: updatedItems });
  };

  useEffect(() => {
    // Calculate Subtotal (sum of all line item totals)
    const subtotal = formData.lineItems.reduce((acc, item) => {
      return acc + (parseFloat(item.total) || 0);
    }, 0);

    // Ensure delivery, salesTax, and other default to 0 unless user changes them
    const delivery = parseFloat(formData.delivery) || 0;
    const salesTax = parseFloat(formData.salesTax) || 0;
    const other = parseFloat(formData.bottomOther) || 0;

    // Calculate Grand Total
    const grandTotal = subtotal + delivery + salesTax + other;

    // Update formData with new calculated values
    setFormData((prevState) => ({
      ...prevState,
      subtotal: subtotal > 0 ? subtotal.toFixed(2) : "",
      grandTotal: grandTotal > 0 ? grandTotal.toFixed(2) : "",
    }));
  }, [
    formData.lineItems,
    formData.delivery,
    formData.salesTax,
    formData.bottomOther,
  ]);

  const generatePdf = async () => {
    const existingPdfBytes = await fetch("/assets/company-template.pdf").then(
      (res) => res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPages()[0];

    const drawWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight = 15
    ): number => {
      if (!text || typeof text !== "string") return 0;

      let line = "";
      let offsetY = 0;
      let linesUsed = 0;

      const splitLongWord = (word: string): string[] => {
        const chars = word.split("");
        let part = "";
        const parts = [];

        for (let char of chars) {
          const testPart = part + char;
          const width = font.widthOfTextAtSize(testPart, 8);
          if (width > maxWidth && part !== "") {
            parts.push(part);
            part = char;
          } else {
            part = testPart;
          }
        }
        if (part) parts.push(part);
        return parts;
      };

      const words = text.split(" ");

      for (let word of words) {
        const testLine = line + word + " ";
        const testWidth = font.widthOfTextAtSize(testLine, 8);

        if (testWidth > maxWidth && line !== "") {
          page.drawText(line.trim(), {
            x,
            y: y - offsetY,
            size: 8,
            font,
            color: rgb(0, 0, 0),
          });
          line = "";
          offsetY += lineHeight;
          linesUsed++;
        }

        if (font.widthOfTextAtSize(word, 8) > maxWidth) {
          const parts = splitLongWord(word);
          for (let part of parts) {
            if (
              font.widthOfTextAtSize(line + part, 8) > maxWidth &&
              line !== ""
            ) {
              page.drawText(line.trim(), {
                x,
                y: y - offsetY,
                size: 8,
                font,
                color: rgb(0, 0, 0),
              });
              line = "";
              offsetY += lineHeight;
              linesUsed++;
            }
            line += part;
          }
          line += " ";
        } else {
          line += word + " ";
        }
      }

      if (line.trim()) {
        page.drawText(line.trim(), {
          x,
          y: y - offsetY,
          size: 8,
          font,
          color: rgb(0, 0, 0),
        });
        linesUsed++;
      }

      return linesUsed;
    };
    const drawWrappedJob = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      initialFontSize = 10,
      minFontSize = 5,
      color = rgb(0, 0, 0)
    ): void => {
      if (!text || typeof text !== "string") return;

      let fontSize = initialFontSize;
      let textWidth = font.widthOfTextAtSize(text, fontSize);

      // Reduce font size until it fits or hits the minimum
      while (textWidth > maxWidth && fontSize > minFontSize) {
        fontSize -= 0.5;
        textWidth = font.widthOfTextAtSize(text, fontSize);
      }

      // Draw the resized text
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color,
      });
    };

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
    const rowHeight = 14.5;

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
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";

      const [year, month, day] = dateStr.split("-").map(Number);

      // Check if the date is valid
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return ""; // Invalid date
      }

      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      const yy = String(year).slice(-2);
      return `${mm}/${dd}/${yy}`;
    };
    // Optional - handles MM/DD/YYYY if needed
    const formattedDate = (dateStr: string) => {
      if (!dateStr) return "";

      const [year, month, day] = dateStr.split("-").map(Number);

      // Check if the date is valid
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return ""; // Invalid date
      }

      // Create date in local time (month is 0-indexed)
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };
    function formatPhone(rawTel: string = "") {
      const digits = rawTel.replace(/\D/g, "").slice(0, 10);
      if (digits.length < 10) return ""; // fallback if incomplete
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    drawWrappedText(formattedDate(formData.date), 78, 703, 180);
    draw(formData.vendor, 78, 688);
    // draw(formData.address1, 78, 673);
    drawWrappedText(formData.address1, 78, 673, 180);
    draw(formData.attention, 78, 643);
    draw(formatPhone(formData.tel), 78, 628);
    draw(formData.ext, 244, 628);
    draw(formData.email, 78, 613);

    drawCheckbox("checkbox.holdToShipYes", formData.holdToShipYes, 150, 595);
    drawCheckbox("checkbox.holdToShipNo", formData.holdToShipNo, 210, 595);
    drawCheckbox("checkbox.pickUp", formData.pickUp, 42, 580);
    drawCheckbox("checkbox.shipTo", formData.shipTo, 160, 580);

    draw(formData.driverContact, 98, 565);
    draw(formatPhone(formData.driverTel), 215, 565);
    draw(formData.siteContact, 115, 550);
    draw(formatPhone(formData.siteTel), 215, 550);
    drawWrappedText(formData.address2, 88, 538, 180);
    draw(formData.deliveryNotes, 97, 507);

    const drawHighlightedText = (
      text: string | undefined,
      x: number,
      y: number,
      width = 30
    ) => {
      if (!text || text.trim() === "") return;

      page.drawRectangle({
        x: x,
        y: y - 3,
        width,
        height: 10,
        color: rgb(1, 1, 0),
      });

      draw(text, x, y);
    };

    const formatTime12Hour = (timeStr: string) => {
      if (!timeStr || !timeStr.includes(":")) return "";
      const [hourStr, minuteStr] = timeStr.split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;

      return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    drawHighlightedText(formatDate(formData.date1), 65, 476);
    drawHighlightedText(formatTime12Hour(formData.time1), 122, 476);
    drawHighlightedText(formatDate(formData.date2), 65, 462);
    drawHighlightedText(formatTime12Hour(formData.time2), 122, 462);
    drawHighlightedText(formatDate(formData.date3), 190, 476);
    drawHighlightedText(formatTime12Hour(formData.time3), 250, 476);
    drawHighlightedText(formatDate(formData.date4), 190, 462);
    drawHighlightedText(formatTime12Hour(formData.time4), 250, 462);

    draw(formData.jobNumber, 400, 703);
    drawWrappedJob(formData.jobName, 400, 688, 180, 10, 5, rgb(0, 0, 0));
    draw(formData.jobTask, 400, 673);
    draw(formData.officeContact, 380, 658);
    draw(formatPhone(formData.officeTel), 495, 658);
    draw(formData.requestedBy, 370, 643);
    draw(formData.orderedBy, 495, 643);
    draw(formatDate(formData.rightDate), 360, 628);
    draw(formData.rightTime, 495, 628);
    draw(formData.coCe, 360, 613);
    draw(formData.rightNotes, 478, 613);
    draw(formData.approxCost, 360, 596);

    drawCheckbox("checkbox.amex", formData.amex, 462, 595);
    draw(formData.amexText, 505, 596);
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
    draw(formatDate(formData.approvedDate), 525, 490);
    draw(formData.rightBottomNotes, 335, 476);

    const formatUSD = (value: string | number): string => {
      const number = parseFloat(value as string);
      if (isNaN(number) || number <= 0) return "";

      const isWhole = number % 1 === 0;

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: isWhole ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(number);
    };

    const drawShrinkToFit = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      baseFontSize: number = 10,
      minFontSize: number = 4
    ) => {
      if (!text) return;

      let fontSize = baseFontSize;
      let width = font.widthOfTextAtSize(text, fontSize);

      while (width > maxWidth && fontSize > minFontSize) {
        fontSize -= 0.5;
        width = font.widthOfTextAtSize(text, fontSize);
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: font,
      });
    };

    const startY = 429;
    let currentY = startY;
    // drawWrappedText should return at least 1, even if text fits in one line
    const drawWrappedtext = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
      fontSize: number = 10
    ): number => {
      if (!text) return 1;

      const words = text.split(/\s+/);
      let line = "";
      let linesUsed = 0;

      for (let i = 0; i < words.length; i++) {
        const testLine = line ? `${line} ${words[i]}` : words[i];
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth <= maxWidth) {
          line = testLine;
        } else {
          page.drawText(line, {
            x,
            y: y - linesUsed * lineHeight,
            size: fontSize,
            font: font,
          });
          linesUsed++;
          line = words[i];
        }
      }

      // Draw the last line
      if (line) {
        page.drawText(line, {
          x,
          y: y - linesUsed * lineHeight,
          size: fontSize,
          font: font,
        });
        linesUsed++;
      }

      return linesUsed; // Don't add +1 outside
    };

    formData.lineItems.forEach((item) => {
      const linesUsed = drawWrappedtext(
        item.description,
        35,
        currentY,
        180,
        rowHeight
      ); // Description can still wrap

      drawShrinkToFit(item.quantity, 245, currentY, 20);
      drawShrinkToFit(item.um, 276, currentY, 15);
      drawShrinkToFit(formatUSD(item.unitCost), 294, currentY, 35);
      drawShrinkToFit(formatUSD(item.total), 334, currentY, 35);

      drawShrinkToFit(item.jobEquipNotes, 390, currentY, 100);
      drawShrinkToFit(item.costCode, 510, currentY, 40);
      drawShrinkToFit(item.payItem, 560, currentY, 40);

      // Only description wraps, so use its height
      currentY -= linesUsed * rowHeight;
    });

    // formData.lineItems.forEach((item, idx) => {
    //   const y = startY - idx * rowHeight;
    //   draw(item.description, 35, y);
    //   draw(item.quantity, 245, y);
    //   draw(item.um, 275, y);
    //   draw(`$${item.unitCost}`, 300, y);
    //   draw(`$${item.total}`, 340, y);
    //   draw(item.jobEquipNotes, 390, y);
    //   draw(item.costCode, 510, y);
    //   draw(item.payItem, 560, y);
    // });

    const formattedSubtotal = formatUSD(formData.subtotal);
    if (formattedSubtotal) drawShrinkToFit(formattedSubtotal, 332, 123, 40);

    const formattedDelivery = formatUSD(formData.delivery);
    if (formattedDelivery) drawShrinkToFit(formattedDelivery, 332, 108, 40);

    const formattedSalesTax = formatUSD(formData.salesTax);
    if (formattedSalesTax) drawShrinkToFit(formattedSalesTax, 332, 93, 40);

    const formattedBottomOther = formatUSD(formData.bottomOther);
    if (formattedBottomOther)
      drawShrinkToFit(formattedBottomOther, 332, 78, 40);

    const formattedGrandTotal = formatUSD(formData.grandTotal);
    if (formattedGrandTotal) drawShrinkToFit(formattedGrandTotal, 332, 63, 40);

    draw(formData.sign, 33, 28);
    draw(formatDate(formData.signDate), 270, 28);

    const taxExemptDataByJob: {
      [jobNumber: string]: {
        governmentEntity: string;
        address1: string;
        address2: string;
        category:
          | "Governmental Entity"
          | "Exempt Organization"
          | "Qualified Housing Sponsor";
        exemptNumber?: string;
        formVersion: "R-13" | "R-8"; // Add to each job entry
      };
    } = {
      "20-1209": {
        governmentEntity: "County of Hunterdon",
        address1: "71 Main Street, Administration Bldg, Flemington, NJ 08822",
        address2:
          "Construction of Burn Building and Site Work for the Hunterdon County Emergency Services Training Center",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "20-1242": {
        governmentEntity: "City of Bayonne, Borough Hall",
        address1: "25 W. 38th Street, Bayonne, NJ 07002",
        address2: "316 Avenue E (adjacent to jobsite), Bayonne, NJ 07002",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "21-1545": {
        governmentEntity:
          "County of Monmouth Department of Public Works & Engineering",
        address1: "One East Main Street, Freehold, NJ 07728",
        address2:
          "Replacement Of Bridge HL-45 & HL 46, 137 Allaire Road, Howell, NJ 07727",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "22-152": {
        governmentEntity: "Passaic Valley Water Commission",
        address1: "1525 Main Avenue, Clifton NJ 07011",
        address2:
          "Water Transmission Main Improvements Industrial Loop, (3 locations - no street addresses), Paterson, NJ",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "22-173": {
        governmentEntity: "Township of Little Falls",
        address1: "225 Main Street, Little Falls, NJ 07424",
        address2:
          "Downtown Streetscape Improvements Section 4 - 44 Main Street, Little Falls, NJ 07424",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "22-197": {
        governmentEntity: "County of Middlesex",
        address1: "75 Bayard Street, New Brunswick NJ 08901",
        address2:
          "22-197 Replace Culvert 3-C-73 Jernee Mill Road, 575 Jernee Mill Rd, Sayreville NJ 08872",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "22-231": {
        governmentEntity: "The Department of Military & Veterans Affairs",
        address1: "PO Box 340, Trenton, NJ 08625-0340",
        category: "Exempt Organization",
        exemptNumber: "216000928",
        address2:
          "Gravesite Expansion & Site Improvements at William Doyle Cemetery - 350 Province Line Rd, Wrightstown, NJ 08562",
        formVersion: "R-8",
      },

      "22-252": {
        governmentEntity: "Township of Little Falls",
        address1: "225 Main Street, Little Falls, NJ 07424",
        address2:
          "SECTION 3 Downtown Streetscape Improvements - 44 Main Street, Little Falls, NJ 07424",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "22-304": {
        governmentEntity: "County of Middlesex",
        address1: "75 Bayard Street, New Brunswick NJ 08901",
        address2:
          "Replacement of Culvert 1-C-87 Thornall St Over Tributary of Rahway River - 561 Thornall Street, Edison, New Jersey 08837",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "22-312": {
        governmentEntity: "County of Ocean",
        address1: "101 Hooper Avenue, Toms River, NJ 08753",
        address2:
          "Replacement of Colonial Drive Bridges - 21 Colonial Drive, Manchester, New Jersey 08759",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "23-286": {
        governmentEntity: "County of Sussex",
        address1: "One Spring Street, Newton, NJ 07860",
        address2:
          "Replacement of Sussex County Bridge X-48, 1198 NJ-23, Wantage, NJ 07461",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "23-292": {
        governmentEntity: "Mercer County",
        address1: "640 South Broad Street, Trenton, NJ 08650",
        address2: "1738 Princeton Ave, Lawrence Township, NJ 08650",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "24-115": {
        governmentEntity: "North Hudson Sewerage Authority",
        address1: "1600 Adams Street, Hoboken, NJ 07030",
        category: "Governmental Entity",
        address2:
          "Madison Street area Infrastructure Improvements Phase 2 - 824 Madison Street, Hoboken, NJ 07030",
        formVersion: "R-13",
      },
      "24-242": {
        governmentEntity: "County of Middlesex",
        address1: "75 Bayard Street, New Brunswick, NJ 08954",
        address2:
          "Improvements to the Intersection of Main St (RT 670) and Crossman Rd - 14 Crossman Road, Sayreville, NJ 08872",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-302": {
        governmentEntity: "Byram Township",
        address1: "10 Mansfield Drive, Stanhope, NJ 07874",
        address2:
          "Johnson Park Field 8 Reconstruction - 117 Roseville Rd, Byram Township, New Jersey 07821",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-311": {
        governmentEntity: "Borough of New Providence",
        address1: "360 Elkwood Avenue, New Providence, NJ 07974",
        address2:
          "Bridge at New Providence Community Pool Replacement - 1378 Springfield Ave, New Providence, NJ 07974",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-316": {
        governmentEntity: "Union County Improvement Authority",
        address1: "10 Elizabeth town Plaza, 5th Floor, Elizabeth, NJ 07207",
        address2:
          "Green Lane Park Improvements - 520 Green Lane, Union, New Jersey 07083",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-363": {
        governmentEntity: "County of Ocean",
        address1: "101 Hooper Avenue, Toms River, NJ 08753",
        address2:
          "Barnegat Branch Trail Phase IX Construction - 225 Atlantic City Blvd, Toms River, NJ 08757",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-367": {
        governmentEntity: "County of Union",
        address1: "2325 South Avenue, Scotch Plains, NJ 07076",
        address2:
          "Replacement of Lower Minor Road Bridge (Li-63) - 1301 Lower Road, Linden, NJ 07036",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-371": {
        governmentEntity: "County of Passaic",
        address1: "401 Grand Street, Paterson, NJ 07505",
        address2:
          "Replacement of Doty Road Bridge - 140 Doty Road, Haskell, NJ 07420",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-380": {
        governmentEntity: "NJ Department of Transportation",
        address1: "1035 Parkway Avenue, Trenton, NJ 08625",
        address2:
          "Maintenance Concrete Structural Repair - South, 2025, South Region, NJ",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "24-417": {
        governmentEntity: "Union County Improvement Authority",
        address1: "10 Elizabeth town Plaza, 5th Floor, Elizabeth, NJ 07207",
        address2:
          "Glenside Avenue Park Improvements - 175 Glenside Avenue, Scotch Plains, NU 07076",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
      "25-119": {
        governmentEntity: "City of Hackensack",
        address1: "65 Central Avenue, Hackensack, NJ 07601",
        address2:
          "Johnson Park Sports Complex Site/Utility Improvements - 452 River St, Hackensack, NJ 07601",
        category: "Governmental Entity",
        formVersion: "R-8",
      },
      "25-154": {
        governmentEntity: "NJ Department of Transportation",
        address1: "1035 Parkway Avenue, Trenton, NJ 08625",
        address2:
          "Route 15 Bridge Replacement Over Paulins Kill - 115 Lafayette Road, Lafayette, NJ 07848",
        category: "Governmental Entity",
        formVersion: "R-13",
      },
    };
    type Category =
      | "Governmental Entity"
      | "Exempt Organization"
      | "Qualified Housing Sponsor";
    type FormVersion = "R-13" | "R-8";

    type Coordinate = { x: number; y: number };

    const formCoordinatesMap: Record<
      FormVersion,
      {
        vendor: Coordinate;
        date: Coordinate;
        address1: Coordinate;
        common: {
          address2: Coordinate;
        };
        governmentalEntity: {
          governmentEntity: Coordinate;
          address1: Coordinate;
        };
        exemptOrganization: {
          governmentEntity: Coordinate;
          address1: Coordinate;
          exemptNumber: Coordinate;
        };
        qualifiedHousingSponsor: {
          governmentEntity: Coordinate;
          address1: Coordinate;
        };
        cross: Record<Category, Coordinate>;
        staticDetails: Coordinate[];
        signature: { x: number; y: number; width: number; height: number };
      }
    > = {
      "R-13": {
        vendor: { x: 100, y: 633 },
        date: { x: 445, y: 633 },
        address1: { x: 100, y: 603 },
        common: {
          address2: { x: 75, y: 190 },
        },
        governmentalEntity: {
          governmentEntity: { x: 270, y: 343 },
          address1: { x: 270, y: 320 },
        },
        exemptOrganization: {
          governmentEntity: { x: 270, y: 440 },
          address1: { x: 270, y: 419 },
          exemptNumber: { x: 270, y: 395 },
        },
        qualifiedHousingSponsor: {
          address1: { x: 270, y: 268 },
          governmentEntity: { x: 270, y: 246 },
        },
        cross: {
          "Governmental Entity": { x: 76, y: 362 },
          "Exempt Organization": { x: 77, y: 460 },
          "Qualified Housing Sponsor": { x: 76, y: 286 },
        },
        staticDetails: [
          { x: 425, y: 700 },
          { x: 165, y: 143 },
          { x: 165, y: 113 },
        ],
        signature: {
          x: 160,
          y: 87,
          width: 100,
          height: 12,
        },
      },
      "R-8": {
        vendor: { x: 95, y: 620 },
        date: { x: 440, y: 620 },
        address1: { x: 95, y: 590 },
        common: {
          address2: { x: 66, y: 210 },
        },
        governmentalEntity: {
          governmentEntity: { x: 255, y: 360 },
          address1: { x: 255, y: 338 },
        },
        exemptOrganization: {
          governmentEntity: { x: 255, y: 458 },
          address1: { x: 255, y: 436 },
          exemptNumber: { x: 255, y: 414 },
        },
        qualifiedHousingSponsor: {
          address1: { x: 255, y: 285 },
          governmentEntity: { x: 255, y: 263 },
        },
        cross: {
          "Governmental Entity": { x: 66, y: 380 },
          "Exempt Organization": { x: 68, y: 476 },
          "Qualified Housing Sponsor": { x: 67, y: 303 },
        },
        staticDetails: [
          { x: 400, y: 680 },
          { x: 153, y: 150 },
          { x: 153, y: 120 },
        ],
        signature: {
          x: 155,
          y: 90,
          width: 100,
          height: 12,
        },
      },
    };

    if (formData.taxExemptYes) {
      // Determine the correct PDF form and coordinates
      const extraData = taxExemptDataByJob[formData.jobNumber];
      const formVersion = extraData?.formVersion || "R-13";
      const coords = formCoordinatesMap[formVersion];

      const taxExemptPdfPath = `/assets/tax-exempt/tax-exempt-${formVersion}.pdf`;

      const extraPdfBytes = await fetch(taxExemptPdfPath).then((res) =>
        res.arrayBuffer()
      );
      const extraPdf = await PDFDocument.load(extraPdfBytes);
      const copiedPages = await pdfDoc.copyPages(
        extraPdf,
        extraPdf.getPageIndices()
      );

      const signatureBytes = await fetch(
        "/assets/tax-exempt/CS Signature for Tax Cert.jpg"
      ).then((res) => res.arrayBuffer());
      const signatureImage = await pdfDoc.embedJpg(signatureBytes);

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      copiedPages.forEach((page, index) => {
        if (index === 0) {
          // Vendor and top section
          page.drawText(formData.vendor, { ...coords.vendor, font, size: 9 });
          page.drawText(formatDate(formData.date), {
            ...coords.date,
            font,
            size: 9,
          });
          page.drawText(formData.address1, {
            ...coords.address1,
            font,
            size: 9,
          });

          // Tax-exempt data
          if (extraData) {
            const {
              category,
              address1,
              address2,
              governmentEntity,
              exemptNumber,
            } = extraData;

            page.drawText(address2, {
              ...coords.common.address2,
              font,
              size: 9,
            });

            if (category === "Exempt Organization") {
              page.drawText(governmentEntity, {
                ...coords.exemptOrganization.governmentEntity,
                font,
                size: 9,
              });
              page.drawText(address1, {
                ...coords.exemptOrganization.address1,
                font,
                size: 9,
              });
              if (exemptNumber) {
                page.drawText(exemptNumber, {
                  ...coords.exemptOrganization.exemptNumber,
                  font,
                  size: 9,
                });
              }
            }

            if (category === "Qualified Housing Sponsor") {
              page.drawText(address1, {
                ...coords.qualifiedHousingSponsor.address1,
                font,
                size: 9,
              });
              page.drawText(governmentEntity, {
                ...coords.qualifiedHousingSponsor.governmentEntity,
                font,
                size: 9,
              });
            }

            if (category === "Governmental Entity") {
              page.drawText(governmentEntity, {
                ...coords.governmentalEntity.governmentEntity,
                font,
                size: 9,
              });
              page.drawText(address1, {
                ...coords.governmentalEntity.address1,
                font,
                size: 9,
              });
            }

            // Draw checkbox X
            const crossCoord = coords.cross[category];
            page.drawText("x", {
              ...crossCoord,
              font,
              size: 12,
            });
          }

          // Static company details
          const staticTexts = [
            "03-0502857/000",
            "Diaco Contracting Inc DBA Grade Construction",
            "110 Pennsylvania Avenue, Paterson, NJ 07503",
          ];

          staticTexts.forEach((text, i) => {
            page.drawText(text, {
              ...coords.staticDetails[i],
              font,
              size: 9,
            });
          });

          // Signature image
          page.drawImage(signatureImage, {
            ...coords.signature,
          });
        }

        pdfDoc.addPage(page);
      });
    }

    if (formData.vendorQuoteYes && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const fileType = file.type;
    
        if (fileType === 'application/pdf') {
          const fileBytes = await file.arrayBuffer();
          const filePdf = await PDFDocument.load(fileBytes);
          const pages = await pdfDoc.copyPages(filePdf, filePdf.getPageIndices());
          pages.forEach((page) => {
            pdfDoc.addPage(page);
          });
        } else if (fileType.startsWith('image/')) {
          const imageBytes = await file.arrayBuffer();
          let embeddedImage;
    
          if (fileType === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else if (fileType === 'image/jpeg') {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          }
    
          if (embeddedImage) {
            const page = pdfDoc.addPage();
            const { width, height } = embeddedImage.scale(0.5);
            page.drawImage(embeddedImage, {
              x: 50,
              y: page.getHeight() - height - 50,
              width,
              height,
            });
          }
        } else {
          console.warn(`Unsupported file type: ${fileType}`);
        }
      }
    }

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadBlob(blob, "PurchaseOrder.pdf");
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
 
  function formatPhone(value: string = "") {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    const parts = [];
    if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
    if (digits.length >= 4) parts.push(") " + digits.slice(3, 6));
    if (digits.length >= 7) parts.push("-" + digits.slice(6));

    return parts.join("");
  }

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
              type="number"
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
              type="date"
              placeholder="Date"
              onChange={handleChange}
              min="1900-01-01"
              max="2099-12-31"
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

            <input
              type="text"
              id="vendor"
              value={formData.vendor}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, vendor: e.target.value }))
              }
              placeholder="Enter vendor name"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            {/* <Select
              placeholder="Select a vendor"
              value={formData.vendor} // Control the Select with formData.vendor
              options={[
                ...vendorDetails.map((vendor) => ({
                  label: vendor.vendor,
                  value: vendor.vendor,
                })),
                { label: "+ Add Vendor", value: "__add_vendor__" },
              ]}
              onChange={(value) => {
                if (value === "__add_vendor__") {
                  if (!isAddVendorModalOpen) {
                    setIsAddVendorModalOpen(true);
                  }
                  return;
                }

                const selectedVendor = vendorDetails.find(
                  (vendor) => vendor.vendor === value
                );
                if (selectedVendor) {
                  setFormData({
                    ...formData,
                    vendor: selectedVendor.vendor,
                    address1: selectedVendor.address1,
                  });
                } else {
                  // Reset formData if an invalid value is selected
                  setFormData((prev) => ({
                    ...prev,
                    vendor: "",
                    address1: "",
                  }));
                }
              }}
            /> */}

            {/* <Modal
              isOpen={isAddVendorModalOpen}
              onClose={() => {
                setIsAddVendorModalOpen(false);
                setFormData((prev) => ({
                  ...prev,
                  vendor: vendorDetails.some((v) => v.vendor === prev.vendor)
                    ? prev.vendor
                    : "", // Reset vendor if it was "__add_vendor__" or invalid
                  address1: vendorDetails.some((v) => v.vendor === prev.vendor)
                    ? prev.address1
                    : "",
                }));
              }}
            >
              <AddVendorModalContent
                onClose={() => {
                  setIsAddVendorModalOpen(false);
                  setFormData((prev) => ({
                    ...prev,
                    vendor: vendorDetails.some((v) => v.vendor === prev.vendor)
                      ? prev.vendor
                      : "",
                    address1: vendorDetails.some(
                      (v) => v.vendor === prev.vendor
                    )
                      ? prev.address1
                      : "",
                  }));
                }}
                onVendorAdded={(newVendor) => {
                  setVendorDetails((prev) => [...prev, newVendor]);
                  setIsAddVendorModalOpen(false);
                }}
              />
            </Modal> */}
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
              value={formData.address1}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <LimitedInput
            name="attention"
            label="Attention"
            placeholder="Attention"
            value={formData.attention}
            max={fieldConfigs.attention}
            onChange={handleChange}
          />

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
              placeholder="(xxx)-xxx-xxxx"
              type="tel"
              value={formatPhone(formData.tel)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, tel: digits }));
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="ext"
              label="Extension"
              placeholder="ext"
              value={formData.ext}
              max={fieldConfigs.ext}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="email"
              label="Email"
              placeholder="email"
              value={formData.email}
              max={fieldConfigs.email}
              onChange={handleChange}
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              type="text"
              onChange={handleChange}
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
              placeholder="(xxx) xxx-xxxx"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              type="tel"
              value={formatPhone(formData.driverTel)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, driverTel: digits }));
              }}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="siteContact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Site Contact
            </label>

            <Select
              options={teamMembers}
              placeholder="Select or type Site Contact"
              value={formData.siteContact}
              onChange={(value: string) => {
                const selected = teamMembers.find((m) => m.value === value);
                setFormData((prev) => ({
                  ...prev,
                  siteContact: value,
                  siteTel: selected?.phone || "",
                }));
              }}
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
              placeholder="(xxx) xxx-xxxx"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              type="tel"
              value={formatPhone(formData.siteTel)} // Optional: use `formatPhone` to format the phone number
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData((prev) => ({ ...prev, siteTel: digits }));
              }}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="address2"
              label="Address (2)"
              placeholder="Address (2)"
              value={formData.address2}
              max={fieldConfigs.address2}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-1.5">
            <LimitedInput
              name="deliveryNotes"
              label="Delivery Notes"
              placeholder="Delivery Notes"
              value={formData.deliveryNotes}
              max={fieldConfigs.deliveryNotes}
              onChange={handleChange}
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
                  type="date"
                  min="1900-01-01"
                  max="2099-12-31"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                {/* <DatePickerDemo /> */}
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
                  type="time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date3"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  3) Date
                </label>
                <Input
                  id="date3"
                  name="date3"
                  placeholder="3) Date"
                  type="date"
                  min="1900-01-01"
                  max="2099-12-31"
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
                  type="time"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="date2"
                  className="text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  2) Date
                </label>
                <Input
                  id="date2"
                  name="date2"
                  type="date"
                  placeholder="2) Date"
                  onChange={handleChange}
                  min="1900-01-01"
                  max="2099-12-31"
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
                  type="time"
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
                  type="date"
                  onChange={handleChange}
                  min="1900-01-01"
                  max="2099-12-31"
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
                  type="time"
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

            <Select
              placeholder="Job # / Equip #"
              value={formData.jobNumber}
              options={jobDetails.map((job) => ({
                label: job.jobOrEquip,
                value: job.jobOrEquip,
              }))}
              onChange={(value) => {
                const selectedJob = jobDetails.find(
                  (job) => job.jobOrEquip.toLowerCase() === value.toLowerCase()
                );

                setFormData((prev) => {
                  const newState = {
                    ...prev,
                    jobNumber: value, // Update jobNumber with the selected or typed value
                    jobName: selectedJob ? selectedJob.jobName : prev.jobName, // Auto-fill jobName if found, otherwise keep it as-is
                  };

                  return newState;
                });
              }}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="jobName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Name / Equip Name
            </label>
            <Select
              placeholder="Job Name / Equip Name"
              value={formData.jobName}
              options={jobDetails.map((job) => ({
                label: job.jobName,
                value: job.jobName,
              }))}
              onChange={(value) => {
                const selectedJob = jobDetails.find(
                  (job) => job.jobName === value
                );
                setFormData((prev) => ({
                  ...prev,
                  jobName: value,
                  jobNumber: selectedJob
                    ? selectedJob.jobOrEquip
                    : prev.jobNumber,
                }));
              }}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            {/* <label
              htmlFor="jobTask"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Task / Use
            </label>
            <Input
              id="jobTask"
              name="jobTask"
              value={formData.jobTask}
              placeholder="Job Task / Use"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            /> */}
            <LimitedInput
              name="jobTask"
              label="Job Task / Use"
              placeholder="Job Task / Use"
              value={formData.jobTask}
              max={fieldConfigs.jobTask}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="officeContact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Office Contact
            </label>

            <Select
              options={teamMembers}
              placeholder="Select or type Office Contact"
              value={formData.officeContact}
              onChange={(value) =>
                handleChange({
                  target: { name: "officeContact", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
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
              value={formData.officeTel}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="Requested By"
              className="text-sm font-medium text-gray-700"
            >
              Requested By
            </label>
            <Select
              options={teamMembers}
              placeholder="Select or type Requested By"
              value={formData.requestedBy}
              onChange={(value) =>
                handleChange({
                  target: { name: "requestedBy", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="Ordered By"
              className="text-sm font-medium text-gray-700"
            >
              Ordered By
            </label>
            <Select
              options={teamMembers}
              placeholder="Select or type Ordered By"
              value={formData.orderedBy}
              onChange={(value) =>
                handleChange({
                  target: { name: "orderedBy", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
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
              type="date"
              min="1900-01-01"
              max="2099-12-31"
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
              type="time"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="coCe"
              label="CO / CE #"
              placeholder="CO / CE #"
              value={formData.coCe}
              max={fieldConfigs.coCe}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="rightNotes"
              label="Notes"
              placeholder="Notes"
              value={formData.rightNotes}
              max={fieldConfigs.rightNotes}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="approxCost"
              label="Approx Cost"
              placeholder="Approx Cost"
              value={formData.approxCost}
              max={fieldConfigs.approxCost}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex flex-wrap gap-4 items-center">
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="amex"
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 mr-2 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />{" "}
              AMEX
            </label>
            <div className="flex flex-col space-y-1.5">
              {/* <LimitedInput
                name="amexText"
                label="AMEX Details"
                placeholder="AMEX Details"
                value={formData.amexText}
                max={fieldConfigs.amexText}
                onChange={handleChange}
              /> */}
              <Select
                options={teamMembers}
                placeholder="Select/Type AMEX Details"
                value={formData.amexText}
                onChange={(value) =>
                  handleChange({
                    target: { name: "amexText", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
            <label className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
              <input
                type="checkbox"
                name="cod"
                onChange={handleChange}
                className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
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
              <LimitedInput
                name="otherText"
                label="Other Details"
                placeholder="Other Details"
                value={formData.otherText}
                max={fieldConfigs.otherText}
                onChange={handleChange}
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
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "image/png" ||
          file.type === "image/jpeg"
      );
    
      if (droppedFiles.length) {
        setUploadedFiles((prev) => [...prev, ...droppedFiles]);
      } else {
        alert("Please drop valid PDF or image files.");
      }
    }}
    
    onClick={() => document.getElementById("quoteUpload")?.click()}
  >
    <input
      type="file"
      id="quoteUpload"
      multiple
      accept=".pdf,.docx,image/png,image/jpeg"
      className="hidden"
      onChange={(e) => {
        const files = e.target.files;
        if (files) {
          const validFiles = Array.from(files).filter(
            (file) =>
              file.type === "application/pdf" ||
              file.type === "image/png" ||
              file.type === "image/jpeg"
          );
          setUploadedFiles((prev) => [...prev, ...validFiles]);
        }
      }}
      
    />
    {uploadedFiles.length > 0 ? (
      <div className="text-green-600 font-medium space-y-1">
        {uploadedFiles.map((file, idx) => (
          <p key={idx}>{file.name} uploaded ✅</p>
        ))}
      </div>
    ) : (
      <p>📄 Drag & drop or click to upload vendor quote files (PDF, PNG, JPG)</p>
    )}
  </div>
)}


          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="ccPo"
              label="CC PO to Grade Team"
              placeholder="CC PO to Grade Team"
              value={formData.ccPo}
              max={fieldConfigs.ccPo}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="author"
              className="text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <Select
              options={teamMembers}
              placeholder="Select or type author"
              value={formData.author}
              onChange={(value) =>
                handleChange({
                  target: { name: "author", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
          </div>

          {/* <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="authorSignature"
              label="Author Signature"
              placeholder="Author Signature"
              value={formData.authorSignature}
              max={fieldConfigs.authorSignature}
              onChange={handleChange}
            />
          </div> */}

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="PM Name"
              className="text-sm font-medium text-gray-700"
            >
              PM Name
            </label>
            <Select
              options={teamMembers}
              placeholder="Select or type PM Name"
              value={formData.pmName}
              onChange={(value) =>
                handleChange({
                  target: { name: "pmName", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
          </div>

          {/* <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="pmSignature"
              label="PM Signature"
              placeholder="PM Signature"
              value={formData.pmSignature}
              max={fieldConfigs.pmSignature}
              onChange={handleChange}
            />
          </div> */}

          <div className="flex flex-col space-y-1.5">
            <LimitedInput
              name="approvedBy"
              label="Approved By"
              placeholder="Approved By"
              value={formData.approvedBy}
              max={fieldConfigs.approvedBy}
              onChange={handleChange}
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
              type="date"
              min="1900-01-01"
              max="2099-12-31"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="col-span-2 flex flex-col space-y-1.5">
            <LimitedInput
              name="rightBottomNotes"
              label="Notes (bottom)"
              placeholder="Notes (bottom)"
              value={formData.rightBottomNotes}
              max={fieldConfigs.rightBottomNotes}
              onChange={handleChange}
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
                    <div className="col-span-full flex justify-end space-x-2 mt-2">
                      {/* Clear button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = [...formData.lineItems];
                          updatedItems[index] = {
                            description: "",
                            quantity: "",
                            um: "",
                            unitCost: "",
                            total: "",
                            jobEquipNotes: "",
                            costCode: "",
                            payItem: "",
                          };
                          setFormData({ ...formData, lineItems: updatedItems });
                        }}
                        className="px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                      >
                        Clear
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = formData.lineItems.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, lineItems: updatedItems });
                        }}
                        className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        Delete
                      </button>
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
              <span className="mr-1">+</span> Add item
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
              type="number"
              value={
                parseFloat(formData.subtotal || "0") > 0
                  ? formData.subtotal
                  : ""
              }
              disabled
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
              type="number"
              placeholder="Delivery"
              value={formData.delivery}
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
              type="number"
              value={formData.salesTax}
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
              type="number"
              placeholder="Other"
              value={formData.bottomOther}
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
              value={
                parseFloat(formData.grandTotal || "0") > 0
                  ? formData.grandTotal
                  : ""
              }
              placeholder="Grand Total"
              disabled
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
              type="date"
              onChange={handleChange}
              min="1900-01-01"
              max="2099-12-31"
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

type LimitedInputProps = {
  name: string;
  value: string;
  max: number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  label?: string;
};

const LimitedInput = ({
  name,
  value,
  max,
  onChange,
  placeholder,
  label,
}: LimitedInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limitedValue = e.target.value.slice(0, max);

    const customEvent = {
      ...e,
      target: {
        ...e.target,
        value: limitedValue,
        name,
      },
    };

    onChange(customEvent as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col space-y-1.5 relative">
      {label &&
        (label !== "AMEX Details" && label !== "Other Details" ? (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        ) : null)}
      <input
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-16 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100"
      />

      <span className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
        {value.length} / {max}
      </span>
    </div>
  );
};
