const data = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [],
        hoverOffset: 4
    }],
};

const options = {
    title: {
        display: true,
        fontSize: 24,
        text: ''
    }
}

const config = {
    type: 'pie',
    data: data,
    options: options
};

let graph;

let elDatasetTemplate;
let elDrawButton;
let elAddDatasetButton;

const DEFAULT_TITLE = '無題';
const LABEL_PLACEHOLDER = '項目${numOfDataset}';
const LABEL_FORMAT = '${label} (${percentage}%)';
const FRACTION_DIGITS = 2; //小数点以下桁数

window.onload = function () {
    setElementsToVals();
    setEventListenersToInitialElements();
}

function setElementsToVals() {
    elDatasetTemplate = document.getElementById('dataset-template').content;
    elDrawButton = document.getElementById('draw');
    elAddDatasetButton = document.getElementById('add-dataset');
}

function setEventListenersToInitialElements() {
    elDrawButton.addEventListener('click', function () {
        setDatasetsToGraphConfig();

        if (graph) {
            graph.config = config;
            graph.update();
        } else {
            graph = new Chart(
                document.getElementById('myChart'),
                config
            );
        }

    });

    elAddDatasetButton.addEventListener('click', function () {
        appendDataset();
    });
}

function appendDataset() {
    let elDataset = generateElDatasetFromTemplate();
    document.getElementById('datasets').appendChild(elDataset);
}

function generateElDatasetFromTemplate() {
    let elDataset = document.importNode(elDatasetTemplate, true);
    elDataset.querySelector('input[name="label[]"]').placeholder = replaceTemplate(LABEL_PLACEHOLDER, { numOfDataset: countDatasets() + 1 });
    setEventListenerIn(elDataset);
    return elDataset;
}

function setEventListenerIn(elDataset){
    elDataset.querySelector('input[name="remove-dataset"]').addEventListener('click', function (event) {
        let removedDataset = findParentDatasetBy(event);
        rewriteLabelsPlaceholdersBehind(removedDataset);
        removeDataset(removedDataset);
        if (graph) {
            elDrawButton.click();
        }
    });
}

function removeDataset(elRemovedDataset) {
    elRemovedDataset.parentNode.removeChild(elRemovedDataset);
}

function findParentDatasetBy(event) {
    let i = 0;
    while (!event.path[i].classList.contains('dataset')) {
        i++;
    }
    return event.path[i];

}

//項目数を取得する
function countDatasets() {
    return document.getElementsByClassName('dataset').length;
}

//引数で渡した項目の後ろにある項目'項目3/項目4/項目5/..' を全て -1 する
//例、引数に項目2を渡す・・項目3/項目4/項目5/.. => 項目2/項目3/項目4/..
function rewriteLabelsPlaceholdersBehind(elDataset) {
    let child = elDataset.nextElementSibling;
    while (child) {
        let labelInput = child.querySelector('input[name="label[]"]');
        labelInput.placeholder = replaceTemplate(LABEL_PLACEHOLDER, { numOfDataset: extractNumFromString(labelInput.placeholder) - 1 });
        child = child.nextElementSibling;
    }
}

//文字列から数字のみを抽出する
function extractNumFromString(str) {
    return str.replace(/[^0-9]/g, '');
}

function setDatasetsToGraphConfig() {
    let graph_setting = document.forms['graph-setting'];
    //title未入力時はDEFAULT_TITLEをタイトルにする
    config.options.title.text = graph_setting.elements['title'].value ? graph_setting.elements['title'].value : DEFAULT_TITLE;
    data.labels = getInputVlues('label[]');
    data.datasets[0].data = getInputVlues('data[]').map(function (d) { return Number(d) });
    data.datasets[0].backgroundColor = getInputVlues('color[]');

    setPercentageToLabel();
}

function getInputVlues(name) {
    let array = [];
    document.getElementsByName(name).forEach(function (input) {
        array.push(input.value ? input.value : input.placeholder);
    });
    return array;

}

function setPercentageToLabel() {
    let total = 0;
    data.datasets[0].data.forEach(function (d) {
        total += d;
    });
    if (total > 0) {
        for (let i = 0; i < data.labels.length; i++) {
            data.labels[i] = replaceTemplate(LABEL_FORMAT, { label: data.labels[i], percentage: formatPercent(getPercent(data.datasets[0].data[i], total)) });
        }
    }
}

function formatPercent(percent) {
    return (percent * 100).toFixed(FRACTION_DIGITS);
}

function getPercent(part, whole) {
    return part / whole;
}

/*
    args1: 'My name is ${hoge}. I'm ${age}.' , args2: {hoge: 'Yamazaki', age: 27})
    return 'My name is Yamazaki. I'm 27.'
*/
function replaceTemplate(string, values) {
    return string.replace(/\$\{(.*?)\}/g, function (all, key) {
        return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : '';
    });
}


