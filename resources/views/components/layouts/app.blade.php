@props([
    'title' => 'SIDUKTAG',
])




<!DOCTYPE html>
<html lang="id">
    <head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $title }}</title>




    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-100 text-slate-800 antialiased">
    {{ $slot }}



</body>

<script>
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');

        if (!sidebar || !backdrop) {
            return;
        }

        sidebar.classList.toggle('-translate-x-full');
        backdrop.classList.toggle('hidden');
    }

    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');

        if (!sidebar || !backdrop) {
            return;
        }

        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
    }
</script>

@stack('scripts')
</html>