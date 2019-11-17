let w = 1200;
let h = 800;
let padding = 90

const sum = (arr) => {
    return arr.reduce((prev, curr) => {
        return prev + curr
    }, 0);
}

const main = async () => {
    let viz = d3.select("#container").append("svg")
        .style("width", w)
        .style("height", h);
    let data = await d3.csv('./videogames.csv');
    data = data.filter((it) => it['Year_of_Release'] !== 'N/A')
        .filter((it) => it['Year_of_Release'] !== '2017')
        .filter((it) => it['Year_of_Release'] !== '2020')

    let salesData;
    const years = Array.from(new Set(data.map((it) => it['Year_of_Release'])));
    salesData = years.map((year) => {
        return {
            year: d3.timeParse('%Y')(year),
            sales: sum(
                data.filter(d => d['Year_of_Release'] === year)
                .map((it) => parseFloat(it['Global_Sales']))
            )
        }
    }).sort((a, b) => {
        if (a.year < b.year) return 1
        else return -1;
    });
    let xDomain = d3.extent(salesData, function (d) {
        return d.year
    });
    let xScale = d3.scaleTime().domain(xDomain).range([padding, w - padding]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g")
        .attr("class", "xaxisgroup")
        .attr("transform", "translate(0," + (h - padding) + ")");
    xAxisGroup.call(xAxis);

    let yMax = d3.max(salesData, function (d) {
        return d.sales;
    })
    let yDomain = [0, yMax];
    let yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.append("g")
        .attr("class", "yaxisgroup")
        .attr("transform", "translate(" + (padding / 2) + ",0)");
    yAxisGroup.call(yAxis);

    const lineMaker = d3.line()
        .x((d) => {
            return xScale(d.year)
        })
        .y((d) => yScale(d.sales));

    viz.selectAll(".global").data([salesData])
        .enter()
        .append("path")
        .attr('class', 'line global')
        .attr("d", lineMaker)
        .attr('stroke', 'aqua')
        .attr('stroke-width', '5px')
        .style('fill', 'none');

    viz.selectAll('.point').data(salesData)
        .enter()
        .append('circle')
        .attr('class','point')
        .attr('cx', (d) => xScale(d.year))
        .attr('cy', (d) => yScale(d.sales))
        .attr('r', (d) => 5)
        .style('fill', 'black')
        .on('mouseenter', function (d) {
            d3.select(this)
             .transition()
             .style('fill', 'orange')
             .attr('r', 10);
        })
        .on('mouseleave', function (d) {
            d3.select(this)
             .transition()
             .style('fill', 'black')
             .attr('r', 5);
        })

}

main();