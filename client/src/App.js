import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Authentification from "./components/Authentification/Auth";
import MusicAdder from "./components/MusicAdder/MusicAdder";
import Main from "./Main";
import NoPage from "./components/404Page/404Page";
import DisplayAlbum from "./components/Album/PageAlbum";
import MainUserProfile from "./components/Profile/MainUserProfile";

import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import PageUser from "./components/User/PageUser";
import MainExplorer from "./components/Explorer/MainExplorer";
import ResultsSearch from "./components/Search/ResultsSearch";

// Material UI
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";

// Enable Browser History for Back and Forward Button
export const appHistory = createBrowserHistory();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="wrapper">
                <Navbar />
                <div className="app px-12">
                    <Routes>
                        <Route exact path="/" element={<Main />} />
                        <Route path="/authentification/:tab" element={<Authentification />} />
                        <Route path="/explorer/:section" element={<MainExplorer />} />
                        <Route path="/results" component={ResultsSearch} />
                        <Route path="/Profile/:username/:tab" element={<MainUserProfile />} />
                        <Route path="/CreateAlbum" element={<MusicAdder />} />
                        <Route path="album/:id" element={<DisplayAlbum />} />
                        <Route path="user/:id" element={<PageUser />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
