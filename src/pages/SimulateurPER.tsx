import React, { useState } from 'react';

// Données de simulation avec rendements calculés
const simulationData = [
  { annee: 2025, versements: 86412, produits: 931, capital: 87344, rendement: 1.08 },
  { annee: 2026, versements: 41314, produits: 3301, capital: 131959, rendement: 2.50 },
  { annee: 2027, versements: 41314, produits: 4760, capital: 178033, rendement: 2.67 },
  { annee: 2028, versements: 41314, produits: 6267, capital: 225613, rendement: 2.78 },
  { annee: 2029, versements: 41314, produits: 7823, capital: 274750, rendement: 2.85 },
  { annee: 2030, versements: 41314, produits: 9430, capital: 325493, rendement: 2.89 },
  { annee: 2031, versements: 41314, produits: 11089, capital: 377896, rendement: 2.94 },
  { annee: 2032, versements: 41314, produits: 12802, capital: 432012, rendement: 2.96 },
  { annee: 2033, versements: 41314, produits: 14572, capital: 487898, rendement: 2.99 },
  { annee: 2034, versements: 41314, produits: 16400, capital: 545611, rendement: 3.01 },
  { annee: 2035, versements: 41314, produits: 18287, capital: 605211, rendement: 3.02 },
  { annee: 2036, versements: 41314, produits: 20236, capital: 666761, rendement: 3.03 },
  { annee: 2037, versements: 41314, produits: 22248, capital: 730323, rendement: 3.05 },
  { annee: 2038, versements: 41314, produits: 24327, capital: 795963, rendement: 3.06 },
  { annee: 2039, versements: 41314, produits: 26473, capital: 863750, rendement: 3.07 },
  { annee: 2040, versements: 41314, produits: 28690, capital: 933754, rendement: 3.07 },
  { annee: 2041, versements: 41314, produits: 30979, capital: 1006047, rendement: 3.08 },
  { annee: 2042, versements: 41314, produits: 33343, capital: 1080703, rendement: 3.08 },
  { annee: 2043, versements: 41314, produits: 35784, capital: 1157801, rendement: 3.09 },
  { annee: 2044, versements: 41314, produits: 38305, capital: 1237420, rendement: 3.10 },
  { annee: 2045, versements: 41314, produits: 40909, capital: 1319643, rendement: 3.10 },
  { annee: 2046, versements: 41314, produits: 43598, capital: 1404554, rendement: 3.10 },
  { annee: 2047, versements: 41314, produits: 43113, capital: 1488981, rendement: 2.89 },
  { annee: 2048, versements: 41314, produits: 45679, capital: 1575973, rendement: 2.90 },
  { annee: 2049, versements: 41314, produits: 48324, capital: 1665611, rendement: 2.90 },
  { annee: 2050, versements: 41314, produits: 51049, capital: 1757973, rendement: 2.90 },
  { annee: 2051, versements: 41314, produits: 53856, capital: 1853143, rendement: 2.91 },
  { annee: 2052, versements: 41314, produits: 43869, capital: 1938326, rendement: 2.37 },
  { annee: 2053, versements: 41314, produits: 45871, capital: 2025511, rendement: 2.37 },
  { annee: 2054, versements: 41314, produits: 47920, capital: 2114745, rendement: 2.37 },
  { annee: 2055, versements: 41314, produits: 40227, capital: 2196286, rendement: 1.83 },
  { annee: 2056, versements: 0, produits: 6848, capital: 2203134, rendement: 0.31 }
];

// Types
interface FormData {
  statutPro: string;
  revenuPro: number;
  plafondReportable: number;
  tmi: number;
  vergementsDeductibles: number;
  versementsNonDeductibles: number;
  etudeConjoint: boolean;
  utilisationPlafondCommun: boolean;
}

const SimulateurPER: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plafond');
  const [formData, setFormData] = useState<FormData>({
    statutPro: 'salarie',
    revenuPro: 562222,
    plafondReportable: 45554,
    tmi: 0.41,
    vergementsDeductibles: 41731,
    versementsNonDeductibles: 0,
    etudeConjoint: false,
    utilisationPlafondCommun: true
  });

  // Fonction pour formater les nombres avec séparateurs de milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Calculateur de plafond PER en temps réel
  const calculatePlafondPER = (revenuPro: number, statut: string): number => {
    const baseRate = statut === 'salarie' ? 0.10 : 0.25;
    const plafondMax = statut === 'salarie' ? 37000 : 85000;
    return Math.min(revenuPro * baseRate, plafondMax);
  };

  // Calculateur d'économie fiscale
  const calculateEconomieFiscale = (versements: number, tmi: number): number => {
    return versements * tmi;
  };

  // Calculs en temps réel
  const plafondTheorique = calculatePlafondPER(formData.revenuPro, formData.statutPro);
  const plafondTotal = plafondTheorique + formData.plafondReportable;
  const economieFiscale = calculateEconomieFiscale(plafondTotal, formData.tmi);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTab = (id: string, label: string) => (
    <div
      key={id}
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Styles */}
      <style>{`
        :root {
          --primary-color: #0055a4;
          --secondary-color: #f5f5f5;
          --accent-color: #ff6b35;
          --text-color: #333;
          --border-color: #ddd;
          --success-color: #28a745;
          --shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          line-height: 1.6;
          color: var(--text-color);
          background-color: #f9f9f9;
        }

        .header {
          background-color: var(--primary-color);
          color: white;
          padding: 15px 0;
          box-shadow: var(--shadow);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .simulator-title {
          margin: 20px 0;
          color: var(--primary-color);
        }

        .tabs {
          display: flex;
          background-color: white;
          border-radius: 5px 5px 0 0;
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .tab {
          padding: 15px 20px;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          font-weight: 500;
        }

        .tab.active {
          border-bottom: 3px solid var(--accent-color);
          color: var(--primary-color);
        }

        .tab-content {
          background-color: white;
          padding: 25px;
          border-radius: 0 0 5px 5px;
          box-shadow: var(--shadow);
          margin-bottom: 30px;
        }

        .form-section {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: var(--primary-color);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        .form-row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -10px;
        }

        .form-group {
          flex: 1;
          min-width: 200px;
          margin: 0 10px 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon input {
          padding-right: 40px;
        }

        .input-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #777;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .checkbox-group input {
          width: auto;
          margin-right: 10px;
        }

        .btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .btn:hover {
          background-color: #004085;
        }

        .btn-secondary {
          background-color: #6c757d;
        }

        .alert {
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid transparent;
          border-radius: 4px;
        }

        .alert-info {
          color: #31708f;
          background-color: #d9edf7;
          border-color: #bee5eb;
        }

        .calculation-summary {
          background-color: #f8f9fa;
          border-left: 4px solid var(--primary-color);
          padding: 15px;
          margin: 20px 0;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }

        .results-card {
          background-color: var(--secondary-color);
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .result-item {
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          box-shadow: var(--shadow);
        }

        .result-label {
          font-size: 0.9rem;
          color: #666;
        }

        .result-value {
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--primary-color);
          margin-top: 5px;
        }

        .highlight {
          color: var(--accent-color);
        }

        .footer-note {
          font-size: 0.8rem;
          color: #666;
          margin-top: 30px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: 1;
            min-width: 120px;
            text-align: center;
          }

          .form-row {
            flex-direction: column;
          }

          .form-group {
            margin: 0 0 15px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">Simulateur PER</div>
          <div>Référence: 2025.1.007.001</div>
        </div>
      </header>

      <div className="container">
        <h1 className="simulator-title">Simulateur Plan Épargne Retraite (PER)</h1>

        {/* Tabs */}
        <div className="tabs">
          {renderTab('plafond', 'Plafond Épargne Retraite')}
          {renderTab('impact', 'Impact fiscal')}
          {renderTab('contrat', 'Contrat retraite')}
          {renderTab('modalites', 'Modalités de sortie')}
          {renderTab('resultats', 'Résultats détaillés')}
        </div>

        {/* Tab Content */}
        {activeTab === 'plafond' && (
          <div className="tab-content">
            <div className="form-section">
              <h2 className="section-title">Données personnelles</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Statut professionnel</label>
                  <select
                    value={formData.statutPro}
                    onChange={(e) => handleInputChange('statutPro', e.target.value)}
                  >
                    <option value="salarie">Salarié</option>
                    <option value="independant">Indépendant</option>
                    <option value="retraite">Retraité</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Revenu professionnel en 2024</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      value={formData.revenuPro}
                      onChange={(e) => handleInputChange('revenuPro', Number(e.target.value))}
                    />
                    <span className="input-icon">€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Mesures déjà prises</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Plafond épargne retraite reportable non utilisé</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      value={formData.plafondReportable}
                      onChange={(e) => handleInputChange('plafondReportable', Number(e.target.value))}
                    />
                    <span className="input-icon">€</span>
                  </div>
                  <small>La fraction non utilisée du plafond épargne retraite est reportable sur 3 ans. Référez-vous à votre dernier avis d'imposition en case 6PS pour en connaître le montant.</small>
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={formData.etudeConjoint}
                  onChange={(e) => handleInputChange('etudeConjoint', e.target.checked)}
                />
                <label>Etude du plafond épargne retraite du conjoint</label>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Situation du foyer</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Vous connaissez votre TMI</label>
                  <select
                    value={formData.tmi}
                    onChange={(e) => handleInputChange('tmi', Number(e.target.value))}
                  >
                    <option value={0.11}>11%</option>
                    <option value={0.30}>30%</option>
                    <option value={0.41}>41%</option>
                    <option value={0.45}>45%</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Impact fiscal en entrée</h2>
              <div className="alert alert-info">
                <strong>💡 Astuce :</strong> Optimisez votre fiscalité en utilisant au maximum le plafond déductible.
                Chaque euro versé dans le cadre du plafond vous fait économiser {formData.tmi.toFixed(2)} € d'impôt.
              </div>

              <div className="calculation-summary">
                <h3>Récapitulatif des calculs</h3>
                <div className="summary-line">
                  <span>Plafond théorique 2025:</span>
                  <span>{formatNumber(plafondTheorique)} €</span>
                </div>
                <div className="summary-line">
                  <span>Plafond reportable utilisé:</span>
                  <span>{formatNumber(formData.plafondReportable)} €</span>
                </div>
                <div className="summary-line">
                  <span>Versements déductibles:</span>
                  <span>{formatNumber(plafondTotal)} €</span>
                </div>
                <div className="summary-line">
                  <span><strong>Économie fiscale totale:</strong></span>
                  <span><strong>{formatNumber(Math.round(economieFiscale))} €</strong></span>
                </div>
              </div>
            </div>

            <div className="results-card">
              <h2 className="section-title">Résultats</h2>
              <div className="results-grid">
                <div className="result-item">
                  <div className="result-label">Plafond épargne retraite 2025</div>
                  <div className="result-value">{formatNumber(plafondTotal)} €</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Impact fiscal 2026</div>
                  <div className="result-value">{formatNumber(Math.round(economieFiscale))} €</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Économie fiscale</div>
                  <div className="result-value highlight">{formatNumber(Math.round(economieFiscale))} €</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Effort réel d'épargne</div>
                  <div className="result-value">{formatNumber(Math.round(plafondTotal - economieFiscale))} €</div>
                </div>
              </div>
            </div>

            <button className="btn" onClick={() => setActiveTab('impact')}>
              Suivant: Impact fiscal
            </button>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="tab-content">
            <div className="form-section">
              <h2 className="section-title">Fiscalité</h2>
              <p>Lorsque vous connaissez votre Tranche Marginale d'Imposition, le calcul de l'économie d'impôt se fait à TMI constant : versement déductible × TMI.</p>
            </div>

            <div className="form-section">
              <h2 className="section-title">Particularités du PER</h2>
              <p>Le PER offre la possibilité au titulaire du contrat de choisir les modalités de sortie de son épargne (en capital ou en rente) pour les versements volontaires et ceux issus de l'épargne salariale.</p>
              <p>Par ailleurs, le PER assure une harmonisation des dispositifs de déblocages anticipés de l'épargne :</p>
              <ul>
                <li>Décès du conjoint ou partenaire de PACS</li>
                <li>Invalidité de 2ème et 3ème catégorie du titulaire, des enfants, du conjoint ou partenaire de PACS</li>
                <li>Surendettement du titulaire</li>
                <li>Expiration des droits à l'assurance chômage</li>
                <li>Cessation d'activité non salariée à la suite d'un jugement de liquidation judiciaire</li>
                <li>Acquisition de la résidence principale</li>
              </ul>
            </div>

            <button className="btn" onClick={() => setActiveTab('contrat')}>
              Suivant: Contrat retraite
            </button>
          </div>
        )}

        {activeTab === 'contrat' && (
          <div className="tab-content">
            <div className="form-section">
              <h2 className="section-title">Contrat retraite PER</h2>
              <p>Configuration du contrat PER et paramètres de gestion.</p>
            </div>
            <button className="btn" onClick={() => setActiveTab('modalites')}>
              Suivant: Modalités de sortie
            </button>
          </div>
        )}

        {activeTab === 'modalites' && (
          <div className="tab-content">
            <div className="form-section">
              <h2 className="section-title">Modalités de sortie</h2>
              <p>Configuration des modalités de sortie du PER.</p>
            </div>
            <button className="btn" onClick={() => setActiveTab('resultats')}>
              Suivant: Résultats détaillés
            </button>
          </div>
        )}

        {activeTab === 'resultats' && (
          <div className="tab-content">
            <div className="form-section">
              <h2 className="section-title">Résultats détaillés</h2>
              <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary-color)' }}>Années</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary-color)' }}>Versements nets</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary-color)' }}>Produits</th>
                      <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary-color)' }}>Capital en fin d'année</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationData.slice(0, 10).map((item) => (
                      <tr key={item.annee}>
                        <td style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>{item.annee}</td>
                        <td style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>{formatNumber(item.versements)} €</td>
                        <td style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>{formatNumber(item.produits)} €</td>
                        <td style={{ padding: '12px 15px', borderBottom: '1px solid var(--border-color)' }}>{formatNumber(item.capital)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="results-card">
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-label">Total versements nets</div>
                    <div className="result-value">1 325 823 €</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">Total produits</div>
                    <div className="result-value">877 311 €</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">Capital final</div>
                    <div className="result-value highlight">2 203 134 €</div>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn" onClick={() => setActiveTab('plafond')}>
              Nouvelle simulation
            </button>
          </div>
        )}

        <div className="footer-note">
          <p>Ce simulateur a pour but de vous aider à estimer les impacts fiscaux et financiers d'un Plan Épargne Retraite. Les résultats présentés sont indicatifs et ne constituent pas un engagement contractuel. Pour une étude personnalisée, veuillez consulter un conseiller financier.</p>
        </div>
      </div>
    </div>
  );
};

export default SimulateurPER;