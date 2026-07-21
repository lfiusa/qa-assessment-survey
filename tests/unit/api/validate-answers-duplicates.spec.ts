import { BadRequestException } from "@nestjs/common";
import { pergunta_tipo } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { validateAnswersDuplicates } from "../../../apps/api/src/modules/pesquisa/helpers/validate-answers-duplicates";
import type { PerguntaInput } from "../../../apps/api/src/modules/pesquisa/helpers/types";

describe("validateAnswersDuplicates", () => {
  it("deve rejeitar duas respostas para uma pergunta de resposta única", () => {
    const pergunta: PerguntaInput = {
      id: 1,
      tipo: pergunta_tipo.texto_grande,
      respostaObrigatoria: false,
      justificarResposta: false,
      permitirOutro: false,
      opcoes: [],
    };

    const perguntasMap = new Map<number, PerguntaInput>([
      [pergunta.id, pergunta],
    ]);

    const respostas = [
      {
        perguntaId: 1,
        valorOpcaoTexto: "Primeira resposta",
      },
      {
        perguntaId: 1,
        valorOpcaoTexto: "Segunda resposta",
      },
    ];

    expect(() =>
      validateAnswersDuplicates(perguntasMap, respostas),
    ).toThrow(
      new BadRequestException(
        "A pergunta 1 foi respondida mais de uma vez.",
      ),
    );
  });

  it("deve rejeitar uma opção repetida em pergunta de opções diversas", () => {
    const pergunta: PerguntaInput = {
      id: 10,
      tipo: pergunta_tipo.opcoes_diversas,
      respostaObrigatoria: false,
      justificarResposta: false,
      permitirOutro: true,
      opcoes: [
        {
          id: 100,
        },
        {
          id: 101,
        },
      ],
    };

    const perguntasMap = new Map<number, PerguntaInput>([
      [pergunta.id, pergunta],
    ]);

    const respostas = [
      {
        perguntaId: 10,
        opcaoId: 100,
      },
      {
        perguntaId: 10,
        opcaoId: 100,
      },
    ];

    expect(() =>
      validateAnswersDuplicates(perguntasMap, respostas),
    ).toThrow(
      new BadRequestException(
        "A opção 100 foi enviada mais de uma vez para a pergunta 10.",
      ),
    );
  });
});