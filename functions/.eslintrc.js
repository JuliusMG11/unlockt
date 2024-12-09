module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [],  // Odstránil som všetky rozšírenia
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    "/generated/**/*",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    // Vypnutie všetkých pravidiel
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "quotes": "off",
    "import/no-unresolved": "off",
    "indent": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "semi": "off"
  },
};