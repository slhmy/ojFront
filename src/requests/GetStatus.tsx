export const get_status = (id: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`query {
            status(id: "{}") {
              language
              src
              judgeResult {
                err
                data {
                  cpuTime
                  memory
                  result
                  output
                }
              }
              errResult {
                err
                data
              }
            }
          }`, id),
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