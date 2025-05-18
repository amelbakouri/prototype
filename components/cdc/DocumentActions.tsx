export default function DocumentActions({ onSave, onExport }) {
  return (
    <div className="mt-6 flex justify-end gap-4">
      <button
        onClick={onExport}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Exporter en PDF
      </button>
      <button
        onClick={onSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sauvegarder
      </button>
    </div>
  );
}
