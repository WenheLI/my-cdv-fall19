const viz = d3.select('#viz-container')
                        .append('svg')
                                .attr("height", 500)
                                .attr("width", 500)
                                .attr("id", "viz");
// const circle = viz.append('circle')
//         .attr('cx', '100')
//         .attr('cy', '100')
//         .attr('r', '50');

// circle.attr('fill', 'white');


// const rect = viz.append('rect')
//         .attr('x', '200')
//         .attr('y', '200')
//         .attr('width', '200')
//         .attr('height', '200')
//         .attr('fill', 'pink');

// const text = document.getElementById('code-area');
// text.addEventListener('keyup', (e) => {
//     console.log(`alert('${e.target.value}')`)
//    eval(`alert('${e.target.value}')`)
// })

const averageData = (data) => {
    const newData = [];
    const keys = Object.keys(data[0]);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let sum = 0;
        let num = 0;

        for (let j = 0; j < data.length; j++) {
            let datum = data[j];
            if (key in datum) {
                sum += datum[key];
                num ++;
            }
        }

        let avg = sum / num;
        if(!isNaN(avg)) {
            const newDataPoint = {"name": key, "average": avg, "numMeasurements": num};
            newData.push(newDataPoint);
        }
    }
    return newData;
}

const task = async () => {
    let data = await d3.json('./data.json');
    data = averageData(data);
    console.log(data)
    viz.selectAll('circle').data(data).enter()
                    .append('circle')
                        .attr('fill', 'purple')
                        .attr('cx', () => Math.random() * 450)
                        .attr('cy', () => Math.random() * 450)
                        .attr('r', (d) => d.average*5);

}

task();