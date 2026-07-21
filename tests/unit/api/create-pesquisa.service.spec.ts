import { ConflictException } from "@nestjs/common";
import { pergunta_tipo } from "@prisma/client";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { CreatePesquisaService } from "../../../apps/api/src/modules/pesquisa/services/create-pesquisa.service";
import type { CreatePesquisaRepository } from "../../../apps/api/src/modules/pesquisa/repositories/create-pesquisa.repository";
import type { FindPesquisaByNomeRepository } from "../../../apps/api/src/modules/pesquisa/repositories/find-pesquisa-by-nome.repository";

describe("CreatePesquisaService", () => {
  let createRepository: {
    execute: ReturnType<typeof vi.fn>;
  };

  let findByNomeRepository: {
    execute: ReturnType<typeof vi.fn>;
  };

  let service: CreatePesquisaService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21T12:00:00.000Z"));

    createRepository = {
      execute: vi.fn(),
    };

    findByNomeRepository = {
      execute: vi.fn(),
    };

    service = new CreatePesquisaService(
      createRepository as unknown as CreatePesquisaRepository,
      findByNomeRepository as unknown as FindPesquisaByNomeRepository,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve criar uma pesquisa quando os dados forem válidos", async () => {
    const dto = {
      empresaId: "emp-001",
      nome: "Pesquisa de satisfação",
      descricao: "Pesquisa unitária",
      dataLancamento: new Date("2026-07-21T00:00:00.000Z"),
      dataEncerramento: new Date("2026-07-30T00:00:00.000Z"),
      perguntas: [
        {
          nome: "Como foi o atendimento?",
          tipo: pergunta_tipo.texto_grande,
          respostaObrigatoria: true,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    };

    const pesquisaCriada = {
      id: 1,
      idPublico: "pub-unitaria",
      ...dto,
      estaAtiva: true,
    };

    findByNomeRepository.execute.mockResolvedValue(null);
    createRepository.execute.mockResolvedValue(pesquisaCriada);

    const resultado = await service.execute(dto);

    expect(findByNomeRepository.execute).toHaveBeenCalledWith(
      "emp-001",
      "Pesquisa de satisfação",
    );

    expect(createRepository.execute).toHaveBeenCalledWith(
      {
        empresaId: "emp-001",
        nome: "Pesquisa de satisfação",
        descricao: "Pesquisa unitária",
        dataLancamento: new Date("2026-07-21T00:00:00.000Z"),
        dataEncerramento: new Date("2026-07-30T00:00:00.000Z"),
        perguntas: [
          {
            nome: "Como foi o atendimento?",
            tipo: pergunta_tipo.texto_grande,
            respostaObrigatoria: true,
            justificarResposta: false,
            permitirOutro: false,
            opcoes: [],
          },
        ],
      },
      true,
    );

    expect(resultado).toEqual(pesquisaCriada);
  });

  it("deve lançar conflito quando já existir uma pesquisa com o mesmo nome", async () => {
    const dto = {
      empresaId: "emp-001",
      nome: "Pesquisa existente",
      descricao: "Pesquisa duplicada",
      dataLancamento: new Date("2026-07-21T00:00:00.000Z"),
      dataEncerramento: new Date("2026-07-30T00:00:00.000Z"),
      perguntas: [
        {
          nome: "Pergunta",
          tipo: pergunta_tipo.texto_grande,
          respostaObrigatoria: false,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    };

    findByNomeRepository.execute.mockResolvedValue({
      id: 99,
      nome: "Pesquisa existente",
    });

    await expect(service.execute(dto)).rejects.toThrow(
      new ConflictException(
        "Já existe uma pesquisa com este nome para esta empresa.",
      ),
    );

    expect(createRepository.execute).not.toHaveBeenCalled();
  });
});