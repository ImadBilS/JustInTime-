import "./index.css";
import { APITester } from "./APITester";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
};

export function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "todo",
  });

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setProjects((prev) => [...prev, data.project]);
    setForm({ name: "", description: "", status: "todo" });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus as Project["status"] } : p))
    );
  };

  return (
    <main className="min-h-screen bg-white/30 text-gray-800 p-6 font-sans backdrop-blur-sm">
      <h1 className="text-4xl font-bold mb-8 text-center text-black-700">
        Suivi de Projets
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-100 p-6 rounded-xl shadow-md"
      >
        <input
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nom du projet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <select
          className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value as Project["status"] })
          }
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
        >
          Ajouter le projet
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4">📋 Liste des projets</h2>

      <ul className="space-y-4">
        {projects.map((proj) => (
          <li
            key={proj.id}
            className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm flex justify-between items-start"
          >
            <div className="w-full">
              <h3 className="font-semibold text-lg text-gray-900">
                {proj.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{proj.description}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                  proj.status === "todo"
                    ? "bg-gray-500"
                    : proj.status === "in_progress"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              >
                {proj.status}
              </span>

              <div className="mt-2">
                <select
                  value={proj.status}
                  onChange={(e) =>
                    handleStatusChange(proj.id, e.target.value)
                  }
                  className="mt-1 border rounded p-1 text-sm"
                >
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>
              </div>
            </div>

            <button
              className="text-red-600 hover:text-red-800 text-sm font-semibold ml-4"
              onClick={() => handleDelete(proj.id)}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
