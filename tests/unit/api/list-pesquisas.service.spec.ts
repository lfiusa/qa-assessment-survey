import { describe, expect, it, vi } from "vitest";
import { ListPesquisasService } from "../../../apps/api/src/modules/pesquisa/services/list-pesquisas.service";
import type { ListPesquisasRepository } from "../../../apps/api/src/modules/pesquisa/repositories/list-pesquisas.repository";

describe("ListPesquisasService", () => {
  it("deve repassar os filtros ao repositório e retornar a listagem", async () => {
    const listRepository = {
      execute: vi.fn(),
    };

    const service = new ListPesquisasService(
      listRepository as unknown as ListPesquisasRepository,
    );

    const filtros = {
      page: 1,
      perPage: 10,
      status: "ativo" as const,
      orderBy: "nome" as const,
    };

    const respostaDoRepositorio = {
      data: [
        {
          id: 1,
          nome: "Pesquisa ativa",
        },
      ],
      total: 1,
      page: 1,
      perPage: 10,
    };

    listRepository.execute.mockResolvedValue(respostaDoRepositorio);

    const resultado = await service.execute(filtros);

    expect(listRepository.execute).toHaveBeenCalledWith(filtros);
    expect(listRepository.execute).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(respostaDoRepositorio);
  });
});