import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Payslip, { IPayslip } from "../../models/Payslip";
import dayjs from "dayjs";
import { GraphQLError } from "graphql";

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

      console.log("payslipDatepayslipDate = ", payslipDate);

      const parsedDate = dayjs(payslipDate, "MMMM YYYY").toDate();

      // Check if a payslip for this month already exists for this user
      const existing = await Payslip.findOne({
        uploadedBy: userId,
        payslipDate: {
          $gte: dayjs(parsedDate).startOf("month").toDate(),
          $lt: dayjs(parsedDate).endOf("month").toDate(),
        },
      });

      if (existing) {
        throw new GraphQLError(
          `A payslip for ${dayjs(parsedDate).format(
            "MMMM YYYY"
          )} has already been uploaded. Please upload a payslip for a different month.`,
          {
            extensions: {
              code: "DUPLICATE_PAYSLIP",
            },
          }
        );
      }

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
