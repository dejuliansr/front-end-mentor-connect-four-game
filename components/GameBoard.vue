<template>
  <div class="flex flex-col items-center justify-center lg:justify-normal min-h-screen p-2 sm:p-0 bg-Light-Purple z-0">
    <!-- Header (Menu & Restart) -->
    <Transition name="fade-header" appear>
      <div class="flex items-center justify-between w-full max-w-xl md:pt-4 lg:pt-12">
        <button @click="showMenu = true" class="bg-Purple px-6 py-2 hover:bg-Pink text-white font-bold text-base rounded-full cursor-pointer">MENU</button>
        <img src="/assets/images/logo.svg" alt="">
        <button @click="restartGame()" class="bg-Purple px-3 py-3 hover:bg-Pink text-white font-bold text-base rounded-full cursor-pointer">RESTART</button>
        <Transition name="fade-scale" mode="out-in">
          <div v-if="showMenu" class="fixed inset-0 bg-black/50 flex items-center justify-center p-3 z-[60]">
            <div class="bg-Light-Purple p-10 rounded-3xl w-full max-w-md shadow-lg border-4 border-Black relative">
              <div class="text-center">
                <p class="text-5xl text-White py-7 font-bold">PAUSE</p>
    
                <button  @click="continueGame" class="w-full h-16 text-center text-xl px-4 mt-5 bg-White text-Black font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer btn">
                  COUNTINUE GAME
                </button>
      
                <button @click="restartGame()" class="w-full h-16 text-center text-xl px-4 mt-5 bg-White text-Black font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer btn">
                  RESTART
                </button>
      
                <button @click="emit('back-to-menu')" class="w-full h-16 text-center text-xl px-4 mt-5 bg-White text-Black font-bold rounded-2xl border-2 border-black hover:border-Purple shadow-md cursor-pointer btn">
                  QUIT GAME
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <div class="grid grid-cols-2 justify-items-center lg:flex lg:flex-row lg:justify-center lg:items-center w-full md:max-w-2xl lg:max-w-5xl m-4 lg:gap-10">
      <!-- score player one -->
      <transition name="fade-player-one" appear>
        <div class="relative flex justify-center items-center bg-white w-5/6 lg:w-1/7 h-20 md:h-auto rounded-3xl p-4 lg:p-7 border-4 border-b-8 border-black lg:order-1">
          <div class="absolute -left-5 lg:left-1/2 md:top-4 lg:top-0 transform lg:-translate-x-1/2 lg:-translate-y-1/2">
            <img src="/assets/images/player-one.svg" alt="Icon Player One" class="h-12">
          </div>
          <div class="flex flex-col md:flex-row lg:flex-col w-full justify-around items-center md:gap-7 lg:gap-0 lg:pt-4">
            <p class="font-bold">{{ props.gameMode === 'playerVsCom' ? 'YOU' : 'PLAYER 1' }}</p>
            <p class="text-3xl md:text-6xl font-bold">{{ score.player1 }}</p>
          </div>
        </div>
      </transition>

      <transition name="fade-player-two" appear>
        <!-- score player two -->
        <div class="relative flex justify-center items-center bg-white w-5/6 md:py-5 lg:w-1/7 rounded-3xl lg:p-7 border-4 border-b-8 border-black lg:order-3">
          <div class="absolute -right-5 lg:right-5 lg:left-1/2 md:top-4 lg:top-0 transform lg:-translate-x-1/2 lg:-translate-y-1/2">
            <img src="/assets/images/player-two.svg" alt="Icon Player Two" class="h-12">
          </div>
          <div class="flex flex-col md:flex-row-reverse lg:flex-col  w-full justify-around items-center gap-0 md:gap-7 lg:gap-0 lg:pt-4">
            <p class="font-bold">{{ props.gameMode === 'playerVsCom' ? 'COM' : 'PLAYER 2' }}</p>
            <p class="text-3xl md:text-6xl font-bold">{{ props.gameMode === 'playerVsCom' ? score.com : score.player2 }}</p>
          </div>
        </div>
      </transition>

      <div class="relative pt-7 md:px-7 lg:px-0 col-span-2 flex justify-center lg:order-2">
        <img 
          :src="currentPlayer === 'red' ? '/images/marker-red.svg' : '/images/marker-yellow.svg'"
          alt="Turn Indicator"
          class="absolute transition-transform duration-200 ease-in-out hidden lg:flex"
          :style="{ left: `${indicatorPosition}px`, top: '-10px' }"
        />
        
        <transition name="fade-scale" appear>
          <div class="relative w-full" @mousemove="updateIndicatorPosition">
            <img src="/assets/images/board-layer-white-small.svg" alt="Board Game" class="absolute flex sm:hidden z-30 pointer-events-none">
            <img src="/assets/images/board-layer-black-small.svg" alt="Board Layer" class="flex sm:hidden">
            
            <img src="/assets/images/board-layer-white-large.svg" alt="Board Game" class="absolute w-full h-auto object-cover hidden sm:flex z-30 pointer-events-none">
            <img src="/assets/images/board-layer-black-large.svg" alt="Board Layer" class="hidden w-full h-auto object-contain sm:flex">

            <!-- Tambahkan div untuk menampilkan kepingan -->
            <div class="absolute mb-9 sm:mb-[70px] mt-1 sm:mt-5 inset-0 flex flex-col justify-between">
              <div 
                v-for="(row, rowIndex) in board" 
                :key="rowIndex" 
                class="flex justify-between px-2"
              >
                <div
                  v-for="(cell, colIndex) in row" 
                  :key="colIndex" 
                  class=" w-2/12 sm:w-[14.28%] h-11 sm:h-16 flex items-center justify-center"
                  @click="!winner && placePiece(colIndex)"
                  @mouseover="hoveredColumn = colIndex"
                  @mouseleave="hoveredColumn = null"
                  :class="{ 'cursor-pointer': !winner }"
                >

                  <transition name="fall" mode="out-in">
                    <img 
                      v-if="cell === 'red'" 
                      src="/assets/images/counter-red-small.svg" 
                      alt="Red piece"
                      class="flex sm:hidden z-20"
                    />
                  </transition>
                  <transition name="fall" mode="out-in">
                    <img 
                      v-if="cell === 'red'" 
                      src="/assets/images/counter-red-large.svg" 
                      alt="Red piece"
                      class="hidden sm:flex z-20"
                    />
                  </transition>
                  
                  <transition name="fall" mode="out-in">
                    <img 
                      v-if="cell === 'yellow'" 
                      src="/assets/images/counter-yellow-small.svg" 
                      alt="Yellow piece"
                      class="flex sm:hidden z-20"
                    />
                  </transition>
                  <transition name="fall" mode="out-in">
                    <img 
                      v-if="cell === 'yellow'" 
                      src="/assets/images/counter-yellow-large.svg" 
                      alt="Yellow piece"
                      class="hidden sm:flex z-20"
                    />
                  </transition>

                  <div
                    v-if="winningPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)"
                    class="absolute w-5 h-5 sm:w-9 sm:h-9 border-4 sm:border-8 border-White rounded-full z-30"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <transition name="fade-timer" appear>
          <!-- Timer -->
          <div class="absolute top-[62%] sm:top-3/4 left-1/2 transform translate-y-3/4 -translate-x-1/2 flex flex-col items-center z-40">
            <div class="relative w-full flex justify-center">
              <img 
                v-if="currentPlayer === 'red'" 
                src="/assets/images/turn-background-red.svg" 
                alt="Turn Background Red" 
                class="object-contain"
              >
              <img 
                v-if="currentPlayer === 'yellow'" 
                src="/assets/images/turn-background-yellow.svg" 
                alt="Turn Background Yellow" 
                class="object-contai"
              >
            </div>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <!-- Menambahkan kelas dinamis untuk warna teks yang benar -->
              <p :class="currentPlayer === 'red' ? 'text-white text-base font-bold' : 'text-black text-base font-bold'">
                {{
                  props.gameMode === 'playerVsCom' ?
                    (currentPlayer === 'red' ? 'YOUR TURN' : "COM'S TURN") :
                    `PLAYER ${currentPlayer === 'red' ? '1' : '2'}'S TURN`
                }}
              </p>
              <!-- Menambahkan kelas dinamis untuk warna teks timer -->
              <p :class="currentPlayer === 'red' ? 'text-white text-3xl font-bold' : 'text-black text-3xl font-bold'">
                {{ timer }}s
              </p>
            </div>
          </div>
        </transition>

        <transition name="fade-scale">
          <div 
            v-if="winner || isDraw"
            class="absolute top-[60%] sm:top-3/4 left-1/2 transform translate-y-3/4 -translate-x-1/2 flex flex-col items-center bg-white py-3 px-12 w-60 rounded-xl shadow-xl border-4 border-black z-50"
          >
            <p class="font-bold text-black text-sm" v-if="winner">
              {{ 
                winner === 'player1' ? (props.gameMode === 'playerVsCom' ? 'YOU' : 'PLAYER 1') : 
                winner === 'player2' ? 'PLAYER 2' : 
                'COM' 
              }}
            </p>
            <p class="text-5xl font-bold text-black" v-if="winner">WINS</p>
            <p class="text-5xl font-bold text-black" v-if="isDraw">DRAW</p>
            <button 
              @click="playAgain" 
              class="mt-2 px-6 py-3 bg-Purple text-white font-bold rounded-full hover:bg-Pink cursor-pointer"
            >
              PLAY AGAIN
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- second-backround -->
    <div 
      class="fixed bottom-0 min-w-full h-1/4 md:h-1/6 lg:h-1/5 rounded-t-3xl -z-10"
      :class="backgroundClass"
    ></div>
  </div>
  
</template>

<script setup lang="ts">
// Emit untuk kembali ke menu
const emit = defineEmits(['back-to-menu']);
const showMenu = ref(false);
const continueGame = () => {
  showMenu.value = false; // Tutup modal dan lanjutkan game
};
const props = defineProps({
  gameMode: {
    type: String as () => 'playerVsPlayer' | 'playerVsCom',
    required: true,
  },
});

// indikator 
const indicatorPosition = ref(0);

const updateIndicatorPosition = (event: MouseEvent) => {
  const boardElement = document.querySelector('.relative.w-full') as HTMLElement | null;
  if (boardElement) {
    const boardRect = boardElement.getBoundingClientRect();
    const columnWidth = boardRect.width / 7;
    const mouseX = event.clientX - boardRect.left;

    let colIndex = Math.floor(mouseX / columnWidth);
    colIndex = Math.max(0, Math.min(colIndex, 6));

    indicatorPosition.value = colIndex * columnWidth + columnWidth / 2 - 15;
  }
};

// State permainan
const currentPlayer = ref<'red' | 'yellow'>('red');
const score = ref<{ player1: number; player2: number; com:number }>({
  player1: 0,
  player2: 0,
  com: 0,
});
const timer = ref(30);
let timerInterval: number;

// Representasi Papan
const board = ref<(null | 'red' | 'yellow')[][]>([]);
const rows = 6;
const cols = 7;

// Inisialisasi papan
const initializeBoard = () => {
  board.value = Array.from({ length: rows }, () => Array(cols).fill(null));
};

initializeBoard();

// logic game
const placePiece = (col: number) => {
  if (winner.value) {
    return; // Hentikan jika sudah ada pemenang
  }

  for (let row = rows - 1; row >= 0; row--) {
    if (board.value[row][col] === null) {
      board.value[row][col] = currentPlayer.value;
      checkWin(row, col); // Cek apakah ada pemenang
      if (!winner.value) {
        isDraw.value = checkDraw(); // Cek apakah seri
      }

      if (!winner.value && !isDraw.value) {
        switchTurn(); // Ganti giliran

        // Cek apakah giliran komputer setelah ganti turn
        if (props.gameMode === 'playerVsCom' && currentPlayer.value === 'yellow') {
          setTimeout(() => makeComputerMove(), 500); // Delay biar terasa lebih natural
        }
      }
      return;
    }
  }
};

// Logika untuk COM (Computer)
// Logika untuk COM (Computer) bisa ditambahkan di sini
const makeComputerMove = () => {
  if (props.gameMode === 'playerVsCom' && currentPlayer.value === 'yellow') {
    // Implementasikan logika untuk membuat gerakan COM
    const availableColumns = board.value[0]
      .map((cell, col) => cell === null ? col : null)
      .filter(col => col !== null);

    if (availableColumns.length > 0) {
      const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      placePiece(randomCol);
    }
  }
};

// Panggil makeComputerMove setelah giliran pemain
watch(currentPlayer, (newPlayer) => {
  if (newPlayer === 'yellow' && props.gameMode === 'playerVsCom') {
    setTimeout(makeComputerMove, 1000); // Beri jeda sebelum COM bergerak
  }
});

const winner = ref<'player1' | 'player2' | 'com' | null>(null);
const winningPositions = ref<{ row: number, col: number }[]>([]);
const checkWin = (row: number, col: number) => {
  const directions = [
    [1, 0], // Vertikal
    [0, 1], // Horizontal
    [1, 1], // Diagonal kanan bawah
    [1, -1], // Diagonal kiri bawah
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    let positions = [{ row, col }];

    for (let i = 1; i < 4; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board.value[newRow][newCol] === currentPlayer.value) {
        count++;
        positions.push({ row: newRow, col: newCol });
      } else {
        break;
      }
    }

    for (let i = 1; i < 4; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board.value[newRow][newCol] === currentPlayer.value) {
        count++;
        positions.push({ row: newRow, col: newCol });
      } else {
        break;
      }
    }

    if (count >= 4) {
      // Tentukan pemenang berdasarkan mode permainan
      if (props.gameMode === 'playerVsCom') {
        winner.value = currentPlayer.value === 'red' ? 'player1' : 'com'; // "YOU" atau "COM"
      } else {
        winner.value = currentPlayer.value === 'red' ? 'player1' : 'player2'; // "PLAYER 1" atau "PLAYER 2"
      }
      winningPositions.value = positions;
      updateScore();
      return;
    }
  }
};

const isDraw = ref<boolean>(false);

const checkDraw = (): boolean => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board.value[row][col] === null) {
        return false; // Masih ada sel yang kosong
      }
    }
  }
  return true; // Semua sel terisi
};

const backgroundClass = computed(() => {
  if (winner.value === 'player1') return 'bg-Pink';
  if (winner.value === 'player2') return 'bg-Yellow';
  if (winner.value === 'com') return 'bg-Yellow';
  return 'bg-Purple'; // Default background
});

const updateScore = () => {
  if (winner.value === 'player1') {
    score.value.player1++;
  } else if (winner.value === 'player2') {
    score.value.player2++;
  } else if (winner.value === 'com') {
    score.value.com++;
  }
};

const playAgain = async () => {
  winner.value = null;
  isDraw.value = false;
  initializeBoard();
  resetTimer();
  await nextTick();
  currentPlayer.value = Math.random() < 0.5 ? 'red' : 'yellow';
  winningPositions.value = [];
};

const switchTurn = () => {
  currentPlayer.value = currentPlayer.value === 'red' ? 'yellow' : 'red';
  resetTimer();
};

// Timer logic
const resetTimer = (): void => {
  clearInterval(timerInterval);
  timer.value = 30;
  timerInterval = setInterval(() => {
    timer.value--;
    if (timer.value === 0) {
      switchTurn();
    }
  }, 1000);
};

// Reset game logic
const restartGame = (): void => {
  currentPlayer.value = 'red';
  resetTimer();
  showMenu.value = false;
  initializeBoard();
  score.value = { player1: 0, player2: 0, com: 0 };
  board.value = Array(rows).fill(null).map(() => Array(cols).fill(null));
  winner.value = null;
  winningPositions.value = [];
};

// Start timer saat komponen dimuat
onMounted(() => {
  resetTimer();
});


function defineEmits(arg0: "back-to-menu"[]) {
  throw new Error('Function not implemented.');
}
</script>

<style scoped>
.utama {
  border: 3px solid red;
}

/* header */
.fade-header-enter-active {
  transition: all 0.8s ease-out;
}
.fade-header-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-header-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* menu pause */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* player-one */
.fade-player-one-enter-active,
.fade-player-one-enter-leave {
  transition: all 0.8s ease-out;
}
.fade-player-one-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.fade-player-one-leave-to {
  opacity: 1;
  transform: translateX(0);
}

/* player-two */
.fade-player-two-enter-active,
.fade-player-two-enter-leave {
  transition: all 0.8s ease-out;
}
.fade-player-two-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.fade-player-two-leave-to {
  opacity: 1;
  transform: translateX(0);
}

/* counter */
@keyframes fall {
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes disappear {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.fall-animation {
  animation: fall 0.3s ease-in-out forwards, bounce 0.2s 0.3s ease-in-out;
}

.fall-enter-active {
  animation: fall 0.3s ease-in-out forwards, bounce 0.2s 0.3s ease-in-out;
}


.fall-leave-active {
  animation: disappear 0.3s ease-in-out forwards;
}

.fade-timer-enter-active {
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}
.fade-timer-enter-from {
  transform: translateY(50px);
  opacity: 0;
}
.fade-timer-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.btn {
  box-shadow: 0 5px black;
}

.btn:hover {
  box-shadow: 0 5px hsl(257, 67%, 51%);
}

.btn:active {
  box-shadow: 0 2px hsl(257, 67%, 51%);
  transform: translateY(5px);
}
</style>
