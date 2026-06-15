/* ============================================
   QUICKSORT VISUALIZER - JAVASCRIPT
   ============================================ */

// ============================================
// VARIABLES AND DOM ELEMENTS
// ============================================

// Canvas setup for drawing bars
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Input controls
const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const arraySizeInput = document.getElementById('arraySize');
const speedControl = document.getElementById('speedControl');

// Display elements
const arraySizeValue = document.getElementById('arraySizeValue');
const speedValue = document.getElementById('speedValue');
const comparisonsDisplay = document.getElementById('comparisons');
const swapsDisplay = document.getElementById('swaps');
const statusDisplay = document.getElementById('status');

// State variables
let array = []; // Current array to sort
let originalArray = []; // Copy of original array for reset
let isRunning = false; // Flag to prevent concurrent sorting
let comparisons = 0; // Count of comparisons made
let swaps = 0; // Count of swaps made
let speed = 100; // Animation speed (higher = slower)

// Color constants for visualization
const COLORS = {
    DEFAULT: '#667eea',      // Default bar color (blue)
    COMPARING: '#ff6b6b',    // Color for bars being compared (red)
    PIVOT: '#ffd93d',        // Color for pivot element (yellow)
    SORTED: '#28a745',       // Color for sorted elements (green)
    SWAPPING: '#ff9999'      // Color for elements being swapped (light red)
};

// ============================================
// INITIALIZATION FUNCTION
// ============================================

// Initialize the visualizer when page loads
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    generateArray();
    setupEventListeners();
    drawBars();
});

// Adjust canvas size when window resizes
window.addEventListener('resize', () => {
    resizeCanvas();
    drawBars();
});

// ============================================
// EVENT LISTENERS
// ============================================

// Set up all button and slider event listeners
function setupEventListeners() {
    // Generate new random array
    generateBtn.addEventListener('click', generateArray);

    // Start the sorting algorithm
    startBtn.addEventListener('click', startSorting);

    // Reset to original array state
    resetBtn.addEventListener('click', resetArray);

    // Update array size display when slider changes
    arraySizeInput.addEventListener('input', (e) => {
        arraySizeValue.textContent = e.target.value;
    });

    // Update speed label based on slider value
    speedControl.addEventListener('input', (e) => {
        speed = 510 - parseInt(e.target.value); // Invert: higher slider = faster sorting
        const speedLabel = parseInt(e.target.value);
        if (speedLabel < 100) speedValue.textContent = 'Slow';
        else if (speedLabel < 300) speedValue.textContent = 'Medium';
        else speedValue.textContent = 'Fast';
    });
}

// ============================================
// CANVAS AND DRAWING FUNCTIONS
// ============================================

// Resize canvas to fit container
function resizeCanvas() {
    const container = document.querySelector('.visualization');
    canvas.width = container.clientWidth - 40; // Account for padding
    canvas.height = 400;
}

// Draw all bars on canvas
function drawBars(colors = null) {
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions for each bar
    const barWidth = canvas.width / array.length;
    const maxValue = Math.max(...array);

    // Draw each bar
    for (let i = 0; i < array.length; i++) {
        // Calculate bar height proportional to value
        const barHeight = (array[i] / maxValue) * (canvas.height - 20);
        const x = i * barWidth;
        const y = canvas.height - barHeight - 10;

        // Use custom colors if provided, otherwise use default
        ctx.fillStyle = colors ? colors[i] : COLORS.DEFAULT;

        // Draw rectangle for bar
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

        // Draw border around bar
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y, barWidth - 4, barHeight);
    }
}

// ============================================
// ARRAY MANIPULATION FUNCTIONS
// ============================================

// Generate a new random array
function generateArray() {
    // Get array size from slider (10 to 200 elements)
    const size = parseInt(arraySizeInput.value);

    // Create array with random values between 10 and 100
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }

    // Store copy for reset functionality
    originalArray = [...array];

    // Reset counters and display
    comparisons = 0;
    swaps = 0;
    comparisonsDisplay.textContent = '0';
    swapsDisplay.textContent = '0';
    statusDisplay.textContent = 'Ready';

    // Update button states
    startBtn.disabled = false;
    resetBtn.disabled = true;

    // Redraw with new array
    drawBars();
}

// Reset array to original state
function resetArray() {
    array = [...originalArray];
    comparisons = 0;
    swaps = 0;
    comparisonsDisplay.textContent = '0';
    swapsDisplay.textContent = '0';
    statusDisplay.textContent = 'Ready';
    isRunning = false;

    startBtn.disabled = false;
    resetBtn.disabled = true;

    drawBars();
}

// ============================================
// SORTING VISUALIZATION FUNCTIONS
// ============================================

// Main sorting function
async function startSorting() {
    // Prevent multiple simultaneous sorts
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;
    generateBtn.disabled = true;
    arraySizeInput.disabled = true;
    statusDisplay.textContent = 'Sorting...';

    // Reset counters for this sort
    comparisons = 0;
    swaps = 0;

    // Call quicksort with full array range
    await quicksort(0, array.length - 1);

    // Sorting complete
    statusDisplay.textContent = 'Sorting Complete!';
    isRunning = false;
    resetBtn.disabled = false;

    // Highlight all bars as sorted
    const colors = new Array(array.length).fill(COLORS.SORTED);
    drawBars(colors);
}

// Quicksort algorithm with visualization
async function quicksort(low, high) {
    // Base case: if subarray has 1 or fewer elements, it's sorted
    if (low < high) {
        // Partition array and get pivot index
        const pi = await partition(low, high);

        // Recursively sort left side (elements less than pivot)
        await quicksort(low, pi - 1);

        // Recursively sort right side (elements greater than pivot)
        await quicksort(pi + 1, high);
    }
}

// Partition function - divides array around pivot
async function partition(low, high) {
    // Choose last element as pivot
    const pivotValue = array[high];
    let i = low - 1; // Index of smaller element

    // Create color array for visualization
    let colors = new Array(array.length).fill(COLORS.DEFAULT);
    colors[high] = COLORS.PIVOT; // Highlight pivot

    // Traverse through all elements and compare with pivot
    for (let j = low; j < high; j++) {
        // Highlight comparing elements
        colors[j] = COLORS.COMPARING;
        colors[i + 1] = COLORS.COMPARING;
        drawBars(colors);

        // Wait for animation delay
        await delay(speed);

        // Increment comparison counter
        comparisons++;
        comparisonsDisplay.textContent = comparisons;

        // If current element is smaller than pivot
        if (array[j] < pivotValue) {
            i++; // Move boundary
            // Swap elements
            [array[i], array[j]] = [array[j], array[i]];
            swaps++;
            swapsDisplay.textContent = swaps;

            // Highlight swap
            colors = new Array(array.length).fill(COLORS.DEFAULT);
            colors[i] = COLORS.SWAPPING;
            colors[j] = COLORS.SWAPPING;
            colors[high] = COLORS.PIVOT;
            drawBars(colors);

            await delay(speed);
        }

        // Reset colors
        colors = new Array(array.length).fill(COLORS.DEFAULT);
        colors[high] = COLORS.PIVOT;
        drawBars(colors);
    }

    // Place pivot in correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    swapsDisplay.textContent = swaps;

    // Highlight final position of pivot
    colors = new Array(array.length).fill(COLORS.DEFAULT);
    colors[i + 1] = COLORS.SORTED;
    drawBars(colors);

    await delay(speed);

    return i + 1; // Return pivot's final position
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Delay function for animation timing
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Shuffle array using Fisher-Yates algorithm (optional utility)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ============================================
// COMMENTS AND ALGORITHM EXPLANATION
// ============================================

/*
QUICKSORT ALGORITHM EXPLANATION:

1. DIVIDE AND CONQUER APPROACH:
   - Quicksort divides the array into smaller sub-arrays
   - Uses a pivot element to partition the array
   - Recursively sorts the sub-arrays

2. HOW IT WORKS:
   a) Choose a pivot element (in this case, the last element)
   b) Partition: Move all elements smaller than pivot to left,
                 larger elements to right
   c) Recursively sort left and right partitions
   d) Combine: The array is now sorted!

3. TIME COMPLEXITY:
   - Average Case: O(n log n) - Most of the time
   - Worst Case: O(n²) - When pivot is always smallest/largest
   - Best Case: O(n log n) - When pivot divides evenly

4. SPACE COMPLEXITY:
   - O(log n) - Due to recursive call stack

5. WHY IS IT FAST?
   - In-place sorting (doesn't need extra array)
   - Good cache locality
   - Average performance is better than many algorithms
   - Practical choice for most real-world applications

6. VISUALIZATION COLORS:
   - BLUE: Elements not being compared
   - RED: Elements currently being compared
   - YELLOW: Pivot element
   - LIGHT RED: Elements being swapped
   - GREEN: Elements in final sorted position
*/
