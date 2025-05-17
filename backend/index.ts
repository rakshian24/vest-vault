import express, { RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { createYoga, createSchema } from "graphql-yoga";
import path from "path";
import fileUpload from "express-fileupload";
import type fileUploadType from "express-fileupload";
import Tesseract from "tesseract.js";
import dayjs from "dayjs";
import { connectDB } from "./db";
import { typeDefs } from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import getLoggedInUserId from "./middleware/getLoggedInUserId";
import Payslip from "./models/Payslip";

const app = express();
const { SERVER_PORT } = process.env;

connectDB();

app.use(fileUpload() as unknown as RequestHandler);

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

app.use("/graphql", yoga);

app.post("/api/upload-payslip", async (req, res) => {
  const file = req.files?.file as fileUploadType.UploadedFile;

  if (!file || Array.isArray(file)) {
    return res.status(400).json({ error: "No valid file uploaded" });
  }

  try {
    const buffer = file.data;

    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");

    const earningsMatch = text.match(/Total Earnings\s+([\d,]+\.\d{2})/i);
    const totalEarnings = earningsMatch
      ? earningsMatch[1].replace(/,/g, "")
      : null;

    const deductionsMatch = text.match(/Total Deductions\s+([\d,]+\.\d{2})/i);
    const totalDeductions = deductionsMatch
      ? deductionsMatch[1].replace(/,/g, "")
      : null;

    const payslipMonthMatch = text.match(
      /Payslip for the Month of\s+([A-Za-z]+\s+\d{4})/i
    );
    const payslipMonth = payslipMonthMatch ? payslipMonthMatch[1] : null;

    const user = getLoggedInUserId(req);
    const userId = user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!payslipMonth || !totalEarnings || !totalDeductions) {
      return res.status(400).json({ error: "Could not extract payslip data" });
    }

    const parsedDate = dayjs(payslipMonth, "MMMM YYYY").toDate();
    const earnings = parseFloat(totalEarnings);
    const deductions = parseFloat(totalDeductions);
    const netPay = parseFloat((earnings - deductions).toFixed(2));

    await Payslip.create({
      payslipDate: parsedDate,
      extractedText: text,
      totalEarnings: earnings,
      totalDeductions: deductions,
      netPay,
      uploadedBy: userId,
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return res.status(500).json({ error: "OCR failed" });
  }
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "./build")));

// Handle React routing, return all requests to the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port: ${SERVER_PORT}`);
});
