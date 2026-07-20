import { test, expect } from '@playwright/test';

test.describe('Fluxo de Pesquisas de Clima', () => {

  test('Deve cadastrar uma nova pesquisa com sucesso', async ({ page }) => {
    await page.goto('/');

    // 1. Clica no botão "Nova Pesquisa"
    await page.getByRole('button', { name: 'Nova Pesquisa' }).click();

    // 2. Preenche o input do nome da pesquisa
    const nomeInput = page.getByTestId('pesquisa-nome-input');
    await expect(nomeInput).toBeVisible({ timeout: 5000 });
    await nomeInput.fill('Pesquisa de Clima Organizacional 2026');
    
    // 3. Preenche as Datas usando os IDs exatos
    const dataLancamentoInput = page.getByTestId('pesquisa-dataLancamento');
    await dataLancamentoInput.focus();
    await dataLancamentoInput.pressSequentially('15072026', { delay: 100 });

    const dataEncerramentoInput = page.getByTestId('pesquisa-dataEncerramento');
    await dataEncerramentoInput.focus();
    await dataEncerramentoInput.pressSequentially('20072026', { delay: 100 });

    // 4. Preenche os campos obrigatórios da PERGUNTA
    const perguntaTitulo = page.getByTestId('pergunta-titulo-input')
      .or(page.getByLabel(/título da pergunta/i))
      .or(page.getByPlaceholder(/digite o título da pergunta/i))
      .or(page.locator('input[name*="pergunta"]').first());
    
    await perguntaTitulo.fill('Como você avalia o seu ambiente de trabalho?');

    // --- NOVA ABORDAGEM PARA O TIPO DA PERGUNTA ---
    // Clica no campo/combobox do tipo de pergunta para abrir as opções
    const perguntaTipoCombo = page.getByTestId('pergunta-tipo-select')
      .or(page.getByLabel(/tipo/i))
      .or(page.locator('select').first())
      .or(page.getByRole('combobox'));
    
    await perguntaTipoCombo.click();
    
    // Espera um pouquinho para as opções renderizarem e clica em uma delas pelo texto (ex: "Texto" ou "Múltipla escolha")
    await page.getByRole('option', { name: 'Texto' })
      .or(page.getByText('Texto', { exact: true }))
      .or(page.locator('option').nth(1)) // fallback para a primeira opção do select se for um select nativo
      .first()
      .click();

    // 5. Marca os campos opcionais / obrigatórios da pergunta (Fregar)
    const respostaObrigatoria = page.getByLabel(/resposta obrigatória/i)
      .or(page.getByText(/resposta obrigatória/i))
      .or(page.locator('input[type="checkbox"]').first());
    
    await respostaObrigatoria.click({ force: true }); // Usando click forcado caso ele esteja escondido atrás de algum estilo CSS

    // 6. Clica no botão de cadastrar
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    // 7. Valida se a pesquisa nova aparece com sucesso na listagem inicial
    await expect(page.getByText('Pesquisa de Clima Organizacional 2026')).toBeVisible({ timeout: 10000 });
  });

});