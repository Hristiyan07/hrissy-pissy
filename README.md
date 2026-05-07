**КУРСОВА РАБОТА**

на тема:

**Създаване на уеб сайт за онлайн магазин с Python Flask и PostgreSQL база данни**

Представено от: Християн, Мартин и Пресиян

Дата: 06.05.2026

## **1\. УВОД**

Настоящата курсова работа представя разработката на пълноценно уеб приложение \- онлайн магазин за кафе под името Hrissy-Pissy. Проектът включва изграждане на многостранична уеб система с функционалности за регистрация и вход на потребители, пазарска количка и каталог с продукти.

За реализацията е използван Python Flask като сървърна рамка (backend), PostgreSQL като релационна база данни, и стандартни уеб технологии (HTML, CSS, JavaScript) за потребителския интерфейс (frontend). Приложението е деплойнато в облака чрез платформата Railway.

## **2\. ЦЕЛ И ЗАДАЧИ**

Целта на проекта е да се изгради функционален уеб магазин с реална база данни, автентикация на потребители и публично достъпен хостинг.

Задачи:

* Проектиране и реализация на потребителски интерфейс с множество страници

* Изграждане на Python Flask backend с REST API endpoints

* Свързване с PostgreSQL база данни за управление на потребители

* Реализация на система за регистрация и вход с криптирани пароли

* Управление на пазарска количка чрез localStorage

* Деплойване на приложението в облака чрез Railway

* Настройка на GitHub хранилище за версионен контрол

## **3\. ТЕОРЕТИЧНА ЧАСТ**

Python Flask е лека уеб рамка (microframework), която позволява бързо изграждане на уеб приложения и REST API-та. Flask не налага специфична архитектура, което го прави гъвкав инструмент за разработка.

PostgreSQL е мощна обектно-релационна база данни с отворен код. Поддържа сложни заявки, транзакции и има отлична интеграция с Python чрез библиотеката psycopg2.

bcrypt е библиотека за криптиране на пароли. При регистрация паролата се хешира и се съхранява хешът \- по този начин дори при изтичане на базата данни, паролите остават защитени.

Railway е облачна платформа за хостинг на уеб приложения. Поддържа директно деплойване от GitHub хранилище и автоматично управление на PostgreSQL бази данни.

GitHub е платформа за версионен контрол, която позволява съвместна работа между разработчици и проследяване на промените в кода.

## **4\. АНАЛИЗ И ПРОЕКТИРАНЕ**

Уеб приложението Hrissy-Pissy се състои от следните модули:

* Начална страница (/) \- представя магазина и показва избрани продукти

* Магазин (/menu) \- показва всички продукти с търсене в реално време

* Страница на продукт (/product) \- детайлна информация за избран продукт

* Количка (/cart) \- управление на избраните продукти с изчисляване на обща сума

* За нас (/about) \- история и мисия на компанията

* Локации (/service) \- информация за физическите магазини

Системата за автентикация включва регистрация с потребителско име, имейл и парола, вход с проверка на хешираната парола и сесийно управление чрез Flask session.

## **5\. РЕАЛИЗАЦИЯ**

Използвани технологии:

* HTML5 \- структура на страниците

* CSS3 \- дизайн и адаптивно оформление

* JavaScript (Vanilla) \- интерактивност и API заявки

* Python 3.11 \+ Flask \- сървърна логика и REST API

* psycopg2 \- Python драйвер за PostgreSQL

* bcrypt \- криптиране на пароли

* PostgreSQL \- релационна база данни

* Gunicorn \- production WSGI сървър

* Railway \- облачна хостинг платформа

* GitHub \- версионен контрол

## **6\. БАЗА ДАННИ (POSTGRESQL СТРУКТУРА)**

Базата данни съдържа таблица Users със следните полета:

* userID \- SERIAL PRIMARY KEY (автоматично генериран идентификатор)

* username \- VARCHAR(100) NOT NULL UNIQUE (потребителско име)

* email \- VARCHAR(255) NOT NULL UNIQUE (имейл адрес)

* password\_hash \- VARCHAR(255) NOT NULL (bcrypt хеш на паролата)

* created\_at \- TIMESTAMP DEFAULT CURRENT\_TIMESTAMP (дата на регистрация)

SQL за създаване на таблицата:

CREATE TABLE Users (

    userID SERIAL PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,

    email VARCHAR(255) NOT NULL UNIQUE,

    password\_hash VARCHAR(255) NOT NULL,

    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP

);

## **7\. ПРИМЕРЕН КОД**

### **7.1 Flask Backend \- Регистрация (app.py)**

@app.route('/api/signup', methods=\['POST'\])

def signup():

    data \= request.get\_json()

    hashed \= bcrypt.hashpw(data\['password'\].encode(), bcrypt.gensalt())

    conn \= get\_db()

    cursor \= conn.cursor()

    cursor.execute(

        'INSERT INTO Users (username, email, password\_hash) VALUES (%s, %s, %s)',

        (data\['username'\], data\['email'\], hashed.decode())

    )

    conn.commit()

    return jsonify({'message': 'Account created\!'}), 201

### **7.2 Flask Backend \- Вход (app.py)**

@app.route('/api/login', methods=\['POST'\])

def login():

    data \= request.get\_json()

    cursor.execute(

        'SELECT userID, username, password\_hash FROM Users WHERE email \= %s',

        (data\['email'\],)

    )

    row \= cursor.fetchone()

    if bcrypt.checkpw(data\['password'\].encode(), row\[2\].encode()):

        session\['user\_id'\] \= row\[0\]

        session\['username'\] \= row\[1\]

        return jsonify({'username': row\[1\]}), 200

### **7.3 JavaScript \- Количка (cart.js)**

let cart \= JSON.parse(localStorage.getItem('cart')) || \[\];

function renderCart() {

    let subtotal \= 0;

    cart.forEach(item \=\> {

        subtotal \+= item.price \* item.quantity;

    });

    const shipping \= subtotal \> 0 ? 5.99 : 0;

    const tax \= subtotal \* 0.08;

    const total \= subtotal \+ shipping \+ tax;

    document.getElementById('sum-total').textContent \=

        '$' \+ total.toFixed(2);

}

## **8\. ДИАГРАМА НА СИСТЕМАТА**

Архитектурата на системата следва класическия модел клиент-сървър:

\[ Потребител (Браузър) \]

           |

  \[ HTML / CSS / JavaScript \]

           |  fetch('/api/...')

   \[ Flask REST API (Python) \]

           |

  \[ psycopg2 драйвер \]

           |

  \[ PostgreSQL (Railway Cloud) \]

           |

     \[ Таблица Users \]

При деплойване цялата система работи в облака на Railway, достъпна от всяка точка на света чрез публичен URL адрес.

## **9\. ТЕСТВАНЕ**

По време на разработката са тествани следните функционалности:

* Регистрация на нов потребител \- системата успешно записва потребителя с bcrypt хеширана парола

* Вход с валидни данни \- системата разпознава потребителя и стартира сесия

* Вход с невалидни данни \- системата връща подходящо съобщение за грешка

* Добавяне на продукт в количката \- продуктът се запазва в localStorage

* Навигация между страниците \- всички Flask routes работят коректно

* Деплойване \- приложението е достъпно на публичен URL чрез Railway

Всички тествани функционалности работят коректно в production среда.

## **10\. ЗАКЛЮЧЕНИЕ**

Разработеният проект Hrissy-Pissy демонстрира изграждането на пълноценно уеб приложение с модерен технологичен стек. Системата включва сигурна автентикация с криптирани пароли, релационна база данни, REST API архитектура и публично достъпен хостинг в облака.

Проектът може да бъде разширен с допълнителни функционалности като система за поръчки, административен панел, интеграция с платежна система и имейл нотификации при регистрация.

## **11\. ИЗТОЧНИЦИ**

* https://flask.palletsprojects.com \- официална документация на Flask

* https://www.postgresql.org \- официална документация на PostgreSQL

* https://pypi.org/project/bcrypt \- bcrypt библиотека за Python

* https://railway.app/docs \- документация на Railway

* https://github.com \- платформа за версионен контрол

* https://developer.mozilla.org \- MDN Web Docs (HTML, CSS, JavaScript)