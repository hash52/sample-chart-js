
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
        text: ''
    }
}

const config = {
    type: 'pie',
    data: data,
    options: options
};

let graph;

window.onload = function () {
    const dataset_template = document.getElementById("dataset-template").content;
    const fragment = document.createDocumentFragment();

    fragment.appendChild(document.importNode(dataset_template, true));
    document.getElementById('datasets').appendChild(fragment);

    document.getElementById('draw').addEventListener('click', function () {
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

    document.getElementById('add-dataset').addEventListener('click', function () {
        fragment.appendChild(document.importNode(dataset_template, true));
        document.getElementById('datasets').appendChild(fragment);
    })
}

