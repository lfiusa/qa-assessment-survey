import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { PerguntaInput } from "../helpers/types";
import { validateAllowedFields } from "../helpers/validate-allowed-fields";
import { validateAnswersDuplicates } from "../helpers/validate-answers-duplicates";
import { validateConditionalFields } from "../helpers/validate-conditional-fields";
import { validateFieldValues } from "../helpers/validate-field-values";
import { validateRequiredAnswered } from "../helpers/validate-required-answered";
import { validateRequiredFields } from "../helpers/validate-required-fields";
import { validatePesquisaDisponivel } from "../helpers/validate-pesquisa-disponivel";

import type { SubmitPesquisaPublicaDto } from "../dtos/submit-pesquisa-publica.dto";
import { FindPesquisaByPublicIdRepository } from "../repositories/find-pesquisa-by-public-id.repository";
import { SubmitPesquisaPublicaRepository } from "../repositories/submit-pesquisa-publica.repository";

@Injectable()
export class SubmitPesquisaPublicaService {
  constructor(
    private readonly findByPublicIdRepository: FindPesquisaByPublicIdRepository,
    private readonly submitRepository: SubmitPesquisaPublicaRepository,
  ) {}

  async execute(idPublico: string, data: SubmitPesquisaPublicaDto) {
    if (!data.respostas || data.respostas.length === 0) {
      throw new BadRequestException(
        "Ao menos uma resposta deve ser enviada.",
      );
    }

    if (data.iniciadoEm && data.finalizadoEm) {
      const iniciadoEm = new Date(data.iniciadoEm);
      const finalizadoEm = new Date(data.finalizadoEm);

      if (iniciadoEm.getTime() > finalizadoEm.getTime()) {
        throw new BadRequestException(
          "A data de início não pode ser posterior à data de finalização.",
        );
      }
    }

    const pesquisa = await this.findByPublicIdRepository.execute(idPublico);

    if (!pesquisa) {
      throw new NotFoundException("Pesquisa não encontrada.");
    }

    validatePesquisaDisponivel(pesquisa);

    const perguntasMap = new Map<number, PerguntaInput>();

    for (const pergunta of pesquisa.perguntas) {
      perguntasMap.set(pergunta.id, {
        id: pergunta.id,
        tipo: pergunta.tipo,
        respostaObrigatoria: pergunta.respostaObrigatoria,
        justificarResposta: pergunta.justificarResposta,
        permitirOutro: pergunta.permitirOutro,
        opcoes: pergunta.opcoes.map((opcao) => ({
          id: opcao.id,
        })),
      });
    }

    validateAnswersDuplicates(perguntasMap, data.respostas);

    validateRequiredAnswered(pesquisa.perguntas, data.respostas);

    for (const resposta of data.respostas) {
      const pergunta = perguntasMap.get(resposta.perguntaId)!;

      validateAllowedFields(pergunta, resposta);
      validateConditionalFields(pergunta, resposta);
      validateRequiredFields(pergunta, resposta);
      validateFieldValues(pergunta, resposta);
    }

    await this.submitRepository.execute({
      pesquisaId: pesquisa.id,
      empresaId: pesquisa.empresaId,
      iniciadoEm: data.iniciadoEm
        ? new Date(data.iniciadoEm)
        : null,
      finalizadoEm: data.finalizadoEm
        ? new Date(data.finalizadoEm)
        : null,
      respostas: data.respostas.map((resposta) => ({
        perguntaId: resposta.perguntaId,
        opcaoId: resposta.opcaoId ?? null,
        valorOpcaoPadronizada:
          resposta.valorOpcaoPadronizada ?? null,
        valorOpcaoTexto: resposta.valorOpcaoTexto ?? null,
        valorNumerico: resposta.valorNumerico ?? null,
        outroTexto: resposta.outroTexto ?? null,
        justificativaTexto:
          resposta.justificativaTexto ?? null,
      })),
    });

    return {
      ok: true,
      total: data.respostas.length,
    };
  }
}