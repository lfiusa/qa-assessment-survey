import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { validateRequiredAnswered } from "../../../apps/api/src/modules/pesquisa/helpers/validate-required-answered";

describe("validateRequiredAnswered", () => {
  it("não deve lançar erro quando todas as perguntas obrigatórias forem respondidas", () => {
    const perguntas = [
      {
        id: 1,
        respostaObrigatoria: true,
      },
      {
        id: 2,
        respostaObrigatoria: false,
      },
    ];

    const respostas = [
      {
        perguntaId: 1,
      },
    ];

    expect(() =>
      validateRequiredAnswered(perguntas, respostas),
    ).not.toThrow();
  });

  it("deve informar todas as perguntas obrigatórias não respondidas", () => {
    const perguntas = [
      {
        id: 1,
        respostaObrigatoria: true,
      },
      {
        id: 2,
        respostaObrigatoria: false,
      },
      {
        id: 3,
        respostaObrigatoria: true,
      },
    ];

    const respostas = [
      {
        perguntaId: 2,
      },
    ];

    expect(() =>
      validateRequiredAnswered(perguntas, respostas),
    ).toThrow(
      new BadRequestException(
        "As perguntas obrigatórias a seguir não foram respondidas: 1, 3.",
      ),
    );
  });
});