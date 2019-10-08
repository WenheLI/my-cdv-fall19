let w = 1200;
let h = 800;

let viz = d3.select('#display')
            .append('svg')
                .attr('width', w)
                .attr('height', h)
                .style('background-color', 'lavender');

const task = async () => {
    let data = await d3.csv('./new-cases-of-hiv-infection.csv');
    data = data.filter((d) => d.Code === 'CHN');
    let tConc = d3.timeParse("%Y");
    let minAndMax = d3.extent(data, (d) => {
        return tConc(d.Year)
    });
    let xScale = d3.scaleTime().domain(minAndMax).range([50, w-50])
    let xAxis = d3.axisBottom(xScale);
    viz.append('g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate(' + 0 + ',' + (h-30) + ')')
        .call(xAxis)
    const theKey = "Incidence - HIV/AIDS - Sex: Both - Age: All Ages (Number) (new cases of HIV)"

    let yScale = d3.scaleLinear().domain( d3.extent(data, (d) => d[theKey]) ).range([0, h])
    let yAxis = d3.axisLeft(yScale);
    viz.append('g')
        .attr('class', 'yaxis')
        .attr('transform', 'translate(' + 30 + ',' + 0 + ')')
        .call(yAxis)
}

task();