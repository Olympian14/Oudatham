const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const doc = await prisma.user.upsert({
    where: { mobile: "9999999991" },
    update: {},
    create: { name: "Dr. Smith", mobile: "9999999991", password, role: "DOCTOR", department: "General Medicine" }
  });

  const lab = await prisma.user.upsert({
    where: { mobile: "9999999992" },
    update: {},
    create: { name: "Lab Tech John", mobile: "9999999992", password, role: "LAB_TECH", department: "Pathology" }
  });

  const admin = await prisma.user.upsert({
    where: { mobile: "9999999993" },
    update: {},
    create: { name: "Admin Super", mobile: "9999999993", password, role: "ADMIN" }
  });

  console.log("Seeded default users:", doc.name, lab.name, admin.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
