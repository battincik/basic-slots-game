const symbols = [
    { emoji: "🍒", rate: 0.5 },
    { emoji: "🍇", rate: 0.75 },
    { emoji: "🍊", rate: 1.0 },
    { emoji: "🍋", rate: 1.5 },
    { emoji: "🍉", rate: 2.0 },
    { emoji: "🍎", rate: 3.0 },
    { emoji: "🍓", rate: 4.0 },
    { emoji: "🍌", rate: 5.0 },
    { emoji: "🍏", rate: 10.0 },
    { emoji: "🥭", rate: 15.0 },
    { emoji: "🍍", rate: 20.0 },
    { emoji: "🥝", rate: 25.0 },
];

var kredi = 500; // Kredi miktarı
var sonKazanc = 0; // Son kazanç miktarı
var slotAnimationsComplete = 0; // Tamamlanan animasyonları saymak için bir değişken ekliyoruz
var spinning = false; // Dönme işlemi devam ediyor mu kontrol etmek için bir değişken ekliyoruz
var completedAnimations = 0; // Tamamlanan animasyonları saymak için bir değişken ekliyoruz
var maxPastResults = 6; // En fazla gösterilecek geçmiş sonuç sayısı

var slotResults = []; // Sonuçları saklamak için bir dizi ekliyoruz
var pastResults = []; // Geçmiş sonuçları saklamak için bir dizi ekliyoruz

var krediAlani = document.getElementById("current-credit"); // Kredi alanını seçiyoruz
var kazancAlani = document.getElementById("last-win"); // Kazanç alanını seçiyoruz
var betInput = document.getElementById("bet"); // Bet inputunu seçiyoruz
var decreaseButton = document.querySelector("button.btn-secondary"); // Azaltma butonunu seçiyoruz
var increaseButton = document.querySelector("button.btn-primary"); // Artırma butonunu seçiyoruz
var spinButonu = document.querySelector("button.btn-success"); // Spin düğmesini seçiyoruz
var slotRows = document.querySelectorAll(".slots .row"); // Slot satırlarını seçiyoruz

krediAlani.textContent = kredi; // Kredi miktarını güncelle
kazancAlani.textContent = sonKazanc; // Kazanç miktarını güncelle

spinButonu.addEventListener("click", function () { // Spin düğmesine tıklandığında
    if (spinning) return alert("Dönme işlemi devam ediyor, lütfen bekleyin!"); // Dönme işlemi devam ediyorsa, kullanıcıya uyarı ver
    var currentBet = parseInt(betInput.value); // Mevcut bahis değerini alıyoruz
    if (currentBet <= 0) { // Bahis miktarı 0 veya daha az ise
        return alert("Lütfen geçerli bir bahis miktarı girin."); // Bahis miktarı 0 veya daha az ise, kullanıcıya uyarı ver
    } else if (currentBet > kredi) { // Bahis miktarı, mevcut kredi miktarını aşıyorsa
        return alert("Bahis miktarı, mevcut kredi miktarını aşıyor. Lütfen geçerli bir bahis miktarı girin."); // Bahis miktarı, mevcut kredi miktarını aşıyorsa, kullanıcıya uyarı ver
    }
    clearSlots(); // Slotları temizle
    kredi -= currentBet; // Krediden bahis miktarını çıkar
    krediAlani.textContent = kredi; // Kredi miktarını güncelle
    spinning = true; // Dönme işlemi devam ediyor
    spinButonu.disabled = true; // Spin düğmesini devre dışı bırak
    slotAnimationsComplete = 0; // Tamamlanan animasyonları sıfırla
    animateRows(); // Animasyonları başlat
});

function clearSlots() { // Slotları temizle
    for (var i = 0; i < slotRows.length; i++) { // Tüm slot satırları üzerinde döngü
        var row = slotRows[i]; // Mevcut satırı seç
        var slots = row.querySelectorAll(".slot"); // Mevcut satırdaki tüm slotları seç
        for (var j = 0; j < slots.length; j++) { // Mevcut satırdaki tüm slotlar üzerinde döngü
            var slot = slots[j]; // Mevcut slotu seç
            slot.textContent = ""; // Slot içeriğini temizle
        } // Mevcut satırdaki tüm slotlar üzerinde döngü bitti
    } // Tüm slot satırları üzerinde döngü bitti
    slotResults = []; // Sonuçları temizle
    completedAnimations = 0; // Tamamlanan animasyonları sıfırla
}

function animateRows() { // Animasyonları başlat
    var animationDuration = 1000; // Düşme hızını ayarla (1 saniye)

    for (var j = 0; j < slotRows[0].children.length; j++) { // İlk satırdaki tüm slotlar üzerinde döngü
        for (var i = 0; i < slotRows.length; i++) { // Tüm slot satırları üzerinde döngü
            var row = slotRows[i]; // Mevcut satırı seç
            var slots = row.querySelectorAll(".slot"); // Mevcut satırdaki tüm slotları seç
            var slot = slots[j]; // Mevcut slotu seç
            setTimeout(function (slot, rowId, columnId) { // Slotu seç, satır ve sütun numarasını al
                return function () { // Döndürülen fonksiyonu döndür
                    slot.style.animationDuration = animationDuration + "ms"; // Düşme hızını ayarla
                    var randomSymbol = symbols[Math.floor(Math.random() * symbols.length)].emoji; // Rastgele bir emoji seç
                    slot.textContent = randomSymbol; // Slot içeriğini emoji ile güncelle
                    completedAnimations++; // Tamamlanan animasyonları arttır
                    if (completedAnimations === slotRows.length * slotRows[0].children.length) { // Tamamlanan animasyonlar, slot satırı sayısı ile slot sütun sayısının çarpımına eşitse
                        console.log("Tüm animasyonlar tamamlandı"); // Konsola bilgi mesajı yaz
                        setTimeout(function () { // 100ms gecikme ekleyerek işlemi biraz geciktir
                            spinning = false; // Dönme işlemi devam etmiyor
                            spinButonu.disabled = false; // Spin düğmesini etkinleştir
                            collectResults(); // Sonuçları topla
                        }, 100); // 100ms gecikme ekleyerek işlemi biraz geciktir
                    }
                    slotResults.push({ row: rowId, column: columnId, emoji: randomSymbol }); // Sonuçları kaydet
                }; // Döndürülen fonksiyonu döndür
            }(slot, i + 1, j + 1), i * 150); // Sıradaki slot için gecikme ekleyin, bu sefer yukarıdan aşağıya doğru düşmesini sağlamak için i'yi ekledik
        }
    }
}

function countEmojiOccurrences() { // Emoji sayılarını say
    var emojiCounts = {}; // Emoji sayılarını saklayacak bir nesne oluşturuyoruz
    for (var i = 0; i < slotResults.length; i++) { // Sonuçlar üzerinde döngü
        var emoji = slotResults[i].emoji; // Mevcut sonucun emoji değerini al
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1; // Emoji sayısını arttır
    } // Sonuçlar üzerinde döngü bitti
    return emojiCounts; // Emoji sayılarını döndür
} // Emoji sayılarını say

function sortEmojiCounts(emojiCounts) { // Sıralanmış sonuçları al
    var resultObj = {}; // Sonuçları tek bir obje olarak saklayacak nesne
    for (var emoji in emojiCounts) { // Emoji sayıları üzerinde döngü
        if (emojiCounts.hasOwnProperty(emoji)) { // Emoji sayıları üzerinde döngü
            resultObj[emoji] = emojiCounts[emoji]; // Sonuçları tek bir obje olarak sakla
        } // Emoji sayıları üzerinde döngü bitti
    } // Emoji sayıları üzerinde döngü bitti
    var sortedResult = {}; // Sıralanmış sonuçları saklayacak nesne
    Object.keys(resultObj).sort(function (a, b) { // Sonuçları sırala
        return resultObj[b] - resultObj[a]; // Sonuçları sırala
    }).forEach(function (key) { // Sonuçlar üzerinde döngü
        sortedResult[key] = resultObj[key]; // Sıralanmış sonuçları sakla
    }); // Sonuçlar üzerinde döngü bitti
    return sortedResult; // Sıralanmış sonuçları döndür
} // Sıralanmış sonuçları al

function checkForSixOrMore(sortedEmojiCounts) { // 6 veya daha fazla aynı emoji gelip gelmediğini kontrol et
    var hasSixOrMore = false; // En az 6 aynı emoji gelip gelmediğini kontrol etmek için bir değişken
    var emojiTypesWithSixOrMore = []; // 6 veya daha fazla aynı emoji içeren emoji türlerini saklamak için bir dizi
    for (var emoji in sortedEmojiCounts) { // Sıralanmış sonuçlar üzerinde döngü
        if (sortedEmojiCounts.hasOwnProperty(emoji) && sortedEmojiCounts[emoji] >= 6) { // Sıralanmış sonuçlar üzerinde döngü
            hasSixOrMore = true; // 6 veya daha fazla aynı emoji gelirse
            emojiTypesWithSixOrMore.push({ emoji: emoji, count: sortedEmojiCounts[emoji] }); // 6 veya daha fazla aynı emoji içeren türleri diziye ekleyin
        } // Sıralanmış sonuçlar üzerinde döngü bitti
    } // Sıralanmış sonuçlar üzerinde döngü bitti
    return { hasSixOrMore: hasSixOrMore, emojiTypes: emojiTypesWithSixOrMore.map(emojiObj => ({ emoji: emojiObj.emoji, count: emojiObj.count })) }; // 6 veya daha fazla aynı emoji gelip gelmediğini ve 6 veya daha fazla aynı emoji içeren türleri döndür
} // 6 veya daha fazla aynı emoji gelip gelmediğini kontrol et

function calculateWinAmount(sortedEmojiCounts) { // Kazanç miktarını hesapla 
    var currentBet = parseInt(betInput.value); // Mevcut bahis değerini alıyoruz
    var totalWin = 0; // Toplam kazanç değişkeni
    for (var emoji in sortedEmojiCounts) { // Sıralanmış sonuçlar üzerinde döngü
        if (sortedEmojiCounts.hasOwnProperty(emoji) && sortedEmojiCounts[emoji] >= 6) { // Sıralanmış sonuçlar üzerinde döngü
            var emojiRate = symbols.find(symbol => symbol.emoji === emoji).rate; // Emoji oranını alıyoruz
            var extraEmojis = sortedEmojiCounts[emoji] - 6; // 6'dan fazla aynı emoji sayısını hesaplıyoruz
            var winAmount = (currentBet * emojiRate * (1 + extraEmojis)); // Ödülü hesaplıyoruz
            totalWin += winAmount; // Toplam kazanç değişkenine ödülü ekliyoruz
        } // Sıralanmış sonuçlar üzerinde döngü bitti
    } // Sıralanmış sonuçlar üzerinde döngü bitti
    return totalWin; // Toplam kazanç değişkenini döndür
} // Kazanç miktarını hesapla

function handleWin(totalWin, emojiTypes) { // Kazançları yönet
    kredi += totalWin; // Krediye kazançları ekle
    krediAlani.textContent = kredi; // Kredi miktarını güncelle
    //console.log("Kazanç: " + totalWin + " kredi"); // Konsola kazanç miktarını yaz
    var emojiLocationsArray = getEmojiLocations(); // Emoji konumlarını al
    addToHistory(parseInt(betInput.value), totalWin, emojiTypes); // Sonucu geçmiş sonuçlara ekle
    kazancAlani.textContent = totalWin; // Kazanç miktarını güncelle
    //console.log(emojiLocationsArray); // Konsola emoji konumlarını yaz
} // Kazançları yönet

function collectResults() { // Sonuçları topla
    spinButonu.disabled = false; // Spin düğmesini etkinleştir
    var emojiCounts = countEmojiOccurrences(); // Emoji sayılarını say
    var sortedEmojiCounts = sortEmojiCounts(emojiCounts); // Sıralanmış sonuçları al
    var result = checkForSixOrMore(sortedEmojiCounts); // 6 veya daha fazla aynı emoji gelip gelmediğini kontrol et
    console.log(result); // Konsola sonuçları yaz
    if (result.hasSixOrMore) { // 6 veya daha fazla aynı emoji gelirse
        var totalWin = calculateWinAmount(sortedEmojiCounts); // Kazanç miktarını hesapla
        handleWin(totalWin, result.emojiTypes); // Kazançları yönet
    } // 6 veya daha fazla aynı emoji gelirse
} // Sonuçları topla

function getEmojiLocations() { // Emoji konumlarını al 
    var emojiLocations = []; // Emoji konumlarını saklamak için bir dizi ekliyoruz
    for (var i = 0; i < slotResults.length; i++) { // Sonuçlar üzerinde döngü
        var result = slotResults[i]; // Mevcut sonucu seç
        emojiLocations.push({ emoji: result.emoji, row: result.row, column: result.column }); // Emoji konumlarını diziye ekle
    } // Sonuçlar üzerinde döngü bitti
    return emojiLocations; // Emoji konumlarını döndür
} // Emoji konumlarını al

document.querySelectorAll("button.btn-secondary").forEach(function (button) { // Azaltma butonlarına tıklanıldığında
    button.addEventListener("click", function () {
        var decrementAmount = parseInt(button.getAttribute("data-value")); // Azaltma miktarını al
        var currentBet = parseInt(betInput.value); // Mevcut bahis değerini al
        if (currentBet >= decrementAmount) { // Minimum bahis değerini aşmıyorsak
            betInput.value = (currentBet - decrementAmount).toString(); // Bahis değerini azalt
        }
    });
});

document.querySelectorAll("button.btn-primary").forEach(function (button) { // Artırma butonlarına tıklanıldığında
    button.addEventListener("click", function () {
        var incrementAmount = parseInt(button.getAttribute("data-value")); // Artırma miktarını al
        var currentBet = parseInt(betInput.value); // Mevcut bahis değerini al
        var maxBet = kredi; // Maksimum bahis miktarı krediye eşittir
        if (currentBet < maxBet) { // Maksimum bahis değerini aşmıyorsak
            if (currentBet + incrementAmount <= maxBet) { // Artırma miktarı eklediğimizde maksimum bahis değerini aşmıyorsa
                betInput.value = (currentBet + incrementAmount).toString(); // Bahis değerini artır
            } else { // Artırma miktarı eklediğimizde maksimum bahis değerini aşıyorsa
                betInput.value = maxBet.toString(); // Bahis değerini maksimum bahis değerine eşitle
            }
        }
    });
});

function addToHistory(bet, totalWin, emojiTypes) {
    var historyTable = document.getElementById("history"); // Geçmiş tablosunu seçiyoruz
    var historyBody = historyTable.querySelector("tbody"); // Tablonun tbody bölümünü seçiyoruz
    if (pastResults.length >= maxPastResults) { // Geçmiş sonuçlardan fazlaysa
        pastResults.shift(); // En eski sonucu kaldır
        historyBody.removeChild(historyBody.firstChild); // Tablodaki ilk satırı kaldır
    } // Geçmiş sonuçlardan fazlaysa, en eski sonucu kaldır
    var newRow = document.createElement("tr"); // Yeni bir satır oluştur
    var betCell = document.createElement("td"); // Bet miktarını yaz
    betCell.textContent = bet; // Bet miktarını yaz
    var totalWinCell = document.createElement("td"); // Emoji türlerini ve sayılarını yaz
    totalWinCell.textContent = totalWin; // Emoji türlerini ve sayılarını yaz
    var symbolsCell = document.createElement("td"); // Emoji türlerini ve sayılarını yaz
    symbolsCell.textContent = emojiTypes.map(emojiType => emojiType.emoji + "x" + emojiType.count).join(", "); // Emoji türlerini ve sayılarını yaz
    newRow.appendChild(betCell); // Sütunları satıra ekle
    newRow.appendChild(totalWinCell); // Sütunları satıra ekle
    newRow.appendChild(symbolsCell); // Sütunları satıra ekle
    historyBody.appendChild(newRow); // Tabloya yeni satırı ekle
    pastResults.push({ bet: bet, totalWin: totalWin, emojiTypes: emojiTypes }); // Geçmiş sonuçlara ekle
}