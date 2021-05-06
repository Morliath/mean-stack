const puppeteer = require('puppeteer')
const sessionFactory = require('./sessionFactory')

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({ headless: false})

        const page = await browser.newPage()
        const customPage = new CustomPage(page)

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] ||  page[property]
            }
        })
    }

    constructor(page){
        this.page = page;
    }

    async login() {
        const email = 'valmorion@gmail.com';
        const userMongoId = '5ef4d98580685c78fb5df53d';

        await sessionFactory.login(email, userMongoId, this.page)

        await this.page.goto('localhost:4201/', {waitUntil: 'load'});

        return email
    }

    async getContentsOf(selector){
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = CustomPage