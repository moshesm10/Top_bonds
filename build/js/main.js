'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const btnMinus = document.querySelector('.description__year-selector-button-wrapper_decrement-year'),
    btnPlus = document.querySelector('.description__year-selector-button-wrapper_increment-year'),
    btnsRisk = document.querySelectorAll('.description__risk-selector-button'),
    yearCurrent = document.querySelector('.description__year-selector-button-wrapper_year-counter'),
    container = document.querySelector('.container'),
    bondsWrapper = document.querySelector('.bonds__block');

    // popup

    const btnPopupShow = document.querySelector('.add'),
        popup = document.querySelector('.popup'),
        btnPopupClose = document.querySelector('.popup__content-close-button');

    btnPopupShow.addEventListener('click', () => {
        popup.style.display = 'block';
        container.style.filter = 'blur(10px)';
    });

    btnPopupClose.addEventListener('click', () => {
        popup.style.display = 'none';
        container.style = '';
    });

    // get data from db

    const getData = (caseNum) => {
        bondsWrapper.innerHTML = '';

    fetch('./json.php')
        .then(response => response.json())
        .then(json => {

            let bonds_arr = [];
            const numOfBonds = json.length;

            for (var i = 0; i < numOfBonds; i++) {

                let secid = json[i].SECID,
                    shortname_1 = json[i].SHORTNAME,
                    matdate = json[i].MATDATE,
                    lotvalue = +json[i].LOTVALUE,
                    duration = +json[i].DURATION,
                    listlevel = +json[i].LISTLEVEL,
                    //accruedint = +json[i].ACCRUEDINT,
                    prevwaprice = +json[i].PREVWAPRICE,
                    coupons_sum_value = +json[i].COUPONS_SUM,
                    sum_volume_trade_value = +json[i].SUM_VOLUME_TRADE,
                    yield_value = +json[i].YIELD,
                    purchase = +json[i].PURCHASE,
                    yield_to_mat_value = +json[i].YIELD_TO_MAT;
                
                // ---------------- Сортировка данных ------------------------
                //условие по дате погашения (управляемый параметр)
                if (Date.parse(matdate) <= Date.parse(`${yearCurrent.textContent}-12-31`)) {
                    
                    //условие по наличию значений, по дюрации до 1000 
                    if ((secid != 0 && shortname_1 != 0 && matdate != 0 && lotvalue != 0 && lotvalue <= 10000 && duration != 0 && duration <= 1000 && listlevel != 0 && prevwaprice != 0 && coupons_sum_value > 0 && sum_volume_trade_value != 0 && purchase != 0) && (secid != null && shortname_1 != null && matdate != null && lotvalue != null && duration != null && listlevel != null && prevwaprice != null && coupons_sum_value != null && sum_volume_trade_value != null && purchase != null)) {

                        if (yield_value > 0 && yield_to_mat_value > 0 && prevwaprice > 95) {
                            switch (caseNum) {
                                case 1:
                                    if ((listlevel == 1) && (100 <= duration <= 330) && sum_volume_trade_value >= 100) {
                                        bonds_arr.push([shortname_1, yield_to_mat_value, purchase, secid, lotvalue, sum_volume_trade_value, duration, matdate]);
                                    }
                                    break;
                                case 2:
                                    if ((listlevel <= 2) && (duration <= 660) && sum_volume_trade_value >= 40) {
                                        bonds_arr.push([shortname_1, yield_to_mat_value, purchase, secid, lotvalue, sum_volume_trade_value, duration, matdate]);
                                    }
                                    break;
                                case 3:
                                    if ((listlevel <= 3) && (duration <= 1000) && (0 <= duration)) {
                                        bonds_arr.push([shortname_1, yield_to_mat_value, purchase, secid, lotvalue, sum_volume_trade_value, duration, matdate]);
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            
            bonds_arr.sort((a, b) => b[1] - a[1]);

            for (var i = 0; i < 20; i++) {
                const bond = document.createElement('div');
                bond.classList.add('bond');
                bond.innerHTML = `
                    <div class="bonds__block-bond-data">
                        <div class="bonds__block-bond-name">
                            <p class="bonds__block-bond-name_value">${bonds_arr[i][0]}</p>
                        </div>
                        <div class="bonds__block-bond-profit">
                            <p class="bonds__block-bond_header">Доходность до погашения</p>
                            <p class="bonds__block-bond-profit_value">${bonds_arr[i][1].toFixed(1)} %</p>
                        </div>
                        <div class="bonds__block-col_adaptive">
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Дата погашения</p>
                                <p class="bonds__block-bond-other_value">${dateNormalizer(bonds_arr[i][7])}</p>
                            </div>
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Цена за облигацию </p>
                                <p class="bonds__block-bond-other_value">${Math.round(bonds_arr[i][2])} ₽</p>
                            </div>
                        </div>
                    </div>
                    <div class="bonds__block-bond-extra-data">
                        <div class="bonds__block-bond-id">
                            <p class="bonds__block-bond_header">ID облигации</p>
                            <p class="bonds__block-bond-name_value">${bonds_arr[i][3]}</p>
                        </div>
                        <div class="bonds__block-col_adaptive">
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Номинал</p>
                                <p class="bonds__block-bond-other_value">${bonds_arr[i][4]} ₽</p>
                            </div>
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Сделок за 30 дней</p>
                                <p class="bonds__block-bond-other_value">${bonds_arr[i][5]}</p>
                            </div>
                        </div>
                        <div class="bonds__block-col_adaptive">
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Средний годовой доход</p>
                                <p class="bonds__block-bond-other_value">${Math.round((bonds_arr[i][1] * bonds_arr[i][2])/100)} ₽</p>
                            </div>
                            <div class="bonds__block-bond-other">
                                <p class="bonds__block-bond_header">Дюрация, дней</p>
                                <p class="bonds__block-bond-other_value">${bonds_arr[i][6]}</p>
                            </div>
                        </div>
                    </div> 
                    <div class="stockbroker-price">
                        <span class="stockbroker-price_label">Доходность к погашению у вашего брокера</span>
                        <div class="stockbroker-price_price">
                            <p class="stockbroker-price_price-header">Введите цену облигации</p>
                            <input type="text" class="stockbroker-price_price-input" name="stockbroker-price">
                                <label class="stockbroker-price_price-input-label" for="stockbroker-price">₽</label>
                            </input>
                        </div>
                        <div class="stockbroker-price_profit">
                            <p class="stockbroker-price_price-header">Доходность к погашению</p>
                            <p class="stockbroker-price_profit-value">150 %</p>
                        </div>
                    </div>
                    `;

                    bondsWrapper.append(bond);
            }

            
            // анимация при наведении мыши
            const bonds = document.querySelectorAll('.bond');

            bonds.forEach(item => {
                item.style.height = `${item.clientHeight - item.lastElementChild.clientHeight - 47}px`;
                item.addEventListener('mouseenter', (e) => {
                    if (e.target.classList.contains('bond')) {
                        e.target.style.height = ``;
                    }
                });
                
                item.addEventListener('mouseleave', (e) => {
                    const currentItem = e.target;
                    currentItem.style.height = `${currentItem.clientHeight - currentItem.lastElementChild.clientHeight - 47}px`
                });
                
            });
            
           
        });
    };

    const dateNormalizer = (date) => {
        const newDate = new Date(date);

        const setZero = (dateParam) => {
            let updateDate = '';
            if (dateParam < 10) {
                updateDate = '0'+ dateParam;
            } else {
                updateDate = dateParam;
            }
            return updateDate;
        }
        return `${setZero(newDate.getDate())}-${setZero(newDate.getMonth() + 1)}-${setZero(newDate.getFullYear())}`;
    }

    // btns risk selector

    //document.addEventListener('DOMContentLoaded', getData(2));

    let switchCaseNum = 2;

    btnsRisk.forEach(item => {
        item.addEventListener('click', e => {
            switchCaseNum = +e.target.value
            getData(switchCaseNum);
        });
    });

    // btns year selector

    let year = 2024;

    btnMinus.addEventListener('click', () => {
        if (year <= 2020) {
            btnMinus.classList.add('disable');
        } else {
            year--;
            yearCurrent.textContent = year;
            getData(switchCaseNum);
        }
    });


    btnPlus.addEventListener('click', () => {
        btnMinus.classList.remove('disable');
        year++;
        yearCurrent.textContent = year;
        getData(switchCaseNum);
    });

});
