import './App.css';
import {Route, Switch, HashRouter} from "react-router-dom";
import SideBarComponent from "./components/sideBar.component";
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
        <HashRouter>
            <div className="App">
                <SideBarComponent/>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route exact path="/about" component={AboutPage}/>
                    {/*<Route exact path="*" component={ErrorPage} />*/}
                </Switch>
            </div>
        </HashRouter>
    );
}
