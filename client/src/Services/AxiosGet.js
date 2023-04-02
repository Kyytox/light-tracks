import { backendUrl } from "../Globals/GlobalVariables";
import axios from "axios";

export async function getAxiosReq(backFunct, data) {
    try {
        const response = await axios.get(backendUrl + backFunct, {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getAxiosReqAuth(backFunct, data, token) {
    try {
        const response = await axios.get(backendUrl + backFunct, {
            params: data,
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("getAxiosReqAuth -- response: ", response);
        return response;
    } catch (error) {
        console.error(error);
    }
}
