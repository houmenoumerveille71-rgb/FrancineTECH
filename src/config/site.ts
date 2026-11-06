// Configuration centralisée de Françine Tech.
// Remplacez les valeurs ci-dessous par vos vraies coordonnées.
export const siteConfig = {
  name: "Françine Tech",
  person: "Françine Houmenou",
  title: "Développeuse Web & Mobile",
  tagline: "Je conçois des sites web, des boutiques e-commerce et des applications mobiles modernes, performants et à votre image.",
  email: "", // À renseigner, ex. contact@francinetech.com
  whatsapp: "", // À renseigner, format international sans +, ex. 22997123456
  phone: "",
  location: "Cotonou, Bénin",
  socials: {
    github: "",
    linkedin: "",
    twitter: "",
  },
};

export const hasWhatsApp = () => Boolean(siteConfig.whatsapp && siteConfig.whatsapp.trim());
export const whatsappLink = () =>
  hasWhatsApp() ? `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Bonjour Françine, je souhaite discuter d'un projet.")}` : "#";
export const hasEmail = () => Boolean(siteConfig.email && siteConfig.email.trim());
