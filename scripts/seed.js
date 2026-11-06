const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Services
  const services = [
    { number: "01", title: "Sites web professionnels", description: "Des sites modernes, rapides et adaptés à votre image de marque.", active: true, order: 1 },
    { number: "02", title: "Boutiques e-commerce", description: "Des expériences d'achat intuitives pour développer votre activité.", active: true, order: 2 },
    { number: "03", title: "Applications web", description: "Des outils numériques conçus pour répondre à vos besoins.", active: true, order: 3 },
    { number: "04", title: "Développement mobile", description: "Des interfaces pensées pour une expérience fluide sur mobile.", active: true, order: 4 },
    { number: "05", title: "Création de chatbots", description: "Conception de chatbots intelligents pour automatiser et améliorer l'expérience utilisateur.", active: true, order: 5 },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(s) + 1 },
      update: s,
      create: s,
    });
  }

  // Skills
  const skills = ["HTML & CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "PHP", "MySQL", "PostgreSQL", "Git & GitHub", "Création de chatbots"];
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.upsert({
      where: { id: i + 1 },
      update: { name: skills[i], order: i },
      create: { name: skills[i], level: 80, order: i },
    });
  }

  // SiteSettings singleton
  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    await prisma.siteSettings.create({
      data: {
        name: "Françine Tech",
        person: "Françine Houmenou",
        title: "Développeuse Web & Mobile",
        tagline: "Je conçois des sites web, des boutiques e-commerce et des applications mobiles modernes, performants et à votre image.",
        location: "Cotonou, Bénin",
      },
    });
  }

  console.log("Seed done");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
