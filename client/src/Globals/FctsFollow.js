import { backendUrl } from "./GlobalVariables";
import axios from "axios";


// get Follows
export async function getFollows(data, token) {
    const response = await axios.get(backendUrl + "/getFollows", {params: {idUser: data}, headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.data : null;
}

// get Follows by idUser
export async function getFollowsByIdUser(data, token) {
    const response = await axios.get(backendUrl + "/getFollowsByIdUser", {
        params: {
            idUser: data.idUser, 
            idUserFollow: data.idArtist
        }, 
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });

    return response.status === 200 ? response.data : null;
}

// Follow / Unfollow
export async function followUser(data, token) {
    const response = await axios.post(backendUrl + "/followUser", data, {headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.status : null;
}

export async function unfollowUser(data, token) {
    const response = await axios.post(backendUrl + "/unfollowUser", data, {headers: { Authorization: `Bearer ${token}` }});
    return response.status === 200 ? response.status : null;
}


// change Btn Follow
export function changeBtnFollow(idUserFollow, value) {
    const lstBtnFollow = document.querySelectorAll(`#follow-user-${idUserFollow}`);
    lstBtnFollow.forEach((btnFollow) => {
        btnFollow.innerHTML = value;
    }
    );
}


// change Btn Follow
// if idArtist is in lstFollows.fo_id_user_follow, return true
export function checkFollowed(lstFollows, idArtist) {
    const isFollow = lstFollows.some((follow) => follow.fo_id_user_follow === idArtist);
    return isFollow;
}

