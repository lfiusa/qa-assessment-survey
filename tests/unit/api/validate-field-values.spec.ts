import { BadRequestException } from "@nestjs/common";
import { pergunta_tipo } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { validateFieldValues } from "../../../apps/api/src/modules/pesquisa/helpers/validate-field-values";

describe("validateFieldValues", () => {
  it("deve rejeitar pontuação maior que 5", () => {
    const pergunta = {
      id: 1,
      tipo: pergunta_tipo.pontuacao_0_a_5,
      respostaObrigatoria: false,
      justificarResposta: false,
      permitirOutro: false,
      opcoes: [],
    };

    const resposta = {
      perguntaId: 1,
      valorNumerico: 6,
    };

    expect(() =>
      validateFieldValues(pergunta, resposta),
    ).toThrow(
      new BadRequestException(
        "A pontuação deve estar entre 0 e 5.",
      ),
    );
  });

  it("deve rejeitar uma opção que não pertence à pergunta", () => {
    const pergunta = {
      id: 20,
      tipo: pergunta_tipo.multipla_escolha,
      respostaObrigatoria: false,
      justificarResposta: false,
      permitirOutro: false,
      opcoes: [
        {
          id: 201,
        },
        {
          id: 202,
        },
      ],
    };

    const resposta = {
      perguntaId: 20,
      opcaoId: 999,
    };

    expect(() =>
      validateFieldValues(pergunta, resposta),
    ).toThrow(
      new BadRequestException(
        "A opção 999 não pertence à pergunta 20.",
      ),
    );
  });
});