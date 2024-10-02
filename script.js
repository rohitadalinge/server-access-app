document.getElementById('fileUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('filePath').value = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            window.serverData = e.target.result.split('\n').map(line => line.trim().toLowerCase());
        };
        reader.readAsText(file);
    }
});

document.getElementById('generateOutput').addEventListener('click', function() {
    const serverNamesInput = document.getElementById('serverNames').value;
    const accessedServersInput = document.getElementById('accessedServers').value;

    const serverNames = serverNamesInput.split('\n').map(name => name.trim().toLowerCase()).filter(name => name !== '');
    const accessedServers = accessedServersInput.split('\n').map(name => name.trim().toLowerCase()).filter(name => name !== '');

    const sampleDict = {};
    window.serverData.forEach(line => {
        const pairs = line.split(/\s+/);
        for (let i = 0; i < pairs.length; i += 2) {
            if (i + 1 < pairs.length) {
                sampleDict[pairs[i + 1].trim().toLowerCase()] = pairs[i].trim();
            }
        }
    });

    const results = {};
    const notFoundResults = [];
    let notFoundCount = 0;

    serverNames.forEach(key => {
        if (accessedServers.includes(key)) {
            results[key] = "already_access_available";
        } else if (sampleDict[key]) {
            results[key] = sampleDict[key];
        } else {
            notFoundCount++;
            notFoundResults.push(key);
        }
    });

    const outputCsvPath = 'output.csv'; // Placeholder for CSV export
    let csvContent = "Server,Number\n";

    // Add found servers to CSV
    for (const key in results) {
        csvContent += `${key},${results[key]}\n`;
    }

    // Add not found servers to CSV
    notFoundResults.forEach(key => {
        csvContent += `${key},Not_Found\n`;
    });

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', outputCsvPath);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.getElementById('outputMessage').innerText = `Results have been exported to ${outputCsvPath}\nCount of Not Found Keys: ${notFoundCount}`;
});
