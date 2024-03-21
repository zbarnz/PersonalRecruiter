//import {shortWait} from '../../lib/utils/waits'

//These functions are unused but can be modified to sign into the indeed page for
//the user. Not sure why im keeping these around but it is what it is.


/*
async function indeedSignInManual(existingPage: Page): Promise<Cookie[]> {
  const page = existingPage;

  const url = `https://secure.indeed.com/auth`;
  await page.goto(url);

  await page.waitForURL("https://secure.indeed.com/settings/account", {
    timeout: 600000,
  });
  return await page.context().cookies();
}

async function indeedSignIn(
  email: string,
  password: string,
  existingPage: Page
): Promise<Cookie[]> {
  const page = existingPage;

  const url = `https://secure.indeed.com/auth`;
  await page.goto(url);

  const emailInput = page.locator('input[type="email"][name="__email"]');
  const submitButton = page.locator('button[type="submit"]');

  await shortWait(page);

  await emailInput.fill(email);

  await shortWait(page);

  await submitButton.click();

  await shortWait(page);

  if (page.url() === "https://secure.indeed.com/settings/account") {
    return await page.context().cookies();
  }

  const passwordInput = page.locator('input[name="__password"]');
  const signInButton = page.locator(
    'button[data-tn-element="auth-page-sign-in-password-form-submit-button"]'
  );

  await passwordInput.click();
  await passwordInput.fill(password);

  await shortWait(page);
  await signInButton.click();

  await page.waitForURL("https://secure.indeed.com/settings/account");
  return await page.context().cookies();
}
*/