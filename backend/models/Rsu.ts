import mongoose, { Types } from "mongoose";

export interface IVestingEvent {
  vestDate: Date;
  grantedQty: number;
  vestedQty: number;
}

export interface IRsu extends Document {
  grantDate: string;
  grantAmount: number;
  stockPrice: number;
  totalUnits: number;
  vestedUnits: number;
  vestingSchedule: IVestingEvent[];
  createdBy: Types.ObjectId;
}

const Schema = mongoose.Schema;

const VestingEventSchema = new Schema<IVestingEvent>({
  vestDate: {
    type: Date,
    required: true,
  },
  grantedQty: {
    type: Number,
    required: true,
  },
  vestedQty: {
    type: Number,
    required: true,
  },
});

const RsuSchema = new Schema(
  {
    grantDate: {
      type: Date,
      required: [true, "Grant date is required!"],
    },
    grantAmount: {
      type: Number,
      required: [true, "Grant amount is required!"],
      min: [0, "Grant amount must be a positive number"],
    },
    stockPrice: {
      type: Number,
      required: [true, "Stock price is required!"],
      min: [0, "Stock price must be a positive number"],
    },
    totalUnits: {
      type: Number,
      required: true,
    },
    vestedUnits: {
      type: Number,
      required: true,
    },
    vestingSchedule: {
      type: [VestingEventSchema],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rsu = mongoose.model("Rsu", RsuSchema);

export default Rsu;
