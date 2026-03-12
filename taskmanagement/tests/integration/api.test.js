/**
 * Tests d'intégration — Endpoints API REST
 * Lance le serveur backend réel et vérifie les réponses HTTP.
 *
 * Prérequis : le backend doit tourner sur http://localhost:3001
 * Lance-le avec : cd backend && npm run dev
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3001";
let authToken = "";
let createdTaskId = "";

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("Auth — POST /api/auth/login", () => {
  test("connecte un utilisateur valide et retourne un token", async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "admin@test.com",
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");
    authToken = res.data.token;
  });

  test("rejette des identifiants incorrects", async () => {
    await expect(
      axios.post(`${BASE_URL}/api/auth/login`, {
        email: "wrong@test.com",
        password: "wrongpassword",
      })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  test("rejette une requête sans email", async () => {
    await expect(
      axios.post(`${BASE_URL}/api/auth/login`, { password: "password" })
    ).rejects.toMatchObject({ response: { status: 400 } });
  });
});

// ─── Tâches ───────────────────────────────────────────────────────────────────

describe("Tasks — GET /api/tasks", () => {
  test("retourne la liste des tâches avec un token valide", async () => {
    const res = await axios.get(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("refuse l'accès sans token", async () => {
    await expect(
      axios.get(`${BASE_URL}/api/tasks`)
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

describe("Tasks — POST /api/tasks", () => {
  test("crée une nouvelle tâche", async () => {
    const res = await axios.post(
      `${BASE_URL}/api/tasks`,
      {
        title: "Tâche de test intégration",
        priority: "high",
        status: "todo",
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("id");
    expect(res.data.title).toBe("Tâche de test intégration");
    createdTaskId = res.data.id;
  });

  test("rejette une tâche sans titre", async () => {
    await expect(
      axios.post(
        `${BASE_URL}/api/tasks`,
        { priority: "low" },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });
});

describe("Tasks — PUT /api/tasks/:id", () => {
  test("met à jour le statut d'une tâche", async () => {
    const res = await axios.put(
      `${BASE_URL}/api/tasks/${createdTaskId}`,
      { status: "in_progress" },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(res.status).toBe(200);
    expect(res.data.status).toBe("in_progress");
  });
});

describe("Tasks — DELETE /api/tasks/:id", () => {
  test("supprime une tâche existante", async () => {
    const res = await axios.delete(
      `${BASE_URL}/api/tasks/${createdTaskId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    expect(res.status).toBe(204);
  });

  test("retourne 404 pour une tâche inexistante", async () => {
    await expect(
      axios.delete(
        `${BASE_URL}/api/tasks/id-qui-nexiste-pas`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 404 } });
  });
});