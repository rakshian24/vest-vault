import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Payslip, { IPayslip } from "../../models/Payslip";
import dayjs from "dayjs";

const payslipResolvers = {
  Mutation: {
    async createPayslip(
      _: unknown,
      {
        payslipInput: {
          payslipDate,
          extractedText,
          totalEarnings,
          totalDeductions,
          netPay,
        },
      }: {
        payslipInput: {
          payslipDate: string;
          extractedText: string;
          totalEarnings: number;
          totalDeductions: number;
          netPay: number;
        };
      },
      ctx: any
    ): Promise<IPayslip> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const parsedDate = dayjs(payslipDate, "MMMM YYYY").toDate();

      const newPayslip = new Payslip({
        payslipDate: parsedDate,
        extractedText,
        totalEarnings,
        totalDeductions,
        netPay,
        uploadedBy: userId,
      });

      const res = (await newPayslip.save()).toObject() as IPayslip;

      return res;
    },
  },

  Query: {
    async myPayslips(_: unknown, args: {}, ctx: any): Promise<IPayslip[]> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const payslips = await Payslip.find({ uploadedBy: userId }).sort({
        payslipDate: -1,
      });

      return payslips.map((p) => p.toObject()) as IPayslip[];
    },
  },
};

export default payslipResolvers;
