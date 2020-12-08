'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const btnMinus = document.querySelector('.description__year-selector-button-wrapper_decrement-year'),
          btnPlus = document.querySelector('.description__year-selector-button-wrapper_increment-year'),
          btnsRisk = document.querySelectorAll('.description__risk-selector-button'),
          yearCurrent = document.querySelector('.description__year-selector-button-wrapper_year-counter'),
          container = document.querySelector('.container'),
          bondsWrapper = document.querySelector('.bonds__block');

    // == get data from db function ==
    const getData = (caseNum) => {
        bondsWrapper.innerHTML = '';

    fetch('./json.php')
        .then(response => response.json())
        .then(json => {
            let bonds_arr = [];
            const numOfBonds = json.length;

            for (let i = 0; i < numOfBonds; i++) {
                const secId = json[i].SECID,
                      shortName = json[i].SHORTNAME,
                      matDate = json[i].MATDATE,
                      lotValue = +json[i].LOTVALUE,
                      duration = +json[i].DURATION,
                      listLevel = +json[i].LISTLEVEL,
                      accruedint = +json[i].ACCRUEDINT,
                      couponsSumValue = +json[i].COUPONS_SUM,
                      sumVolumeTradeValue = +json[i].SUM_VOLUME_TRADE,
                      purchase = +json[i].PURCHASE,
                      yieldToMatValue = +json[i].YIELD_TO_MAT;
                
                // == sort by selected year ==
                if (Date.parse(matDate) <= Date.parse(`${yearCurrent.textContent}-12-31`)) {
                    
                    switch (caseNum) {
                        case 1:
                            if ((listLevel == 1) && (100 <= duration <= 330) && sumVolumeTradeValue >= 100) {
                                bonds_arr.push(
                                    {
                                        shortName: shortName,
                                        yieldToMatValue: yieldToMatValue,
                                        purchase: purchase,
                                        secId: secId,
                                        lotValue: lotValue,
                                        sumVolumeTradeValue: sumVolumeTradeValue,
                                        duration: duration,
                                        matDate: matDate,
                                        couponsSumValue: couponsSumValue,
                                        accruedint: accruedint
                                    }
                                );
                            }
                            break;
                        case 2:
                            if ((listLevel <= 2) && (duration <= 660) && sumVolumeTradeValue >= 40) {
                                bonds_arr.push(
                                    {
                                        shortName: shortName,
                                        yieldToMatValue: yieldToMatValue,
                                        purchase: purchase,
                                        secId: secId,
                                        lotValue: lotValue,
                                        sumVolumeTradeValue: sumVolumeTradeValue,
                                        duration: duration,
                                        matDate: matDate,
                                        couponsSumValue: couponsSumValue,
                                        accruedint: accruedint
                                    }
                                );
                            }
                            break;
                        case 3:
                            if ((listLevel <= 3) && (0 <= duration <= 1000)) {
                                bonds_arr.push(
                                    {
                                        shortName: shortName,
                                        yieldToMatValue: yieldToMatValue,
                                        purchase: purchase,
                                        secId: secId,
                                        lotValue: lotValue,
                                        sumVolumeTradeValue: sumVolumeTradeValue,
                                        duration: duration,
                                        matDate: matDate,
                                        couponsSumValue: couponsSumValue,
                                        accruedint: accruedint
                                    }
                                );
                            }
                            break;
                    }
                }
            }
            
            // == sort data by yieldToMatValue ==
            bonds_arr.sort((a, b) => b.yieldToMatValue - a.yieldToMatValue);

            // == render ==
            if (bonds_arr[0]) {
                let counter = 20;
                if (bonds_arr.length < 20) {
                    counter = bonds_arr.length;
                }
                for (let i = 0; i < counter; i++) {
                    const bond = document.createElement('div');
                    bond.classList.add('wrapper-bond');
                    bond.innerHTML = `
                        <div class="bond">
                            <div class="bonds__block-bond-data">
                                <div class="bonds__block-bond-name">
                                    <p class="bonds__block-bond-name_value">${bonds_arr[i].shortName}</p>
                                </div>
                                <div class="bonds__block-bond-profit">
                                    <p class="bonds__block-bond_header">Доходность до погашения</p>
                                    <p class="bonds__block-bond-profit_value">${Math.round((bonds_arr[i].yieldToMatValue) * 10) / 10} %</p>
                                </div>
                                <div class="bonds__block-col_adaptive">
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Дата погашения</p>
                                        <p class="bonds__block-bond-other_value">${dateNormalizer(bonds_arr[i].matDate)}</p>
                                    </div>
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Цена за облигацию </p>
                                        <p class="bonds__block-bond-other_value">${Math.round(bonds_arr[i].purchase)} ₽</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bonds__block-bond-extra-data">
                                <div class="bonds__block-bond-id">
                                    <p class="bonds__block-bond_header">ID облигации</p>
                                    <p class="bonds__block-bond-name_value">${bonds_arr[i].secId}</p>
                                </div>
                                <div class="bonds__block-col_adaptive">
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Номинал</p>
                                        <p class="bonds__block-bond-other_value">${bonds_arr[i].lotValue} ₽</p>
                                    </div>
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Сделок за 30 дней</p>
                                        <p class="bonds__block-bond-other_value">${bonds_arr[i].sumVolumeTradeValue}</p>
                                    </div>
                                </div>
                                <div class="bonds__block-col_adaptive">
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Средний годовой доход</p>
                                        <p class="bonds__block-bond-other_value">${Math.round((bonds_arr[i].yieldToMatValue * bonds_arr[i].purchase)/100)} ₽</p>
                                    </div>
                                    <div class="bonds__block-bond-other">
                                        <p class="bonds__block-bond_header">Дюрация, дней</p>
                                        <p class="bonds__block-bond-other_value">${bonds_arr[i].duration}</p>
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="stockbroker-price">
                            <span class="stockbroker-price_label">Доходность к погашению у вашего брокера</span>
                            <div class="stockbroker-price_wrapper">
                                <div class="stockbroker-price_price">
                                    <p class="stockbroker-price_price-header">Введите цену облигации</p>
                                    <input type="text" data-lotvalue="${bonds_arr[i].lotValue}" data-coupons="${bonds_arr[i].couponsSumValue - bonds_arr[i].accruedint}" data-delta="${((Date.parse(bonds_arr[i].matDate) - new Date()) / (1000 * 3600 * 24))}" class="stockbroker-price_price-input" name="stockbroker-price" placeholder="0 ₽"/>
                                </div>
                                <div class="stockbroker-price_profit">
                                    <p class="stockbroker-price_price-header">Доходность к погашению</p>
                                    <p class="stockbroker-price_profit-value">0 %</p>
                                </div>
                            </div>
                        </div>
                    `;
                    bondsWrapper.append(bond);
                };
            };
            // == /render == 
            
            // == stockbroker-price input logic==
            const priceInputs = document.querySelectorAll('.stockbroker-price_price-input');
            priceInputs.forEach(item => {
                item.addEventListener('input', () => {
                    const targetProfitValue = item.parentElement.parentElement.lastElementChild.lastElementChild;
                    item.value = item.value.replace(/\D/, '');
                    if (item.value) {
                        targetProfitValue.innerText = (((+item.dataset.lotvalue - +item.value + +item.dataset.coupons) / +item.value) * (365 / +item.dataset.delta * 100)).toFixed(1) + ' %';
                    }
                });
            });

            // == mouse and touch event animation ==
            const bonds = document.querySelectorAll('.wrapper-bond');

            const eventAnimationStyleStart = (element) => {
                element.lastElementChild.style.transition = `0.5s`;
                element.lastElementChild.style.marginTop = `0`;
            };
            const eventAnimationStyleEnd = (element) => {
                element.lastElementChild.style.marginTop = `-${element.lastElementChild.clientHeight + 15}px`;
            };

            bonds.forEach(item => {
                eventAnimationStyleEnd(item);

                // mouse event
                item.addEventListener('mouseenter', () => eventAnimationStyleStart(item));
                item.addEventListener('mouseleave', () => eventAnimationStyleEnd(item));

                // touch event
                item.addEventListener('touchstart', () => {
                    bonds.forEach(item => {
                        eventAnimationStyleEnd(item)
                    });
                    eventAnimationStyleStart(item)
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
        item.addEventListener('click', (e) => {
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
