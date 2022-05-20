
require('dotenv').config();
// require('chromedriver');
// const chrome = require('selenium-webdriver/chrome');
const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver');
const stubFields = require('./stubFields.json');

const installDriver = require('ms-chromium-edge-driver').installDriver;
// const Builder = require('selenium-webdriver').Builder;
const edge = require('selenium-webdriver/edge');
const { goToCalendar, topCalendarGotoDate, goToLessonTop } = require('./navigateFunc');
const { delay } = require('./Utils');

async function name(){
  const edgePaths = await installDriver();
const edgeOptions = new edge.Options();
console.log('edgeOptions:', edgeOptions)
// edgeOptions.setEdgeChromium(true);
edgeOptions.setBinaryPath(edgePaths.browserPath);
const builder = await new Builder()
  .forBrowser('MicrosoftEdge')
  .setEdgeOptions(edgeOptions)
  .setEdgeService(new edge.ServiceBuilder(edgePaths.driverPath))
  //.build();

const screen = {
  width: 750,
  height: 520
};


const baseUrl = process.env.DOT_ENV === 'stg' ? 'https://staging.edualpha.jp' : process.env.DOT_ENV === 'pro' ? 'https://edualpha.jp' : 'http://localhost:3000';
//const builder = new Builder().forBrowser('chrome');
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

  const page = false ? '/ja/home/lesson-top/393/' : null;
  console.log('[INFO]', `[${role}/${uname}]`, 'logged in');
  if (page) {
    // await browser.get(baseUrl + '/ja/home/top-calendar/');
    // await browser.get(baseUrl + '/ja/home/timetable/');
    await browser.get(baseUrl + page);
  }

  console.log('[INFO]', `[${role}/${uname}]`, 'visited: ', (baseUrl + page));
  return browser;
}

/**
 * 
 * @param {number} time 
 * @param {WebDriver} browser 
 */
async function testLessonTop(time, browser) {
  await goToCalendar(browser);
  await topCalendarGotoDate('2022-05-09', browser);
  for (let i = 0; i < time; i++) {
    await goToLessonTop(browser)
    const backBtn = await browser.findElement(By.className('teacher_lessontop_back_button'));
    const imageEl = await browser.findElement(By.className('image-lessontop'));
    console.log('[INFO]', `[test: ${i}] imageEl: `, typeof imageEl);
    console.log('wait me');
    await delay(100);
    console.log('Im done ['+i+']');
    await backBtn.click();
    const lessonBtnEl = await browser.findElement(By.className('timetable__week__add-btn have-data'));
    if (lessonBtnEl[0]) {
      console.log('0: ', lessonBtnEl[0]);
      await lessonBtnEl[0].click();
    }
  }
  delay(60 * 60 * 1000);
}


if (process.env.DOT_ENV === 'pro') {
  doLogin('teacher', '2504teacher03@gmail.com', 'Nagi1234');
  doLogin('student', 'UC15TND102', 'vmtMLV78');
} else
if (process.env.DOT_ENV === 'stg') {
//   doLogin('student', 'UC30V96141', 'Nagi1234');
//   doLogin('student', 'UC30PV9140', 'Nagi1234');
//   doLogin('student', 'UC30EGZ142', 'Nagi1234');
//   doLogin('teacher', 'gvosakauni1@edu.jp', 'Nagi1234');
   doLogin('student', 'UC29DDB76', 'nrcCLA49');
   doLogin('student', 'UC297LT77', 'gxsVKE37');
  doLogin('teacher', '1904gv01@gmail.com', 'edwPRQ46');
} else { // dev Local
 doLogin('teacher', '1801gv@gmail.com', 'masYGB39');
 // testLessonTop(10, br);
 const browser = await doLogin('student', 'UC3288DY9595', 'zftDNM57');
 await goToCalendar(browser);
  await topCalendarGotoDate('2022-05-16', browser);
  await goToLessonTop(browser)
  await delay(100);
  console.log('Im done ');
//  doLogin('teacher', 'datcoder@gmail.com', 'Dat12345');
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
};

name();