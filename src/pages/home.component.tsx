import {useEffect, useState} from "react";

export default function HomePage() {

    const [apiKey, setApiKey] = useState<string>("");

    useEffect(() => {
        window.electronAPI.getApiKey().then(result => {
            setApiKey(result);
        });
    }, []);

    function sendApiKey() {
        window.electronAPI.setApiKey(apiKey);
    }

    function removeApiKey() {
        setApiKey("");
        window.electronAPI.setApiKey("");
    }

    return (<>
            <input name="apiKey" type="text" value={apiKey} onChange={(event: any) => setApiKey(event.target.value)}/>
            <button name="setApiKey" onClick={sendApiKey}>Set api key</button>
            <button name="deleteApiKey" onClick={removeApiKey}>Remove api key</button>
        </>);
}