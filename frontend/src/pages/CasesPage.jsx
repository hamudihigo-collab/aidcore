import { useEffect, useState } from "react";
import { getCases, createCase } from "../services/api.js";

export const CasesPage = () => {
    const [cases, setCases] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all cases
    const fetchCases = async () => {
        try {
            const data = await getCases();
            setCases(data);
        } catch (error) {
            console.error("Error fetching cases:", error);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    // Add a new case
    const handleAddCase = async () => {
        if (!newTitle || !newDesc) return alert("Please enter title and description");
        setLoading(true);
        try {
            await createCase({ title: newTitle, description: newDesc });
            setNewTitle("");
            setNewDesc("");
            fetchCases(); // refresh the list
        } catch (error) {
            console.error("Error creating case:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">All Cases</h1>

            {/* Add Case Form */}
            <div className="mb-6 flex space-x-2">
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Case Title"
                    className="border p-2 rounded flex-1"
                />
                <input
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Case Description"
                    className="border p-2 rounded flex-1"
                />
                <button
                    onClick={handleAddCase}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Case"}
                </button>
            </div>

            {/* Cases List */}
            {cases.length > 0 ? (
                <ul className="space-y-4">
                    {cases.map((c) => (
                        <li key={c.id} className="p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold">{c.title}</h2>
                            <p className="text-gray-700">{c.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No cases found.</p>
            )}
        </div>
    );
};
