document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // Smooth scrolling
    // ================================

    const navLinks = document.querySelectorAll(
        ".nav-menu a, .top-link, .sidebar-link, .view-all"
    );

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this
                .getAttribute("href")
                ?.substring(1);

            const targetElement =
                document.getElementById(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // ================================
    // Mobile hamburger menu
    // ================================

    const menuButton =
        document.querySelector(".menu-button");

    const sidebar =
        document.querySelector(".sidebar");

    if (menuButton && sidebar) {

        menuButton.addEventListener("click", function () {

            const isOpen =
                sidebar.classList.toggle("mobile-open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

            menuButton.textContent =
                isOpen ? "✕" : "☰";

        });


        // Close mobile menu after clicking a link

        const sidebarLinks =
    document.querySelectorAll(".sidebar-link");

sidebarLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        // Remove active state from every sidebar link
        sidebarLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add active state to the clicked link
        this.classList.add("active");

        // Close mobile menu
        if (window.innerWidth <= 768) {

            sidebar.classList.remove("mobile-open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.textContent = "☰";
        }

    });

});

    }


    // ================================
    // Card loading animation
    // ================================

    const cards =
        document.querySelectorAll(".stat-card");

    cards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        setTimeout(function () {

            card.style.transition =
                "opacity 500ms ease, transform 500ms ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, index * 100);

    });

});