import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home.component";
import AboutPage from "./pages/about.component";
import React from "react";

export default function App() {

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/about" element={<AboutPage />}/>
                <Route path="*" element={<HomePage />}/>
            </Routes>
        </div>
    );
}
