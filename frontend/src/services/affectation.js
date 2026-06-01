/**
 * Service pour l'affectation automatique IA
 * Communique avec l'API backend pour générer les affectations
 */

const API_BASE_URL = "http://127.0.0.1:5000/api/affectation";

export const affectationService = {
  /**
   * Génère automatiquement l'affectation d'un stagiaire
   * @param {string} profilNiveau - Profil et niveau du stagiaire (ex: "Bac+3 Informatique")
   * @param {string} etablissement - Établissement d'origine (optionnel)
   * @returns {Promise<Object>} Affectation générée
   */
  genererAffectation: async (profilNiveau, etablissement = "") => {
    try {
      const response = await fetch(`${API_BASE_URL}/generer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profil_niveau: profilNiveau,
          etablissement: etablissement,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          affectation: data.affectation,
        };
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur lors de la génération d'affectation:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Récupère la liste de toutes les divisions disponibles
   * @returns {Promise<Array>} Liste des divisions
   */
  listerDivisions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/divisions`);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          divisions: data.divisions,
        };
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des divisions:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Récupère les thèmes de stage d'une division
   * @param {string} division - ID ou nom de la division
   * @returns {Promise<Array>} Liste des thèmes
   */
  listerThemes: async (division) => {
    try {
      const response = await fetch(`${API_BASE_URL}/themes/${division}`);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          division: data.division,
          themes: data.themes,
        };
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des thèmes:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default affectationService;
