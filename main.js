const labels = [
    'Red',
    'Blue',
    'Yellow'
];

const data = {
    labels: labels,
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};

const config = {
    type: 'pie',
    data: data,
};

window.onload = function () {
    document.getElementById('draw').addEventListener('click',function(){
        new Chart(
            document.getElementById('myChart'),
            config
        );  
    })
}

