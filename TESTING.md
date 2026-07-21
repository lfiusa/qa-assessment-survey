# Estratégia de Testes

## Pirâmide de testes

Para este desafio optei por iniciar pela camada de testes unitários, pois ela permite validar regras de negócio de forma rápida e isolada.

Em uma implementação completa, distribuiria os testes da seguinte forma:

- Testes unitários: 18
- Testes de integração: 8
- Testes E2E: 4

A maior parte dos testes estão localizados nos testes unitários, pois esses são mais rápidos e baratos de serem feitos, e evitam que falhas encontradas nas etapas iniciais do desenvolvimento se espalhem para as camadas mais altas da aplicação, reduzindo o tempo e os custos necessários para corrigir problemas nas etapas posteriores do desenvolvimento.
A menor parte dos testes está concentrada nos testes E2E no topo da pirâmide, pois esses testes possuem maior custo de desenvolvimento e execução, por isso, foram reservados para validar apenas os fluxos mais críticos da aplicação.

Total: 30 testes.

# Testes Implementados

Até o momento foram implementados **6 testes unitários** para a função `getStatusFromPeriod`, responsável por verificar se uma pesquisa está disponível de acordo com sua data de lançamento e data de encerramento.

## Cenários testados

- Pesquisa dentro do período ativo.
- Pesquisa ainda não iniciada.
- Pesquisa já encerrada.
- Pesquisa iniciando na data atual.
- Pesquisa encerrando na data atual.
- Pesquisa sem data de encerramento.

## Arquivo de teste

```
tests/unit/api/get-status-from-period.spec.ts
```

---

# Como executar

Executar apenas este arquivo de teste:

```bash
npx vitest run tests/unit/api/get-status-from-period.spec.ts
```

Executar todos os testes configurados no projeto:

```bash
npm test
```

---

# Resultado

Os testes foram executados com sucesso.

- **1** arquivo de teste.
- **6** testes executados.
- **6** testes aprovados.
- **0** falhas.
