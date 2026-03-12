/**
 * Tests unitaires — Logique métier des tâches
 * Ces tests vérifient les fonctions pures sans appel réseau ni base de données.
 */

// ─── Helpers utilitaires (simulés ici, à adapter selon votre code) ────────────

function isValidPriority(priority) {
  return ["low", "medium", "high"].includes(priority);
}

function isValidStatus(status) {
  return ["todo", "in_progress", "done"].includes(status);
}

function formatTask(task) {
  return {
    ...task,
    title: task.title?.trim(),
    createdAt: task.createdAt || new Date().toISOString(),
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

// ─── Tests : Priorités ────────────────────────────────────────────────────────

describe("Validation des priorités", () => {
  test("accepte 'low' comme priorité valide", () => {
    expect(isValidPriority("low")).toBe(true);
  });

  test("accepte 'medium' comme priorité valide", () => {
    expect(isValidPriority("medium")).toBe(true);
  });

  test("accepte 'high' comme priorité valide", () => {
    expect(isValidPriority("high")).toBe(true);
  });

  test("rejette une priorité inconnue", () => {
    expect(isValidPriority("critical")).toBe(false);
  });

  test("rejette une valeur vide", () => {
    expect(isValidPriority("")).toBe(false);
  });
});

// ─── Tests : Statuts ─────────────────────────────────────────────────────────

describe("Validation des statuts", () => {
  test("accepte 'todo'", () => {
    expect(isValidStatus("todo")).toBe(true);
  });

  test("accepte 'in_progress'", () => {
    expect(isValidStatus("in_progress")).toBe(true);
  });

  test("accepte 'done'", () => {
    expect(isValidStatus("done")).toBe(true);
  });

  test("rejette un statut inconnu", () => {
    expect(isValidStatus("pending")).toBe(false);
  });
});

// ─── Tests : Formatage d'une tâche ───────────────────────────────────────────

describe("Formatage d'une tâche", () => {
  test("trim le titre", () => {
    const task = { title: "  Ma tâche  ", priority: "high" };
    expect(formatTask(task).title).toBe("Ma tâche");
  });

  test("ajoute createdAt si absent", () => {
    const task = { title: "Tâche sans date" };
    expect(formatTask(task).createdAt).toBeDefined();
  });

  test("conserve createdAt si déjà présent", () => {
    const date = "2024-01-01T00:00:00.000Z";
    const task = { title: "Tâche", createdAt: date };
    expect(formatTask(task).createdAt).toBe(date);
  });

  test("conserve les autres champs intacts", () => {
    const task = { title: "Tâche", priority: "low", status: "todo" };
    const result = formatTask(task);
    expect(result.priority).toBe("low");
    expect(result.status).toBe("todo");
  });
});

// ─── Tests : Validation email ─────────────────────────────────────────────────

describe("Validation de l'email", () => {
  test("accepte un email valide", () => {
    expect(isValidEmail("admin@test.com")).toBe(true);
  });

  test("rejette un email sans @", () => {
    expect(isValidEmail("admintest.com")).toBe(false);
  });

  test("rejette un email sans domaine", () => {
    expect(isValidEmail("admin@")).toBe(false);
  });

  test("rejette une chaîne vide", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

// ─── Tests : Validation mot de passe ─────────────────────────────────────────

describe("Validation du mot de passe", () => {
  test("accepte un mot de passe d'au moins 6 caractères", () => {
    expect(isStrongPassword("password")).toBe(true);
  });

  test("rejette un mot de passe trop court", () => {
    expect(isStrongPassword("abc")).toBe(false);
  });

  test("rejette une valeur non-string", () => {
    expect(isStrongPassword(null)).toBe(false);
  });
});