import { useEffect, useState } from "react";
import { getJournalEntriesByUserId, updateJournalEntry } from "../services/journal";
import type { Journal } from "../types/journal";
import CreateJournalEntryForm from "../components/CreateJournalEntryForm";

type Props = {
  userId: number;
};

function getDateString(date: Date | string) {
  return new Date(date).toLocaleDateString();
}

function isToday(date: Date | string) {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
}

function getAvgMood(entries: Journal[], days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const filtered = entries.filter(e => new Date(e.date) >= since);
  if (filtered.length === 0) return null;
  const avg = (key: keyof Journal) =>
    filtered.length
      ? (filtered.reduce((sum, e) => sum + Number(e[key]), 0) / filtered.length).toFixed(2)
      : "-";
  return {
    humeur: avg("humeur"),
    energie: avg("energie"),
    sommeil: avg("sommeil"),
    anxiete: avg("anxiete"),
    count: filtered.length,
  };
}

export default function Dashboard({ userId }: Props) {
  const [entries, setEntries] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Journal | null>(null);

  useEffect(() => {
    setLoading(true);
    getJournalEntriesByUserId(userId)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [userId, showCreateForm]);

  const todayEntry = entries.find(e => isToday(e.date));
  const canCreateToday = !todayEntry;

  const avg7 = getAvgMood(entries, 7);
  const avg30 = getAvgMood(entries, 30);

  const handleCreate = () => {
    setShowCreateForm(false);
    getJournalEntriesByUserId(userId).then(setEntries);
  };

  const handleEdit = (entry: Journal) => {
    setEditingEntry(entry);
    setShowCreateForm(true);
  };

  const handleUpdate = async (payload: Partial<Omit<Journal, 'id' | 'user'>>)  => {
    if (!editingEntry) return;
    await updateJournalEntry(userId, editingEntry.id, payload);
    setEditingEntry(null);
    setShowCreateForm(false);
    getJournalEntriesByUserId(userId).then(setEntries);
  };

  return (
    <div className="page-container">
      <h1>Mon Journal</h1>
      <div>
        <h2>Moyenne des 7 derniers jours</h2>
        <ul>
          <li>😊 Humeur: {avg7?.humeur}</li>
          <li>⚡ Énergie: {avg7?.energie}</li>
          <li>🛌 Sommeil: {avg7?.sommeil}</li>
          <li>😰 Anxiété: {avg7?.anxiete}</li>
        </ul>
        <h2>Moyenne des 30 derniers jours</h2>
        <ul>
          <li>😊 Humeur: {avg30?.humeur}</li>
          <li>⚡ Énergie: {avg30?.energie}</li>
          <li>🛌 Sommeil: {avg30?.sommeil}</li>
          <li>😰 Anxiété: {avg30?.anxiete}</li>
        </ul>
      </div>
      <button onClick={() => setShowCreateForm(true)} disabled={!canCreateToday}>
        {canCreateToday ? "Nouvelle entrée" : "Entrée déjà créée aujourd'hui"}
      </button>
      {showCreateForm && !editingEntry && (
        <CreateJournalEntryForm
          userId={userId}
          onCreate={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      {showCreateForm && editingEntry && (
        <EditJournalEntryForm
          entry={editingEntry}
          onUpdate={handleUpdate}
          onCancel={() => { setEditingEntry(null); setShowCreateForm(false); }}
        />
      )}
      <h2>Mes entrées</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={entry.id} style={{ marginBottom: 16, borderBottom: "1px solid #ccc" }}>
              <strong>{getDateString(entry.date)}</strong>
              <div>Humeur: {entry.humeur} | Énergie: {entry.energie} | Sommeil: {entry.sommeil} | Anxiété: {entry.anxiete}</div>
              <div>{entry.journal}</div>
              {isToday(entry.date) && (
                <button onClick={() => handleEdit(entry)}>
                  Modifier (jusqu'à minuit)
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function EditJournalEntryForm({
  entry,
  onUpdate,
  onCancel,
}: {
  entry: Journal;
  onUpdate: (payload: Partial<Omit<Journal, "id" | "user">>) => void;
  onCancel: () => void;
}) {
  const [humeur, setHumeur] = useState(entry.humeur.toString());
  const [energie, setEnergie] = useState(entry.energie.toString());
  const [sommeil, setSommeil] = useState(entry.sommeil.toString());
  const [anxiete, setAnxiete] = useState(entry.anxiete.toString());
  const [journal, setJournal] = useState(entry.journal || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({
      humeur: Number(humeur),
      energie: Number(energie),
      sommeil: Number(sommeil),
      anxiete: Number(anxiete),
      journal,
      date: new Date(),
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Modifier l'entrée du jour</h3>
      <label>
        Humeur (0-10):
        <input required type="number" min={0} max={10} value={humeur} onChange={e => setHumeur(e.target.value)} />
      </label>
      <label>
        Énergie (0-10):
        <input required type="number" min={0} max={10} value={energie} onChange={e => setEnergie(e.target.value)} />
      </label>
      <label>
        Qualité du sommeil (0-10):
        <input required type="number" min={0} max={10} value={sommeil} onChange={e => setSommeil(e.target.value)} />
      </label>
      <label>
        Niveau d'anxiété (0-10):
        <input required type="number" min={0} max={10} value={anxiete} onChange={e => setAnxiete(e.target.value)} />
      </label>
      <label>
        Journal (optionnel):
        <textarea value={journal} onChange={e => setJournal(e.target.value)} />
      </label>
      <button type="button" onClick={onCancel}>Annuler</button>
      <button type="submit" disabled={loading}>{loading ? "Mise à jour..." : "Mettre à jour"}</button>
    </form>
  );
}