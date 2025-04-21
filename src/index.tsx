import { serve } from "bun";
import index from "./index.html";
import * as fs from "fs";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req: Request) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/projects": {
      async GET() {
        const path = "data/projects.json";
        const projects = JSON.parse(fs.readFileSync(path, "utf-8"));
        return Response.json(projects);
      },

      async POST(req: Request) {
        const body = await req.json();

        const newProject: Project = {
          id: crypto.randomUUID(),
          name: body.name,
          description: body.description,
          status: body.status || "todo",
          createdAt: new Date().toISOString(),
        };

        const path = "data/projects.json";
        const existing = JSON.parse(fs.readFileSync(path, "utf-8"));
        existing.push(newProject);
        fs.writeFileSync(path, JSON.stringify(existing, null, 2));

        return Response.json({
          message: "Projet ajouté",
          project: newProject,
        });
      },
    },

    "/api/projects/:id": {
      async PATCH(req: Request) {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        const body = await req.json();
        const path = "data/projects.json";

        const projects = JSON.parse(fs.readFileSync(path, "utf-8"));
        const updated = projects.map((project: any) =>
          project.id === id ? { ...project, status: body.status } : project
        );

        fs.writeFileSync(path, JSON.stringify(updated, null, 2));
        return Response.json({ message: "Statut mis à jour" });
      },

      async DELETE(req: Request) {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();  // On récupère le dernier segment de l'URL (id)
        const path = "data/projects.json";
    
        // Vérifie si un ID a été trouvé
        if (!id) {
          return new Response("ID du projet manquant", { status: 400 });
        }
    
        const current = JSON.parse(fs.readFileSync(path, "utf-8"));
        const filtered = current.filter((p: any) => p.id !== id);
    
        // Si aucun projet n'a été trouvé avec cet ID
        if (filtered.length === current.length) {
          return new Response("Aucun projet trouvé avec cet ID", { status: 404 });
        }
    
        fs.writeFileSync(path, JSON.stringify(filtered, null, 2));
    
        return Response.json({ message: "Projet supprimé" });
      },
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
