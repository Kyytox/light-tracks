import { backendUrl } from "./GlobalVariables";
import axios from "axios";



// Follow / Unfollow
export async function followUser(data, token) {
    console.log("followUser");
    const response = await axios.post(backendUrl + "/followUser", data, {headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.status : null;
}

export async function unfollowUser(data, token) {
    console.log("unfollowUser");
    const response = await axios.post(backendUrl + "/unfollowUser", data, {headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.status : null;
}

// get Follows
export async function getFollows(data, token) {
    console.log("getFollows");
    const response = await axios.get(backendUrl + "/getFollows", {params: {idUser: data}, headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.data : null;
}