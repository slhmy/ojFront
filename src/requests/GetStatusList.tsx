export const get_status_list = (region: string, problemId: string, userId: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`
          query {
            statusCatalog(
              region: "{}"
              problemId: {}
              userId: {}
              countPerPage: 100
              pageNumber: 1
            ) {
              elements {
                id
                submitTime
                language
                state
                result
              }
            }
          }
        `, region, problemId, userId),
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