export default function CDCForm({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    { label: "Contexte", name: "contexte" },
    { label: "Objectifs", name: "objectifs" },
    { label: "Périmètre fonctionnel", name: "perimetre_fonctionnel" },
    { label: "Technologies", name: "technologies" },
    { label: "Contraintes", name: "contraintes" },
    { label: "Budget", name: "budget" },
    { label: "Délai", name: "delai" },
    { label: "Acteurs impliqués", name: "acteurs_impliquees" },
    { label: "Validation", name: "validation" },
  ];

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cahier des charges</h2>
      {fields.map(({ label, name }) => (
        <div key={name} className="flex flex-col gap-2">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          <textarea
            id={name}
            name={name}
            value={data[name]}
            onChange={handleChange}
            rows={4}
            placeholder={`Entrez ${label.toLowerCase()}`}
            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 text-sm text-gray-800 resize-none"
          />
        </div>
      ))}
    </div>
  );
}
