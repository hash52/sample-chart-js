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

window.onload = function () {
    setElement();
    appendDataset();

    elDrawButton.addEventListener('click', function () {
        setGraphData();

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

    elAddDatasetButton.addEventListener('click', function(){
        appendDataset()
    });
}


function setElement(){
    elDatasetTemplate = document.getElementById("dataset-template").content;
    elAddDatasetButton = document.getElementById('add-dataset');
    elDrawButton = document.getElementById('draw');
}

function appendDataset(){
    let fragment = document.createDocumentFragment();
    let clone = document.importNode(elDatasetTemplate, true);
    clone.querySelector("input[name='label[]']").placeholder = replaceTemplate(clone.querySelector("input[name='label[]']").placeholder, {numOfDataset: 1})
    fragment.appendChild(clone);
    document.getElementById('datasets').appendChild(fragment);
}

function setGraphData(){
    let graph_setting = document.forms['graph-setting'];
    config.options.title.text = graph_setting.elements['title'].value;
    data.labels = [];
    data.datasets[0].data = [];
    data.datasets[0].backgroundColor = [];

    //FIXME
    //data.labels = graph_setting.elements['label[]'].values みたいな感じでループを回さずに取りたい
    for (let i = 0; i < graph_setting.getElementsByClassName('dataset').length; i++) {
        data.labels.push(graph_setting.elements['label[]'][i].value)
        data.datasets[0].backgroundColor.push(graph_setting.elements['color[]'][i].value)
        data.datasets[0].data.push(graph_setting.elements['data[]'][i].value)
    }
}

/*
    args1: "My name is ${hoge}. I'm ${age}." , args2: {hoge: "Yamazaki", age: 27})
    return "My name is Yamazaki. I'm 27."
*/
function replaceTemplate(string, values){
    return string.replace(/\$\{(.*?)\}/g, function(all, key){
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : "";
    });
  }


