export class GithubUser {
    //pegando os dados (JSON) do usuário  pela api do gitHub
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        //fetch busca os dados na rede - é uma promisse, então precisa de um then
        return fetch(endpoint)
        .then(data => data.json()) //transformando o dado que chega em json
        .then(({login, name, public_repos, followers}) => ({
            login,
            name,
            public_repos,
            followers,
        })) //retornando o dado organizado como um obj
    }
}