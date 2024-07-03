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
        byteStringArray.push(...bytes);
    });
    return String.fromCharCode(...byteStringArray);
}

// Funkcja odwracająca proces zmniejszenia w trzech krokach
function reverseReduceInThreeSteps(reducedNumbers, token1, token2, token3) {
    const size = reducedNumbers.length;
    const restoredNumbers = [...reducedNumbers];

    for (let i = 0; i < size; i++) {
        if (i % 3 === 0) {
            restoredNumbers[i] = (restoredNumbers[i] + token1[i % 8]) % 1000000007;
        } else if (i % 3 === 1) {
            restoredNumbers[i] = (restoredNumbers[i] + token2[i % 8]) % 1000000007;
        } else {
            restoredNumbers[i] = (restoredNumbers[i] + token3[i % 8]) % 1000000007;
        }
    }

    return restoredNumbers;
}

// Funkcja przywracająca oryginalne liczby na podstawie PIN-a (KeyPass)
function restorePassword(keyPass) {
    // Definicja tokenów - przykładowe wartości, do zmiany na własne
    const token1 = [415, 588, 676, 925, 809, 289, 45, 347];
    const token2 = [157, 966, 216, 92, 961, 180, 636, 613];
    const token3 = [292, 627, 779, 749, 483, 134, 577, 230];

    // Przekształcenie KeyPass na liczby
    let restoredNumbers = [];
    for (let i = 0; i < keyPass.length; i++) {
        restoredNumbers.push(parseInt(keyPass[i], 10));
    }

    // Odtworzenie oryginalnych liczb
    restoredNumbers = reverseReduceInThreeSteps(restoredNumbers, token1, token2, token3);

    // Przywrócenie ciągu bajtów
    const recoveredByteString = splitNumbers(restoredNumbers);

    return recoveredByteString;
}

// Funkcja obsługująca kliknięcie przycisku GO
function recoverPassword() {
    const pinInput = document.getElementById('pin');
    const keyPass = pinInput.value.trim();
    
    // Przywrócenie hasła z KeyPass
    const recoveredByteString = restorePassword(keyPass);

    // Wyświetlenie przywróconego hasła
    const recoveredPasswordDiv = document.getElementById('recoveredPassword');
    recoveredPasswordDiv.textContent = recoveredByteString;
}

// Przykładowa funkcja logowania
function login() {
    // Tutaj można dodać logikę logowania
    alert('Zalogowano!');
}
