document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return; // Guard clause jika form tidak ditemukan

    const inputs = filterForm.querySelectorAll('.filter-input');

    inputs.forEach(input => {
        // Untuk Select Box: Langsung submit saat dipilih
        input.addEventListener('change', () => {
            filterForm.submit();
        });

        // Untuk Input Text: Beri jeda (debounce) agar tidak spam server
        if (input.tagName === 'INPUT' && input.type === 'text') {
            let timer;
            input.addEventListener('input', () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    filterForm.submit();
                }, 800);
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;

    // Ambil semua input yang memiliki class filter-input
    const inputs = filterForm.querySelectorAll('.filter-input');

    inputs.forEach(input => {
        // 1. Logic untuk Select Box (Dropdown)
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                submitWithLoading();
            });
        }

        // 2. Logic untuk Input Text (Search) dengan Debounce
        if (input.tagName === 'INPUT' && input.type === 'text') {
            let timeout = null;
            input.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    submitWithLoading();
                }, 800); // Tunggu 0.8 detik setelah user berhenti mengetik
            });
        }
    });

    function submitWithLoading() {
        // Efek visual loading (opsional)
        const table = document.querySelector('table');
        if (table) table.style.opacity = '0.5';
        
        filterForm.submit();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fungsi Preview Foto Profil
    window.previewFotoProfil = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                const output = document.getElementById('preview_foto');
                if (output) {
                    output.src = reader.result;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Anda juga bisa menambahkan logic validasi client-side di sini nantinya
    console.log('Penduduk Form Script Loaded');
});