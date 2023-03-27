// authentification check user
import { backendUrl } from "./GlobalVariables";
import axios from "axios";
import { colorsFav } from "./Colors";

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

// change btn Favoris in function of favoris and sales of user
export function changeBtnFavoris(data) {
    console.log("changeBtnFavoris");
    console.log("data", data);

    // browse data, for each album check if source == sale or favoris
    // if sale, remove icone favoris and add text "Album purchased"
    // if favoris, change color of icone favoris

    data.map((album) => {
        if (album.source === "sale") {
            // remove icone favoris
            document.getElementById(`fav-album-${album.album_id}`).style.display = "none";

            // check if text "Album purchased" already exist
            if (
                document
                    .getElementById(`fav-album-${album.album_id}`)
                    .parentNode.querySelector(".album-purchased")
            ) {
                return;
            }

            // add text "Album purchased"
            const p = document.createElement("p");
            p.setAttribute("class", "album-purchased");
            p.innerHTML = "Album purchased";
            document.getElementById(`fav-album-${album.album_id}`).parentNode.appendChild(p);
        } else if (album.source === "favoris") {
            // change color of icone favoris
            document.getElementById(`fav-album-${album.album_id}`).style.color = colorsFav.primary;
        }
    });
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
