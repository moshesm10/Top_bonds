'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const btnMinus = document.querySelector('.description__year-selector-button-wrapper_decrement-year'),
          btnPlus = document.querySelector('.description__year-selector-button-wrapper_increment-year'),
          btnsRisk = document.querySelectorAll('.description__risk-selector-button'),
          yearCurrent = document.querySelector('.description__year-selector-button-wrapper_year-counter'),
          container = document.querySelector('.container'),
          bondsWrapper = document.querySelector('.bonds__block');

    let bonds_arr = [];
    // == get data from db function ==
    const getData = (caseNum) => {
        bondsWrapper.innerHTML = '';

    fetch('./json.php')
        .then(response => response.json())
        .then(json => {
            bonds_arr = [];
            const numOfBonds = json.length;

            for (let i = 0; i < numOfBonds; i++) {
                const secId = json[i].SECID,
                      shortName = json[i].SHORTNAME,
                      matDate = json[i].MATDATE,
                      lotvalue = +json[i].LOTVALUE,
                      duration = +json[i].DURATION,
                      listlevel = +json[i].LISTLEVEL,
                      accruedint = +json[i].ACCRUEDINT,
                      coupons_sum_value = +json[i].COUPONS_SUM,
                      sum_volume_trade_value = +json[i].SUM_VOLUME_TRADE,
                      purchase = +json[i].PURCHASE,
                      yield_to_mat_value = +json[i].YIELD_TO_MAT;
                
                // == sort by selected year ==
                if (Date.parse(matDate) <= Date.parse(`${yearCurrent.textContent}-12-31`)) {
                    
                    switch (caseNum) {
                        case 1:
                            if ((listlevel == 1) && (100 <= duration <= 330) && sum_volume_trade_value >= 100) {
                                bonds_arr.push([shortName, yield_to_mat_value, purchase, secId, lotvalue, sum_volume_trade_value, duration, matDate, coupons_sum_value, accruedint]);
                            }
                            break;
                        case 2:
                            if ((listlevel <= 2) && (duration <= 660) && sum_volume_trade_value >= 40) {
                                bonds_arr.push([shortName, yield_to_mat_value, purchase, secId, lotvalue, sum_volume_trade_value, duration, matDate, coupons_sum_value, accruedint]);
                            }
                            break;
                        case 3:
                            if ((listlevel <= 3) && (duration <= 1000) && (0 <= duration)) {
                                bonds_arr.push([shortName, yield_to_mat_value, purchase, secId, lotvalue, sum_volume_trade_value, duration, matDate, coupons_sum_value, accruedint]);
                            }
                            break;
                    }
                }
            }
            
            // == sort data by yield_to_mat_value ==
            bonds_arr.sort((a, b) => b[1] - a[1]);

            if (bonds_arr[0]) {
                for (let i = 0; i < 20; i++) {
                    const bond = document.createElement('div');
                    bond.classList.add('wrapper-bond');
                    bond.innerHTML = `
                        <div class="bond">
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
                        </div>
                        <div class="stockbroker-price">
                            <span class="stockbroker-price_label">Доходность к погашению у вашего брокера</span>
                            <div class="stockbroker-price_price">
                                <p class="stockbroker-price_price-header">Введите цену облигации</p>
                                <input type="text" data-lotvalue="${bonds_arr[i][4]}" data-coupons="${bonds_arr[i][8] - bonds_arr[i][9]}" data-delta="${((Date.parse(bonds_arr[i][7]) - new Date()) / (1000 * 3600 * 24))}" class="stockbroker-price_price-input" name="stockbroker-price" oninput="this.nextElementSibling.nextSibling.parentNode.nextElementSibling.lastElementChild.innerText = (((+this.dataset.lotvalue - +this.value + +this.dataset.coupons) / +this.value) * (365 / +this.dataset.delta * 100)).toFixed(1) + ' %'"> 
                                    <label class="stockbroker-price_price-input-label" for="stockbroker-price">₽</label>
                                </input>
                            </div>
                            <div class="stockbroker-price_profit">
                                <p class="stockbroker-price_price-header">Доходность к погашению</p>
                                <p class="stockbroker-price_profit-value">0 %</p>
                            </div>
                        </div>
                    `;
                    bondsWrapper.append(bond);
                };
            }
            // == result render ==
            

            // mouse event animation
            const bonds = document.querySelectorAll('.wrapper-bond');
            bonds.forEach(item => {
                item.lastElementChild.style.marginTop = `-${item.lastElementChild.clientHeight + 15}px`;

                item.addEventListener('mouseenter', (e) => {
                        e.target.lastElementChild.style.transition = `0.5s`;
                        e.target.lastElementChild.style.marginTop = `0`;
                });
                item.addEventListener('mouseleave', (e) => {
                    e.target.lastElementChild.style.marginTop = `-${e.target.lastElementChild.clientHeight + 15}px`;
                });
            });
        });
    }; // getData

    // == first load init ==
    getData(2);

    // == date normalizer function ==
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
    };

    // == risk selector buttons ==
    let switchCaseNum = 2;
    btnsRisk.forEach(item => {
        item.addEventListener('click', e => {
            switchCaseNum = +e.target.value;
            getData(+e.target.value);
        });
    });

    // == year selector buttons ==
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

    // == popup ==
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

});
