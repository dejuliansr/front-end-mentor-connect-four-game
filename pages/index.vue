<template>
  <div class="flex items-center justify-center min-h-screen p-2 sm:p-0 bg-Light-Purple sm:bg-Purple">
    <!-- Menu Utama -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="!showRules && !showGame" class="bg-Light-Purple p-10 rounded-3xl w-full max-w-md shadow-lg sm:border-4 sm:border-b-8 sm:border-black relative">
        <div class="flex justify-center py-8">
          <img src="/images/logo.svg" alt="logo">
        </div>
        <div class="mt-6">
          <!-- Tombol 1 -->
          <button @click="setGameMode('playerVsCom')" class="w-full h-16 flex justify-between items-center text-xl px-4 mt-5 bg-Pink text-white font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer">
            PLAYER VS CPU
            <span class="flex items-center gap-2">
              <img src="/images/player-vs-cpu.svg" alt="Icon Playe VS CPU" class="h-10 w-auto">
            </span>
          </button>

          <!-- Tombol 2 -->
          <button @click="setGameMode('playerVsPlayer')" class="w-full h-16 flex justify-between items-center text-xl px-4 mt-5 bg-Yellow text-black font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer">
            PLAY VS PLAYER
            <span class="flex items-center gap-2">
              <img src="/images/player-vs-player.svg" alt="Icon Player VS Player" class="h-10 w-auto">
            </span>
          </button>

          <!-- Tombol 3 -->
          <button @click="showRules = true" class="w-full h-16 flex justify-start items-center text-xl px-4 mt-5 bg-White text-black font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer">
            GAME RULES
          </button>
        </div>
      </div>
    </Transition>

    <!-- Menu Rules -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="showRules" class="bg-White p-10 rounded-3xl w-full max-w-md shadow-lg border-4 border-b-8 border-black relative">
        <h2 class="text-5xl text-center font-bold mb-4">RULES</h2>

        <h3 class="text-Purple font-bold text-lg mb-3">OBJECTIVE</h3>
        <p class="text-Black text-sm mb-4">
          Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).
        </p>

        <h3 class="text-Purple font-bold text-lg mb-3">HOW TO PLAY</h3>
        <ul class="text-Black text-left space-y-2 pb-6">
          <li class="flex gap-2 text-sm">
            <span class="inline-block text-right font-bold">1.</span> Red goes first in the first game.
          </li>
          <li class="flex gap-2 text-sm">
            <span class="inline-block text-right font-bold">2.</span> Players must alternate turns, and only one disc can be dropped in each turn.
          </li>
          <li class="flex gap-2 text-sm">
            <span class="inline-block text-right font-bold">3.</span> The game ends when there is a 4-in-a-row or a stalemate.
          </li>
          <li class="flex gap-2 text-sm">
            <span class="inline-block text-right font-bold">4.</span> The starter of the previous game goes second on the next game.
          </li>
        </ul>

        <div class="absolute left-1/2 transform -translate-x-1/2">
          <!-- Tombol Ceklis untuk Kembali ke Menu -->
          <button @click="showRules = false" class="mx-auto flex justify-center items-center bg-Pink text-white hover:border-Purple rounded-full shadow-md cursor-pointer">
            <img src="/images/icon-check.svg" alt="icon Check" class="hover:border-Purple">
          </button>
        </div>
      </div>
    </Transition>

    <GameBoard 
      @back-to-menu="showGame = false"
      :gameMode="gameMode"
      v-if="showGame" 
      class="w-full" 
      />
      <!-- :difficulty="difficulty" -->
  </div>
</template>

<script setup lang="ts">
// Definisi reaktif state untuk menampilkan atau menyembunyikan rules
const showRules = ref<boolean>(false);
const showGame = ref<boolean>(false);
const gameMode = ref<'playerVsPlayer' | 'playerVsCom'>('playerVsPlayer');
// const difficulty = ref<'easy' | 'medium' | 'hard' | null>(null);
// const showDifficulty = ref(false);

const setGameMode = (mode: 'playerVsPlayer' | 'playerVsCom') => {
  gameMode.value = mode;
  if (mode === 'playerVsCom') {
    showGame.value = true; 
  } else {
    showGame.value = true; // Langsung mulai game untuk Player vs Player
  }
};

// const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
//   difficulty.value = selectedDifficulty;
//   showDifficulty.value = false;
//   showGame.value = true;
// };
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Tambahkan ini untuk memastikan elemen yang dianimasikan tidak menyebabkan layout shift */
.fade-slide-enter-active,
.fade-slide-leave-active {
  position: absolute;
  width: 100%;
}

/* Pastikan elemen yang dianimasikan memiliki z-index yang sesuai */
.fade-slide-enter-active,
.fade-slide-leave-active {
  z-index: 1;
}

button {
  box-shadow: 0 5px black;
}

button:hover {
  box-shadow: 0 5px hsl(257, 67%, 51%);
}

button:active {
  box-shadow: 0 2px hsl(257, 67%, 51%);
  transform: translateY(5px);
}
</style>