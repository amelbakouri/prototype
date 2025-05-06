export default function ClientForm({ client, setClient }) {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setClient({ ...client, [name]: value });
    };
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      const clientInput = e.currentTarget.elements.clientInput;
      fetch(`/api/client?search=${clientInput.value}`)
        .then((res) => res.json())
        .then((clients) => {
          if (clients.length > 0) {
            setClient(clients[0]);
          } else {
            alert("Client non trouvé");
          }
        });
    };
  
    const fields = [
      "prenom",
      "nom",
      "societe",
      "adresse",
      "codePostal",
      "ville",
      "siret",
      "email",
      "tel",
    ];
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations client</h2>
  
        {/* Barre de recherche */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex items-center gap-3">
            <input
              name="clientInput"
              placeholder="Rechercher un client"
              className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full flex items-center justify-center shadow-md"
              title="Rechercher"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
  
        {/* Formulaire client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                onChange={handleChange}
                value={client[field] || ""}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  