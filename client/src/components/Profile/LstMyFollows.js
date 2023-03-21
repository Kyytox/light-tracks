import React from "react";
import BtnFollow from "../Bouttons/BtnFollow";
import LinkNavUser from "../User/LinkNavUser";

function LstMyFollows({ idUser, isLoggedIn, lstFollows }) {
    console.log("LstMyFollows - lstFollows", lstFollows);

    // create a map to display lstFollows (username), this is index of listFollows:  fo_date_follow; fo_id_user; fo_id_user_follow; u_id; u_username;
    // add BtnFllows
    const LstDisplayFollows = lstFollows.map((follow, key) => {
        return (
            <>
                <nav id={"follow-" + follow.p_id_user} key={follow.p_id_user}>
                    <LinkNavUser data={follow} />
                    <BtnFollow
                        idUser={idUser}
                        isLoggedIn={isLoggedIn}
                        idUserFollow={follow.p_id_user}
                        isFollowedProp={true}
                    />
                </nav>
            </>
        );
    });

    return (
        <div>
            <div className="row">{LstDisplayFollows}</div>
        </div>
    );
}

export default LstMyFollows;
