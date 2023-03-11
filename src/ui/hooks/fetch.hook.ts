export default function useFetch() {

    const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response | void> => {
        // TODO set custom init with token
        const result = await fetch(input, init)
            .then(async res => {
                if (res.ok || res.status === 200) return res;
                if (res.status === 401) {
                    const auth = await authenticate();
                    if (auth) {
                        return customFetch(input, init);
                    } else {
                        // TODO ERROR POPUP
                    }
                }
            }).catch(err => {
                console.log('custom fetch error on url:', input, 'with response:', err);
                // TODO ERROR POPUP
            });
        return result;
    };

    async function authenticate(): Promise<boolean> {
        return await fetch('URL', {
            method: 'POST',
            body: JSON.stringify({
                username: 'sawks',
                passwork: 'password'
            })
        }).then(res => {
            console.log('authentication in useFetch successful??', res.status);
            return res.ok || res.status === 200;
            // TODO set token
            // TODO ERROR POPUP
        }).catch(err => {
            // TODO ERROR POPUP
            console.log('authentication in useFetch failed:', err);
            return false;
        });
    }

    return customFetch;
}
