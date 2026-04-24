@props([
    'title' => 'SIDUKTAG',
])



<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $title }}</title>



    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-100 text-slate-800 antialiased">
    {{ $slot }}


</body>
@stack('scripts')
</html>