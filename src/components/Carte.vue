<script setup>
import { ref, nextTick, computed } from 'vue';

const props = defineProps({
    tache: Object
});

const emit = defineEmits(['debut-glissement', 'supprimer-tache', 'editer-tache', 'deplacer-tache']);

const isEditing = ref(false);
const titreEdite = ref(props.tache.titre);
const inputElement = ref(null);

const ordreMouvement = ['a_faire', 'en_cours', 'termine'];
const currentStatusIndex = computed(() => ordreMouvement.indexOf(props.tache.statut));
const peutReculer = computed(() => currentStatusIndex.value > 0);
const peutAvancer = computed(() => currentStatusIndex.value < ordreMouvement.length - 1);

const deplacerApp = (direction) => {
  const nouveauStatut = ordreMouvement[currentStatusIndex.value + direction];
  emit('deplacer-tache', props.tache.id, nouveauStatut);
};

const demarrerEdition = async () => {
    isEditing.value = true;
    titreEdite.value = props.tache.titre;
    await nextTick();
    if (inputElement.value) {
        inputElement.value.focus();
    }
};

const sauvegarderEdition = () => {
    if (!isEditing.value) return;
    isEditing.value = false;
    const cleanTitre = titreEdite.value.trim();
    if (cleanTitre !== '') {
        emit('editer-tache', props.tache.id, cleanTitre);
    } else {
        titreEdite.value = props.tache.titre;
    }
};

const handleDragStart = (e) => {
    if (!isEditing.value) {
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', props.tache.id.toString());
        }
        emit('debut-glissement', props.tache.id);
    } else {
        e.preventDefault();
    }
};
</script>

<template>
    <div class="carte" :draggable="!isEditing" @dragstart="handleDragStart" @dblclick="demarrerEdition">
        <div class="carte-content" style="width: 100%;">
            <span class="indicateur-priorite" :class="'priorite-' + tache.priorite"></span>
            
            <input 
                v-if="isEditing"
                ref="inputElement" 
                v-model="titreEdite" 
                @blur="sauvegarderEdition"
                @keyup.enter="sauvegarderEdition"
                class="input-edition"
            />
            <span v-else class="titre">{{ tache.titre }}</span>
        </div>
        
        <div class="actions" v-if="!isEditing">
            <button class="btn-action btn-move" v-if="peutReculer" @click.stop="deplacerApp(-1)" title="Déplacer à gauche">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button class="btn-action btn-move" v-if="peutAvancer" @click.stop="deplacerApp(1)" title="Déplacer à droite">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <button class="btn-action btn-editer" @click.stop="demarrerEdition">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="btn-action btn-supprimer" @click.stop="emit('supprimer-tache', tache.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.carte {
    background: var(--bg-card);
    padding: 16px 20px;
    border-radius: 16px;
    box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.02), 
        0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid var(--border-card);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: grab;
    position: relative;
    overflow: hidden;
}

.carte:active {
    cursor: grabbing;
}

.carte:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 
        0 12px 20px -8px rgba(0, 0, 0, 0.08), 
        0 4px 6px -2px rgba(0, 0, 0, 0.04);
    border-color: var(--border-glass);
}

.carte-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.input-edition {
    flex: 1;
    border: 1px solid #6366f1;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    background: var(--input-bg);
    color: var(--text-main);
}

.titre {
    font-weight: 500;
    color: var(--text-main);
    font-size: 0.95rem;
    line-height: 1.4;
    cursor: pointer;
}

.titre:hover {
    color: #4f46e5;
}

.indicateur-priorite {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.priorite-haute {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.priorite-normale {
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.priorite-basse {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.actions {
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.carte:hover .actions {
    opacity: 1;
}

.btn-action {
    transform: scale(0.9);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.carte:hover .btn-action {
    transform: scale(1);
}

.btn-editer {
    background: var(--btn-editer-bg);
    color: var(--btn-editer-text);
}

.btn-editer:hover {
    filter: brightness(0.9);
}

.btn-supprimer {
    background: var(--btn-supprimer-bg);
    color: var(--btn-supprimer-text);
}

.btn-supprimer:hover {
    filter: brightness(0.9);
}

.btn-move {
    background: var(--bg-glass);
    color: var(--text-main);
    border: 1px solid var(--border-glass);
}

.btn-move:hover {
    background: var(--border-glass);
}

@media (max-width: 768px) {
    .actions {
        opacity: 1 !important;
    }
}
</style>