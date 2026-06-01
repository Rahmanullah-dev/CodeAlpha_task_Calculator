// Display elements
const displayMain = document.getElementById('displayMain');
const expressionPreview = document.getElementById('expressionPreview');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
    let displayValue = currentOperand;

    // Prevent overflow
    if (displayValue.length > 20 && !displayValue.includes('e')) {
        displayValue = displayValue.slice(0, 24) + '...';
    }

    displayMain.innerText = displayValue || '0';

    if (operation && previousOperand !== '') {
        let opSymbol = '';

        if (operation === '+') opSymbol = '+';
        else if (operation === '-') opSymbol = '−';
        else if (operation === '*') opSymbol = '×';
        else if (operation === '/') opSymbol = '÷';

        expressionPreview.innerText = `${previousOperand} ${opSymbol}`;
    } else {
        expressionPreview.innerText = '';
    }
}

function appendNumber(number) {

    // Start new input
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }

    // Prevent duplicates
    if (number === '.' && currentOperand.includes('.')) return;

    // Input limit
    if (currentOperand.length >= 16) return;

    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }

    updateDisplay();
}

function chooseOperator(op) {
    if (currentOperand === '' && previousOperand === '') return;

    // Chain operations
    if (operation && !shouldResetScreen && previousOperand !== '') {
        compute();
    }

    if (previousOperand === '') {
        previousOperand = currentOperand;
    } else if (operation && shouldResetScreen) {
        previousOperand = currentOperand;
    }

    operation = op;
    shouldResetScreen = true;

    updateDisplay();
}

function compute() {
    if (operation === null || previousOperand === '' || currentOperand === '') return;

    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);

    // Validate numbers
    if (isNaN(prev) || isNaN(curr)) {
        clearAll();
        displayMain.innerText = 'Error';
        return;
    }

    let result;

    // Perform calculation
    switch (operation) {
        case '+':
            result = prev + curr;
            break;

        case '-':
            result = prev - curr;
            break;

        case '*':
            result = prev * curr;
            break;

        case '/':

            // Divide protection
            if (curr === 0) {
                clearAll();
                displayMain.innerText = 'Error';
                return;
            }

            result = prev / curr;
            break;

        default:
            return;
    }

    // Clean decimals
    let finalResult;

    if (Number.isInteger(result)) {
        finalResult = result.toString();
    } else {
        finalResult = parseFloat(result.toFixed(8)).toString();
    }

    currentOperand = finalResult;
    previousOperand = '';
    operation = null;

    // Ready next input
    shouldResetScreen = true;

    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    shouldResetScreen = false;

    updateDisplay();
}

function deleteLast() {

    // Reset state
    if (shouldResetScreen) {
        clearAll();
        return;
    }

    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);

        if (currentOperand === '') {
            currentOperand = '0';
        }
    }

    updateDisplay();
}

function evaluateEquals() {
    if (operation && previousOperand !== '' && !shouldResetScreen) {
        compute();
    }

    updateDisplay();
}

function handleKeyboard(event) {
    const key = event.key;

    // Number keys
    if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        appendNumber(key);
    }
    else if (key === '.') {
        event.preventDefault();
        appendNumber('.');
    }

    // Operator keys
    else if (key === '+') {
        event.preventDefault();
        chooseOperator('+');
    }
    else if (key === '-') {
        event.preventDefault();
        chooseOperator('-');
    }
    else if (key === '*') {
        event.preventDefault();
        chooseOperator('*');
    }
    else if (key === '/') {
        event.preventDefault();
        chooseOperator('/');
    }

    // Enter key
    else if (key === 'Enter') {
        event.preventDefault();
        evaluateEquals();
    }

    // Delete key
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }

    // Clear keys
    else if (key === 'Escape' || key === 'Delete') {
        event.preventDefault();
        clearAll();
    }
}

function setupEventListeners() {

    // Number buttons
    document.querySelectorAll('[data-num]').forEach(btn => {
        btn.addEventListener('click', () => {
            appendNumber(btn.getAttribute('data-num'));
        });
    });

    // Operator buttons
    document.querySelectorAll('[data-op]').forEach(btn => {
        btn.addEventListener('click', () => {
            chooseOperator(btn.getAttribute('data-op'));
        });
    });

    const clearBtn = document.querySelector('[data-action="clear"]');
    if (clearBtn) clearBtn.addEventListener('click', clearAll);

    const deleteBtn = document.querySelector('[data-action="delete"]');
    if (deleteBtn) deleteBtn.addEventListener('click', deleteLast);

    const equalsBtn = document.querySelector('[data-action="equals"]');
    if (equalsBtn) equalsBtn.addEventListener('click', evaluateEquals);
}

// App entry
function init() {
    setupEventListeners();
    window.addEventListener('keydown', handleKeyboard);
    clearAll();
}

init();