

@Test
public void loginTest() {

driver.get("https://www.saucedemo.com");

driver.findElement(By.id("user-name"))
.sendKeys("standard_user");

driver.findElement(By.id("password"))
.sendKeys("secret_sauce");

driver.findElement(By.id("login-button")).click();

Assert.assertTrue(driver.getCurrentUrl().contains("inventory"));

}