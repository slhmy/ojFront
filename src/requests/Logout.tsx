export const logout = () => {
    var format = require('string-format')

    let credentials: any = 'include';
    var requestOptions = {
        method: 'GET',
        credentials: credentials,
    };

    return fetch(format("{}user/logout", localStorage['SERVICE_URL']), requestOptions);
}