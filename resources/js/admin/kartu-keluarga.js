window.tambahAnggota = function() {
    const container = document.getElementById('anggota-container');
    const div = document.createElement('div');
    div.className = 'anggota-item flex items-center gap-3';

    div.innerHTML = `
        <input
            type="text"
            name="anggota[]"
            placeholder="Nama anggota keluarga"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
        <button
            type="button"
            onclick="hapusAnggota(this)"
            class="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-200"
        >
            Hapus
        </button>
    `;
    container.appendChild(div);
}

window.hapusAnggota = function(button) {
    const container = document.getElementById('anggota-container');
    const items = container.querySelectorAll('.anggota-item');

    if (items.length > 1) {
        button.parentElement.remove();
    } else {
        button.parentElement.querySelector('input').value = '';
    }
}

// Menambahkan baris input anggota keluarga baru
window.tambahAnggota = function() {
    const container = document.getElementById('anggota-container');
    const div = document.createElement('div');
    div.className = 'anggota-item flex items-center gap-3 animate-fadeIn'; // Tambahkan animasi jika ada

    div.innerHTML = `
        <input
            type="text"
            name="anggota[]"
            placeholder="Nama anggota keluarga"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        >
        <button
            type="button"
            onclick="hapusAnggota(this)"
            class="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-200"
        >
            Hapus
        </button>
    `;
    container.appendChild(div);
}

// Menghapus baris input anggota keluarga
window.hapusAnggota = function(button) {
    const container = document.getElementById('anggota-container');
    const items = container.querySelectorAll('.anggota-item');

    // Sisakan minimal satu baris input
    if (items.length > 1) {
        button.parentElement.remove();
    } else {
        button.parentElement.querySelector('input').value = '';
    }
}

// Konfirmasi penghapusan data KK via Form Spoofing
window.confirmDelete = function(url) {
    if (confirm('Apakah Anda yakin ingin menghapus data Kartu Keluarga ini? Semua data terkait di dalamnya mungkin akan terdampak.')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        
        // CSRF Token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        // Method Spoofing untuk DELETE
        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        
        form.appendChild(csrfInput);
        form.appendChild(methodInput);
        document.body.appendChild(form);
        form.submit();
    }
}