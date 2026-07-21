import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getStatusFromPeriod } from "../../../apps/api/src/modules/pesquisa/helpers/get-status-from-period";

describe("getStatusFromPeriod", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve retornar true quando a pesquisa estiver dentro do período", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-20"),
      new Date("2026-07-30"),
    );

    expect(resultado).toBe(true);
  });

  it("deve retornar false quando a pesquisa ainda não começou", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-22"),
      new Date("2026-07-30"),
    );

    expect(resultado).toBe(false);
  });

  it("deve retornar false quando a pesquisa já terminou", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-10"),
      new Date("2026-07-20"),
    );

    expect(resultado).toBe(false);
  });

  it("deve retornar true quando a pesquisa começa hoje", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-21"),
      new Date("2026-07-30"),
    );

    expect(resultado).toBe(true);
  });

  it("deve retornar true quando a pesquisa termina hoje", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-10"),
      new Date("2026-07-21"),
    );

    expect(resultado).toBe(true);
  });

  it("deve retornar true quando a pesquisa não possui data de encerramento", () => {
    const resultado = getStatusFromPeriod(
      new Date("2026-07-10"),
      null,
    );

    expect(resultado).toBe(true);
  });

});