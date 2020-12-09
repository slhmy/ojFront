export const get_verification_code = (mobile: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("mobile", mobile);

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        credentials: credentials,
    };

    return fetch(format("{}user/get_verification_code", localStorage['SERVICE_URL']), requestOptions);
}