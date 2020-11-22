# Webneek

## Aplicações

```sh
samples
├── client
├── client-e2e
└── server
```

## Bibliotecas

```sh
packages
├── media
├── rtc
│   └── data
└── server
    └── core
```

## Gestão

Temos alguns arquivos que devemos nos atentar, 3 principais e 2 secundários, onde sempre que trabalhamos na estrutura do repo, seja, criando, alterando ou removendo qualquer aplicação ou biblioteca, deve-se conferir se estão de acordo.

```sh
├── nx.json       # <- Nome do projeto e suas tags de controle #
├── package.json  # <- Dependências externas de todos projetos #
├── tsconfig.base.json # <- Dependências internas dos projetos #
├── tslint.json   # <- Aqui é onde criamos as tags de controle #
├── workspace.json # <- Principal, fica todas as configurações #
```

## Estrutura de comandos

- `nx` (comando)
  - `serve / build / test / lint / e2e / run / generate` (ações)
  - `projeto` Ou `--projects projeto1, projeto2, projeto 3` (projetos)
  - demais parâmetros que variam de acordo com a ação

Para saber mais, acesse [este link para doc](https://nx.dev/latest/angular/cli/overview) do `nx cli`

> _Não vale a pena extender muito, pois caso atualizem precisaríamos manter isso aqui._

## Git

Vamos simplificar as coisas e trabalhar somente com branch principal e branch feature.

Sendo assim, a `main` seria nossa branch principal onde **não devem haver commits**, apenas _pull requests_, a branch feature que está abrindo pull request deve sempre estar atualizada com o que pode ter entrado na main enquanto foi desenvolvida a task, se necessário, utilize o `rebase` para isso. Depois listamos aqui de cola os principais comandos que serão usados.

> _Em casos de pânico_
>
> Talvez este link: [Oh shit git.com](https://ohshitgit.com/) possa ajudar `;)`

Tente manter os commits pequenos que resolvam poucas coisas, feature branches com objetivo bem definido e mensagem e cuidado com a mensagem do commit, ela deve explicar **o problema** resolvido e não **como** ele foi resolvido.

Para comitar é só executar `./cmt`

No code review, ao aceitar o pull request, **nunca** aceite clicando no botão só de merge, ele gera um _merge commit_ intermediário que dificulta a navegação futura, clique **sempre** no (rebase & merge) ou (squash & merge) caso seja necessário juntar ou remover um ou mais commits, conversamos melhor depois também, blz? nozes 👊

---

<br>

---

This project was generated using [Nx](https://nx.dev).

**Nx is a set of Extensible Dev Tools for Monorepos.**

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@webneek/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
