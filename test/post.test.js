const Page = require('./utils/CustomPage')

let page;

beforeEach(async () => {
    page = await Page.build()
    await page.goto('localhost:4201/', { waitUntil: 'load' });
})

afterEach(async () => {
    await page.close();
})

describe('When logged in', () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.mat-button')
    })

    test('can see new post form', async () => {
        const text = await page.url()
        expect(text).toEqual('http://localhost:4201/create')
    })

    describe('And using invalid inputs', () => {
        beforeEach(async () => {
            await page.click('button.mat-primary')
        })

        test('form shows error message', async () => {
            const text = await page.getContentsOf('.mat-error');
            expect(text.trim()).toEqual('Please enter a text')
        })
    })
})