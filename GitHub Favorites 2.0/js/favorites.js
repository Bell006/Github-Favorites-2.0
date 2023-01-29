import { GithubUser } from "./gitHubUser.js"

//Classe contendo a lógica e estrutura de dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector('#app')

        this.load()

        
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        
        this.update()
        this.save()
    }
    
    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado.')
            } 

            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error(`Ops! :(
Usuário não encontrado. Tente novamente!`)
            }


            //novo array que primeiro mostra o user pesquisado, seguido dos outros usuários ja presentes, ESPALHADOS (...this.entries)
            this.entries = [user, ...this.entries];

            this.emptyState()
            this.update()
            this.save()
        
        } catch(error) {
            alert(error.message)
        }

    }

}

// classe que vai criar a visualização e eventos HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()

    }

    update() {

        this.removeAllTr()
        this.emptyState()

        this.entries.forEach(user => {

            const row = this.createRow()

            row.querySelector('td img').src = `https://github.com/${user.login}.png` 
            row.querySelector('td img').alt = `Imagem de ${user.name}`
            row.querySelector('td p').textContent = user.name
            row.querySelector('td a').href = `https://github.com/${user.login}`
            row.querySelector('td span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            
            this.tbody.append(row) //passa as mudanças para o html

            let removeButton = row.querySelector('.RemoveUserButton')

            removeButton.onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                    
                }
   
            }
        })
        
    }


    onAdd() {
        const searchButton = this.root.querySelector('.search .search-button')

        searchButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }

        window.document.onkeyup = event => {
            if(event.key === "Enter"){ 
              const { value } = this.root.querySelector('.search input')
              this.add(value)
            }
          };
    } 

    removeAllTr() {

        //tr em node lists, se comportando como array e podendo receber .forEach
        //.forEach = High Order Function - Recebe uma função como parâmetro
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        const content = `
        <td>
        <img src="https://avatars.githubusercontent.com/u/72817984?v=4" alt="Foto de perfil do usuário">
        <a href="https://github.com/bell006" target="_blank">
            <p>Bell Amancio</p>
            <span>bell006</span>
        </a>
    </td>

    <td class="repositories">50</td>
    <td class="followers">45767</td>
    <td>
        <button class="RemoveUserButton">
            Remover
        </button>
    </td>` 

        tr.innerHTML = content

        return tr
    }

    emptyState() {
        const emptyState = this.root.querySelector('.empty-state')

        if(this.entries.length > 0) {
            emptyState.classList.add('hide')
        } else {
            emptyState.classList.remove('hide')
        }

    }

}