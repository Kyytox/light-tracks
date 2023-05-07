import React from "react";
import SelectCountry from "../Forms/SelectCountry";
import SelectGenres from "../Forms/selectGenres";
import FormParamTextField from "../Forms/FormParamTextField";
import FormAddTags from "../Forms/FormAddTags";

// import CSS
import "./MainSearch.css";

// create component for search album by style or country
function FormSearch({ lstParams, setLstParams, lstGenres, lstCountry, handleChange }) {
    return (
        <>
            <form className="form-search space-y-6 w-full">
                {/* Textfield */}
                <FormParamTextField
                    lstParams={lstParams}
                    handleChanges={handleChange}
                    name="search"
                    label="Title - Artists"
                    placeholder="Search"
                    type="text"
                    keyVal="search"
                />
                {/* Styles */}
                <SelectGenres lstValues={lstParams} setLstValues={setLstParams} lstGenres={lstGenres} />
                {/* Tags */}
                <FormAddTags lstParams={lstParams} setLstParams={setLstParams} />
                {/* Country */}
                <SelectCountry
                    lstParams={lstParams}
                    setLstParams={setLstParams}
                    lstCountries={lstCountry}
                    multipleSelect={true}
                />
            </form>
        </>
    );
}

export default FormSearch;
