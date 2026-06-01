"""
Module d'affectation automatique basé sur l'IA
Génère automatiquement la division, l'encadrant et le thème de stage
selon le profil et l'établissement du stagiaire
"""

import re
from typing import Dict, Tuple

class GenerateurAffectationIA:
    """Classe pour générer les affectations automatiques basées sur les profils"""
    
    # Dictionnaire des divisions et leurs encadrants par défaut
    DIVISIONS = {
        "exploitation": {
            "nom": "Division Exploitation",
            "encadrants": ["M. Hassan Benali", "Mme Fatima Zerkaoui", "M. Ahmed Moroccan"],
            "themes": [
                "Optimisation des processus d'exploitation portuaire",
                "Gestion des flux de marchandises et planification",
                "Amélioration de la disponibilité des équipements portuaires",
                "Sécurité et respect des normes d'exploitation",
                "Digitalisation des opérations d'exploitation",
                "Gestion des incidents et plans de continuité"
            ]
        },
        "technique": {
            "nom": "Division Technique",
            "encadrants": ["M. Karim Bennani", "Mme Leila Mohammedi", "M. Youssef Tazi"],
            "themes": [
                "Maintenance préventive des équipements portuaires",
                "Modernisation des infrastructures techniques",
                "Efficacité énergétique et durabilité",
                "Gestion des systèmes de manutention",
                "Inspection et audit technique des installations",
                "Implémentation de technologies IoT pour la maintenance"
            ]
        },
        "dsi": {
            "nom": "DSI (Direction Système d'Information)",
            "encadrants": ["M. Rashid El Alaoui", "Mme Souad Boubekeur", "M. Mustafa Hansali"],
            "themes": [
                "Développement d'applications de gestion portuaire",
                "Infrastructure cloud et cybersécurité",
                "Datawarehouse et business intelligence",
                "Intégration EDI et échanges électroniques",
                "API REST pour l'interopérabilité des systèmes",
                "Transformation numérique et automatisation"
            ]
        },
        "rh": {
            "nom": "Direction des Ressources Humaines",
            "encadrants": ["Mme Nadia Alaoui", "M. Jalal Bennani"],
            "themes": [
                "Amélioration de la paie et des avantages sociaux",
                "Développement du talent et formation continue",
                "Gestion de la performance et évaluation",
                "Relation client interne et bien-être au travail",
                "Recrutement et onboarding optimisé",
                "Conformité RH et respect de la législation"
            ]
        },
        "finance": {
            "nom": "Direction Financière",
            "encadrants": ["M. Mohammed Bennani", "Mme Aïcha Khouyi"],
            "themes": [
                "Audit interne et conformité financière",
                "Gestion budgétaire et prévisions financières",
                "Réduction des coûts opérationnels",
                "Analyse de rentabilité des activités portuaires",
                "Système comptable et reporting financier",
                "Trésorerie et gestion des risques financiers"
            ]
        },
        "commercial": {
            "nom": "Direction Commerciale",
            "encadrants": ["M. Ahmed Farah", "Mme Leila Bennani"],
            "themes": [
                "Développement des partenariats commerciaux",
                "Stratégie tarifaire et pricing",
                "Customer relationship management (CRM)",
                "Étude de marché et positionnement compétitif",
                "Augmentation de la part de marché",
                "Services à valeur ajoutée pour les clients"
            ]
        },
        "qualite": {
            "nom": "Direction Qualité et Environnement",
            "encadrants": ["Mme Nawal Bennani", "M. Abdelkrim Zahra"],
            "themes": [
                "Certification ISO et audit interne",
                "Gestion des non-conformités et actions correctives",
                "Amélioration continue (Lean/Six Sigma)",
                "Respect de l'environnement et développement durable",
                "Prévention des risques et sécurité",
                "Traçabilité et documentation de qualité"
            ]
        }
    }
    
    @staticmethod
    def classifier_profil(profil_niveau: str) -> Tuple[str, str]:
        """
        Classifie le profil du stagiaire en domaine principal et niveau
        
        Args:
            profil_niveau: String contenant le profil et niveau (ex: "Bac+3 Informatique", "Master Génie Informatique")
        
        Returns:
            Tuple (domaine_principal, niveau_etude)
        """
        profil_lower = profil_niveau.lower()
        
        # Extraction du niveau d'étude
        niveau = "Bac+3"
        if "master" in profil_lower or "bac+5" in profil_lower:
            niveau = "Master"
        elif "bac+4" in profil_lower:
            niveau = "Bac+4"
        elif "bac+3" in profil_lower or "licence" in profil_lower:
            niveau = "Bac+3"
        elif "bts" in profil_lower or "dut" in profil_lower:
            niveau = "Bac+2"
        
        # Classification du domaine
        domaine = "technique"
        
        # Mots-clés pour informatique/DSI
        if any(keyword in profil_lower for keyword in ["informatique", "ingénieur informatique", "développement", 
                                                         "data", "système", "réseau", "cloud", "programmer", 
                                                         "software", "it", "dsi"]):
            domaine = "dsi"
        
        # Mots-clés pour mécanique/génie mécanique
        elif any(keyword in profil_lower for keyword in ["mécanique", "génie mécanique", "production", 
                                                          "fabrication", "usinage"]):
            domaine = "technique"
        
        # Mots-clés pour électrique
        elif any(keyword in profil_lower for keyword in ["électrique", "électrotechnique", "énergie", "électronique"]):
            domaine = "technique"
        
        # Mots-clés pour RH/Management
        elif any(keyword in profil_lower for keyword in ["rh", "ressources humaines", "management", "gestion", 
                                                          "administr", "master management"]):
            domaine = "rh"
        
        # Mots-clés pour Finance/Audit
        elif any(keyword in profil_lower for keyword in ["finance", "audit", "comptabil", "économ", 
                                                          "gestion financière", "banque"]):
            domaine = "finance"
        
        # Mots-clés pour Commercial/Marketing
        elif any(keyword in profil_lower for keyword in ["commercial", "marketing", "vente", "business", 
                                                          "commerce", "négociation"]):
            domaine = "commercial"
        
        # Mots-clés pour Qualité
        elif any(keyword in profil_lower for keyword in ["qualité", "environnement", "sécurité", "audit", 
                                                          "norme", "iso"]):
            domaine = "qualite"
        
        # Mots-clés pour Exploitation
        elif any(keyword in profil_lower for keyword in ["exploitation", "opération", "logistique", "supply chain", 
                                                          "chaîne logistique", "planning", "ordonnancement"]):
            domaine = "exploitation"
        
        return domaine, niveau
    
    @staticmethod
    def generer_affectation_ia(profil_niveau: str, etablissement: str = "") -> Dict[str, str]:
        """
        Génère automatiquement l'affectation du stagiaire
        
        Args:
            profil_niveau: Le profil et niveau du stagiaire (ex: "Bac+3 Informatique")
            etablissement: L'établissement d'origine (optionnel)
        
        Returns:
            Dictionnaire contenant:
            - division: Nom de la division d'affectation
            - encadrant: Nom de l'encadrant
            - theme_stage: Thème du stage proposé
            - domaine: Domaine principal classifié
            - justification: Explication de l'affectation
        """
        
        if not profil_niveau or not isinstance(profil_niveau, str):
            return {
                "division": "Division Exploitation",
                "encadrant": "M. Hassan Benali",
                "theme_stage": "Découverte des opérations portuaires",
                "domaine": "exploitation",
                "justification": "Profil non spécifié - affectation par défaut"
            }
        
        # Classifie le profil
        domaine, niveau = GenerateurAffectationIA.classifier_profil(profil_niveau)
        
        # Récupère les informations de la division
        info_division = GenerateurAffectationIA.DIVISIONS.get(domaine, 
                                                              GenerateurAffectationIA.DIVISIONS["exploitation"])
        
        # Sélectionne un encadrant (selon établissement ou défaut)
        encadrant = info_division["encadrants"][0]
        
        # Logique d'affectation d'encadrant selon l'établissement
        etablissement_lower = etablissement.lower() if etablissement else ""
        if "fst" in etablissement_lower or "settat" in etablissement_lower:
            encadrant = info_division["encadrants"][0]
        elif "hassan" in etablissement_lower or "fez" in etablissement_lower:
            encadrant = info_division["encadrants"][1] if len(info_division["encadrants"]) > 1 else info_division["encadrants"][0]
        elif "casablanca" in etablissement_lower or "sup" in etablissement_lower:
            encadrant = info_division["encadrants"][2] if len(info_division["encadrants"]) > 2 else info_division["encadrants"][0]
        
        # Sélectionne un thème de stage
        theme_stage = info_division["themes"][0]
        
        # Amélioration du thème selon le niveau
        if "master" in niveau.lower():
            theme_stage = info_division["themes"][3] if len(info_division["themes"]) > 3 else info_division["themes"][0]
        elif "bac+2" in niveau.lower():
            theme_stage = info_division["themes"][1] if len(info_division["themes"]) > 1 else info_division["themes"][0]
        
        # Génération de la justification
        justification = f"Affectation basée sur profil '{profil_niveau}' ({niveau}) -> Domaine {domaine}"
        if etablissement:
            justification += f" | Établissement: {etablissement}"
        
        return {
            "division": info_division["nom"],
            "encadrant": encadrant,
            "theme_stage": theme_stage,
            "domaine": domaine,
            "niveau": niveau,
            "justification": justification
        }
    
    @staticmethod
    def afficher_affectation(affectation: Dict) -> str:
        """Formate l'affectation pour l'affichage"""
        return f"""
╔══════════════════════════════════════════════════════════════════╗
║                    AFFECTATION AUTOMATIQUE                       ║
╚══════════════════════════════════════════════════════════════════╝

📍 Division d'Affectation : {affectation.get('division', 'N/A')}
👤 Encadrant Désigné     : {affectation.get('encadrant', 'N/A')}
📚 Thème de Stage        : {affectation.get('theme_stage', 'N/A')}
🏢 Domaine               : {affectation.get('domaine', 'N/A')}
📊 Niveau d'Étude        : {affectation.get('niveau', 'N/A')}

💡 Justification : {affectation.get('justification', 'N/A')}
"""


# Fonction principale pour compatibilité
def generer_affectation_ia(profil_niveau: str, etablissement: str = "") -> Dict[str, str]:
    """Fonction wrapper pour la génération d'affectation IA"""
    return GenerateurAffectationIA.generer_affectation_ia(profil_niveau, etablissement)


# Tests et exemples d'utilisation
if __name__ == "__main__":
    # Exemples de test
    exemples = [
        ("Bac+3 Informatique", "FST Settat"),
        ("Master Génie Mécanique", "Université Hassan II"),
        ("Bac+3 Gestion Commerciale", "Casablanca Sup"),
        ("Master Finance et Audit", "FST Fez"),
        ("Bac+3 Électrotechnique", ""),
        ("Profil inconnu", ""),
    ]
    
    print("=" * 70)
    print("TESTS - GÉNÉRATEUR D'AFFECTATION IA - MARSA MAROC")
    print("=" * 70)
    
    for profil, etablissement in exemples:
        result = generer_affectation_ia(profil, etablissement)
        print(GenerateurAffectationIA.afficher_affectation(result))
        print("\n")
