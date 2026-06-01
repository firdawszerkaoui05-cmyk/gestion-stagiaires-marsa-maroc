const BASE_URL = "http://127.0.0.1:5000";

export async function fetchStagiaires() {
  const response = await fetch(`${BASE_URL}/stagiaires`);
  return response.json();
}

export async function submitStagiaire(formData) {
  const response = await fetch(`${BASE_URL}/stagiaires`, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export async function updateDecision(id, decision) {
  const response = await fetch(`${BASE_URL}/stagiaires/${id}/decision`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ decision }),
  });
  return response.json();
}

export async function validateStage(id) {
  const response = await fetch(`${BASE_URL}/valider-stage/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ affectation: null }),
  });
  return response.json();
}
