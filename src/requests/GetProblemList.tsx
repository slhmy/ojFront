export const get_problem_list = (region: string, title: any, difficulty: any) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`query {
            problemCatalog(
                region: "{}"
                title: "{}"
                difficulty: {}
            ) {
                elements {
                    id
                    title
                    tags
                    difficulty
                    acceptRate
                    isPassed
                    isTried
                }
            }
        }`,
            region,
            (title === undefined || title === null || title === '') ? "" : title,
            (difficulty === undefined || difficulty === null || difficulty === '') ? null : `"${difficulty}"`
        ),
        variables: {}
    })

    let credentials: any = 'include';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        credentials: credentials,
    };
    return fetch(format("{}graphql", localStorage['SERVICE_URL']), requestOptions);
}