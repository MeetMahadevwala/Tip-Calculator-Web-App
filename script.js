// ============================================
//           DOM Element Selection
// ============================================
const billInput = document.getElementById('bill-input');
const tipButtons = document.querySelectorAll('.tip-percent-btn');
const customTipInput = document.getElementById('custom-tip-input');
const peopleInput = document.getElementById('people-input');
const tipAmountDisplay = document.getElementById('tip-amount-display');
const totalAmountDisplay = document.getElementById('total-amount-display');
const resetButton = document.getElementById('reset-button');

// ============================================
//           Event Listeners
// ============================================

// --- Bill Input Listener ---
billInput.addEventListener('input', calculateTip);

// --- Tip Buttons Listener ---
tipButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedButton = event.target;
        const tipPercentage = clickedButton.dataset.tip;

        tipButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        customTipInput.value = '';

        console.log(`Button ${tipPercentage}% clicked`);

        if (!tipPercentage) {
            console.warn('Clicked button is missing the data-tip attribute!');
        }
        calculateTip();
    });
});

// --- Custom Tip Input Listener ---
customTipInput.addEventListener('input', () => {
    tipButtons.forEach(btn => btn.classList.remove('active'));

    console.log(`Custom tip: ${customTipInput.value}%`);

    calculateTip();
});

// --- Number of People Input Listener ---
peopleInput.addEventListener('input', calculateTip);

// --- Listener for the Reset button ---
if(resetButton){
    resetButton.addEventListener('click', () => {
        resetCalculator();
    });
}
else{
    console.error('Error: Reset button element not found. Cannot add event listener.');
}

// ============================================
//             Core Functions
// ============================================

function calculateTip() {
    console.log('--- Executing CalculateTip ---');

    // --- 1. Retrieve Input Values (Strings) ---
    const billValueStr = billInput.value;
    const peopleValueStr = peopleInput.value;
    const customTipValueStr = customTipInput.value;

    // --- 2. Convert to Numbers ---
    const billAmount = parseFloat(billValueStr);
    const numberOfPeople = parseFloat(peopleValueStr);
    const customTipPercent = parseFloat(customTipValueStr);

    // ===========================================================
    // --- 3. INPUT VALIDATION SECTION ---
    // ===========================================================
    const isBillValid = !isNaN(billAmount) && billAmount >= 0;
    const isPeopleValid = !isNaN(numberOfPeople) && numberOfPeople >= 0 && Number.isInteger(numberOfPeople);
    const isCustomInputValid = customTipValueStr === '' || (!isNaN(customTipPercent) && customTipPercent >= 0);


    // --- 4. Determine Tip Percentage to Use ---
    let actualTipPercent = 0;
    if (customTipValueStr !== '' && !isNaN(customTipPercent) && customTipPercent >= 0) {
        actualTipPercent = customTipPercent;
    }
    else if (customTipValueStr === '') {
        const activeButton = document.querySelector('.tip-percent-btn');
        if(activeButton){
            const selectedButtonTipPercent = parseFloat(activeButton.dataset.tip);
            if(!isNaN(selectedButtonTipPercent) && selectedButtonTipPercent >= 0){
                actualTipPercent = selectedButtonTipPercent;
            }
        }
    }

    const isTipValid = !isNaN(actualTipPercent) && actualTipPercent >= 0;

    // --- 5. Calculate Total Tip ---
    let totalTipAmount = 0;
    if (isBillValid && isTipValid) {
        totalTipAmount = billAmount * (actualTipPercent / 100);
    }

    // --- 6. Calculate Total Bill ---
    let totalBillAmount = 0;
    if(isBillValid){
        totalBillAmount = billAmount + totalTipAmount;
    }

    // --- 7. Calculate Per-Person Amounts (with existing division validation) ---
    let tipAmountPerPerson = 0;
    let totalAmountPerPerson = 0;

    if (isBillValid && isTipValid && isPeopleValid) {
        if(!isNaN(totalBillAmount)){
            tipAmountPerPerson = totalTipAmount / numberOfPeople;
            totalAmountPerPerson = totalBillAmount / numberOfPeople;
        }
        else{
            tipAmountPerPerson = 0;
            totalAmountPerPerson = 0;
            console.warn("Per-person calculation aborted: totalBillAmount was NaN despite other flags.");
        }
    }
    // else{
    //     if(!isPeopleValid){
    //         console.warn(`Cannot calculate per-person amounts. Number of People (${numberOfPeople}) is not a positive integer.`);
    //     }
    //     else if(!isBillValid){
    //         console.warn("Cannot calculate per-person amounts due to invalid Bill Amount.");
    //     }
    //     else if(!isTipValid){
    //         console.warn("Cannot calculate per-person amounts due to invalid Tip Percentage.");
    //     }
    // }

    // --- 8. Format Results for Display ---
    const formattedTipAmount = tipAmountPerPerson.toFixed(2);
    const formattedTotalAmount = totalAmountPerPerson.toFixed(2);
    const displayTipAmount = `₹${formattedTipAmount}`;
    const displayTotalAmount = `₹${formattedTotalAmount}`;

    // --- 9. Update DOM ---
    if (tipAmountDisplay) {
        tipAmountDisplay.textContent = displayTipAmount;
    }
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = displayTotalAmount;
    }

    // --- 10. Apply Visual Feedback (Task 9.5 Implementation) ---
    if (billInput) {
        billInput.classList.toggle('error', !isBillValid);
    }
    if (peopleInput) {
        peopleInput.classList.toggle('error', !isPeopleValid);
    }
    if (customTipInput) {
        let showErrorForCustomTip = !isCustomInputValid;
        activeButton = document.querySelector('.tip-percent-btn');
        if(customTipInput.value === '' && activeButton){
            showErrorForCustomTip = false;
        }
        customTipInput.classList.toggle('error', showErrorForCustomTip);
    }

}

function resetCalculator(){

    if(billInput){
        billInput.value = '';
    }
    if(customTipInput){
        customTipInput.value = '';
    }
    if(tipButtons && tipButtons.length > 0){
        tipButtons.forEach(button => {
            button.classList.remove('active');
        });
    }
    if(peopleInput){
        peopleInput.value = '';
    }
    if(tipAmountDisplay){
        tipAmountDisplay.textContent = '₹0.00';
    }
    if(totalAmountDisplay){
        totalAmountDisplay.textContent = '₹0.00';
    }
    if(billInput){
        billInput.classList.remove('error');
    }
    if(customTipInput){
        customTipInput.classList.remove('error');
    }
    if(peopleInput){
        peopleInput.classList.remove('error');
    }
}

// ============================================\\
//           Initial Execution
// ============================================\\
// document.addEventListener('DOMContentLoaded', () => {
//     calculateTip();
// });