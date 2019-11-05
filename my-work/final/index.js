const main = async () => {
    let stop = false;

    const data = await d3.csv("./videogames.csv");
    const svg = d3.select("#container")
        .append('svg')
        .attr('width', 600)
        .attr('height', 600);

    let dateData = {};
    // const jp = it['"JP_Sales"'];
    // const eu = it['"EU_Sales"'];
    data.forEach((it) => {
        const year = it['Year_of_Release'];
        const global = it['Global_Sales'];
        if (year !== 'N/A' && year !== '2020' && year !== '2017' && year !== '2016') {
            if (!dateData[year]) dateData[year] = parseFloat(global);
            else dateData[year] += parseFloat(global);
        }
    });

    dateData = Object.keys(dateData).map((it) => {
        return {
            year: d3.timeParse('%Y')(it),
            sales: dateData[it]
        }
    });


    let dateDataNA = {};
    // const jp = it['"JP_Sales"'];
    // const eu = it['"EU_Sales"'];
    data.forEach((it) => {
        const year = it['Year_of_Release'];
        const global = it['NA_Sales'];
        if (year !== 'N/A' && year !== '2020' && year !== '2017' && year !== '2016') {
            if (!dateDataNA[year]) dateDataNA[year] = parseFloat(global);
            else dateDataNA[year] += parseFloat(global);
        }
    });

    dateDataNA = Object.keys(dateDataNA).map((it) => {
        return {
            year: d3.timeParse('%Y')(it),
            sales: dateDataNA[it]
        }
    });

    let dateDataJP = {};

    // const eu = it['"EU_Sales"'];
    data.forEach((it) => {
        const year = it['Year_of_Release'];
        const global = it['JP_Sales'];
        if (year !== 'N/A' && year !== '2020' && year !== '2017' && year !== '2016') {
            if (!dateDataJP[year]) dateDataJP[year] = parseFloat(global);
            else dateDataJP[year] += parseFloat(global);
        }
    });

    dateDataJP = Object.keys(dateDataJP).map((it) => {
        return {
            year: d3.timeParse('%Y')(it),
            sales: dateDataJP[it]
        }
    });

    let dateDataEU = {};

    data.forEach((it) => {
        const year = it['Year_of_Release'];
        const global = it['EU_Sales'];
        if (year !== 'N/A' && year !== '2020' && year !== '2017' && year !== '2016') {
            if (!dateDataEU[year]) dateDataEU[year] = parseFloat(global);
            else dateDataEU[year] += parseFloat(global);
        }
    });

    dateDataEU = Object.keys(dateDataEU).map((it) => {
        return {
            year: d3.timeParse('%Y')(it),
            sales: dateDataEU[it]
        }
    });


    let xDomain = d3.extent(dateData, function (d) {
        return d.year
    });
    let xScale = d3.scaleTime().domain(xDomain).range([50, 550]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = svg.append("g")
        .attr("class", "xaxisgroup")
        .attr("transform", "translate(0," + (550) + ")");
    xAxisGroup.call(xAxis);

    let yMax = d3.max(dateData, function (d) {
        return d.sales;
    })
    let yDomain = [0, yMax];
    let yScale = d3.scaleLinear().domain(yDomain).range([550, 50]);
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = svg.append("g")
        .attr("class", "yaxisgroup")
        .attr("transform", "translate(" + (50 / 2) + ",0)");
    yAxisGroup.call(yAxis);

    const lineMaker = d3.line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.sales));


    console.log(dateData)
    svg.selectAll(".global").data([dateData])
        .enter()
        .append("path")
        .attr('class', 'line global')
        .attr("d", lineMaker)
        .attr('stroke', 'aqua')
        .attr('stroke-width', '5px')
        .style('fill', 'none')



    svg.selectAll(".na").data([dateDataNA])
        .enter()
        .append("path")
        .attr('class', 'line na')
        .attr("d", lineMaker)
        .attr('stroke', 'blue')
        .attr('stroke-width', '5px')
        .style('fill', 'none');


    svg.selectAll(".jp").data([dateDataJP])
        .enter()
        .append("path")
        .attr('class', 'line jp')
        .attr("d", lineMaker)
        .attr('stroke', 'red')
        .attr('stroke-width', '5px')
        .style('fill', 'none')

    svg.selectAll(".eu").data([dateDataEU])
        .enter()
        .append("path")
        .attr('class', 'line eu')
        .attr("d", lineMaker)
        .attr('stroke', 'green')
        .attr('stroke-width', '5px')
        .style('fill', 'none');


    document.getElementById("anime").addEventListener("click", () => {
        if (!stop) {
            Array.from(document.getElementsByClassName('line')).forEach((it) => {
                it.setAttribute('class', it.className.baseVal.split(" ").filter((it) => it !== 'line')[0] + ' noline') 
            });
            document.getElementById("anime").innerText = 'Start Anime';
        } else {
            Array.from(document.getElementsByClassName('noline')).forEach((it) => {
                it.setAttribute('class', it.className.baseVal.split(" ").filter((it) => it !== 'noline')[0] + ' line') 
            });
            document.getElementById("anime").innerText = 'Stop Anime';
        }

        stop = !stop;
    });



}

main();