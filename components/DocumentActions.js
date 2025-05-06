export default function DocumentActions({ infoSupp, setInfoSupp, totalHT, tva, totalTTC, onSave, onGeneratePDF }) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Informations supplémentaires</h2>
  
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          rows={4}
          placeholder="Notes ou informations à ajouter (facultatif)"
          value={infoSupp}
          onChange={(e) => setInfoSupp(e.target.value)}
        />

  
        <div className="flex justify-end gap-4">
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition"
          >
            Enregistrer
          </button>
          <button
            onClick={onGeneratePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    );
  }
  