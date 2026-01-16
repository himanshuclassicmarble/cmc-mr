import z from "zod/v3";
import { ACCOUNT_GROUP_ENUM,  PLANT_ENUM, PURCHASINGORG_ENUM,   RECIPIENTINVOICEENUM, RECIPIENTPAYMENTENUM, RECON_ACCOUNT_ENUM, WHT_INV_CODE_ENUM, WHT_INV_TYPE_ENUM, WHT_PAY_CODE_ENUM, WHT_PAY_TYPE_ENUM } from "./constant";



export const formSchema = z.object({
  accountgroup: ACCOUNT_GROUP_ENUM, 
 reconaccount: RECON_ACCOUNT_ENUM,
  plant: PLANT_ENUM,
  purchasingorg: PURCHASINGORG_ENUM,
  paymentterm: z.string().min(1, "Payment Term is required"),
 wtaxtypeinv: WHT_INV_TYPE_ENUM,
  wtaxcodeinv: WHT_INV_CODE_ENUM,
  wtaxtypepay:WHT_PAY_TYPE_ENUM,
  wtaxcodepay: WHT_PAY_CODE_ENUM,
  subject: z.unknown(),
  recipientinvoice: RECIPIENTINVOICEENUM,
   recipientpayment: RECIPIENTPAYMENTENUM,
});





export type InternalForm = z.infer<typeof formSchema>;
