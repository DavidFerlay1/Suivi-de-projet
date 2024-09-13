import { useTranslation } from "react-i18next";

const useLitteral = () => {

    const monthes = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'July',
        'august',
        'september',
        'october',
        'november',
        'december'
    ];

    const {t} = useTranslation();

    const litteralDateMillis = (dateMillis: number, mod: string = LitteralType.DEFAULT) => {
        const date = new Date(dateMillis);
        const firstSplit = date.toISOString().split('T');

        const isolatedDate = firstSplit[0];
        const dateSplit = isolatedDate?.split('-')!;
        const month = monthes[parseInt(dateSplit[1]!)]
        const litteralDate = new Date() === new Date(isolatedDate!) ? 'date.today' : `${dateSplit[2]} ${t(`date.${month}`)} ${dateSplit[0]}`;

        if(mod === LitteralType.DATE_ONLY)
            return litteralDate;

        const hours = firstSplit[1]?.substring(0, 5);

        if(mod === LitteralType.HOURS_ONLY)
            return hours;

        return `${litteralDate} ${t('date.at')} ${hours}`;
    }

    return {litteralDateMillis}
}

export const LitteralType = {
    DEFAULT: 'default',
    DATE_ONLY: 'date_only',
    HOURS_ONLY: 'hours_only'
}

export default useLitteral