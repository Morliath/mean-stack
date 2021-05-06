const Page = require('./utils/CustomPage')

let page;

beforeEach( async () => {
    page = await Page.build()
    await page.goto('localhost:4201/', {waitUntil: 'load'});
})

afterEach( async () => {
    await page.close();
})

test('Header has the correct text', async () => {
    
    const text = await page.getContentsOf('#myMessages-Link');

    expect(text).toEqual('My Messages')

})

test('When signed in, shows user email', async () => {
    
    const email =  await page.login();   

    const text = await page.getContentsOf('#user-Name-Holder');
    expect(text.trim()).toEqual(email)

})