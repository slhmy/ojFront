export const me = () => {
    var format = require('string-format')

    let credentials: any = 'include';
    var requestOptions = {
        method: 'GET',
        credentials: credentials,
    };

    return fetch(format("{}user/me", localStorage['SERVICE_URL']), requestOptions);
}