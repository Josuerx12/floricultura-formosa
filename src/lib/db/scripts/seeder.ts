import fs from "fs";
import path from "path";

const seedsPath = path.resolve(__dirname, "..", "./seeds");

async function main() {
  const files = fs.readdirSync(seedsPath);

  for (const file of files) {
    if (file.endsWith(".seed.ts")) {
      const seed = await import(path.join(seedsPath, file));

      seed.default();
    }
  }
}

main().catch((err) => {
  console.error("❌ Erro ao executar seeds:", err);
  process.exit(1);
});
