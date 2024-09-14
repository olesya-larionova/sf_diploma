import css from './Tariffes.module.css';
import TariffCard from './TariffCard';
import { getCurrentTarrife } from '../../DataQueries/DataQueries';

type TPriceData = {
    name: string,
    desc: string,
    icon: string,
    bcolor: string;
    fcolor: string;
    price: number,
    oldprice: number,
    instprice: number,
    months: number,
    incl1: string,
    incl2: string,
    incl3: string,
    key: number
};

const bages:TPriceData[] = [
    {
        name: "Beginner",
        desc: "Для небольшого исследования",
        icon: "/img/price_lamp.svg",
        bcolor: "#FFB64F",
        fcolor: "black",
        price: 799,
        oldprice: 1200,
        instprice: 150,
        months: 24,
        incl1: "Безлимитная история запросов",
        incl2: "Безопасная сделка",
        incl3: "Поддержка 24/7",
        key: 0
    },
    {
        name: "Pro",
        desc: "Для HR и фрилансеров",
        icon: "/img/price_archery.svg",
        bcolor: "#7CE3E1",
        fcolor: "black",
        price: 1299,
        oldprice: 2600,
        instprice: 279,
        months: 24,
        incl1: "Все пункты тарифа Beginner",
        incl2: "Экспорт истории",
        incl3: "Рекомендации по приоритетам",
        key: 1
    },
    {
        name: "Business",
        desc: "Для корпоративных клиентов",
        icon: "/img/price_laptop.svg",
        bcolor: "black",
        fcolor: "white",
        price: 2379,
        oldprice: 3700,
        instprice: NaN,
        months: NaN,
        incl1: "Все пункты тарифа Pro",
        incl2: "Безлимитное количество запросов",
        incl3: "Приоритетная поддержка",
        key: 2
    },

];


function Tariffes() {
    
    const currentTariffe = getCurrentTarrife();

    return (
        <div className={css.tariffes}>
            <TariffCard data={bages[0]} currentTariffe={currentTariffe}/>
            <TariffCard data={bages[1]} currentTariffe={currentTariffe}/>
            <TariffCard data={bages[2]} currentTariffe={currentTariffe}/>
        </div>

    )
}

export default Tariffes;
