import { useState } from "react";
import Tesseract from "tesseract.js";

export const usePayslipOCR = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const extractPayslipData = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setText(data.text);

      const totalEarnings = data.text
        .match(/Total Earnings\s+([\d,]+\.\d{2})/i)?.[1]
        ?.replace(/,/g, "");
      const totalDeductions = data.text
        .match(/Total Deductions\s+([\d,]+\.\d{2})/i)?.[1]
        ?.replace(/,/g, "");
      const payslipMonth = data.text.match(
        /Payslip for the Month of\s+([A-Za-z]+\s+\d{4})/i
      )?.[1];

      if (!totalEarnings || !totalDeductions || !payslipMonth) {
        throw new Error("Could not extract key fields");
      }

      return {
        extractedText: data.text,
        totalEarnings: parseFloat(totalEarnings),
        totalDeductions: parseFloat(totalDeductions),
        netPay: parseFloat(
          (parseFloat(totalEarnings) - parseFloat(totalDeductions)).toFixed(2)
        ),
        payslipMonth,
      };
    } catch (err: any) {
      console.error("OCR Error:", err);
      setError(err.message || "Failed to extract text");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { extractPayslipData, loading, error, text };
};
