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

const createBar = (width, name) => {
    const bar = document.createElement('div');
    bar.setAttribute('class', 'bar');
    bar.setAttribute('style', `width: ${width*100}`);
    bar.innerText = name;
    return bar;
}

const transformedData = averageData(data);
const display = document.getElementById('display');
transformedData.forEach((data) => {
    const bar = createBar(data.average, data.name);
    display.appendChild(bar);
})

