// import { describe, beforeEach, afterEach, it, expect, inject } from "vitest";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
// import { PocketIc, type Actor } from "@dfinity/pic";
// import { Principal } from "@dfinity/principal";

// Import generated types for your canister
// import {
//   type _SERVICE,
//   idlFactory,
//   type AssetType,
// } from "../../src/declarations/backend/backend.did.js";

// Define the path to your canister's WASM file
export const WASM_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  ".dfx",
  "local",
  "canisters",
  "backend",
  "backend.wasm",
);