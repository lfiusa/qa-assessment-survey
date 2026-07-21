import { NotFoundException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { ShowPesquisaPublicaService } from "src/modules/pesquisa/services/show-pesquisa-publica.service";
import type { FindPesquisaByPublicIdRepository } from "src/modules/pesquisa/repositories/find-pesquisa-by-public-id.repository";

describe("ShowPesquisaPublicaService", () => {
  it("deve lançar NotFoundException quando a pesquisa não existir", async () => {
    const repository = {
      execute: vi.fn().mockResolvedValue(null),
    };

    const service = new ShowPesquisaPublicaService(
      repository as unknown as FindPesquisaByPublicIdRepository,
    );

    await expect(
      service.execute("public-id-inexistente"),
    ).rejects.toThrow(
      new NotFoundException("Pesquisa não encontrada."),
    );

    expect(repository.execute).toHaveBeenCalledWith(
      "public-id-inexistente",
    );

    expect(repository.execute).toHaveBeenCalledTimes(1);
  });
});