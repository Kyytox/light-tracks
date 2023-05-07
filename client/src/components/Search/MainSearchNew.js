// import React
import React, { useState, useContext, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

// import MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";

// Envirronement
import { getAxiosReq, getAxiosReqAuth } from "../../Services/AxiosGet";
import { AuthContext } from "../../Services/AuthContext";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

// import Components
import FormSearch from "../Search/FormSearch";

// import CSS
import "./MainSearch.css";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={1000} ref={ref} {...props} />;
});

function MainSearchNew() {
    const navigate = useNavigate();
    const { isLoggedIn, checkToken, idUser } = useContext(AuthContext);
    const [lstGenres, setLstGenres] = useState([]);
    const [lstCountry, setLstCountry] = useState([]);

    const [lstParams, setLstParams] = useState({
        search: { value: "", error: false, helperText: "" },
        styles: { value: [], error: false, helperText: "" },
        tags: { value: [], error: false, helperText: "" },
        country: { value: [], error: false, helperText: "" },
    });
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        console.log("MainSearch -- /getStylesCountryInAlbums");
        const response = getAxiosReq("/getStylesCountryInAlbums", {});
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
                const existingCountry = arrCountries.find((c) => c.c_code_country === item.p_code_country);
                if (!existingCountry && item.p_code_country !== null) {
                    arrCountries.push({
                        c_code_country: item.p_code_country,
                        c_name_country: item.p_name_country,
                    });
                }
            });

            setLstGenres(arrStyles);
            setLstCountry(arrCountries);
        });
    }, []);

    // change value of lstParams search
    const handleChange = (key, value) => {
        setLstParams({ ...lstParams, [key]: { value: value, error: false, helperText: "" } });
    };

    // get albums by search
    const onSubmit = async (e) => {
        e.preventDefault();
        await checkToken();
        const token = getLocalStorage("token");

        const data = {
            idUser: idUser,
            search: lstParams.search.value,
            styles: lstParams.styles.value,
            tags: lstParams.tags.value,
            country: lstParams.country.value,
        };

        navigate(`/results?search=${data}`);

        // console.log("MainSearch -- ", isLoggedIn ? "/getSearchAuth" : "/getSearch");
        // try {
        //     const response = isLoggedIn
        //         ? await getAxiosReqAuth("/getSearchAuth", data, token)
        //         : await getAxiosReq("/getSearch", data);

        //     setLstAlbums(response);
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} startIcon={<SearchIcon />}>
                Search a Album
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Search a Album"}</DialogTitle>
                <DialogContent>
                    {/* form Search */}
                    <FormSearch
                        lstParams={lstParams}
                        setLstParams={setLstParams}
                        lstGenres={lstGenres}
                        lstCountry={lstCountry}
                        handleChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <div className="div-btn-search mb-3 px-3 w-full flex flex-row justify-between">
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button variant="contained" onClick={handleClose}>
                            Search
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MainSearchNew;
