// typewrite.js

// Function to simulate typewriter effect with line styles
function typeWriterEffect(text, element, styles, speed) {
    let i = 0;
    let lineIndex = 0;
    let lineElement; // To keep track of the current line element
    let interval = setInterval(function() {
        if (i < text.length) {
            if (text[i] === '\n') {
                // Close the previous span (line)
                if (lineElement) {
                    lineElement.innerHTML += '<br>';
                }
                lineIndex++; // Move to the next line
                i++;
            } else {
                // Wrap each line in a span with the corresponding style
                if (i === 0 || text[i - 1] === '\n') {
                    lineElement = document.createElement('span');
                    lineElement.style = styles[lineIndex] || ''; // Apply style
                    element.appendChild(lineElement);
                }

                lineElement.innerHTML += text[i];

                i++;
            }
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// Content to be displayed with typewriter effect
const content = `.\n\n\nfunction portfolio(){\n\nHello,\nI'm Manohar Eldhandi!\n\nWelcome to my portfolio -- a reflection of my journey, growth, and achievements throughout my Career. Here, you’ll find a showcase of my skills, projects, and experiences, each representing a step in my continuous pursuit of excellence.\n\nFeel free to explore each section and dive deep into my work. I am always excited to connect and discuss new ideas. Let’s make something amazing together!\n\n}`;

// Define styles for each line (CSS styles as string)
const lineStyles = [
    "font-size: 20px;", // First line style
    "font-size: 50px;", // Second line style
    "font-size: 24px;", // Third line style
    "font-size: 23px;",
    "font-size: 24px;", // Fifth line style
    "font-size: 32px; color: #FFD700;", // Sixth line style
    "font-size: 32px; color: #FFD700;", //im
    "font-size: 23px;", // Eighth line style
    "font-size: 23px;", //welcome
    "font-size: 23px; ", // 
    "font-size: 23px;", //feel free
    "font-size:23px;",
    "font-size:30px;",
    "font-size:20px;",//}
];

// Start the typewriter effect when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const typewriterText = document.getElementById('typewriter-text');
    const typingSpeed = 1; // Aajust typing speed as needed

    typeWriterEffect(content, typewriterText, lineStyles, typingSpeed);
});