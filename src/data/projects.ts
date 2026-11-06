export type Project = {
  category: string;
  title: string;
  description: string;
  tech: string;
};

export const projects: Project[] = [
  { category: "E-COMMERCE", title: "La fille-ci", description: "Une boutique en ligne dédiée à la mode féminine et aux tenues de sport.", tech: "Next.js · E-commerce" },
  { category: "APPLICATION WEB", title: "Gestion intelligente", description: "Une interface pour simplifier la gestion des activités et des données.", tech: "À personnaliser selon le projet" },
  { category: "PROJET PERSONNEL", title: "Votre prochain projet", description: "Un espace pour présenter une autre réalisation ou un projet en cours.", tech: "Technologies à préciser" },
];
