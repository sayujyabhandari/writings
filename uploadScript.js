document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    window.location.href = '/';
});

async function loadWritings() {
    const response = await fetch('/writings');
    const writings = await response.json();
    const writingsList = document.getElementById('writingsList');
    writingsList.innerHTML = ''; // Clear existing content

    writings.forEach(writing => {
        const titleElement = document.createElement('div');
        titleElement.textContent = writing.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
        deleteWriting(writing.title);
        };
        titleElement.appendChild(deleteButton);
        writingsList.appendChild(titleElement);
    });
    
}

async function deleteWriting(title) {
    const response = await fetch(`/writings/${encodeURIComponent(title)}`, {
        method: 'DELETE'
    });
    

if (response.ok) {
    console.log('Writing deleted');
    loadWritings(); // Refresh the list after deletion
} else {
    console.error('Error deleting writing');
}

}

// Call loadWritings when the page loads
loadWritings();