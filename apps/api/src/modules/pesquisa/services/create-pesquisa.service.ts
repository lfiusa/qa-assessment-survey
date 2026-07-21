import { ConflictException, Injectable } from "@nestjs/common";
import { getStatusFromPeriod } from "../helpers/get-status-from-period";
import { validateSurveyDates } from "../helpers/validate-survey-dates";
import { CreatePesquisaDto } from "../dtos/create-pesquisa.dto";
import { CreatePesquisaRepository } from "../repositories/create-pesquisa.repository";
import { FindPesquisaByNomeRepository } from "../repositories/find-pesquisa-by-nome.repository";

@Injectable()
export class CreatePesquisaService {
  constructor(
    private readonly createRepository: CreatePesquisaRepository,
    private readonly findByNomeRepository: FindPesquisaByNomeRepository,
  ) {}

  async execute(data: CreatePesquisaDto) {
    const dataLancamento = new Date(data.dataLancamento);
    const dataEncerramento = data.dataEncerramento
      ? new Date(data.dataEncerramento)
      : null;

    validateSurveyDates(dataLancamento, dataEncerramento);

    const surveyWithSameName = await this.findByNomeRepository.execute(
      data.empresaId,
      data.nome,
    );

    if (surveyWithSameName) {
      throw new ConflictException(
        "Já existe uma pesquisa com este nome para esta empresa.",
      );
    }

    const isActive: boolean = getStatusFromPeriod(
      dataLancamento,
      dataEncerramento,
    );

    return await this.createRepository.execute(
      {
        empresaId: data.empresaId,
        nome: data.nome,
        descricao: data.descricao,
        dataLancamento,
        dataEncerramento,
        perguntas: data.perguntas.map((pergunta) => ({
          nome: pergunta.nome,
          tipo: pergunta.tipo,
          respostaObrigatoria: pergunta.respostaObrigatoria,
          justificarResposta: pergunta.justificarResposta,
          permitirOutro: pergunta.permitirOutro,
          opcoes: pergunta.opcoes,
        })),
      },
      isActive,
    );
  }
}
