import { BadRequestException } from "@nestjs/common";
import { pergunta_tipo } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { validateRequiredFields } from "../../../apps/api/src/modules/pesquisa/helpers/validate-required-fields";

describe("validateRequiredFields", () => {
  it("deve aceitar o campo principal preenchido em uma pergunta obrigatória", () => {
    const pergunta = {
      id: 1,
      tipo: pergunta_tipo.texto_grande,
      respostaObrigatoria: true,
      justificarResposta: false,
      permitirOutro: false,
      opcoes: [],
    };

    const resposta = {
      perguntaId: 1,
      valorOpcaoTexto: "Atendimento excelente.",
    };

    expect(() =>
      validateRequiredFields(pergunta, resposta),
    ).not.toThrow();
  });

  it("deve exigir justificativa quando a pergunta estiver configurada para justificá-la", () => {
    const pergunta = {
      id: 5,
      tipo: pergunta_tipo.pontuacao_0_a_10,
      respostaObrigatoria: true,
      justificarResposta: true,
      permitirOutro: false,
      opcoes: [],
    };

    const resposta = {
      perguntaId: 5,
      valorNumerico: 8,
    };

    expect(() =>
      validateRequiredFields(pergunta, resposta),
    ).toThrow(
      new BadRequestException(
        "A pergunta 5 exige justificativa.",
      ),
    );
  });
});