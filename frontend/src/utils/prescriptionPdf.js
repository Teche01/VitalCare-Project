import { jsPDF } from "jspdf";

export const downloadPrescriptionPdf = (prescription) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const leftMargin = 18;
  const rightMargin = 18;

  const contentWidth =
    pageWidth - leftMargin - rightMargin;

  let y = 18;

  // =========================
  // HELPERS
  // =========================

  const checkPageBreak = (requiredHeight = 15) => {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const addWrappedText = (
    text,
    x,
    maxWidth,
    lineHeight = 5,
  ) => {
    if (!text) {
      return;
    }

    const lines =
      doc.splitTextToSize(
        String(text),
        maxWidth,
      );

    checkPageBreak(
      lines.length * lineHeight,
    );

    doc.text(lines, x, y);

    y += lines.length * lineHeight;
  };

  const sectionTitle = (title) => {
    checkPageBreak(15);

    y += 3;

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.setFontSize(12);

    doc.text(
      title,
      leftMargin,
      y,
    );

    y += 3;

    doc.setDrawColor(210);

    doc.line(
      leftMargin,
      y,
      pageWidth - rightMargin,
      y,
    );

    y += 7;

    doc.setFont(
      "helvetica",
      "normal",
    );

    doc.setFontSize(10);
  };

  // =========================
  // HEADER
  // =========================

  doc.setFont(
    "helvetica",
    "bold",
  );

  doc.setFontSize(20);

  doc.text(
    "VitalCare",
    leftMargin,
    y,
  );

  doc.setFontSize(11);

  doc.setFont(
    "helvetica",
    "normal",
  );

  doc.text(
    "Multi-Speciality Hospital",
    leftMargin,
    y + 6,
  );

  doc.setFont(
    "helvetica",
    "bold",
  );

  doc.setFontSize(15);

  doc.text(
    "PRESCRIPTION",
    pageWidth - rightMargin,
    y,
    {
      align: "right",
    },
  );

  doc.setFontSize(9);

  doc.setFont(
    "helvetica",
    "normal",
  );

  doc.text(
    `Prescription #${prescription.prescriptionId ?? "-"}`,
    pageWidth - rightMargin,
    y + 6,
    {
      align: "right",
    },
  );

  y += 15;

  doc.setDrawColor(80);

  doc.line(
    leftMargin,
    y,
    pageWidth - rightMargin,
    y,
  );

  y += 9;

  // =========================
  // PATIENT & DOCTOR DETAILS
  // =========================

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "bold",
  );

  doc.text(
    "Patient",
    leftMargin,
    y,
  );

  doc.text(
    "Doctor",
    110,
    y,
  );

  y += 6;

  doc.setFont(
    "helvetica",
    "normal",
  );

  doc.text(
    prescription.patientName || "-",
    leftMargin,
    y,
  );

  doc.text(
    prescription.doctorName || "-",
    110,
    y,
  );

  y += 5;

  doc.setTextColor(90);

  doc.text(
    `Consultation Date: ${
      prescription.appointmentDate || "-"
    }`,
    leftMargin,
    y,
  );

  doc.text(
    prescription.specialization || "",
    110,
    y,
  );

  y += 5;

  doc.text(
    `Department: ${
      prescription.departmentName || "-"
    }`,
    leftMargin,
    y,
  );

  doc.setTextColor(0);

  y += 5;

  // =========================
  // DIAGNOSIS
  // =========================

  sectionTitle("Diagnosis");

  addWrappedText(
    prescription.diagnosis ||
      "Not specified",
    leftMargin,
    contentWidth,
  );

  // =========================
  // CONSULTATION NOTES
  // =========================

  if (
    prescription.consultationNotes
  ) {
    sectionTitle(
      "Consultation Notes",
    );

    addWrappedText(
      prescription.consultationNotes,
      leftMargin,
      contentWidth,
    );
  }

  // =========================
  // MEDICINES
  // =========================

  sectionTitle("Medicines");

  if (
    prescription.medicines &&
    prescription.medicines.length > 0
  ) {
    prescription.medicines.forEach(
      (medicine, index) => {
        checkPageBreak(25);

        doc.setFont(
          "helvetica",
          "bold",
        );

        doc.setFontSize(10);

        doc.text(
          `${index + 1}. ${
            medicine.medicineName ||
            "Medicine"
          }`,
          leftMargin,
          y,
        );

        y += 6;

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.setFontSize(9);

        const medicineDetails = [
          `Dosage: ${
            medicine.dosage || "-"
          }`,
          `Frequency: ${
            medicine.frequency || "-"
          }`,
          `Duration: ${
            medicine.duration || "-"
          }`,
        ];

        addWrappedText(
          medicineDetails.join(
            "    |    ",
          ),
          leftMargin + 4,
          contentWidth - 4,
          4.5,
        );

        if (medicine.instructions) {
          addWrappedText(
            `Instructions: ${medicine.instructions}`,
            leftMargin + 4,
            contentWidth - 4,
            4.5,
          );
        }

        y += 4;
      },
    );
  } else {
    doc.setFontSize(10);

    doc.text(
      "No medicines prescribed.",
      leftMargin,
      y,
    );

    y += 6;
  }

  // =========================
  // GENERAL ADVICE
  // =========================

  if (
    prescription.generalAdvice
  ) {
    sectionTitle(
      "General Advice",
    );

    addWrappedText(
      prescription.generalAdvice,
      leftMargin,
      contentWidth,
    );
  }

  // =========================
  // FOLLOW-UP
  // =========================

  if (
    prescription.followUpDate
  ) {
    sectionTitle("Follow-up");

    doc.setFont(
      "helvetica",
      "bold",
    );

    doc.text(
      `Follow-up Date: ${prescription.followUpDate}`,
      leftMargin,
      y,
    );

    y += 8;
  }

  // =========================
  // FOOTER
  // =========================

  checkPageBreak(25);

  y += 8;

  doc.setDrawColor(200);

  doc.line(
    leftMargin,
    y,
    pageWidth - rightMargin,
    y,
  );

  y += 7;

  doc.setFont(
    "helvetica",
    "italic",
  );

  doc.setFontSize(8);

  doc.setTextColor(100);

  doc.text(
    "Generated through the VitalCare Hospital Appointment and Consultation Management System.",
    pageWidth / 2,
    y,
    {
      align: "center",
    },
  );

  // =========================
  // DOWNLOAD
  // =========================

  const patientName =
    prescription.patientName
      ?.replace(/\s+/g, "_")
      ?.replace(
        /[^a-zA-Z0-9_-]/g,
        "",
      ) || "Patient";

  const fileName =
    `VitalCare_Prescription_${patientName}_${prescription.appointmentDate || ""}.pdf`;

  doc.save(fileName);
};