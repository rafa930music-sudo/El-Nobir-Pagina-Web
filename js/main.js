// ===========================================
// EL NOBIR - main.js CORREGIDO (SIN SCROLL AUTOMÁTICO)
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 EL NOBIR - Sitio cargado');
    
    // ===========================================
    // INICIALIZAR REPRODUCTOR DE MÚSICA
    // ===========================================
    if (document.querySelector('.player-section')) {
        console.log('🎵 Página de discografía detectada');
        
        // INICIALIZAR PERO SIN CARGAR CANCIÓN AUTOMÁTICAMENTE
        setTimeout(() => {
            initMusicPlayer();
        }, 500);
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
    // CONFIGURAR FORMULARIOS FORMSPREE
    // ===========================================
    setupFormspreeForms();
});

// ===========================================
// FORMULARIOS FORMSPREE
// ===========================================

function setupFormspreeForms() {
    const forms = document.querySelectorAll('form[action*="formspree"]');
    
    if (forms.length === 0) return;
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const formId = this.id;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    let title = '¡MENSAJE ENVIADO!';
                    let message = 'Gracias por tu mensaje. Te responderé en 48 horas.';
                    
                    if (formId === 'schedule-call-form') {
                        title = '¡LLAMADA AGENDADA!';
                        message = 'Solicitud recibida. Te confirmaré por email.';
                    }
                    
                    showSuccessModal(title, message);
                    this.reset();
                } else {
                    showErrorModal('Error al enviar. Intenta nuevamente.');
                }
                
            } catch (error) {
                showErrorModal('Error de conexión. Verifica tu internet.');
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
    
    setupModalClose();
}

// ===========================================
// FUNCIONES DEL MODAL
// ===========================================

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
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }, 5000);
}

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
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function setupModalClose() {
    const confirmationModal = document.getElementById('confirmationModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalAcceptBtn = document.getElementById('modalClose');
    
    if (!confirmationModal) return;
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (modalAcceptBtn) {
        modalAcceptBtn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirmationModal.style.display === 'flex') {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ===========================================
// REPRODUCTOR DE MÚSICA - VARIABLES
// ===========================================

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let audioPlayer = null;

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
// FUNCIÓN PRINCIPAL DEL REPRODUCTOR (CORREGIDA)
// ===========================================

function initMusicPlayer() {
    console.log('🎧 Inicializando reproductor (sin scroll automático)...');
    
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
    
    if (!allElementsExist) return;
    
    audioPlayer = new Audio();
    audioPlayer.preload = "metadata";
    audioPlayer.volume = 0.7;
    
    setupAudioEvents();
    setupMainButtons();
    
    // SOLO MOSTRAR PRIMERA CANCIÓN, SIN REPRODUCIR
    updateTrackInfo(tracks[0]);
    renderPlaylist();
    setupProgressBar();
    setupVolumeControl();
    
    console.log('✅ Reproductor listo (sin autoplay)');
}

// ===========================================
// FUNCIONES DEL REPRODUCTOR
// ===========================================

function setupAudioEvents() {
    if (!audioPlayer) return;
    
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
    audioPlayer.addEventListener('error', function(e) {
        console.error('❌ Error de audio:', e);
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
    if (!playlist) return;
    
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
            console.error('Error al reproducir:', e);
        });
    }, 300);
}

// ===========================================
// FUNCIÓN CORREGIDA - SIN SCROLL AUTOMÁTICO
// ===========================================

function updatePlaylistUI() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    playlistItems.forEach((item, index) => {
        item.classList.remove('playing');
        
        if (parseInt(item.dataset.index) === currentTrackIndex) {
            item.classList.add('playing');
            // SIN scrollIntoView - esto evita el desplazamiento automático
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
// GALERÍA Y MODAL
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