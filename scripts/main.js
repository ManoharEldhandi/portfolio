document.addEventListener('DOMContentLoaded', function() {
    const navbarLinks = document.querySelectorAll('#navbar a'); // Navigation links
    const sections = document.querySelectorAll('#transparent-layer > .content-wrapper > div'); // All sections within the transparent layer

    // Function to show a particular section based on ID
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block'; // Show the target section
            } else {
                section.style.display = 'none'; // Hide all other sections
            }
        });
    }

    // Event listeners for each navigation link
    navbarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Get the section ID to be shown from the link's id attribute
            const sectionId = link.getAttribute('id').replace('-link', '-page'); // Example: 'home-link' to 'home-page'

            // Check if the link clicked is 'Home'
            if (sectionId === 'home-page') {
                showSection('landing-page'); // Show the landing page section
            } else {
                showSection(sectionId); // Show the corresponding section
            }
        });
    });

    // Initially show the landing page and hide others
    showSection('landing-page');
});

//form submission
document.addEventListener('DOMContentLoaded', function() {
    const sendMessageBtn = document.getElementById('send-message-btn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Gather form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validate form fields (frontend validation)
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // SMTP.js configuration
            Email.send({
                SecureToken: 'fc5e300b-196c-4eae-90a2-9036c203f809', // Your secure token from SMTP.js
                To: 'manoharportfolio@gmail.com', // Your email address for receiving messages
                From: email, // Use the email input fielfs as the 'From' address
                Subject: 'New Message from Portfolio Contact Form',
                Body: `
                    You have received a new message from your portfolio contact form:
                    
                    Name: ${name}
                    Email: ${email}
                    Message: ${message}
                `
            }).then(
                message => {
                    console.log(message);
                    alert('Message sent successfully!');
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('message').value = '';
                }
            ).catch(
                error => {
                    console.error(error);
                    alert('Failed to send message');
                }
            );
        });
    }
});

//carousel controlls

document.addEventListener("DOMContentLoaded", () => {
    const carouselItems = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".indicator");
    const prevButton = document.getElementById("carousel-prev");
    const nextButton = document.getElementById("carousel-next");
    let currentIndex = 0;

    function updateCarousel(index) {
        carouselItems.forEach((item, i) => {
            if (i === index) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === index);
        });
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        updateCarousel(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        updateCarousel(currentIndex);
    }

    indicators.forEach((indicator, i) => {
        indicator.addEventListener("click", () => {
            currentIndex = i;
            updateCarousel(currentIndex);
        });
    });

    prevButton.addEventListener("click", showPrev);
    nextButton.addEventListener("click", showNext);

    // Initial carousel setup
    updateCarousel(currentIndex);
});

//typewriter for about page
// Typewriter Effect Script
document.addEventListener("DOMContentLoaded", function() {
    const typewriterElement = document.getElementById("typewriter");
    const text = "Hello! I'm Manohar Eldhandi, currently pursuing a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence & Machine Learning at CMR Institute of Technology. My passion lies in exploring the realms of machine learning, data science, and software development. Through various projects and internships, I've honed my skills in these fields. I'm always eager to learn and contribute to technological advancements. When I'm not coding, I enjoy Cooking and Gaming.";
    
    let index = 0;

    function type() {
        if (index < text.length) {
            typewriterElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 2); // Adjust typing speed as needed
        }
    }

    type();
});

document.addEventListener("DOMContentLoaded", () => {
    // Project Carousel Controls
    const projectCarouselItems = document.querySelectorAll("#projects-page .carousel-item");
    const projectIndicators = document.querySelectorAll("#projects-page .indicator");
    const projectPrevButton = document.getElementById("carousel-prev");
    const projectNextButton = document.getElementById("carousel-next");
    let projectCurrentIndex = 0;

    function updateProjectCarousel(index) {
        projectCarouselItems.forEach((item, i) => {
            if (i === index) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        projectIndicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === index);
        });
    }

    function showProjectNext() {
        projectCurrentIndex = (projectCurrentIndex + 1) % projectCarouselItems.length;
        updateProjectCarousel(projectCurrentIndex);
    }

    function showProjectPrev() {
        projectCurrentIndex = (projectCurrentIndex - 1 + projectCarouselItems.length) % projectCarouselItems.length;
        updateProjectCarousel(projectCurrentIndex);
    }

    projectIndicators.forEach((indicator, i) => {
        indicator.addEventListener("click", () => {
            projectCurrentIndex = i;
            updateProjectCarousel(projectCurrentIndex);
        });
    });

    projectPrevButton.addEventListener("click", showProjectPrev);
    projectNextButton.addEventListener("click", showProjectNext);

    // Initial project carousel setup
    updateProjectCarousel(projectCurrentIndex);

    // Experience Carousel Controls
    const experienceCarouselItems = document.querySelectorAll("#experience-page .carousel-item");
    const experienceIndicators = document.querySelectorAll("#experience-page .experience-indicator");
    const experiencePrevButton = document.getElementById("experience-carousel-prev");
    const experienceNextButton = document.getElementById("experience-carousel-next");
    let experienceCurrentIndex = 0;

    function updateExperienceCarousel(index) {
        experienceCarouselItems.forEach((item, i) => {
            if (i === index) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        experienceIndicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === index);
        });
    }

    function showExperienceNext() {
        experienceCurrentIndex = (experienceCurrentIndex + 1) % experienceCarouselItems.length;
        updateExperienceCarousel(experienceCurrentIndex);
    }

    function showExperiencePrev() {
        experienceCurrentIndex = (experienceCurrentIndex - 1 + experienceCarouselItems.length) % experienceCarouselItems.length;
        updateExperienceCarousel(experienceCurrentIndex);
    }

    experienceIndicators.forEach((indicator, i) => {
        indicator.addEventListener("click", () => {
            experienceCurrentIndex = i;
            updateExperienceCarousel(experienceCurrentIndex);
        });
    });

    experiencePrevButton.addEventListener("click", showExperiencePrev);
    experienceNextButton.addEventListener("click", showExperienceNext);

    // Initial experience carousel setup
    updateExperienceCarousel(experienceCurrentIndex);
});