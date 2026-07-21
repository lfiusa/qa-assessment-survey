# Estratégia de Testes

## Pirâmide de testes

Para este desafio optei por iniciar pela camada de testes unitários, pois ela permite validar regras de negócio de forma rápida e isolada.

Em uma implementação completa, distribuiria os testes da seguinte forma:

- Testes unitários: 18
- Testes de integração: 8
- Testes E2E: 4

A maior parte dos testes está concentrada na camada de testes unitários, pois eles são mais rápidos e baratos de desenvolver e executar. Além disso, permitem identificar falhas nas etapas iniciais do desenvolvimento, evitando que esses problemas se propaguem para as camadas superiores da aplicação e reduzindo o tempo e o custo de correção.

A menor parte dos testes está concentrada na camada de testes E2E, no topo da pirâmide, pois esses testes possuem maior custo de desenvolvimento e execução. Por esse motivo, foram reservados para validar apenas os fluxos mais críticos da aplicação.

**Total planejado: 30 testes.**

> Nesta entrega, entretanto, foram implementados **21 testes unitários**
> e **1 teste E2E**, priorizando as principais regras de negócio e o
> fluxo crítico da aplicação.

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

Também foi implementado **1 teste E2E**, cobrindo o fluxo completo de
criação de uma pesquisa.

**Total implementado: 22 testes automatizados.**

## Arquivos de teste

``` text
tests/unit/api/
tests/e2e/pesquisa.spec.ts
```

------------------------------------------------------------------------

# Testes de integração

Os testes de integração devem validar a API utilizando HTTP e um banco
MySQL dedicado para testes.

Para garantir isolamento e reprodutibilidade entre as execuções, a
estratégia utilizada foi:

-   utilizar um banco separado do ambiente de desenvolvimento;
-   aplicar o schema antes da execução da suíte;
-   limpar os registros entre os testes;
-   utilizar fixtures apenas com os dados necessários para cada cenário;
-   garantir que os testes possam ser executados de forma independente;
-   evitar dependência direta do seed utilizado no ambiente de
    desenvolvimento.

Principais cenários:

-   criação de uma pesquisa válida;
-   rejeição de payload inválido;
-   persistência das perguntas;
-   listagem e filtro de pesquisas;
-   consulta pública;
-   envio de respostas;
-   rejeição de respostas para pesquisas indisponíveis.

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
npm test
```

Executar os testes E2E:

``` bash
npm run test:e2e
```

Ou diretamente:

``` bash
npx playwright test
```

------------------------------------------------------------------------

# Resultado atual

Os testes implementados foram executados com sucesso.

-   **8 arquivos de testes unitários**;
-   **21 testes unitários aprovados**;
-   **1 teste E2E aprovado**;
-   **22 testes automatizados implementados**;
-   **0 falhas**.

A estratégia apresentada considera uma cobertura total de **30 testes**,
distribuídos entre as camadas unitária, integração e E2E conforme a
pirâmide de testes proposta.