// ==UserScript==
// @name         BUMP Autoclicker
// @version      1.1
// @author       mudachyo
// @match        *://mmbump.pro/*
// @run-at       document-start
// @icon         https://sun9-16.userapi.com/impg/g93WJxPJtCopVIAqWbzvaGWbkn-LaY-pEyCh1Q/Jvut2jMz7Rc.jpg?size=640x640&quality=95&sign=2f4460fee947b101894f4c274a599bff&c_uniq_tag=hQ43e9wzpBH6S4E0mWytfXtp5gde33mgCvmnGLVj-rI&type=album
// @grant        none
// @downloadURL  https://github.com/mudachyo/BUMP/raw/main/BUMP-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/BUMP/raw/main/BUMP-autoclicker.user.js
// @homepage     https://github.com/mudachyo/BUMP
// ==/UserScript==

(function () {
    'use strict';

    // Настройки задержек между кликами
    const minDelay = 40; // минимальная задержка в миллисекундах
    const maxDelay = 130; // максимальная задержка в миллисекундах
    const startDelay = 5000; // задержка перед началом работы скрипта в миллисекундах

    // Стили для логов
    const styles = {
        success: 'background: #28a745; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        starting: 'background: #8640ff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        error: 'background: #dc3545; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
        info: 'background: #007bff; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    };

    const logPrefix = '%c[BUMPBot] ';
    const originalLog = console.log;
    console.log = function () {
        if (typeof arguments[0] === 'string' && arguments[0].includes('[BUMPBot]')) {
            originalLog.apply(console, arguments);
        }
    };

    // Скрываем все сообщения об ошибках и предупреждениях
    console.error = console.warn = console.info = console.debug = () => { };

    // Логи запуска
    console.clear();
    console.log(`${logPrefix}Starting`, styles.starting);
    console.log(`${logPrefix}Created by https://t.me/shopalenka`, styles.starting);
    console.log(`${logPrefix}Github https://github.com/mudachyo/BUMP`, styles.starting);

    // Функция для генерации случайных координат внутри элемента
    function getRandomCoordinates(element) {
        const rect = element.getBoundingClientRect();
        const x = Math.random() * rect.width + rect.left;
        const y = Math.random() * rect.height + rect.top;
        return { x, y };
    }

    // Функция для генерации событий клика
    function triggerEvents(element, x, y) {
        const events = ['pointerdown', 'mousedown', 'touchstart', 'pointerup', 'mouseup', 'touchend', 'click'];

        events.forEach(eventType => {
            let event;
            if (eventType.startsWith('pointer') || eventType.startsWith('mouse')) {
                event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y,
                });
            } else if (eventType.startsWith('touch')) {
                event = new TouchEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    touches: [new Touch({
                        identifier: Date.now(),
                        target: element,
                        clientX: x,
                        clientY: y,
                        radiusX: 2.5,
                        radiusY: 2.5,
                        rotationAngle: 10,
                        force: 0.5,
                    })],
                });
            }
            if (event) {
                element.dispatchEvent(event);
            }
        });
    }

    // Функция автоклика
    function autoClick() {
        try {
            const element = document.querySelector('#root > div.styled__MainContainer-sc-dmv8vl-0.fuBJHP > div.styled__Page-sc-18eupc9-0.crlOkF > div.styled__Wrapper-sc-1lbly2t-0.kArHQu > div > div.styled__ScaleWrap-sc-1lbly2t-5.iRLOdy > div.styled__Content-sc-1lbly2t-6.iidaUe');
            if (element) {
                const { x, y } = getRandomCoordinates(element);
                triggerEvents(element, x, y);
                console.log(`${logPrefix}Click executed`, styles.success);
            } else {
                console.log(`${logPrefix}Element not found. Retrying...`, styles.error);
            }
        } catch (error) {
            console.error(`${logPrefix}Error:`, styles.error, error);
        } finally {
            // Устанавливаем следующий запуск с рандомной задержкой
            setTimeout(autoClick, Math.random() * (maxDelay - minDelay) + minDelay);
        }
    }

    // Запуск автоклика с задержкой
    setTimeout(() => {
        console.log(`${logPrefix}Starting auto-clicker...`, styles.info);
        autoClick();
    }, startDelay);

})();