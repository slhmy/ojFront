export const get_rank_list = (region: string) => {
    var format = require('string-format')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var graphql = JSON.stringify({
        query: format(`query {
          acmRank(region: "{}") {
            columes {
              isUnrated
              rank
              userPreviews {
                id
                username
              }
              solutionPreviews {
                problemId
                tryTimes
                state
                solveTime
              }
              totalAccepted
              totalPenalty
            }
          }
        }
        `, region),
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