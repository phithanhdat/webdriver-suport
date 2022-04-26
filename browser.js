require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
const { Builder, By, Key, until } = require('selenium-webdriver');
const stubFields = require('./stubFields.json');

const screen = {
  width: 640,
  height: 480
};


const baseUrl = process.env.STG ? 'https://staging.edualpha.jp' : 'http://localhost:3000';
const builder = new Builder().forBrowser('chrome');
const instances = [];

async function doLogin(role, uname, upass) {
  const fields = stubFields[role];
  const browser = await builder
    // .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .build();
  await browser.manage().window().setRect({ width: 1200, height: 900 });
  instances.push(browser);

  await browser.get(baseUrl + '/jp/login');
  console.log('[INFO]', `[${role}/${uname}]`, 'visited website');

  const loginBtn = await browser.findElement(By.className(fields.loginBtn));
  await loginBtn.click();
  console.log('[INFO]', `[${role}/${uname}]`, 'logging in');

  const unameField = await browser.findElement(By.id(fields.uname));
  const upassField = await browser.findElement(By.id(fields.upass));

  await unameField.sendKeys(uname);
  await upassField.sendKeys(upass, Key.ENTER);

  await browser.wait(
    until.elementLocated(By.className('box-calendar')),
    120 * 1000
  );

  console.log('[INFO]', `[${role}/${uname}]`, 'logged in');
  if (process.env.BOARD) {
    await browser.get(baseUrl + process.env.BOARD);
  }

  console.log('[INFO]', `[${role}/${uname}]`, 'visited');
}

if (process.env.STG) {
  doLogin('student', 'UC29DDB76', 'nrcCLA49');
  doLogin('student', 'UC297LT77', 'gxsVKE37');
  doLogin('teacher', 'van1@grr.la', 'xslKUV53');
} else {
  doLogin('teacher', '1801gv@gmail.com', 'masYGB39');
  doLogin('student', 'UC328YYR2002', 'kuyR2S78');
}

process.stdin.resume();//so the program will not close instantly

async function exitHandler(options, _exitCode) {
  if (options.cleanup) {
    await Promise.all(instances.map(instance => instance.quit()));
  }

  if (options.exit) {
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

