document.addEventListener('DOMContentLoaded', function () {
    const consentGate = document.getElementById('consent-gate');
    const videoPlayer = document.getElementById('video-player');
    const consentCheckbox = document.getElementById('consent-checkbox');
    const consentButton = document.getElementById('consent-button');
    const videoId = "Dlcs89fVw2Y";

    if (!consentGate || !videoPlayer || !consentCheckbox || !consentButton) {
        console.error('Einige Elemente für das Risitas-LP konnten nicht gefunden werden.');
        return;
    }

    consentCheckbox.addEventListener('change', function () {
        consentButton.disabled = !this.checked;
    });

    consentButton.addEventListener('click', function () {
        if (consentCheckbox.checked) {
            consentGate.style.display = 'none';
            videoPlayer.style.display = 'block';

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;
            iframe.title = "YouTube video player";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            videoPlayer.appendChild(iframe);
        }
    });
});
