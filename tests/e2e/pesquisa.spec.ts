import { test } from "@playwright/test";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

test.describe("Cadastro de pesquisa", () => {
  test("deve criar uma pesquisa com sucesso", async ({ page }) => {
    const nomePesquisa = `Pesquisa E2E ${Date.now()}`;

    const dataInicial = new Date();
    dataInicial.setDate(dataInicial.getDate() + 1);

    const dataFinal = new Date();
    dataFinal.setDate(dataFinal.getDate() + 2);

    page.on("request", (request) => {
      console.log(
        "REQUISIÇÃO:",
        request.method(),
        request.url(),
      );
    });

    page.on("response", async (response) => {
      console.log(
        "RESPOSTA:",
        response.status(),
        response.request().method(),
        response.url(),
      );

      if (response.status() >= 400) {
        try {
          console.log("BODY DO ERRO:", await response.text());
        } catch {
          console.log("Não foi possível ler o body da resposta.");
        }
      }
    });

    page.on("requestfailed", (request) => {
      console.log(
        "REQUISIÇÃO FALHOU:",
        request.method(),
        request.url(),
        request.failure()?.errorText,
      );
    });

    page.on("console", (message) => {
      console.log(
        "CONSOLE DO NAVEGADOR:",
        message.type(),
        message.text(),
      );
    });

    page.on("pageerror", (error) => {
      console.log("ERRO JAVASCRIPT:", error.message);
    });

    await page.goto("/pesquisas/criar");

    await page
      .getByTestId("pesquisa-nome-input")
      .fill(nomePesquisa);

    await page
      .getByTestId("pesquisa-dataLancamento")
      .fill(formatDate(dataInicial));

    await page
      .getByTestId("pesquisa-dataEncerramento")
      .fill(formatDate(dataFinal));

    await page
      .getByTestId("pergunta-nome-input-0")
      .fill("O que você achou do nosso atendimento?");

    await page
      .getByTestId("pergunta-tipo-select-0")
      .selectOption("texto_grande");

    await page
      .getByTestId("pergunta-respostaObrigatoria-0")
      .check();

    await page
      .getByTestId("create-button")
      .click();

    await page.waitForTimeout(5000);

    console.log("URL FINAL:", page.url());
  });
});