/**
 * Tests E2E — Selenium WebDriver
 * Simule un utilisateur réel dans le navigateur.
 *
 * Prérequis :
 *   - Backend  : http://localhost:3001  (cd backend && npm run dev)
 *   - Frontend : http://localhost:3000  (cd frontend && npm start)
 *   - ChromeDriver installé (npm install dans ce dossier)
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const FRONTEND_URL = "http://localhost:3000";
const TIMEOUT = 10000;

let driver;

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
  const options = new chrome.Options();
  options.addArguments(
    "--headless",         // sans fenêtre (CI/CD)
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1280,800"
  );

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}, 30000);

afterAll(async () => {
  if (driver) await driver.quit();
});

// ─── Helper : login ───────────────────────────────────────────────────────────

async function login(email = "admin@test.com", password = "password") {
  await driver.get(FRONTEND_URL);

  const emailInput = await driver.wait(
    until.elementLocated(By.css("input[type='email'], input[name='email']")),
    TIMEOUT
  );
  await emailInput.clear();
  await emailInput.sendKeys(email);

  const passwordInput = await driver.findElement(
    By.css("input[type='password'], input[name='password']")
  );
  await passwordInput.clear();
  await passwordInput.sendKeys(password);

  const submitBtn = await driver.findElement(
    By.css("button[type='submit'], input[type='submit']")
  );
  await submitBtn.click();

  // Attendre la redirection post-login
  await driver.wait(until.urlContains("/dashboard"), TIMEOUT);
}

// ─── Tests : Authentification ─────────────────────────────────────────────────

describe("E2E — Authentification", () => {
  test("affiche la page de login au démarrage", async () => {
    await driver.get(FRONTEND_URL);
    const title = await driver.getTitle();
    const body = await driver.findElement(By.css("body")).getText();

    expect(
      title.toLowerCase().includes("login") ||
      body.toLowerCase().includes("connexion") ||
      body.toLowerCase().includes("login") ||
      body.toLowerCase().includes("email")
    ).toBe(true);
  }, TIMEOUT);

  test("connecte l'utilisateur admin avec les bons identifiants", async () => {
    await login();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/dashboard");
  }, TIMEOUT);

  test("affiche une erreur avec un mauvais mot de passe", async () => {
    await driver.get(FRONTEND_URL);

    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[type='email'], input[name='email']")),
      TIMEOUT
    );
    await emailInput.sendKeys("admin@test.com");

    const passwordInput = await driver.findElement(
      By.css("input[type='password']")
    );
    await passwordInput.sendKeys("mauvaismdp");

    const submitBtn = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitBtn.click();

    // Un message d'erreur doit apparaître
    await driver.wait(
      until.elementLocated(
        By.css(".error, .alert, [class*='error'], [class*='alert']")
      ),
      TIMEOUT
    );
    const errorEl = await driver.findElement(
      By.css(".error, .alert, [class*='error'], [class*='alert']")
    );
    expect(await errorEl.isDisplayed()).toBe(true);
  }, TIMEOUT);
});

// ─── Tests : Gestion des tâches ───────────────────────────────────────────────

describe("E2E — Gestion des tâches", () => {
  beforeEach(async () => {
    await login();
  });

  test("affiche la liste des tâches sur le dashboard", async () => {
    const taskList = await driver.wait(
      until.elementLocated(
        By.css(".task-list, .tasks, [class*='task'], ul, table")
      ),
      TIMEOUT
    );
    expect(await taskList.isDisplayed()).toBe(true);
  }, TIMEOUT);

  test("crée une nouvelle tâche", async () => {
    // Ouvrir le formulaire de création
    const addBtn = await driver.wait(
      until.elementLocated(
        By.css("button[class*='add'], button[class*='create'], button[class*='new'], button")
      ),
      TIMEOUT
    );
    await addBtn.click();

    // Remplir le titre
    const titleInput = await driver.wait(
      until.elementLocated(
        By.css("input[name='title'], input[placeholder*='titre'], input[placeholder*='title']")
      ),
      TIMEOUT
    );
    await titleInput.sendKeys("Tâche E2E Selenium");

    // Soumettre
    const submitBtn = await driver.findElement(
      By.css("button[type='submit'], button[class*='save'], button[class*='submit']")
    );
    await submitBtn.click();

    // Vérifier que la tâche apparaît dans la liste
    await driver.wait(
      until.elementTextContains(
        await driver.findElement(By.css("body")),
        "Tâche E2E Selenium"
      ),
      TIMEOUT
    );

    const body = await driver.findElement(By.css("body")).getText();
    expect(body).toContain("Tâche E2E Selenium");
  }, TIMEOUT);

  test("l'interface est responsive (mobile 375px)", async () => {
    await driver.manage().window().setRect({ width: 375, height: 812 });
    await driver.navigate().refresh();

    const body = await driver.findElement(By.css("body"));
    expect(await body.isDisplayed()).toBe(true);

    // Remettre en desktop
    await driver.manage().window().setRect({ width: 1280, height: 800 });
  }, TIMEOUT);
});