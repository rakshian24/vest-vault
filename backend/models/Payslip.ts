import mongoose, { Types } from "mongoose";

export interface IPayslip extends Document {
  payslipDate: string;
  extractedText: string;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: Types.ObjectId;
}

const Schema = mongoose.Schema;

const PayslipSchema = new Schema(
  {
    payslipDate: {
      type: Date,
      required: [true, "Payslip date is required!"],
    },
    extractedText: {
      type: String,
      required: [true, "Extracted text is required!"],
    },
    totalEarnings: {
      type: Number,
      required: [true, "Total earnings is required!"],
    },
    totalDeductions: {
      type: Number,
      required: [true, "Total deductions is required!"],
    },
    netPay: {
      type: Number,
      required: [true, "Net pay is required!"],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payslip = mongoose.model("Payslip", PayslipSchema);

export default Payslip;
