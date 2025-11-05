// Abre todos os links externos em nova aba
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });
});
