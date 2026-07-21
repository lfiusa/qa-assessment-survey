import { BadRequestException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateSurveyDates } from "../../../apps/api/src/modules/pesquisa/helpers/validate-survey-dates";

describe("validateSurveyDates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("não deve lançar erro quando as datas forem válidas", () => {
    expect(() =>
      validateSurveyDates(
        new Date("2026-07-22"),
        new Date("2026-07-30"),
      ),
    ).not.toThrow();
  });

  it("não deve lançar erro quando não houver data de encerramento", () => {
    expect(() =>
      validateSurveyDates(
        new Date("2026-07-22"),
        null,
      ),
    ).not.toThrow();
  });

  it("deve lançar erro quando a data de lançamento for anterior a hoje", () => {
    expect(() =>
      validateSurveyDates(
        new Date("2026-07-20"),
        new Date("2026-07-30"),
      ),
    ).toThrow(
      new BadRequestException(
        "A data de lançamento não pode ser anterior a hoje.",
      ),
    );
  });

  it("deve lançar erro quando a data de encerramento for anterior à data de lançamento", () => {
    expect(() =>
      validateSurveyDates(
        new Date("2026-07-25"),
        new Date("2026-07-24"),
      ),
    ).toThrow(
      new BadRequestException(
        "A data de encerramento não pode ser anterior à data de lançamento.",
      ),
    );
  });
});