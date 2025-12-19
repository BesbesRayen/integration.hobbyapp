# Guide de Dépannage - Hobby App Frontend

## ✅ Erreurs Corrigées

### 1. **Erreur localStorage (SSR)**
**Problème** : `localStorage is not defined` lors du rendu côté serveur (SSR)

**Solution appliquée** :
- Utilisation de `isPlatformBrowser()` pour vérifier l'environnement
- Vérification de l'existence de `localStorage` avant utilisation
- Protection du guard d'authentification pour SSR

### 2. **Warning HttpClient fetch**
**Problème** : Angular recommande d'utiliser `fetch` pour SSR

**Solution appliquée** :
- Ajout de `withFetch()` dans la configuration HttpClient

---

## 🔍 Comment Dépanner les Problèmes

### Quand vous trouvez une erreur :

#### 1. **Lire l'erreur complète**
   - Regardez le message d'erreur dans le terminal
   - Notez le fichier et la ligne concernés
   - Identifiez le type d'erreur (TypeScript, runtime, SSR, etc.)

#### 2. **Vérifier les erreurs TypeScript**
   ```bash
   # Dans le terminal, cherchez les erreurs qui commencent par:
   X [ERROR] TS...
   ```
   - **TS2304** : Nom non trouvé → Vérifiez les imports
   - **TS2395** : Conflit de déclaration → Renommez les classes/interfaces
   - **TS2440** : Conflit d'import → Utilisez des alias d'import

#### 3. **Vérifier les erreurs Runtime**
   ```bash
   # Erreurs qui apparaissent dans le navigateur ou le terminal
   ERROR ReferenceError: ...
   ```
   - **localStorage/sessionStorage** : Vérifiez si vous êtes en SSR
   - **window/document** : Utilisez `isPlatformBrowser()`
   - **undefined/null** : Ajoutez des vérifications

#### 4. **Vérifier les warnings Angular**
   ```bash
   # Warnings qui commencent par:
   ▲ [WARNING] NG...
   ```
   - **NG8107** : Chaînage optionnel inutile → Supprimez `?.` si la propriété est requise
   - **NG02801** : Configuration HttpClient → Ajoutez `withFetch()`

#### 5. **Vérifier les erreurs de compilation**
   ```bash
   # Erreurs de build
   Application bundle generation failed
   ```
   - Vérifiez tous les imports
   - Vérifiez que tous les fichiers existent
   - Vérifiez la syntaxe TypeScript

---

## 🛠️ Solutions Communes

### Problème : localStorage is not defined
```typescript
// ❌ Mauvais (ne fonctionne pas en SSR)
const token = localStorage.getItem('token');

// ✅ Bon (fonctionne en SSR)
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

private platformId = inject(PLATFORM_ID);

getToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('token');
  }
  return null;
}
```

### Problème : Conflit de noms
```typescript
// ❌ Mauvais (conflit)
import { Chat } from './models/chat.model';
export class Chat { }

// ✅ Bon (utiliser un alias)
import { Chat as ChatMessage } from './models/chat.model';
export class ChatComponent { }
```

### Problème : Import manquant
```typescript
// ❌ Mauvais
export interface User {
  groups?: Group[]; // Group n'est pas importé
}

// ✅ Bon
import { Group } from './group.model';
export interface User {
  groups?: Group[];
}
```

### Problème : Chaînage optionnel inutile
```typescript
// ❌ Mauvais (si name est requis dans l'interface)
{{ hobby.name?.charAt(0) }}

// ✅ Bon
{{ hobby.name.charAt(0) }}
```

---

## 📋 Checklist de Vérification

Avant de signaler un problème, vérifiez :

- [ ] Tous les imports sont corrects
- [ ] Les noms de classes/interfaces ne sont pas en conflit
- [ ] `localStorage`/`window` sont protégés pour SSR
- [ ] Les types TypeScript sont corrects
- [ ] Les fichiers de test sont à jour
- [ ] Le linter ne montre pas d'erreurs (`read_lints`)

---

## 🚀 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm start

# Vérifier les erreurs de lint
npm run lint  # Si configuré

# Build de production
npm run build

# Tests
npm test
```

---

## 📞 Quand Demander de l'Aide

1. **Copiez l'erreur complète** du terminal
2. **Indiquez le fichier** concerné
3. **Décrivez ce que vous faisiez** quand l'erreur est apparue
4. **Vérifiez d'abord** avec ce guide

---

## 🔗 Ressources

- [Angular SSR Documentation](https://angular.dev/guide/ssr)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular Best Practices](https://angular.dev/guide/best-practices)

