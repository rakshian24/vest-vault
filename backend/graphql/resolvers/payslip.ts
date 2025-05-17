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
    async deletePayslip(
      _: unknown,
      { id }: { id: string },
      ctx: any
    ): Promise<boolean> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new GraphQLError("User not authenticated", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const payslip = await Payslip.findById(id);

      if (!payslip) {
        throw new GraphQLError("Payslip not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }

      if (payslip.uploadedBy.toString() !== userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      await payslip.deleteOne();
      return true;
    },
  },

  Query: {
    async myPayslips(_: unknown, args: {}, ctx: any) {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const payslips = await Payslip.find({ uploadedBy: userId }).sort({
        payslipDate: -1,
      });

      const payslipList = payslips.map((p) => p.toObject());

      const totalEarnings = payslipList
        .reduce((acc, p) => acc + (p.totalEarnings || 0), 0)
        .toFixed(2);

      const totalDeductions = payslipList
        .reduce((acc, p) => acc + (p.totalDeductions || 0), 0)
        .toFixed(2);

      const totalNetpay = (+totalEarnings - +totalDeductions).toFixed(2);

      return {
        myPayslips: payslipList,
        aggregate: {
          totalEarnings: +totalEarnings,
          totalDeductions: +totalDeductions,
          totalNetpay: +totalNetpay,
        },
      };
    },
  },
};

export default payslipResolvers;
