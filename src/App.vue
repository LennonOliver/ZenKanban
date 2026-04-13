<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import Colonne from './components/Colonne.vue';
import AjoutTache from './components/AjoutTache.vue';
import { playSakura } from './utils/sakura.js';

const taches = ref([]);
const recherche = ref("");
const idTacheEnMouvement = ref(null);

const isDark = ref(false);

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('kanban-theme', isDark.value ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme();
};

// --- PARALLAXE ---
const mouseX = ref(0);
const mouseY = ref(0);

const onMouseMove = (e) => {
  // Valeurs normalisées entre -1 et 1
  mouseX.value = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY.value = (e.clientY / window.innerHeight) * 2 - 1;
};

// --- LOGIQUE DE RECHERCHE ---

// Cette propriété calculée filtre la liste en temps réel
const tachesFiltrees = computed(() => {
  return taches.value.filter(t =>
    t.titre.toLowerCase().includes(recherche.value.toLowerCase())
  );
});

// --- PERSISTANCE (LOCALSTORAGE) ---

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);

  const savedTheme = localStorage.getItem('kanban-theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();

  const sauvegarde = localStorage.getItem('mes-taches-kanban');
  if (sauvegarde) {
    taches.value = JSON.parse(sauvegarde);
  } else {
    taches.value = [
      { id: 1, titre: "Créer un compte GitHub", priorite: "normale", statut: "a_faire" },
      { id: 2, titre: "Mettre mon Kanban sur mon portfolio", priorite: "haute", statut: "a_faire" }
    ];
  }
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});

watch(taches, (nouvellesTaches) => {
  localStorage.setItem('mes-taches-kanban', JSON.stringify(nouvellesTaches));
}, { deep: true });

// --- ACTIONS ---

const ajouterUneTache = (donneesRecues) => {
  const nouvelleTache = {
    id: Date.now(),
    titre: donneesRecues.titre,
    priorite: donneesRecues.priorite,
    statut: "a_faire"
  };
  taches.value.push(nouvelleTache);
};

const supprimerTache = (idAsupprimer) => {
  taches.value = taches.value.filter(tache => tache.id !== idAsupprimer);
};

const editerTache = (id, nouveauTitre) => {
  const tache = taches.value.find(t => t.id === id);
  if (tache) {
    tache.titre = nouveauTitre;
  }
};

const deplacerDirectement = (id, nouveauStatut) => {
  const tache = taches.value.find(t => t.id === id);
  if (tache) {
    if (tache.statut !== 'termine' && nouveauStatut === 'termine') {
      playSakura();
    }
    tache.statut = nouveauStatut;
  }
};

const demarrerGlissement = (id) => {
  idTacheEnMouvement.value = id;
};

const lacherTache = (nouveauStatut) => {
  const tache = taches.value.find(t => t.id === idTacheEnMouvement.value);
  if (tache) {
    if (tache.statut !== 'termine' && nouveauStatut === 'termine') {
      playSakura();
    }
    tache.statut = nouveauStatut;
  }
  idTacheEnMouvement.value = null;
};
</script>

<template>
  <div class="kanban-container">
    <div class="orb orb-1" :style="{ transform: `translate(${mouseX * -150}px, ${mouseY * -150}px) scale(${1 + (mouseX * 0.05)})` }"></div>
    <div class="orb orb-2" :style="{ transform: `translate(${mouseX * 200}px, ${mouseY * 200}px) scale(${1 - (mouseY * 0.05)})` }"></div>
    <div class="orb orb-3" :style="{ transform: `translate(${mouseX * -90}px, ${mouseY * -130}px) scale(${1 + Math.abs(mouseX * 0.1)})` }"></div>

    <div class="content-foreground">
      <div class="header-titre">
        <div class="logo-hanko">
          <span class="kanji">看板</span>
        </div>
        <h1>My Kanban</h1>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'">
          {{ isDark ? '🌙' : '☀️' }}
        </button>
      </div>

      <div class="controles">
        <AjoutTache @nouvelle-tache="ajouterUneTache" />

        <div class="barre-recherche">
          <input v-model="recherche" type="text" placeholder="Rechercher une tâche..." />
        </div>
      </div>

      <div class="board">
        <Colonne titre="À faire" statut="a_faire" :tachesColonne="tachesFiltrees.filter(t => t.statut === 'a_faire')"
          @lacher-tache="lacherTache" @debut-glissement="demarrerGlissement" @supprimer-tache="supprimerTache" @editer-tache="editerTache" @deplacer-tache="deplacerDirectement" />

        <Colonne titre="En cours" statut="en_cours" :tachesColonne="tachesFiltrees.filter(t => t.statut === 'en_cours')"
          @lacher-tache="lacherTache" @debut-glissement="demarrerGlissement" @supprimer-tache="supprimerTache" @editer-tache="editerTache" @deplacer-tache="deplacerDirectement" />

        <Colonne titre="Terminé" statut="termine" :tachesColonne="tachesFiltrees.filter(t => t.statut === 'termine')"
          @lacher-tache="lacherTache" @debut-glissement="demarrerGlissement" @supprimer-tache="supprimerTache" @editer-tache="editerTache" @deplacer-tache="deplacerDirectement" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bg-gradient: radial-gradient(circle at top left, #f1f5f9 0%, #e2e8f0 100%);
  --text-main: #0f172a;
  --text-muted: #334155;
  --bg-glass: rgba(255, 255, 255, 0.6);
  --border-glass: rgba(255, 255, 255, 0.4);
  --shadow-color: rgba(0, 0, 0, 0.05);
  --bg-card: #ffffff;
  --border-card: #f1f5f9;
  --bg-colonne: rgba(248, 250, 252, 0.6);
  --bg-colonne-hover: rgba(255, 255, 255, 0.8);
  --input-bg: rgba(255, 255, 255, 0.9);
  --input-border: #e2e8f0;
  --btn-supprimer-bg: #fee2e2;
  --btn-supprimer-text: #ef4444;
  --btn-editer-bg: #e0e7ff;
  --btn-editer-text: #4f46e5;
  --badge-bg: #e0e7ff;
  --badge-text: #4f46e5;
  --header-border: #e2e8f0;
  --btn-ajouter: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  --btn-ajouter-shadow: rgba(99, 102, 241, 0.3);
}

html.dark {
  --bg-gradient: radial-gradient(circle at top left, #0f172a 0%, #1e293b 100%);
  --text-main: #f8fafc;
  --text-muted: #cbd5e1;
  --bg-glass: rgba(30, 41, 59, 0.6);
  --border-glass: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --bg-card: #1e293b;
  --border-card: #334155;
  --bg-colonne: rgba(30, 41, 59, 0.5);
  --bg-colonne-hover: rgba(30, 41, 59, 0.8);
  --input-bg: rgba(15, 23, 42, 0.9);
  --input-border: #334155;
  --btn-supprimer-bg: rgba(239, 68, 68, 0.2);
  --btn-supprimer-text: #fca5a5;
  --btn-editer-bg: rgba(79, 70, 229, 0.2);
  --btn-editer-text: #818cf8;
  --badge-bg: rgba(79, 70, 229, 0.3);
  --badge-text: #a5b4fc;
  --header-border: #334155;
  --btn-ajouter: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  --btn-ajouter-shadow: rgba(0, 0, 0, 0.5);
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg-gradient);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}
</style>

<style scoped>
.kanban-container {
  box-sizing: border-box;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  color: var(--text-main);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: -1;
  pointer-events: none;
  transition: transform 0.1s ease-out;
}
.orb-1 {
  top: -10%;
  left: 5%;
  width: 45vw;
  height: 45vw;
  background: rgba(99, 102, 241, 0.12);
}
.orb-2 {
  bottom: -15%;
  right: -5%;
  width: 50vw;
  height: 50vw;
  background: rgba(236, 72, 153, 0.12);
}
.orb-3 {
  top: 30%;
  left: 40%;
  width: 35vw;
  height: 35vw;
  background: rgba(16, 185, 129, 0.08);
}

.header-titre {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.logo-hanko {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transform: rotate(-6deg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}

.logo-hanko:hover {
  transform: rotate(0deg) scale(1.1);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

.logo-hanko .kanji {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 900;
  font-family: "Yu Mincho", "MS Mincho", serif;
  transform: rotate(6deg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-hanko:hover .kanji {
  transform: rotate(0deg);
}

.theme-toggle {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--text-main);
  box-shadow: 0 4px 6px -1px var(--shadow-color);
  margin-left: auto;
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
}

h1 {
  font-weight: 800;
  font-size: 3.2rem;
  color: var(--text-main);
  letter-spacing: -0.05em;
  margin: 0;
  line-height: 1;
  text-align: center;
  text-shadow: 0 4px 15px var(--shadow-color);
}

.controles {
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 20px 30px;
  border-radius: 24px;
  box-shadow:
    0 4px 6px -1px var(--shadow-color),
    0 10px 15px -3px var(--shadow-color),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-glass);
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.barre-recherche {
  flex: 1;
  max-width: 400px;
}

.barre-recherche input {
  width: 100%;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  font-size: 0.95rem;
  color: var(--text-main);
  transition: all 0.3s ease;
  box-sizing: border-box;
  outline: none;
}

.barre-recherche input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background: var(--bg-card);
}

.board {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 1024px) {
  .controles {
    flex-direction: column;
    align-items: stretch;
  }

  .barre-recherche {
    max-width: 100%;
  }

  .board {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .kanban-container {
    padding: 20px 10px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .header-titre {
    gap: 12px;
    margin-bottom: 25px;
  }
  .logo-hanko {
    width: 44px;
    height: 44px;
  }
  .logo-hanko .kanji {
    font-size: 1.4rem;
  }
  .controles {
    padding: 16px;
    gap: 16px;
  }
}
</style>