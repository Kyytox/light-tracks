import React, { useState, useContext, forwardRef } from "react";

// Envirronement
import { AuthContext } from "../../Services/AuthContext";
import { postAxiosReqAuth } from "../../Services/AxiosPost";
import { getLocalStorage } from "../../Globals/GlobalFunctions";

// MATERIAL UI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function BtnDeleteAccount() {
    const { isLoggedIn, checkToken, handleLogout } = useContext(AuthContext);
    const idUser = getLocalStorage("id");

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // delete User
    const handleDeleteUser = async () => {
        await checkToken();
        const token = getLocalStorage("token");

        const data = { idUser: idUser };

        try {
            console.log("ParamProfile.js -- /deleteUser");
            const response = postAxiosReqAuth("/deleteUser", data, token);
            response.then((data) => {
                console.log(data);
                if (data.success === "User deleted") {
                    handleLogout();
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="div-btn-delete-account">
            <Button variant="contained" color="error" onClick={handleClickOpen}>
                Slide in alert dialog
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Confirm Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description" sx={{ color: "white" }}>
                        <Typography variant="body2" gutterBottom>
                            Are you sure you want to delete your account ?
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            This action cannot be undone.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BtnDeleteAccount;
