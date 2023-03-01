import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

function Success(text) {
    const textSuccess = text;
    console.log("textSuccess.text", textSuccess.text);

    const loginSuccess = () => {
        return (
            <div>
                <p>Connection Successful</p>
                <p>Welcome Back</p>
                <TaskAltIcon color="success" />
            </div>
        );
    };

    const singupSuccess = () => {
        return (
            <div>
                <p>Successful account creation</p>
                <p>Welcome</p>
                <TaskAltIcon color="success" />
            </div>
        );
    };

    return (
        <div>
            {textSuccess.text === "LoginSuccess" && loginSuccess()}
            {textSuccess.text === "SignupSuccess" && singupSuccess()}
        </div>
    );
}

export default Success;
