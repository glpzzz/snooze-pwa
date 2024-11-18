/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa';
import path from 'path'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                id: 'pwa',
                name: 'Snooze',
                short_name: 'Snooze',
                description: 'A veterinary consultation app for recording and managing pet medical records efficiently and securely.',
                display: 'standalone',
                theme_color: '#0a213b',
                background_color: '#d1dad9',
                categories: ['health', 'pets'],
                icons: [
                    {
                        src: 'icon-48.webp',
                        sizes: '48x48',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-72.webp',
                        sizes: '72x72',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-96.webp',
                        sizes: '96x96',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-128.webp',
                        sizes: '128x128',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-192.webp',
                        sizes: '192x192',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-256.webp',
                        sizes: '256x256',
                        type: 'image/webp',
                    },
                    {
                        src: 'icon-512.webp',
                        sizes: '512x512',
                        type: 'image/webp',
                    },
                ],
                screenshots: [
                    {
                        src: '/screenshots/ios-01.jpg',
                        platform: "ios",
                        label: 'Lista de Pacientes',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/ios-02.jpg',
                        platform: "ios",
                        label: 'Crear un paciente',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/ios-03.jpg',
                        platform: "ios",
                        label: 'Detalles de un paciente sin historial',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/ios-04.jpg',
                        platform: "ios",
                        label: 'Detalles de un paciente (datos del propietario expandido)',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/ios-05.jpg',
                        platform: "ios",
                        label: 'Detalles de un paciente (datos del propietario colapsado)',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/ios-06.jpg',
                        platform: "ios",
                        label: 'Eliminar un paciente',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-01.jpg',
                        platform: "android",
                        label: 'Lista de Pacientes',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-02.jpg',
                        platform: "android",
                        label: 'Crear un paciente',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-03.jpg',
                        platform: "android",
                        label: 'Detalles de un paciente sin historial',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-04.jpg',
                        platform: "android",
                        label: 'Detalles de un paciente (datos del propietario expandido)',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-05.jpg',
                        platform: "android",
                        label: 'Detalles de un paciente (datos del propietario colapsado)',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                    {
                        src: '/screenshots/android-06.jpg',
                        platform: "android",
                        label: 'Eliminar un paciente',
                        form_factor: "narrow",
                        sizes: '428x926',
                        type: 'image/jpeg',
                    },
                ]
            }
        }),
        legacy()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom'
    }
})
