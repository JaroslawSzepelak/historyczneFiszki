export default {
    namespaced: true,
    state: {
        allAreas: [{
                name: "Polska",
                routeName: "polska",
            },
            {
                name: "Świat",
                routeName: "swiat",
            }
        ],
        allEras: [{
                name: "Prehistoria",
                routeName: "prehistoria",
                description: "Jest to najdłuższy okres dziejów ludzkości, od pojawienia się na Ziemi człowieka zręcznego, do powstania pisma. Badanie tego okresu możliwe jest jedynie metodami archeologicznymi. Na terenach Afryki zaczyna się około 2,5 mln lat temu razem z pojawieniem się Homo habilis, na terenie Europy około 1 mln lat temu, natomiast na innych terenach z momentem pojawienia się człowieka rozumnego"
            },
            {
                name: "Starożytność",
                routeName: "starozytnosc",
                description: "Pierwsza epoka w dziejach niektórych części świata, wyróżniana zwłaszcza w dziejopisarstwie europejskim. Obecnie dotyczy przede wszystkim tzw. Starego Świata, w tym Europy, Bliskiego Wschodu i Afryki Północnej, choć termin ten bywa też stosowany w historycznym kontekście Indii i Chin.Początek starożytności następuje po epoce prehistorii, to znaczy od powstania pierwszych historycznych cywilizacji w IV tysiącleciu p.n.e., a za jej zakończenie uznawany jest czas około V wieku n.e. W Europie za koniec starożytności najczęściej uznawany jest rok 476 n.e., czyli upadek Cesarstwa Zachodniorzymskiego."
            },
            {
                name: "Średniowiecze",
                routeName: "sredniowiecze",
                description: "Epoka w historii Europy trwająca od V do XV wieku, która rozpoczęła się wraz z upadkiem cesarstwa zachodniorzymskiego (476 r.) i trwała do epoki renesansu i wielkich odkryć geograficznych (1492 r.). Jest środkowym okresem w tradycyjnym podziale historii Europy na starożytność, średniowiecze i nowożytność. Dzieli się na wczesne, pełne (dojrzałe) i późne średniowiecze."
            },
            {
                name: "Nowożytność",
                routeName: "nowozytnosc",
                description: "Epoka w historii następująca według tradycyjnej periodyzacji po średniowieczu i poprzedzająca XIX wiek (jako epokę). Za jej datę początkową uznaje się najczęściej upadek Konstantynopola, a tym samym cywilizacji bizantyńskiej (1453) lub odkrycie Ameryki przez Krzysztofa Kolumba (1492). Obie te daty mają wyłącznie charakter umowny – upadek Bizancjum miał bardzo ograniczony wpływ na rozwój kultury europejskiej, natomiast ekspansja europejska w kierunkach zachodnim i południowym miała przynieść skutki dopiero w XVI wieku. Realnymi wyznacznikami przejścia od epoki średniowiecznej do nowożytnej są natomiast przemiany kulturowe, polityczne, państwowe, ideologiczne i w ograniczonym stopniu techniczne. W historii świata za umowne zakończenie epoki najczęściej uznaje się wybuch rewolucji francuskiej, a rzadziej kongres wiedeński lub rozpoczęcie się I wojny światowej."
            },
            {
                name: "XIX wiek",
                routeName: "xix-wiek",
                description: "Epoka XIX wieku (przez niektórych historyków traktowana jako część nowożytności), wprowadza pewne zamieszanie, bo nie rozpoczęła się ani nie zakończyła w XIX stuleciu. Ramy czasowe tej epoki wyznacza bowiem wybuch rewolucji francuskiej i wybuch I wojny światowej."
            },
            {
                name: "Współczesność",
                routeName: "wspolczesnosc",
                description: "Współczesność rozpoczęła się wraz z wybuchem pierwszej wojny światowej i trwa do dziś. O tym, jakie wydarzenia należy uznać za przełomowe w tej epoce zdecydują kolejne pokolenia, ale już teraz współczesność można podzielić na trzy okresy: okres międzywojenny – to właśnie wtedy USA i ZSRR umocniły swoją pozycję na arenie międzynarodowej, a Polska wróciła na mapę Europy; II wojna światowa – okres ten obejmuje lata 1939–1945 i wszystkie wydarzenia, które miały miejsce między wrześniową wojną obronną a kapitulacją Niemiec i Japonii;powojnie – okres trwający od 1945 roku do dziś. Mówiąc o najważniejszych wydarzeniach po II wojnie światowej, należy wskazać m.in. na zimną wojnę, upadek muru berlińskiego i transformację ustrojową w Polsce."
            },
        ],
        historyArea: null,
        historyEra: null
    },
    getters: {
        allAreasRouteNamesString(state) {
            let areaRouteNames = [];
            state.allAreas.forEach(area => {
                areaRouteNames.push(area.routeName);
            });
            return areaRouteNames.join(", ");
        },
        allErasRouteNamesString(state) {
            let eraRouteNames = [];
            state.allEras.forEach(era => {
                eraRouteNames.push(era.routeName);
            });
            return eraRouteNames.join(", ");
        }
    },
    mutations: {
        setHistoryArea(state, historyArea) {
            state.historyArea = historyArea;
        },

        setHistoryEra(state, historyEra) {
            //Object.assign(state.historyEra, historyEra);
            state.historyEra = historyEra;
        }
    },
    actions: {},
    modules: {}
}