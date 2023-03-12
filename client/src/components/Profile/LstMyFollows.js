import React from "react";
import { Link } from "react-router-dom";
import BtnFollow from "../Bouttons/BtnFollow";

function LstMyFollows({ idUser, isLoggedIn, lstFollows }) {

    console.log("LstMyFollows - lstFollows", lstFollows);

    
    // create a map to display lstFollows (username), this is index of listFollows:  fo_date_follow; fo_id_user; fo_id_user_follow; u_id; u_username;
    // add BtnFllows 
    const LstDisplayFollows = lstFollows.map((follow, key) => {
        const location = {
            pathname: `/user/${follow.u_id}`,
        };
        const stateLocation = { user: follow };

        return (
            <>
                <nav id={"follow-" + follow.u_id} key={follow.u_id}>
                    <Link to={location} state={stateLocation}>
                        <div className="card">
                            <div className="card-body" style={{ display: "flex" }}>
                                <h5 className="card-title">{follow.u_username}</h5>
                            </div>
                        </div>
                    </Link>
                    <BtnFollow idUser={idUser} isLoggedIn={isLoggedIn} idUserFollow={follow.u_id} isFollowedProp={true} />
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
