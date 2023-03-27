import React, { useEffect, useState } from "react";
import SelectCountry from "../Forms/SelectCountry";
import SelectGenres from "../Forms/selectGenres";
import { getAxiosReq } from "../../Services/AxiosGet";

// create component for search album by style or country
function MainSearch() {
    const [lstGenres, setLstGenres] = useState([]);
    const [lstCountry, setLstCountry] = useState([]);

    const [lstParams, setLstParams] = useState({
        styles: { value: [], error: false, helperText: "" },
        country: { value: [], error: false, helperText: "" },
    });

    useEffect(() => {
        const response = getAxiosReq("/getStylesAndCountry", {});
        response.then((data) => {
            // create array with styles distinct
            const arrStyles = [];
            data.map((item) => {
                if (!arrStyles.includes(item.style)) {
                    arrStyles.push({ gm_id: item.gm_id, gm_name_genre: item.gm_name_genre });
                }
            });

            // create array with country distinct (string p_code_country)
            const arrCountries = [];
            data.forEach((item) => {
                const existingCountry = arrCountries.find(
                    (c) => c.p_code_country === item.p_code_country
                );
                if (!existingCountry) {
                    arrCountries.push({
                        p_code_country: item.p_code_country,
                        p_name_country: item.p_name_country,
                    });
                }
            });

            setLstGenres(arrStyles);
            setLstCountry(arrCountries);
        });
    }, []);

    console.log("MainSearch -- lstGenres = ", lstGenres);
    console.log("MainSearch -- lstCountry = ", lstCountry);
    console.log("MainSearch -- lstParams = ", lstParams);

    return (
        <div>
            <form>
                {/* Styles */}
                <SelectGenres
                    lstValues={lstParams}
                    setLstValues={setLstParams}
                    lstGenres={lstGenres}
                />

                {/* Country */}
                <SelectCountry
                    lstParams={lstParams}
                    setLstParams={setLstParams}
                    lstCountries={lstCountry}
                />
            </form>
        </div>
    );
}

export default MainSearch;
