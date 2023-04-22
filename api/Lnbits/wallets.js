import axios from "axios";

// get balance wallet
export const getBalanceWallet = async (invoiceKey, adminKey) => {
    console.log("getBalanceWallet");

    try {
        const result = await axios.get("http://127.0.0.1:5000/api/v1/wallet", {
            headers: {
                "X-Api-Key": invoiceKey,
                "Content-type": "application/json",
            },
        });

        console.log("getBalanceWallet -- Succes");
        console.log(result.data);
        console.log(result.status);
        return getLinkwithdraw(adminKey, result.data.balance);
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};

// create Invoice
export const createInvoice = async (invoiceKey, amount) => {
    console.log("createInvoice");
    console.log("amount", amount);

    try {
        const data = {
            out: false,
            amount: amount,
            memo: "LightWaves",
            unit: "sat",
            expiry: 3600,
            bolt11: "string",
        };

        const result = await axios.post("http://127.0.0.1:5000/api/v1/payments", data, {
            headers: {
                "X-Api-Key": invoiceKey,
                "Content-type": "application/json",
            },
        });

        console.log("createInvoice -- Succes");
        console.log(result.data);
        console.log(result.status);
        return result.data;
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};

// verify invoice
export const verifyInvoice = async (req, res) => {
    console.log("verifyInvoice");

    try {
        const result = await axios.get(`http://127.0.0.1:5000/api/v1/payments/${req.query.payementHash}`, {
            headers: {
                "X-Api-Key": req.query.invoiceKey,
                "Content-type": "application/json",
            },
        });

        console.log("verifyInvoice -- Succes");
        console.log(result.status);

        if (result.data.paid) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};

// check Payement
export const checkPayement = async (invoiceKey, payementHash) => {
    console.log("verifyInvoice");

    try {
        const result = await axios.get(`http://127.0.0.1:5000/api/v1/payments/${payementHash}`, {
            headers: {
                "X-Api-Key": invoiceKey,
                "Content-type": "application/json",
            },
        });

        console.log(result.status);
        if (result.data.paid) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("Error executing INSERT INTO:", err);
    }
};
