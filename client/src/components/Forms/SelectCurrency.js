import React from "react";

// lib Material UI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function SelectCurrency({ lstParams, setLstParams, lstCurrencies }) {
    const handleCurrencyChange = (e) => {
        const currency = e.target.value;

        setLstParams({
            ...lstParams,
            currency: {
                value: currency,
                error: false,
                helperText: "",
            },
        });
    };

    return (
        <>
            <Select
                labelId="select-currency"
                id="select-currency"
                label="Currency"
                value={lstParams.currency.value}
                onChange={(e) => handleCurrencyChange(e)}
            >
                {lstCurrencies.map((currency, key) => (
                    <MenuItem value={currency.cu_code_currency} key={key}>
                        {currency.cu_code_currency} - {currency.cu_name_currency}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
}

export default SelectCurrency;
