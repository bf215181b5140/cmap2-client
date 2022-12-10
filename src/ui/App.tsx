import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/home.component";
import AboutPage from "./pages/about.component";
import React from "react";
import styled from "styled-components";
import TitleBar from "./components/titleBar.component";
import NavBar from "./components/navBar.component";
import "./App.css";
import "remixicon/fonts/remixicon.css";

export default function App() {

    return (<AppStyled>
        <TitleBar/>
        <MainWindow>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="*" element={<HomePage/>}/>
                </Routes>
            </div>
        </MainWindow>
        <NavBar/>
    </AppStyled>);
}

const MainWindow = styled.div`
  width: 100%;
  background: rgba(20, 24, 28, 0.95);
  border-radius: 10px;
  flex: 1;
`;

const AppStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;