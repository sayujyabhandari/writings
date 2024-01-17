async function loadWritings() {
    const response = await fetch('/writings');
    const writings = await response.json();
    const writingsList = document.getElementById('writingsList');
    writingsList.innerHTML = ''; // Clear the list before adding updated writings

    writings.forEach(writing => {
        const titleElement = document.createElement('h2');
        titleElement.textContent = writing.title;

        // Create a container for the content
        const contentElement = document.createElement('div');
        // Normalize newline characters and split the content by new lines, wrapping each line in <p> tags.
        const paragraphs = writing.content.replace(/\r\n?/g, '\n').split('\n');
        contentElement.innerHTML = paragraphs.map(paragraph =>
            `<p>${paragraph}</p>`).join('');

        const writingContainer = document.createElement('div');
        writingContainer.classList.add('writing-entry');
        writingContainer.appendChild(titleElement);
        writingContainer.appendChild(contentElement);

        writingsList.appendChild(writingContainer);
    });
}

// Call loadWritings when the page loads
loadWritings();
