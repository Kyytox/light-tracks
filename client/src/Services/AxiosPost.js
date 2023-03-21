import { backendUrl } from "../Globals/GlobalVariables";
import axios from "axios";

export async function postAxiosReq(backFunct, data) {
    try {
        const response = await axios.post(backendUrl + backFunct, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function postAxiosReqAuth(backFunct, data, token) {
    try {
        const response = await axios.post(backendUrl + backFunct, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
