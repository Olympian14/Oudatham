import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash("password123", 10);

  // Doctors across departments
  const doctors = [
    { name: "Dr. Ramesh Kumar", mobile: "9999999991", department: "General Medicine" },
    { name: "Dr. Priya Sharma", mobile: "9999999996", department: "General Surgery" },
    { name: "Dr. Anil Verma",   mobile: "9999999997", department: "Orthopaedics" },
    { name: "Dr. Sunita Devi",  mobile: "9999999998", department: "Paediatrics" },
    { name: "Dr. Meena Gupta",  mobile: "9999999999", department: "Obstetrics & Gynaecology" },
  ];

  for (const d of doctors) {
    await prisma.user.upsert({
      where: { mobile: d.mobile },
      update: {},
      create: { name: d.name, mobile: d.mobile, password: pw, role: "DOCTOR", department: d.department },
    });
  }

  // Lab Tech
  await prisma.user.upsert({
    where: { mobile: "9999999992" },
    update: {},
    create: { name: "Lab Tech John", mobile: "9999999992", password: pw, role: "LAB_TECH", department: "Pathology" },
  });

  // Admin
  await prisma.user.upsert({
    where: { mobile: "9999999993" },
    update: {},
    create: { name: "Admin Super", mobile: "9999999993", password: pw, role: "ADMIN" },
  });

  // Radiologist
  await prisma.user.upsert({
    where: { mobile: "9999999994" },
    update: {},
    create: { name: "Dr. Radiologist Rao", mobile: "9999999994", password: pw, role: "RADIOLOGIST", department: "Radiology" },
  });

  // Pharmacist
  await prisma.user.upsert({
    where: { mobile: "9999999995" },
    update: {},
    create: { name: "Pharmacist Patel", mobile: "9999999995", password: pw, role: "PHARMACIST", department: "Pharmacy" },
  });

  console.log("✓ Seeded all users (5 doctors, lab, admin, radiologist, pharmacist)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
