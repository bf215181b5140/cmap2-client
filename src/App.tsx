import './App.css';
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home.component";
import AboutPage from "./pages/about.component";
import React from "react";

export default function App() {
    let counter: number = 0;

    // @ts-ignore
    window.electronAPI.onUpdateCounter((_event: any, value: any) => {
        counter = counter + value;
        console.log(counter);
    })

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
