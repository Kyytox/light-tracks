import pool from "../Database/database.js";

import { getInfosUserLnbits } from "../Lnbits/getInfosUser.js";
import { createInvoice } from "../Lnbits/wallets.js";

export const createInvoiceCustomPrice = async (req, res) => {
    console.log("API /createInvoiceCustomPrice");
    console.log("req.body", req.body);

    try {
        const infosUser = await getInfosUserLnbits(req.body.idUser);
        console.log("infosUser", infosUser);

        // create invoice
        const invoice = await createInvoice(infosUser.invoiceKey, req.body.price);
        res.send({
            invoiceKey: infosUser.invoiceKey,
            payementHash: invoice.payment_hash,
            payementRequest: invoice.payment_request,
        });
    } catch (error) {
        console.log("error", error);
    }
};
