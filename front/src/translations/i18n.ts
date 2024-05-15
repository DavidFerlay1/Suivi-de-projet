import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import fr from './fr.json';

const resources = {
    fr: {
        translation: fr
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: 'fr'
    })

export default i18next;