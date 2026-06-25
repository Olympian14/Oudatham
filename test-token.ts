import { setSession, encrypt } from "./lib/auth";

async function run() {
  const token = await encrypt({ id: "test", role: "DOCTOR", name: "Dr. Test" });
  console.log(token);
}
run();
