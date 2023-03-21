import { backendUrl } from "./GlobalVariables";
import axios from "axios";

// Follow / Unfollow
export async function followUser(data, token) {
    const response = await axios.post(backendUrl + "/followUser", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200 ? response.status : null;
}

export async function unfollowUser(data, token) {
    const response = await axios.post(backendUrl + "/unfollowUser", data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200 ? response.status : null;
}

// change Btn Follow
export function changeBtnFollow(idUserFollow, value) {
    const lstBtnFollow = document.querySelectorAll(`#follow-user-${idUserFollow}`);
    lstBtnFollow.forEach((btnFollow) => {
        btnFollow.innerHTML = value;
    });
}

// change Btn Follow
// if idArtist is in lstFollows.fo_id_user_follow, return true
export function checkFollowed(lstFollows, idArtist) {
    const isFollow = lstFollows.some((follow) => follow.fo_id_user_follow === idArtist);
    return isFollow;
}
