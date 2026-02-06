// ===========================================
// EL NOBIR - main.js COMPLETO - VERSIÓN FINAL CORREGIDA
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 EL NOBIR - Sitio cargado');
    
    // ===========================================
    // INICIALIZAR REPRODUCTOR DE MÚSICA
    // ===========================================
    if (document.querySelector('.player-section')) {
        console.log('🎵 Página de discografía detectada');
        
        const playerSection = document.querySelector('.player-section');
        if (playerSection) {
            setTimeout(() => {
                initMusicPlayer();
            }, 300);
        }
    }
    
    // ===========================================
    // CONFIGURAR TABS DE SERVICIOS
    // ===========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0) {
        console.log('🔧 Configurando tabs de servicios...');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                this.classList.add('active');
                const targetPane = document.getElementById(tabId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
    
    // ===========================================
    // GALERÍA FOTOGRÁFICA - FILTRADO
    // ===========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        console.log('🖼️ Configurando galería fotográfica...');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.filter;
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                filterGallery(category);
            });
        });
    }
    
    // ===========================================
    // MODAL PARA IMÁGENES
    // ===========================================
    const modal = document.getElementById('imageModal');
    if (modal) {
        setupImageModal();
    }
    
    // ===========================================
    // CONFIGURAR FORMULARIOS FORMSPREE - VERSIÓN CORREGIDA
    // ===========================================
    setupFormspreeForms();
});

// ===========================================
// FORMULARIOS FORMSPREE - VERSIÓN MEJORADA (COMPLETAMENTE CORREGIDA)
// ===========================================

function setupFormspreeForms() {
    const forms = document.querySelectorAll('form[action*="formspree"]');
    
    if (forms.length === 0) {
        console.log('ℹ️ No se encontraron formularios Formspree');
        return;
    }
    
    console.log(`📝 Configurando ${forms.length} formulario(s) Formspree...`);
    
    forms.forEach(form => {
        // Eliminar campos de redirección porque usaremos AJAX
        const nextField = form.querySelector('input[name="_next"]');
        const autoresponseField = form.querySelector('input[name="_autoresponse"]');
        if (nextField) nextField.remove();
        if (autoresponseField) autoresponseField.remove();
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevenir envío normal - usaremos AJAX
            console.log('📤 Enviando formulario a Formspree...');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const formId = this.id;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                // IMPORTANTE: Incluir el header 'Accept' para recibir JSON
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                console.log('📨 Respuesta de Formspree:', response.status);
                
                if (response.ok) {
                    // ÉXITO: Formspree recibió el mensaje
                    console.log('✅ Formulario enviado exitosamente a Formspree');
                    
                    // Determinar mensaje según formulario
                    let title = '¡MENSAJE ENVIADO!';
                    let message = 'Gracias por tu mensaje. Te responderé en un plazo máximo de 48 horas.';
                    
                    if (formId === 'schedule-call-form') {
                        title = '¡LLAMADA AGENDADA!';
                        message = 'Solicitud de llamada recibida. Revisaré mi agenda y te confirmaré la fecha y hora por email.';
                    }
                    
                    // Mostrar modal con mensaje correcto
                    showSuccessModal(title, message);
                    
                    // Limpiar formulario
                    this.reset();
                    
                } else {
                    // ERROR de Formspree
                    console.error('❌ Error en Formspree:', response.status);
                    const errorData = await response.json();
                    console.error('Detalles del error:', errorData);
                    showErrorModal('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o escríbeme a hola@elnobir.com');
                }
                
            } catch (error) {
                // ERROR DE RED
                console.error('❌ Error de red:', error);
                showErrorModal('Error de conexión. Por favor, verifica tu internet e intenta nuevamente.');
                
            } finally {
                // Restaurar botón
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
    
    // Configurar cierre del modal de confirmación
    setupModalClose();
    
    console.log('✅ Formularios Formspree configurados');
}

// Función para mostrar modal de éxito - CORREGIDA
function showSuccessModal(title, message) {
    const modal = document.getElementById('confirmationModal');
    const modalTitle = modal.querySelector('h3');
    const modalMessage = document.getElementById('modalMessage');
    
    if (!modal || !modalTitle || !modalMessage) {
        alert(title + '\n' + message);
        return;
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';  // CORREGIDO: 'flex' en lugar de 'block'
    document.body.style.overflow = 'hidden';
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        if (modal.style.display === 'flex') {  // CORREGIDO
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }, 5000);
}

// Función para mostrar modal de error - CORREGIDA
function showErrorModal(message) {
    const modal = document.getElementById('confirmationModal');
    const modalTitle = modal.querySelector('h3');
    const modalMessage = document.getElementById('modalMessage');
    
    if (!modal || !modalTitle || !modalMessage) {
        alert('ERROR: ' + message);
        return;
    }
    
    modalTitle.textContent = '⚠️ ERROR';
    modalMessage.textContent = message;
    modal.style.display = 'flex';  // CORREGIDO: 'flex' en lugar de 'block'
    document.body.style.overflow = 'hidden';
}

function setupModalClose() {
    const confirmationModal = document.getElementById('confirmationModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalAcceptBtn = document.getElementById('modalClose');
    
    if (!confirmationModal) return;
    
    // Cerrar con botón X
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar con botón ACEPTAR
    if (modalAcceptBtn) {
        modalAcceptBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Cerrar al hacer clic fuera
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar con tecla ESC - CORREGIDO
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.style.display === 'flex') {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ===========================================
// VARIABLES GLOBALES DEL REPRODUCTOR
// ===========================================

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let audioPlayer = null;

// ===========================================
// LISTA DE CANCIONES - ARCHIVOS DE INTERNET
// ===========================================

const tracks = [
    {
        id: 1,
        title: "Horizonte Lejano",
        artist: "El Nobir",
        album: "Single • 2023",
        duration: "3:45",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "assets/images/album-dualidad.jpg"
    },
    {
        id: 2,
        title: "Espejismos",
        artist: "El Nobir ft. Luna Beat",
        album: "Colaboración • 2023",
        duration: "4:12",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        image: "assets/images/single2.jpg"
    },
    {
        id: 3,
        title: "Sin Retorno",
        artist: "El Nobir",
        album: "Crónica Urbana • 2022",
        duration: "3:28",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        image: "assets/images/single3.jpg"
    },
    {
        id: 4,
        title: "Versos Bajo la Lluvia",
        artist: "El Nobir",
        album: "Single Acústico • 2021",
        duration: "4:05",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        image: "assets/images/single4.jpg"
    },
    {
        id: 5,
        title: "Urban Dreams",
        artist: "El Nobir",
        album: "Beat Demo • 2024",
        duration: "2:45",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        image: "assets/images/album-cronica.jpg"
    },
    {
        id: 6,
        title: "Midnight Vibes",
        artist: "El Nobir",
        album: "R&B Instrumental • 2024",
        duration: "3:15",
        file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        image: "assets/images/album-primeros-pasos.jpg"
    }
];

// ===========================================
// FUNCIÓN PRINCIPAL DEL REPRODUCTOR
// ===========================================

function initMusicPlayer() {
    console.log('🎧 Inicializando reproductor...');
    
    const requiredElements = [
        'playBtn', 'prevBtn', 'nextBtn', 'progressBar',
        'playlist', 'currentTitle', 'currentArtist'
    ];
    
    let allElementsExist = true;
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`❌ Elemento #${id} no encontrado`);
            allElementsExist = false;
        }
    });
    
    if (!allElementsExist) {
        console.error('❌ No se pueden inicializar los controles del reproductor');
        return;
    }
    
    audioPlayer = new Audio();
    audioPlayer.preload = "metadata";
    audioPlayer.volume = 0.7;
    
    setupAudioEvents();
    setupMainButtons();
    loadTrack(currentTrackIndex);
    renderPlaylist();
    setupProgressBar();
    setupVolumeControl();
    
    console.log('✅ Reproductor inicializado correctamente');
}

// ===========================================
// FUNCIONES DEL REPRODUCTOR (MANTENIDAS)
// ===========================================

function setupAudioEvents() {
    if (!audioPlayer) return;
    
    audioPlayer.addEventListener('loadedmetadata', function() {
        updateTotalTime();
    });
    
    audioPlayer.addEventListener('error', function(e) {
        console.error('❌ Error al cargar audio:', e);
        const currentTrack = tracks[currentTrackIndex];
        setTimeout(() => {
            playNext();
        }, 1000);
    });
    
    audioPlayer.addEventListener('ended', function() {
        if (isRepeating) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNext();
        }
    });
    
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('play', function() {
        isPlaying = true;
        updatePlayButton();
    });
    
    audioPlayer.addEventListener('pause', function() {
        isPlaying = false;
        updatePlayButton();
    });
}

function setupMainButtons() {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.addEventListener('click', togglePlayPause);
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.addEventListener('click', playPrevious);
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', playNext);
    
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    
    const repeatBtn = document.getElementById('repeatBtn');
    if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);
    
    const searchInput = document.getElementById('searchTracks');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterPlaylist(e.target.value);
        });
    }
}

function togglePlayPause() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (!audioPlayer.src || audioPlayer.src === '') {
            loadTrack(currentTrackIndex);
        }
        
        audioPlayer.play().catch(error => {
            console.error('Error al reproducir:', error);
        });
    }
}

function updatePlayButton() {
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
}

function playPrevious() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
    } else {
        currentTrackIndex = tracks.length - 1;
    }
    
    loadTrack(currentTrackIndex);
    
    if (isPlaying) {
        setTimeout(() => audioPlayer.play(), 300);
    }
}

function playNext() {
    if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
    } else {
        currentTrackIndex = 0;
    }
    
    loadTrack(currentTrackIndex);
    
    if (isPlaying) {
        setTimeout(() => audioPlayer.play(), 300);
    }
}

function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    
    const track = tracks[index];
    console.log('📀 Cargando:', track.title);
    
    updateTrackInfo(track);
    resetProgressBar();
    
    if (audioPlayer) {
        audioPlayer.src = track.file;
        audioPlayer.load();
    }
    
    updatePlaylistUI();
}

function updateTrackInfo(track) {
    const elements = {
        title: document.getElementById('currentTitle'),
        artist: document.getElementById('currentArtist'),
        album: document.getElementById('currentAlbum'),
        albumArt: document.getElementById('currentAlbumArt')
    };
    
    if (elements.title) elements.title.textContent = track.title;
    if (elements.artist) elements.artist.textContent = track.artist;
    if (elements.album) elements.album.textContent = track.album;
    if (elements.albumArt) {
        elements.albumArt.src = track.image;
        elements.albumArt.onerror = function() {
            this.src = 'assets/images/album-dualidad.jpg';
        };
    }
}

function resetProgressBar() {
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progressHandle');
    const currentTime = document.getElementById('currentTime');
    
    if (progress) progress.style.width = '0%';
    if (progressHandle) progressHandle.style.left = '0%';
    if (currentTime) currentTime.textContent = '0:00';
}

function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    progressBar.addEventListener('click', function(e) {
        if (!audioPlayer || !audioPlayer.duration) return;
        
        const rect = this.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const newTime = percentage * audioPlayer.duration;
        
        audioPlayer.currentTime = newTime;
    });
}

function updateProgressBar() {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    const progress = document.getElementById('progress');
    const progressHandle = document.getElementById('progressHandle');
    const currentTime = document.getElementById('currentTime');
    
    if (!progress || !progressHandle || !currentTime) return;
    
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${percentage}%`;
    progressHandle.style.left = `${percentage}%`;
    
    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    const totalTime = document.getElementById('totalTime');
    if (!totalTime) return;
    
    const minutes = Math.floor(audioPlayer.duration / 60);
    const seconds = Math.floor(audioPlayer.duration % 60);
    totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function setupVolumeControl() {
    const volumeBar = document.getElementById('volumeBar');
    const volumeLevel = document.getElementById('volumeLevel');
    const muteBtn = document.getElementById('muteBtn');
    const volumeIcon = document.getElementById('volumeIcon');
    
    if (!volumeBar || !volumeLevel || !muteBtn || !volumeIcon) return;
    
    volumeLevel.style.width = `${audioPlayer.volume * 100}%`;
    
    volumeBar.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const volume = Math.max(0, Math.min(1, percentage));
        
        audioPlayer.volume = volume;
        volumeLevel.style.width = `${volume * 100}%`;
        updateVolumeIcon(volume);
    });
    
    muteBtn.addEventListener('click', function() {
        audioPlayer.muted = !audioPlayer.muted;
        updateVolumeIcon(audioPlayer.volume);
    });
    
    updateVolumeIcon(audioPlayer.volume);
}

function updateVolumeIcon(volume) {
    const volumeIcon = document.getElementById('volumeIcon');
    if (!volumeIcon) return;
    
    if (audioPlayer.muted) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-off';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function renderPlaylist() {
    const playlist = document.getElementById('playlist');
    if (!playlist) {
        console.error('❌ No se encontró la playlist');
        return;
    }
    
    playlist.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-album">${track.album}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
            <button class="play-track" data-index="${index}" title="Reproducir">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-track')) {
                playTrackFromPlaylist(index);
            }
        });
        
        const playBtn = item.querySelector('.play-track');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playTrackFromPlaylist(index);
            });
        }
        
        playlist.appendChild(item);
    });
    
    updatePlaylistUI();
}

function playTrackFromPlaylist(index) {
    console.log('🎵 Seleccionando canción:', tracks[index].title);
    currentTrackIndex = index;
    loadTrack(index);
    
    setTimeout(() => {
        audioPlayer.play().catch(e => {
            console.error('Error al reproducir desde playlist:', e);
        });
    }, 300);
}

function updatePlaylistUI() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    playlistItems.forEach((item, index) => {
        item.classList.remove('playing');
        
        if (parseInt(item.dataset.index) === currentTrackIndex) {
            item.classList.add('playing');
            setTimeout(() => {
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    const shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
        shuffleBtn.classList.toggle('active', isShuffled);
    }
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    const repeatBtn = document.getElementById('repeatBtn');
    if (repeatBtn) {
        repeatBtn.classList.toggle('active', isRepeating);
    }
}

function filterPlaylist(searchTerm) {
    const filteredTracks = tracks.filter(track => 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.album.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const playlist = document.getElementById('playlist');
    if (!playlist) return;
    
    playlist.innerHTML = '';
    
    filteredTracks.forEach((track, index) => {
        const originalIndex = tracks.indexOf(track);
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.originalIndex = originalIndex;
        
        item.innerHTML = `
            <div class="track-number">${originalIndex + 1}</div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-album">${track.album}</div>
            </div>
            <div class="track-duration">${track.duration}</div>
            <button class="play-track" data-index="${originalIndex}" title="Reproducir">
                <i class="fas fa-play"></i>
            </button>
        `;
        
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-track')) {
                currentTrackIndex = originalIndex;
                playTrackFromPlaylist(originalIndex);
            }
        });
        
        const playBtn = item.querySelector('.play-track');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentTrackIndex = originalIndex;
                playTrackFromPlaylist(originalIndex);
            });
        }
        
        playlist.appendChild(item);
    });
}

// ===========================================
// FUNCIÓN DE NOTIFICACIONES (SIMPLIFICADA)
// ===========================================

function showNotification(message, type = 'info') {
    console.log('💬 Notificación:', message);
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.setAttribute('data-type', type);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
    
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
                border-left: 4px solid;
            }
            
            .notification[data-type="info"] {
                background: #000;
                color: white;
                border-left-color: #666;
            }
            
            .notification[data-type="success"] {
                background: #111;
                color: #0f0;
                border-left-color: #0f0;
            }
            
            .notification[data-type="warning"] {
                background: #111;
                color: #ff0;
                border-left-color: #ff0;
            }
            
            .notification[data-type="error"] {
                background: #111;
                color: #f00;
                border-left-color: #f00;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===========================================
// GALERÍA FOTOGRÁFICA - FUNCIONES
// ===========================================

function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// ===========================================
// MODAL PARA IMÁGENES
// ===========================================

function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            if (img && overlay) {
                const title = overlay.querySelector('h3');
                const description = overlay.querySelector('p');
                
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                
                if (title) modalTitle.textContent = title.textContent;
                if (description) modalDescription.textContent = description.textContent;
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ===========================================
// INICIALIZACIÓN SEGURA
// ===========================================

if (document.querySelector('.player-section')) {
    setTimeout(() => {
        if (!audioPlayer) {
            initMusicPlayer();
        }
    }, 500);
}

// ===========================================
// FUNCIÓN PARA PRUEBAS
// ===========================================

function testFormspreeDirect() {
    console.log('🧪 Probando Formspree directamente...');
    
    fetch('https://formspree.io/f/xbdarpwg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: '_subject=Test+Directo&name=Test&email=test@test.com&message=Probando+Formspree'
    })
    .then(response => {
        console.log('Status:', response.status);
        alert(response.ok ? '✅ FORMSPREE FUNCIONA' : '⚠️ Problema con Formspree');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error de red');
    });
}