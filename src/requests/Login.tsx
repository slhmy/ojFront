export const login = (identity_info: string, password: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("identity_info", identity_info);
    urlencoded.append("password", password);

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        credentials: credentials,
    };

    return fetch(format("{}user/login", localStorage['SERVICE_URL']), requestOptions);
}