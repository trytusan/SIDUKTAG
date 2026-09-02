import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/admin/dashboard.js',
                'resources/js/admin/penduduk.js',
                'resources/js/admin/kartu-keluarga.js',
                'resources/js/admin/pengajuan-surat.js',
                'resources/js/user/dashboard.js',
                'resources/js/user/onboarding.js',
                'resources/js/user/pengajuan-surat.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
