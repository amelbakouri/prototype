export default function PrestationsSection({
    prestations,
    handleChange,
    addPrestation,
  }) {
    // Calcul des totaux
    const totalHT = prestations.reduce(
      (sum, p) => sum + (parseFloat(p.prixHT || 0) * parseFloat(p.quantite || 0)),
      0
    );
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Prestations</h2>
  
        <div className="space-y-4">
          {prestations.map((p, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border border-gray-200"
            >
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantité
                </label>
                <input
                  type="number"
                  placeholder="Quantité"
                  value={p.quantite}
                  onChange={(e) => handleChange(index, "quantite", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Prix HT
                </label>
                <input
                  type="number"
                  placeholder="Prix HT"
                  value={p.prixHT}
                  onChange={(e) => handleChange(index, "prixHT", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
  
        <button
          onClick={addPrestation}
          className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
        >
          + Ajouter une prestation
        </button>
  
        {/* Zone des totaux */}
        <div className="mt-6 p-4">
          <div className="space-y-2 text-right">
            <p className="text-gray-600">Total HT : {totalHT.toFixed(2)}€</p>
            <p className="text-gray-600">TVA (20%) : {tva.toFixed(2)}€</p>
            <p className="text-xl font-bold text-gray-800">
              Total TTC : {totalTTC.toFixed(2)}€
            </p>
          </div>
        </div>
      </div>
    );
  }
  