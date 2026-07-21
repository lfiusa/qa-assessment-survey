import { BadRequestException } from "@nestjs/common";
import { pergunta_tipo } from "@prisma/client";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { SubmitPesquisaPublicaService } from "src/modules/pesquisa/services/submit-pesquisa-publica.service";
import type { FindPesquisaByPublicIdRepository } from "src/modules/pesquisa/repositories/find-pesquisa-by-public-id.repository";
import type { SubmitPesquisaPublicaRepository } from "src/modules/pesquisa/repositories/submit-pesquisa-publica.repository";

describe("SubmitPesquisaPublicaService", () => {
  let findByPublicIdRepository: {
    execute: ReturnType<typeof vi.fn>;
  };

  let submitRepository: {
    execute: ReturnType<typeof vi.fn>;
  };

  let service: SubmitPesquisaPublicaService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21T12:00:00.000Z"));

    findByPublicIdRepository = {
      execute: vi.fn(),
    };

    submitRepository = {
      execute: vi.fn(),
    };

    service = new SubmitPesquisaPublicaService(
      findByPublicIdRepository as unknown as FindPesquisaByPublicIdRepository,
      submitRepository as unknown as SubmitPesquisaPublicaRepository,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve rejeitar o envio quando nenhuma resposta for informada", async () => {
    const dto = {
      iniciadoEm: new Date("2026-07-21T10:00:00.000Z"),
      finalizadoEm: new Date("2026-07-21T10:05:00.000Z"),
      respostas: [],
    };

    await expect(
      service.execute("pub-ativa", dto),
    ).rejects.toThrow(
      new BadRequestException(
        "Ao menos uma resposta deve ser enviada.",
      ),
    );

    expect(findByPublicIdRepository.execute).not.toHaveBeenCalled();
    expect(submitRepository.execute).not.toHaveBeenCalled();
  });

  it("deve validar e persistir as respostas da pesquisa", async () => {
    const pesquisa = {
      id: 1,
      idPublico: "pub-ativa",
      empresaId: "emp-001",
      nome: "Pesquisa ativa",
      descricao: "Pesquisa disponível para respostas",
      dataLancamento: new Date("2026-07-20T00:00:00.000Z"),
      dataEncerramento: new Date("2026-07-30T00:00:00.000Z"),
      estaAtiva: true,
      perguntas: [
        {
          id: 10,
          pesquisaId: 1,
          nome: "Como foi sua experiência?",
          tipo: pergunta_tipo.texto_grande,
          respostaObrigatoria: true,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    };

    const dto = {
      iniciadoEm: new Date("2026-07-21T10:00:00.000Z"),
      finalizadoEm: new Date("2026-07-21T10:05:00.000Z"),
      respostas: [
        {
          perguntaId: 10,
          valorOpcaoTexto: "Minha experiência foi muito boa.",
        },
      ],
    };

    findByPublicIdRepository.execute.mockResolvedValue(pesquisa);
    submitRepository.execute.mockResolvedValue(undefined);

    const resultado = await service.execute("pub-ativa", dto);

    expect(findByPublicIdRepository.execute).toHaveBeenCalledWith(
      "pub-ativa",
    );

    expect(submitRepository.execute).toHaveBeenCalledWith({
      pesquisaId: 1,
      empresaId: "emp-001",
      iniciadoEm: new Date("2026-07-21T10:00:00.000Z"),
      finalizadoEm: new Date("2026-07-21T10:05:00.000Z"),
      respostas: [
        {
          perguntaId: 10,
          opcaoId: null,
          valorOpcaoPadronizada: null,
          valorOpcaoTexto: "Minha experiência foi muito boa.",
          valorNumerico: null,
          outroTexto: null,
          justificativaTexto: null,
        },
      ],
    });

    expect(resultado).toEqual({
      ok: true,
      total: 1,
    });
  });
});