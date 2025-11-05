// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import globals from 'globals'; // Pour définir les environnements globaux comme browser, node, etc.

// Simuler __dirname pour les modules ES, nécessaire pour FlatCompat si vous n'utilisez pas Node.js v20.11.0+
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // ou import.meta.dirname si Node.js v20.11.0+
  recommendedConfig: {}, // Configuration requise pour FlatCompat
  // resolvePluginsRelativeTo: __dirname, // Peut être nécessaire pour certains plugins plus anciens
});

export default [
  // Configuration de base et recommandations ESLint et TypeScript ESLint
  // FlatCompat est utilisé ici pour faciliter l'utilisation des configurations "extends" classiques.
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Règles recommandées pour TypeScript ESLint
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // Décommentez si vous utilisez des règles nécessitant des infos de type
    'next/core-web-vitals' // Configuration spécifique à Next.js (inclut souvent des bases TS)
    // 'prettier' // Si vous utilisez Prettier, ajoutez sa config ici (ex: 'eslint-config-prettier')
  ),

  // Configuration spécifique pour les fichiers TypeScript/JavaScript dans votre projet
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'], // Cible les fichiers JS, TS, JSX, TSX
    languageOptions: {
      ecmaVersion: 'latest', // Utiliser la dernière version d'ECMAScript
      sourceType: 'module',  // Utiliser les modules ES
      globals: {
        ...globals.browser, // Variables globales du navigateur (window, document, etc.)
        ...globals.node,    // Variables globales de Node.js (process, console, etc.)
        React: 'readonly',  // Déclarer React comme global en lecture seule si utilisé globalement
      },
      // Si vous utilisiez parserOptions.project avec recommended-requiring-type-checking:
      // parserOptions: {
      //   project: true, // ou './tsconfig.json'
      //   tsconfigRootDir: __dirname,
      // },
    },
    // Si vous n'utilisez pas FlatCompat pour @typescript-eslint, vous le configureriez ainsi:
    // plugins: {
    //   '@typescript-eslint': tseslint.plugin,
    // },
    // linterOptions: {
    //   reportUnusedDisableDirectives: true,
    // },
    rules: {
      // 1. Désactiver la règle ESLint de base pour les variables non utilisées.
      // La règle @typescript-eslint est plus adaptée pour TypeScript.
      'no-unused-vars': 'off',

      // 2. Configuration pour @typescript-eslint/no-unused-vars:
      // Avertissement pour les variables non utilisées, avec des exceptions.
      '@typescript-eslint/no-unused-vars': ['warn', { 
        args: 'after-used',          // N'avertir pour les arguments non utilisés qu'après le dernier argument utilisé
        argsIgnorePattern: '^_',     // Ignorer les arguments de fonction commençant par _
        varsIgnorePattern: '^_',     // Ignorer les variables déclarées commençant par _
        caughtErrors: 'all',         // Appliquer aux erreurs catchées
        caughtErrorsIgnorePattern: '^_', // Ignorer les variables d'erreur dans les blocs catch commençant par _
        ignoreRestSiblings: true     // Ignorer les frères restants dans la déstructuration
      }],

      // 3. Pour désactiver la règle interdisant l'utilisation explicite de 'any':
      // Il est généralement préférable de la laisser en 'warn' ou de la corriger.
      '@typescript-eslint/no-explicit-any': 'off', 
      // Ou pour la configurer comme un avertissement:
      // '@typescript-eslint/no-explicit-any': 'warn',

      // Règles de votre exemple (vous pouvez les garder si elles sont pertinentes pour vous)
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',

      // ... Ajoutez ici d'autres règles personnalisées ou des surcharges
    },
  },
  
  // Vous pouvez ajouter d'autres objets de configuration ici pour des cas spécifiques
  // par exemple, des règles différentes pour les fichiers de test, etc.
];
