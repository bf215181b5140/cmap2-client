import {useEffect, useState} from "react";
import {ClientCredentials} from "../../global";


export default function HomePage() {

    // const [apiKey, setApiKey] = useState<string>("");
    const [clientCredentials, setClientCredentials] = useState<ClientCredentials>({apiKey: "", username: ""});

    useEffect(() => {
        window.electronAPI.getClientCredentials().then(result => {
            if(result != null) {
                setClientCredentials(result);
            }
        });
    }, []);

    function usernameOnChange(value: string) {
        setClientCredentials({apiKey: clientCredentials.apiKey, username: value});
    }

    function apiKeyOnChange(value: string) {
        setClientCredentials({apiKey: value, username: clientCredentials.username});
    }

    function sendClientCredentials() {
        window.electronAPI.setClientCredentials(clientCredentials);
    }

    function clearClientCredentials() {
        setClientCredentials({apiKey: "", username: ""});
        window.electronAPI.setClientCredentials({apiKey: "", username: ""});
    }

    return (<>
            <input name="username" type="text" value={clientCredentials.username} onChange={(event: any) => usernameOnChange(event.target.value)}/>
            <input name="apiKey" type="text" value={clientCredentials.apiKey} onChange={(event: any) => apiKeyOnChange(event.target.value)}/>
            <button name="setApiKey" onClick={sendClientCredentials}>Connect</button>
            <button name="deleteApiKey" onClick={clearClientCredentials}>Clear</button>
        </>);
}