import {onMounted, ref, watch} from 'vue';
import {loadingController} from '@ionic/vue';

export function useLoading() {
    const loading = ref<boolean>(false);
    let loadingElement: HTMLIonLoadingElement | null = null;

    watch(loading, async (oldValue, newValue) => {

        loadingElement = loadingElement === null
            ? await loadingController.create({
                'message': 'Cargando...',
            })
            : loadingElement;

        if (loadingElement) {
            if (loading.value) {
                console.log('display the loading');
                loadingElement.present();
            } else {
                console.log('hide the loading');
                loadingElement.dismiss();
            }
        }
    });

    return {loading};
}
