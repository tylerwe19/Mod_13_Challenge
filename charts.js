function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result)
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    samplesArray = data.samples
    console.log(samplesArray)
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesresultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metaDataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metaDataResults = metaDataArray[0];
    
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var samplesresult = samplesresultArray[0];
    console.log(samplesresult)

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuIDS = (samplesresult.otu_ids)
    console.log(otuIDS)
    otuLabels = samplesresult.otu_labels
    console.log(otuLabels)
    otuSampleValues = samplesresult.sample_values
    console.log(otuSampleValues)
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    console.log(metaDataResults)
    var wfreqVariable = metaDataResults.wfreq
    var floatwfreqVar = parseFloat(wfreqVariable)
    console.log(floatwfreqVar)

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    console.log(otuIDS.slice(0,10))
    var top10otuIDS = otuIDS.slice(0,10)
    var yticks = top10otuIDS.map(String)
    console.log(yticks)
    var OTUyticks = yticks.map(i => "OTU " + i);
    console.log(OTUyticks)
    var xticks = otuSampleValues.slice(0,10)
    console.log(xticks)

    // Deliverable 1: 8. Create the trace for the bar chart. 
      var trace1 = {
        x: xticks.reverse(),
        y: OTUyticks.reverse(),
        type:"bar",
        orientation: 'h'
      }
    var barData = [trace1];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {title: `Top 10 Bacterial Species for: ${sample}`,
    xaxis: {title: "Amount Found"},
    yaxis: {title: "Bacterial Species (OTU)"}
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace2 = {
      x: otuIDS,
      y: otuSampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDS,
        size: otuSampleValues
      }
    }
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleData = [trace2];
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1200,
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData,bubbleLayout)
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: floatwfreqVar,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "Scrubs per Week", font: {size:24}},
        gauge: {
          axis: {range: [0,10], tickwidth: 2, tickcolor: "black"},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "lightgreen"},
            {range: [8,10], color: "green"}
          ]
        }

      }
    ];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400, height: 400, margin: {t:0,b:0}};
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
