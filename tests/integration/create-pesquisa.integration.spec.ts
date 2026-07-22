import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { pergunta_tipo } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { AppModule } from '../../apps/api/src/app.module';
import { PrismaService } from '../../apps/api/src/prisma/prisma.service';

describe('POST /pesquisas - integração', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());

    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.resposta.deleteMany();
    await prisma.opcao.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.pesquisa.deleteMany();
    await prisma.empresa.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar uma pesquisa e persistir os dados no banco', async () => {
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa Teste',
      },
    });

    const payload = {
      empresaId: empresa.id,
      nome: 'Pesquisa de Clima 2026',
      descricao: 'Pesquisa interna para avaliar o clima organizacional.',
      dataLancamento: new Date().toISOString(),
      dataEncerramento: null,
      perguntas: [
        {
          nome: 'Como você avalia o ambiente de trabalho?',
          tipo: pergunta_tipo.texto_grande,
          respostaObrigatoria: true,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/pesquisas')
      .send(payload);

    expect(response.status).toBe(201);

    const pesquisaSalva = await prisma.pesquisa.findFirst({
      where: {
        empresaId: empresa.id,
        nome: payload.nome,
      },
      include: {
        perguntas: true,
      },
    });

    expect(pesquisaSalva).not.toBeNull();
    expect(pesquisaSalva?.nome).toBe(payload.nome);
    expect(pesquisaSalva?.descricao).toBe(payload.descricao);
    expect(pesquisaSalva?.empresaId).toBe(empresa.id);
    expect(pesquisaSalva?.perguntas).toHaveLength(1);
    expect(pesquisaSalva?.perguntas[0].nome).toBe(
      payload.perguntas[0].nome,
    );
    expect(pesquisaSalva?.perguntas[0].respostaObrigatoria).toBe(true);
  });

  it('deve retornar 409 ao tentar criar uma pesquisa com nome duplicado', async () => {
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa Duplicada',
      },
    });

    const payload = {
      empresaId: empresa.id,
      nome: 'Pesquisa Repetida',
      descricao: 'Teste de duplicidade',
      dataLancamento: new Date().toISOString(),
      dataEncerramento: null,
      perguntas: [
        {
          nome: 'Pergunta de teste',
          tipo: pergunta_tipo.texto_grande,
          respostaObrigatoria: true,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/pesquisas')
      .send(payload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/pesquisas')
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      'Já existe uma pesquisa com este nome para esta empresa.',
    );

    const quantidade = await prisma.pesquisa.count({
      where: {
        empresaId: empresa.id,
        nome: payload.nome,
      },
    });

    expect(quantidade).toBe(1);
  });

  it('deve retornar 400 ao enviar um payload inválido', async () => {
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa Payload Inválido',
      },
    });

    const payload = {
      empresaId: empresa.id,
      nome: '',
      descricao: 'Payload inválido',
      dataLancamento: new Date().toISOString(),
      dataEncerramento: null,
      perguntas: [],
    };

    const response = await request(app.getHttpServer())
      .post('/pesquisas')
      .send(payload);

    expect(response.status).toBe(400);

    const quantidade = await prisma.pesquisa.count({
      where: {
        empresaId: empresa.id,
      },
    });

    expect(quantidade).toBe(0);
  });
});