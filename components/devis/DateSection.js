export default function DateSection({ typeDoc, dates, setDates }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setDates({ ...dates, [name]: value });
    };
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {typeDoc === "devis" ? (
            <>
              <input
                type="date"
                name="dateDevis"
                value={dates.dateDevis}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="validite"
                placeholder="Validité (ex: 30 jours)"
                value={dates.validite}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          ) : (
            <>
              <input
                type="date"
                name="dateFacturation"
                value={dates.dateFacturation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="dateLivraison"
                value={dates.dateLivraison}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="echeance"
                placeholder="Échéance (ex: 30 jours)"
                value={dates.echeance}
                onChange={handleChange}
                className="w-full sm:col-span-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>
      </div>
    );
  }
  