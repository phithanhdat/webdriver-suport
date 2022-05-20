const { By, WebDriver } = require('selenium-webdriver');

/**
 * 
 * @param {string} date 
 * @param {WebDriver} browser 
 */
async function topCalendarGotoDate (date, browser) {
  const dateEl = await browser.findElement(By.xpath(`//td[@title='${date}']/div/button`));
  await dateEl.click();
  console.log('[INFO]: go to time-table OK');
}

/**
 * 
 * @param {WebDriver} browser 
 */
async function goToCalendar(browser) {
  const calendarBtnEl = await browser.findElement(By.xpath(`//div[@class='item subTitle'][1]`));
  await calendarBtnEl.click();
  console.log('[INFO]: go to calendar OK');
}

/**
 * 
 * @param {WebDriver} browser 
 * @param {number} num 
 */
async function goToLessonTop(browser, num = 0) {
  const lesonBtnEl = await browser.findElements(By.xpath(`//button[contains(@class, 'have-data')]`));
  console.log('[INFO]: lessonBtnEl:', lesonBtnEl);
  await lesonBtnEl[num].click();
  console.log('[INFO]: top lesson-top OK');
}

module.exports = {
  topCalendarGotoDate,
  goToCalendar,
  goToLessonTop
}