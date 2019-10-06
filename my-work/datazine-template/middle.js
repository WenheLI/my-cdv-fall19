const task = async () => {
    let data = await d3.json('data.json');
    data = data.filter((d) => {
        if (d.platform !== 'Bilibili') return true;
        else if (d.progress === -1 || d.progress ) return true;
        return false;
    });
    data = data.map((d) => {
        let date = new Date(d.time);
        let time = date.getMinutes() + date.getHours() * 60;        
        d.time = time;
        d.day = date.getDay();
        d.hour = date.getHours();
        d.printedTime = `${date.getHours()} : ${date.getMinutes()}`;
        return d;
    });

    const tags = {};

    data.forEach((it) => {
        if (it.tag && !tags[it.tag]) tags[it.tag] = 1;
        else if (it.tag) tags[it.tag] += 1;
    });

    const svg = d3.select('#container')
                    .append('svg')
                        .attr('width', 2360)
                        .attr('height', 780)
                        .attr("transform", "translate(" + 10 + ", " + 10 + ")");
    
    const scatterChart = svg.append('g')
                                .attr('class', 'scatter');

    const xScale = d3.scaleLinear().domain([0, 23]).range([30, 1100]);
    const yScale = d3.scaleLinear().domain([0, 6]).range([10, 720]);

    const xAxis = d3.axisBottom(xScale)
                    .ticks(24)
                    .tickFormat((d, i) => {
                        return (d > 12) ? `${d % 12} p.m.` : `${d} a.m.`
                    });
    const yAxis = d3.axisLeft(yScale)
                    .ticks(7)
                    .tickFormat((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d] );

    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 740 + ')')
                .call(xAxis);
    
    scatterChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + 50 + ',' + 0 + ')')
                .call(yAxis);
    
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']

    const videoDuration = data.map((it) => it.duration);
    const minDuration = Math.min(...videoDuration);
    const maxDuration = Math.max(...videoDuration);

    const rScale = d3.scaleLinear().range([3, 25]).domain([minDuration, maxDuration]);
    scatterChart.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                    .style('fill', (d, i) => {
                        if (d.platform === 'Bilibili') return colorMap[1];
                        else if (d.platform === 'Youtube') return colorMap[0];
                        else if (d.platform === 'Tencent') return colorMap[2];
                    })
                    .attr('cx', (d) => xScale(d.hour) + 50)
                    .attr('cy', (d) => yScale(d.day))
                    .attr('r', (d) => rScale(d.duration));

    const radius = 250;
    const colorSet = d3.scaleSequential()
                        .domain([0, Object.keys(tags).length])
                        .interpolator(d3.interpolateRainbow);
    const pieFunc = d3.pie()
                      .value((d) => d.value);
    const pieData = pieFunc(d3.entries(tags));

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pieChart = svg.append('g').attr('class', 'pie');
    pieChart.attr('transform', 'translate(' + 1800 + ',' + 400 + ')')

    pieChart.selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => colorSet(i))
                .attr('stroke', 'black')
                .style('stroke-width', '2px')
                .style('opacity', .6);

    pieChart.selectAll('mySlices')
            .data(pieData)
            .enter()
            .append('text')
            .text((d) => {
                if (d.data.value > 18) return d.data.key
                else if (d.data.value === 18) return 'Other'
            })
            .attr("transform", (d) => {
                if (d.data.value > 18) return `translate(${ arc.centroid(d) } )`;
                else if (d.data.value === 18) {
                    console.log(arc.centroid(d))
                    return `translate(${ arc.centroid(d)[0]+10}, ${arc.centroid(d)[1]  - 50} )`;
                }
            })
            .style("text-anchor", "middle")
            .style("font-size", (d) => {
                if (d.data.value > 18) return 17;
                else if (d.data.value === 18) return 24;
            });
}

task();