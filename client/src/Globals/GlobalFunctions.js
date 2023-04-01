// authentification check user
import { backendUrl } from "./GlobalVariables";
import axios from "axios";

export function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

export function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

export function getLocalStorage(key) {
    return localStorage.getItem(key);
}

export async function verifyUser(data) {
    console.log("verifyUser");
    const response = await axios.post(backendUrl + "/verifyUser", data, {});
    return response.status === 200 ? response.status : null;
}

// add Favoris
export async function addFavoris(data) {
    console.log("addFavoris");
    const response = await axios.post(backendUrl + "/addFavoris", data, {});
    return response.status === 200 ? response.status : null;
}

// remove Favoris
export async function removeFavoris(data) {
    console.log("deleteFavoris");
    const response = await axios.post(backendUrl + "/deleteFavoris", data, {});
    return response.status === 200 ? response.status : null;
}

// format date to display number of days, hours, minutes ago the album was published
export function formatDate(dateString) {
    const diff = (new Date() - new Date(dateString)) / 1000 / 60;

    if (diff < 1) {
        return "il y a quelques secondes";
    } else if (diff < 60) {
        return `il y a ${Math.floor(diff)} minutes`;
    } else if (diff < 1440) {
        return `il y a ${Math.floor(diff / 60)} heures`;
    } else {
        return `il y a ${Math.floor(diff / 1440)} jours`;
    }
}
