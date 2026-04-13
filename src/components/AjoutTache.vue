<script setup>
import { ref } from 'vue';

const emit = defineEmits(['nouvelle-tache']);
const texteSaisi = ref("");
const prioriteSaisie = ref("normale");

const envoyerTache = () => {
    if (texteSaisi.value.trim() === "") return;

    emit('nouvelle-tache', {
        titre: texteSaisi.value,
        priorite: prioriteSaisie.value
    });

    texteSaisi.value = "";
    prioriteSaisie.value = "normale";
};
</script>

<template>
    <div class="formulaire-ajout">
        <div class="input-group">
            <input v-model="texteSaisi" @keyup.enter="envoyerTache" type="text" placeholder="Nouvelle tâche..." />
        </div>

        <div class="select-group">
            <select v-model="prioriteSaisie">
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute 🔥</option>
            </select>
            <div class="select-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>

        <button @click="envoyerTache" class="btn-ajouter">
            <span>Ajouter</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
    </div>
</template>

<style scoped>
.formulaire-ajout {
    display: flex;
    gap: 12px;
    align-items: stretch;
    flex-wrap: wrap;
}

.input-group {
    flex: 1;
    min-width: 250px;
}

input {
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
    height: 100%;
    font-family: inherit;
}

input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: var(--bg-card);
}

.select-group {
    position: relative;
    min-width: 140px;
}

select {
    width: 100%;
    padding: 12px 40px 12px 20px;
    border-radius: 12px;
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    font-size: 0.95rem;
    color: var(--text-main);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    height: 100%;
    font-family: inherit;
}

select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: var(--bg-card);
}

.select-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #94a3b8;
}

.btn-ajouter {
    padding: 12px 24px;
    background: var(--btn-ajouter);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px -1px var(--btn-ajouter-shadow);
}

.btn-ajouter:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgba(99, 102, 241, 0.4);
}

.btn-ajouter:active {
    transform: translateY(0);
}

@media (max-width: 768px) {
    .input-group, 
    .select-group, 
    .btn-ajouter {
        min-width: 100%;
        width: 100%;
    }
    .btn-ajouter {
        justify-content: center;
    }
}
</style>