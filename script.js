// Funkcja przekształcająca ciąg bajtów na wartości liczbowe połączone w liczby 3-bajtowe
function combineBytes(byteString) {
    const combinedNumbers = [];
    let tempNumber = 0;
    for (let i = 0; i < byteString.length; i++) {
        tempNumber = (tempNumber << 8) | byteString.charCodeAt(i);
        if ((i + 1) % 3 === 0 || i === byteString.length - 1) {
            combinedNumbers.push(tempNumber);
            tempNumber = 0;
        }
    }
    return combinedNumbers;
}

// Funkcja przekształcająca liczby z powrotem na bajty
function splitNumbers(combinedNumbers) {
    const byteStringArray = [];
    combinedNumbers.forEach(num => {
        let bytes = [];
        while (num > 0) {
            bytes.unshift(num & 0xFF);
            num = num >> 8;
        }
        while (bytes.length < 3) {
            bytes.unshift(0);
        }
        byteStringArray.push(...bytes);
    });
    return String.fromCharCode(...byteStringArray);
}

// Funkcja zmniejszająca wartości w trzech krokach za pomocą tokenów do liczby KeyPass
function reduceNumbersInThreeSteps(numbers, token1, token2, token3) {
    const size = numbers.length;
    const reducedNumbers = [...numbers];

    for (let i = 0; i < size; i++) {
        if (i % 3 === 0) {
            reducedNumbers[i] = (reducedNumbers[i] - token1[i % 8] + 1000000007) % 1000000007;
        } else if (i % 3 === 1) {
            reducedNumbers[i] = (reducedNumbers[i] - token2[i % 8] + 1000000007) % 1000000007;
        } else {
            reducedNumbers[i] = (reducedNumbers[i] - token3[i % 8] + 1000000007) % 1000000007;
        }
    }

    return reducedNumbers;
}

// Funkcja odzyskująca oryginalny ciąg bajtów na podstawie KeyPass (PIN)
function recoverByteString() {
    const pin = document.getElementById('pin').value;
    const keyPass = parseInt(pin); // Konwertujemy PIN na liczbę

    // Definicja tokenów
    const token1 = [415, 588, 676, 925, 809, 289, 45, 347];
    const token2 = [157, 966, 216, 92, 961, 180, 636, 613];
    const token3 = [292, 627, 779, 749, 483, 134, 577, 230];

    // Przekształcenie KeyPass na reducedNumbers
    let reducedNumbers = [keyPass];
    reducedNumbers = reduceNumbersInThreeSteps(reducedNumbers, token1, token2, token3);

    // Odzyskanie oryginalnych bajtów
    const originalNumbers = [...reducedNumbers];
    const byteString = splitNumbers(originalNumbers);

    // Wyświetlenie odzyskanego ciągu bajtów
    const recoveredByteString = document.getElementById('recoveredByteString');
    recoveredByteString.value = byteString;
}
