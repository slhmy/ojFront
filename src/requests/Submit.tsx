export const submit = (
    problem_id: string,
    problem_region: string,
    src: string,
    language: string,
    judge_type: string,
    output: boolean,
) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("problem_id", problem_id);
    urlencoded.append("problem_region", problem_region);
    urlencoded.append("src", src);
    urlencoded.append("language", language);
    urlencoded.append("judge_type", judge_type);
    urlencoded.append("output", output ? "true" : "false");

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        credentials: credentials,
    };

    return fetch(format("{}judge_server/submit", localStorage['SERVICE_URL']), requestOptions);
}