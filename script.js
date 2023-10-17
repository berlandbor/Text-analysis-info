function analyzeText() {
    let text = document.getElementById("textArea").value.toLowerCase();
    // Удаление знаков препинания и разделение на слова
    let words = text.replace(/[.,!?"':;]/g, '').split(/\s+/).filter(Boolean); // filter(Boolean) уберет пустые строки, которые могут образоваться при разделении

    let wordCount = {};

    // Подсчет слов
    words.forEach(word => {
        if (word in wordCount) {
            wordCount[word]++;
        } else {
            wordCount[word] = 1;
        }
    });


// Сортировка слов по частоте
    let sortedWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);

    // Создание массивов данных для Chart.js
    let labels = [];
    let data = [];
    let totalWordsCount = words.length;

    for (let word of sortedWords) {
        let percentage = ((wordCount[word] / totalWordsCount) * 100).toFixed(2);
        labels.push(`${word} (${percentage}%)`);
        data.push(wordCount[word]);
    }



    // Отображение круговой диаграммы
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: generateColors(labels.length)
            }]
        },
        options: {
            responsive: true
        }
    });

displayTextInfo(wordCount, words.length);
    // Отображение рейтинга слов и процентного соотношения
    displayWordStats(labels, data);
      // Отображение общего количества слов
    document.getElementById("totalWords").textContent = "Общее количество слов: " + words.length + " (100%);";
    
    displayFrequencyStatsWithChart(wordCount);
    
}

function displayFrequencyStatsWithChart(wordCount) {
    let frequencyStats = {};
    let totalWords = Object.keys(wordCount).length;

    for (let word in wordCount) {
        let count = wordCount[word];
        if (frequencyStats[count]) {
            frequencyStats[count]++;
        } else {
            frequencyStats[count] = 2;
        }
    }

    let freqStatsDiv = document.getElementById("frequencyStats");
    freqStatsDiv.innerHTML = "";  // Очистить предыдущие данные
    let list = document.createElement("ul");

    let freqLabels = [];
    let freqData = [];
    for (let freq in frequencyStats) {
        let percentage = ((frequencyStats[freq] / totalWords) * 100).toFixed(2);
        let listItem = document.createElement("li");
        listItem.textContent = `По ${freq} раз(а) повторяется: ${frequencyStats[freq]} (${percentage}%) слов;`;
        list.appendChild(listItem);

        freqLabels.push(`по ${freq} раз(а) (${percentage}%)`);
        freqData.push(frequencyStats[freq]);
    }

    freqStatsDiv.appendChild(list);

    // Круговая диаграмма для рейтинга частоты
    let ctx = document.getElementById('frequencyChart').getContext('2d');
    let frequencyPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: freqLabels,
            datasets: [{
                data: freqData,
                backgroundColor: generateColors(freqLabels.length)
            }]
        },
        options: {
            responsive: true
        }
    });
}

function displayWordStats(labels, data) {
    const totalWords = data.reduce((acc, count) => acc + count, 0);
    let wordStatsDiv = document.getElementById("wordStats");
    wordStatsDiv.innerHTML = "";  // Очистить предыдущие данные

    // Сортируем слова по частоте
    let sortedIndexes = data.map((item, index) => index).sort((a, b) => data[b] - data[a]);

    let list = document.createElement("ul");

    for(let i = 0; i < sortedIndexes.length; i++) {
        let listItem = document.createElement("li");
        let percentage = ((data[sortedIndexes[i]] / totalWords) * 100).toFixed(2);
        listItem.textContent = `${i + 1}. ${labels[sortedIndexes[i]]}: ${data[sortedIndexes[i]]} (${percentage}%)`;
        list.appendChild(listItem);
    }

    wordStatsDiv.appendChild(list);
}

function generateColors(count) {
    let colors = [];
    for(let i = 0; i < count; i++) {
        colors.push(`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`);
    }
    return colors;
}

function displayTextInfo(wordCount, totalWords) {
    let uniqueWords = Object.keys(wordCount).length;
    let diversityRatio = (uniqueWords / totalWords * 100).toFixed(2);
    
    let frequentWordsCount = 0;
    for (let word in wordCount) {
        if (wordCount[word] > 1) {  // слова, которые повторяются более 1 раза
            frequentWordsCount += wordCount[word];
        }
    }
    let frequentWordsPercentage = (frequentWordsCount / totalWords * 100).toFixed(2);

    let textInfoDiv1 = document.getElementById("textInfo");
    textInfoDiv1.innerHTML = `
   <hr> <strong>Информация о тексте:</strong>
       <br>
       <hr>
        Коэффициент разнообразия слов: ${diversityRatio}%
        <br>
        <hr>
        Процент наиболее часто встречающихся слов: ${frequentWordsPercentage}% 
        <hr>
    `;
    let informativeLevel = '';
    if (diversityRatio > 60 && frequentWordsPercentage < 40) {
        informativeLevel = "<h3>Текст высоко информативен</h3>";
    } else if (diversityRatio < 40 && frequentWordsPercentage > 60) {
        informativeLevel = "<h3>Текст малоинформативен</h3>";
    } else {
        informativeLevel = "<h3>Текст средне информативен</h3>";
    }

    let textInfoDiv = document.getElementById("textInfo1");
    textInfoDiv.innerHTML += `<br>${informativeLevel}`;
}


