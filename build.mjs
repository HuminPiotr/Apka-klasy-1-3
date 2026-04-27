import { execSync } from "child_process";
import { cpSync, mkdirSync, rmSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL(".", import.meta.url));

function run(cmd, cwd) {
  console.log(`\n[${cwd}] ${cmd}`);
  execSync(cmd, { cwd: resolve(root, cwd), stdio: "inherit" });
}

// Wyczyść dist
rmSync(resolve(root, "dist"), { recursive: true, force: true });
mkdirSync(resolve(root, "dist/games"), { recursive: true });

const games = [
  { dir: "gry/architekci_na_czas", name: "architekci" },
  { dir: "gry/memory",             name: "memory"     },
  { dir: "gry/oddech-smoka",       name: "smok"       },
  { dir: "gry/prawda_czy_falsz",   name: "tf"         },
  { dir: "gry/mgla",              name: "mgla"        },
];

// Zainstaluj zależności i zbuduj każdą grę
for (const { dir, name } of games) {
  run("npm install", dir);
  run(`npx vite build --base /games/${name}/`, dir);
  cpSync(
    resolve(root, dir, "dist"),
    resolve(root, `dist/games/${name}`),
    { recursive: true }
  );
  console.log(`✓ ${name} → dist/games/${name}`);
}

// Zbuduj launcher
run("npm install", "launcher");
run("npx vite build --base /", "launcher");
cpSync(resolve(root, "launcher/dist"), resolve(root, "dist"), { recursive: true });
console.log("✓ launcher → dist/");

console.log("\n✅ Build gotowy! Folder: dist/");
