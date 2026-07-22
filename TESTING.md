# Estratégia de Testes

## Pirâmide de testes

Para este desafio optei por iniciar pela camada de testes unitários,
pois ela permite validar regras de negócio de forma rápida e isolada.

Em um cenário ideal, considerando uma implementação completa, a distribuição dos testes seria a seguinte:

-   Testes unitários: 18
-   Testes de integração: 8
-   Testes E2E: 4

A maior parte dos testes está concentrada na camada de testes unitários,
pois eles são mais rápidos e baratos de desenvolver e executar. Além
disso, permitem identificar falhas nas etapas iniciais do
desenvolvimento, evitando que esses problemas se propaguem para as
camadas superiores da aplicação e reduzindo o tempo e o custo de
correção.

A menor parte dos testes está concentrada na camada de testes E2E, no
topo da pirâmide, pois esses testes possuem maior custo de
desenvolvimento e execução. Por esse motivo, foram reservados para
validar apenas os fluxos mais críticos da aplicação.

**Total planejado: 30 testes.**

> Nesta entrega, foram implementados **21 testes unitários**, **3 testes
> de integração** e **1 teste E2E**, priorizando as principais regras de
> negócio, a integração da API com o banco de dados e o fluxo crítico da
> aplicação.

------------------------------------------------------------------------

# Testes implementados

Foram implementados **21 testes unitários**, distribuídos em **8
arquivos**, cobrindo as principais regras de negócio da API, incluindo:

-   criação de pesquisas;
-   listagem de pesquisas;
-   validação de datas;
-   validação de campos obrigatórios;
-   validação de respostas obrigatórias;
-   validação de valores;
-   validação de respostas duplicadas.

Também foram implementados **3 testes de integração**, cobrindo:

-   criação de uma pesquisa válida e persistência dos dados no banco;
-   rejeição de pesquisa com nome duplicado, retornando `409`;
-   rejeição de payload inválido, retornando `400`.

Além disso, foi implementado **1 teste E2E**, cobrindo o fluxo completo
de criação de uma pesquisa pela aplicação Web.

**Total implementado: 25 testes automatizados.**

## Arquivos de teste

``` text
tests/unit/api/
tests/integration/create-pesquisa.integration.spec.ts
tests/e2e/pesquisa.spec.ts
```

------------------------------------------------------------------------

# Testes de integração

Os testes de integração validam a API utilizando HTTP e um banco MySQL
dedicado para testes.

Para garantir isolamento e reprodutibilidade entre as execuções, a
estratégia utilizada foi:

-   utilizar um banco separado do ambiente de desenvolvimento;
-   aplicar o schema no banco de testes antes da execução da suíte;
-   limpar os registros entre os testes;
-   utilizar apenas os dados necessários para cada cenário;
-   garantir que os testes possam ser executados de forma independente;
-   evitar dependência direta do seed utilizado no ambiente de
    desenvolvimento.

Cenários implementados:

-   criação de uma pesquisa válida;
-   persistência da pesquisa e das perguntas;
-   rejeição de pesquisa com nome duplicado;
-   rejeição de payload inválido.

------------------------------------------------------------------------

# Pipeline de CI

A estratégia para o GitLab CI é:

1.  instalar as dependências com `npm ci`;
2.  iniciar um MySQL exclusivo para os testes;
3.  gerar o Prisma Client e aplicar o schema;
4.  executar os testes unitários e de integração;
5.  iniciar a API e a aplicação Web;
6.  executar os testes E2E com Playwright;
7.  armazenar relatórios e evidências em caso de falha.

Essa sequência reduz o tempo de diagnóstico, executando primeiro os
testes mais rápidos e deixando os E2E para o final.

------------------------------------------------------------------------

# Como executar

Executar os testes unitários e de integração:

``` bash
npm run test:integration
```

Executar os testes E2E:

``` bash
npm run test:e2e
```

Ou diretamente:

``` bash
npx playwright test
```

Para o teste E2E, a API deve estar rodando na porta `3000` e a aplicação
Web na porta `5173`.

------------------------------------------------------------------------

# Resultado atual

Os testes implementados foram executados com sucesso.

-   **8 arquivos de testes unitários**;
-   **21 testes unitários aprovados**;
-   **1 arquivo de testes de integração**;
-   **3 testes de integração aprovados**;
-   **1 teste E2E aprovado**;
-   **25 testes automatizados implementados**;
-   **0 falhas**.

Nesta entrega, foram implementados 25 testes automatizados, distribuídos entre as camadas de testes unitários, integração e E2E, priorizando as principais regras de negócio, a integração da API e o fluxo crítico da aplicação.
