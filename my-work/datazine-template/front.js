const task = async () => {
    let data = await d3.json('data.json');
    data = data.filter((d) => {
        if (d.platform !== 'Bilibili') return true;
        else if ( d.progress != 0) return true;
        return false;
    });
    const timeDevotedMap = {
        'Youtube': 0,
        'Bilibili': 1,
        'Tencent': 2
    }
    const timeDevoted = [0, 0, 0];
    data.forEach((it) => {
        timeDevoted[timeDevotedMap[it.platform]] += it.duration;
    });

    const viz = d3.select('#container')
                    .append('svg')
                        .attr("height", 700)
                        .attr("width", 1200)
                        .attr("id", "viz");
    const scaler = d3.scaleLinear()
                        .range([100, 600])
                        .domain([Math.min(...timeDevoted), Math.max(...timeDevoted)]);
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']
    const lineChart = viz.append('g')
        .attr('class', 'lineChart');
    lineChart.selectAll('rect')
        .data(timeDevoted)
        .enter()
        .append('rect')
            .attr('x', (d, i) => {
                if (i === 0) return 100;
                else if (i === 1) return 250;
                else return 400;
            })
            .attr('fill', (d, i) => colorMap[i])
            .attr('y', (d) => 650 - scaler(d))
            .attr('width', 50)
            .attr('height', (d) => scaler(d));
    const bottomScale = d3.scaleLinear().range([0, 300]).domain([0, 2]);
    const bottomAxis = d3.axisBottom(bottomScale);
    bottomAxis.ticks(2).tickFormat((d, i) => {
        if (i === 0) return 'Youtube';
        else if (i === 1) return 'Bilibili';
        else if (i === 2) return 'Tencent';
    });
    const leftScale = d3.scaleLinear()
                        .range([600, 0])
                        .domain([Math.min(...timeDevoted), Math.max(...timeDevoted)]);
    const leftAxis = d3.axisLeft(leftScale);
    leftAxis.tickFormat((d) => `${Math.ceil(d/3600)} hours`)

    lineChart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(125, 650)')
        .call(bottomAxis);

    lineChart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(90, 50)')
        .call(leftAxis);
    lineChart.append('text')
        .attr('transform', 'translate(150, 680)')
        .attr("font-size", "12px")
        .text("Hours spent on different video platforms");

    const pieChart = viz.append('g')
                        .attr('transform', 'translate(900, 350)')
                        .attr('class', 'pieChart');
    
    const radius =  250;

    const pieFunc = d3.pie()
                        .value((d) => d.value);

    const pieData = pieFunc(d3.entries([...timeDevoted, 60*60*24*30 - timeDevoted.reduce((a, b) => a + b, 0)]));
    pieArcs = d3.arc().innerRadius(radius*.5).outerRadius(radius*.8);
    labelArcs = d3.arc().innerRadius(radius*.9).outerRadius(radius*.9);
    pieChart.selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('d', pieArcs)
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .attr('fill', (d, i) => {
                if (i === 3) return '#223344'
                return colorMap[i]
            });
    pieChart.selectAll('polyline')
            .data(pieData)
            .enter()
            .append('polyline')
                .style('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1)
                .attr('points', (d, i) => {
                    let posA = pieArcs.centroid(d);
                    let posB = labelArcs.centroid(d);
                    let posC = labelArcs.centroid(d);

                    let midAngle = (d.startAngle + d.endAngle) / 2;
                    if (i === 2) posC[0] = radius * .5;
                    else posC[0] = radius * .95 * (midAngle <= Math.PI ? 1 : -1);
                    return [posA, posB, posC];
                });
    pieChart.selectAll('.label')
            .data(pieData)
            .enter()
            .append('text')
                .text((d, i) => {
                    if (i === 3) return 'Other'
                    if (i === 0) return 'Youtube';
                    else if (i === 1) return 'Bilibili';
                    else if (i === 2) return 'Tencent';
                })
                .attr('transform', (d, i) => {
                    const pos = labelArcs.centroid(d);
                    let midAngle = (d.startAngle + d.endAngle) / 2;
                    if (i === 2) pos[0] = radius * .5;
                    else pos[0] = radius * .95 * (midAngle <= Math.PI ? 1 : -1);
                    return `translate(${pos})`
                })
                .attr('class', 'label');
}

task();