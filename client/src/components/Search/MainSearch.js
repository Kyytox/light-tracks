import React, { useEffect } from "react";
import SelectCountry from "../Forms/SelectCountry";
import SelectGenres from "../Forms/selectGenres";
import { getAxiosReq } from "../../Services/AxiosGet";

// create component for search album by style or country
function MainSearch() {
    useEffect(() => {
        console.log("MainSearch");
        const response = getAxiosReq("/getGenresAndCountry", {});
        response.then((data) => {
            console.log("MainSearch data = ", data);
        });
    }, []);

    return (
        <div>
            <form>
                {/* <SelectGenres />
                <SelectCountry /> */}
            </form>
        </div>
    );
}

export default MainSearch;
