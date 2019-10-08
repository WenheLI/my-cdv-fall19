const viz = d3.select('#container')
                    .append('svg')
                        .attr('width', 2360)
                        .attr('height', 780)
                        .attr("transform", "translate(" + 10 + ", " + 10 + ")");

const taskSecond = async () => {
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
    const newTags = {'other': 0};
    const colorMap = ['#c4302b', '#73c9e5', '#86BA00']

    data.forEach((it) => {
        if (it.tag && !tags[it.tag]) tags[it.tag] = 1;
        else if (it.tag) tags[it.tag] += 1;
    });

    for (const tag in tags) {
        if (tags[tag] > 20) newTags[tag] = tags[tag];
    }

    let xScale = d3.scaleTime().domain([0, 24]).range([80, 2320])
    let xAxis = d3.axisBottom(xScale);
    xAxis.ticks(24).tickFormat((d, i) => {
        return (i > 12) ? `${i % 12} p.m.` : `${i} a.m.`
    });
    let yScale = d3.scaleBand()
                    .range([760, 20])
                    .domain(Object.keys(newTags));
    let yAxis = d3.axisLeft(yScale);
    
    data = data.map((it) => {
        let newIt = {};
        newIt.time = it.hour;
        newIt.tag = newTags[it.tag] ? it.tag : 'other';
        newIt.platform = it.platform;
        return newIt
    });

    const youtubeData = data.filter((it) => it.platform === 'Youtube')
    const biliData = data.filter((it) => it.platform === 'Bilibili')
    const tencentData = data.filter((it) => it.platform === 'Tencent')


    viz.append('g')
        .attr('transform', 'translate(' + 80 + ',' + 0 + ')')
        .call(yAxis);
    viz.append('g')
        .attr('transform', 'translate(' + 0 + ',' + 760 + ')')
        .call(xAxis);

    viz.selectAll('.bilibili')
    .data(biliData)
    .enter()
    .append('rect')
    .attr('class', 'bilibili')
    .attr('x', (d) => xScale(d.time))
    .attr('y', (d) => yScale(d.tag))
    .attr('width', (2320-80)/24)
    .attr('height', yScale.bandwidth())
    .attr('opacity', .3)
    .style('fill', colorMap[1])

    viz.selectAll('.youtube')
        .data(youtubeData)
        .enter()
        .append('rect')
        .attr('class', 'youtube')
        .attr('x', (d) => xScale(d.time))
        .attr('y', (d) => yScale(d.tag))
        .attr('width', (2320-80)/24)
        .attr('height', yScale.bandwidth())
        .attr('opacity', .3)
        .style('fill', colorMap[0])

    

        viz.selectAll('.tencent')
        .data(tencentData)
        .enter()
        .append('rect')
        .attr('class', 'tencent')
        .attr('x', (d) => xScale(d.time))
        .attr('y', (d) => yScale(d.tag))
        .attr('width', (2320-80)/24)
        .attr('height', yScale.bandwidth())
        .attr('opacity', .3)
        .style('fill', colorMap[2])

}

taskSecond()
//     const radius = 250;
//     const colorSet = d3.scaleSequential()
//                         .domain([0, Object.keys(tags).length])
//                         .interpolator(d3.interpolateRainbow);
//     const pieFunc = d3.pie()
//                       .value((d) => d.value);
//     const pieData = pieFunc(d3.entries(tags));

//     const arc = d3.arc().innerRadius(0).outerRadius(radius);

//     const pieChart = svg.append('g').attr('class', 'pie');
//     pieChart.attr('transform', 'translate(' + 1800 + ',' + 400 + ')')

//     pieChart.selectAll('path')
//             .data(pieData)
//             .enter()
//             .append('path')
//                 .attr('d', arc)
//                 .attr('fill', (d, i) => colorSet(i))
//                 .attr('stroke', 'black')
//                 .style('stroke-width', '2px')
//                 .style('opacity', .6);

//     pieChart.selectAll('mySlices')
//             .data(pieData)
//             .enter()
//             .append('text')
//             .text((d) => {
//                 if (d.data.value > 18) return d.data.key
//                 else if (d.data.value === 18) return 'Other'
//             })
//             .attr("transform", (d) => {
//                 if (d.data.value > 18) return `translate(${ arc.centroid(d) } )`;
//                 else if (d.data.value === 18) {
//                     console.log(arc.centroid(d))
//                     return `translate(${ arc.centroid(d)[0]+10}, ${arc.centroid(d)[1]  - 50} )`;
//                 }
//             })
//             .style("text-anchor", "middle")
//             .style("font-size", (d) => {
//                 if (d.data.value > 18) return 17;
//                 else if (d.data.value === 18) return 24;
//             });
// }

