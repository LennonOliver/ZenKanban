<script setup>
import { ref } from 'vue';
import Carte from './Carte.vue';

defineProps({
    titre: String,
    statut: String,
    tachesColonne: Array
});

const emit = defineEmits(['lacher-tache', 'debut-glissement', 'supprimer-tache', 'editer-tache', 'deplacer-tache']);

const estSurvolee = ref(false);

const auLacher = (statut) => {
    estSurvolee.value = false;
    emit('lacher-tache', statut);
};
</script>

<template>
    <div class="colonne" :class="{ 'survol': estSurvolee }" @dragover.prevent @dragenter="estSurvolee = true"
        @dragleave="estSurvolee = false" @drop="auLacher(statut)">
        <div class="colonne-header">
            <h2>{{ titre }}</h2>
            <span class="badge">{{ tachesColonne.length }}</span>
        </div>

        <div class="zone-taches">
            <TransitionGroup name="liste">
                <Carte v-for="tache in tachesColonne" :key="tache.id" :tache="tache"
                    @debut-glissement="(id) => emit('debut-glissement', id)"
                    @supprimer-tache="(id) => emit('supprimer-tache', id)" 
                    @editer-tache="(id, nouveauTitre) => emit('editer-tache', id, nouveauTitre)"
                    @deplacer-tache="(id, nouveauStatut) => emit('deplacer-tache', id, nouveauStatut)" />
            </TransitionGroup>
            <p v-if="tachesColonne.length === 0" class="vide">Déposez ici...</p>
        </div>
    </div>
</template>

<style scoped>
.colonne {
    flex: 1;
    background: var(--bg-colonne);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 20px;
    padding: 24px;
    min-height: 500px;
    border: 1px solid var(--border-glass);
    box-shadow: 0 4px 6px -1px var(--shadow-color);
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

.colonne.survol {
    background: var(--bg-colonne-hover);
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    transform: scale(1.01);
}

.colonne-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--header-border);
}

h2 {
    font-weight: 700;
    color: var(--text-main);
    font-size: 1.1rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.badge {
    background: var(--badge-bg);
    color: var(--badge-text);
    font-weight: 700;
    font-size: 0.85rem;
    padding: 4px 12px;
    border-radius: 9999px;
    box-shadow: 0 1px 2px var(--shadow-color);
}

.zone-taches {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.vide {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.95rem;
    margin-top: 20px;
}

.liste-enter-active,
.liste-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.liste-enter-from,
.liste-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
}

@media (max-width: 1024px) {
    .colonne {
        min-height: 150px;
        padding: 16px;
    }
}
</style>