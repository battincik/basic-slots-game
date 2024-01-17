const symbols = [
    { emoji: "🍒", oran: 0.5 },
    { emoji: "🍇", oran: 0.75 },
    { emoji: "🍊", oran: 1.0 },
    { emoji: "🍋", oran: 1.5 },
    { emoji: "🍉", oran: 2.0 },
    { emoji: "🍎", oran: 3.0 },
    { emoji: "🍓", oran: 4.0 },
    { emoji: "🍌", oran: 5.0 },
    { emoji: "🍏", oran: 10.0 },
    { emoji: "🥭", oran: 15.0 },
    { emoji: "🍍", oran: 20.0 },
    { emoji: "🥝", oran: 25.0 },
];

var kredi = 500;
var sonKazanc = 0;
var slotResults = [];
var pastResults = [];


// Kredi ve kazanç alanlarını HTML'de seçiyoruz
var krediAlani = document.querySelector("h3.text-center span");
var kazancAlani = document.querySelectorAll("h3.text-center span")[1];

// Başlangıçta kredi ve kazanç alanlarını güncelliyoruz
krediAlani.textContent = kredi;
kazancAlani.textContent = sonKazanc;


var spinButonu = document.querySelector("button.btn-success");
var spinning = false; // Dönme işlemi devam ediyor mu kontrol etmek için bir değişken ekliyoruz
var slotRows = document.querySelectorAll(".slots .row");
var slotAnimationsComplete = 0; // Tamamlanan animasyonları saymak için bir değişken ekliyoruz

spinButonu.addEventListener("click", function () {
    if (spinning) return alert("Dönme işlemi devam ediyor, lütfen bekleyin!"); // Dönme işlemi devam ediyorsa, kullanıcıya uyarı ver

    // Bütün slotları temizle
    clearSlots();

    spinning = true; // Dönme işlemi başladı
    slotAnimationsComplete = 0; // Tamamlanan animasyonları sıfırla

    // Spin işlemini burada gerçekleştirin
    animateRows();
});

function clearSlots() {
    for (var i = 0; i < slotRows.length; i++) {
        var row = slotRows[i];
        var slots = row.querySelectorAll(".slot");
        for (var j = 0; j < slots.length; j++) {
            var slot = slots[j];
            slot.textContent = "";
        }
    }
    slotResults = []; // Sonuçları temizle
}

function animateRows() {
    var animationDuration = 1000; // Düşme hızını ayarla (1 saniye)

    for (var j = 0; j < slotRows[0].children.length; j++) {
        for (var i = 0; i < slotRows.length; i++) {
            var row = slotRows[i];
            var slots = row.querySelectorAll(".slot");
            var slot = slots[j];

            setTimeout(function (slot, rowId, columnId) {
                return function () {
                    slot.style.animationDuration = animationDuration + "ms"; // Düşme hızını ayarla
                    var randomSymbol = symbols[Math.floor(Math.random() * symbols.length)].emoji;
                    slot.textContent = randomSymbol;

                    // Tüm animasyonlar tamamlandığında spinning'i sıfırla
                    slotAnimationsComplete++;
                    if (slotAnimationsComplete === slotRows.length * slotRows[0].children.length) {
                        spinning = false;
                        collectResults();
                    }

                    // Sonuçları kaydet
                    slotResults.push({ row: rowId, column: columnId, emoji: randomSymbol });
                };
            }(slot, i + 1, j + 1), i * 150); // Sıradaki slot için gecikme ekleyin, bu sefer yukarıdan aşağıya doğru düşmesini sağlamak için i'yi ekledik
        }
    }
}
function collectResults() {
    var emojiCounts = {}; // Emoji sayılarını saklayacak bir nesne oluşturuyoruz

    // Slot sonuçları üzerinde döngü
    for (var i = 0; i < slotResults.length; i++) {
        var emoji = slotResults[i].emoji;

        // Emoji sayısını arttır veya yeni eklenen bir emoji ise 1 olarak ayarla
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    }

    var resultObj = {}; // Sonuçları tek bir obje olarak saklayacak nesne

    // Emoji sayılarını tek bir objeye ekle
    for (var emoji in emojiCounts) {
        if (emojiCounts.hasOwnProperty(emoji)) {
            resultObj[emoji] = emojiCounts[emoji];
        }
    }

    // Emoji sayılarını büyükten küçüğe sırala
    var sortedResult = {};
    Object.keys(resultObj).sort(function (a, b) {
        return resultObj[b] - resultObj[a];
    }).forEach(function (key) {
        sortedResult[key] = resultObj[key];
    });

    pastResults.push(sortedResult); // Sonuçları geçmiş sonuçlar listesine ekle
    console.log(sortedResult);
}
