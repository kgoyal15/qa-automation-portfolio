package tests;

import io.qameta.allure.*;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.ByteArrayInputStream;

@Feature("Login")
public class LoginTest extends BaseTest {

    @Test(groups = {"smoke", "regression"})
    @Story("Successful login")
    @Description("Verify standard user can log in and lands on inventory page")
    @Severity(SeverityLevel.CRITICAL)
    public void successfulLoginTest() {
        openLoginPage();
        enterCredentials("standard_user", "secret_sauce");
        clickLoginButton();

        Assert.assertTrue(getDriver().getCurrentUrl().contains("inventory"), "URL should contain 'inventory'");

        WebElement header = getDriver().findElement(By.className("app_logo"));
        Assert.assertTrue(header.isDisplayed(), "App logo should be visible");
        Assert.assertEquals(header.getText(), "Swag Labs", "Header text should be 'Swag Labs'");

        takeScreenshot("After successful login");
    }

    @Test(groups = {"regression"})
    @Story("Failed login")
    @Description("Verify error message shown for invalid credentials")
    @Severity(SeverityLevel.NORMAL)
    public void failedLoginTest() {
        openLoginPage();
        enterCredentials("invalid_user", "wrong_password");
        clickLoginButton();

        WebElement errorMessage = getDriver().findElement(By.cssSelector("[data-test='error']"));
        Assert.assertTrue(errorMessage.isDisplayed(), "Error message should be visible");
        Assert.assertTrue(errorMessage.getText().contains("Username and password do not match"),
                "Error should indicate invalid credentials");

        takeScreenshot("Failed login error message");
    }

    @Test(groups = {"regression"})
    @Story("Locked user login")
    @Description("Verify locked out user sees appropriate error message")
    @Severity(SeverityLevel.NORMAL)
    public void lockedUserLoginTest() {
        openLoginPage();
        enterCredentials("locked_out_user", "secret_sauce");
        clickLoginButton();

        WebElement errorMessage = getDriver().findElement(By.cssSelector("[data-test='error']"));
        Assert.assertTrue(errorMessage.isDisplayed(), "Error message should be visible");
        Assert.assertTrue(errorMessage.getText().contains("locked out"),
                "Error should indicate user is locked out");

        takeScreenshot("Locked user error message");
    }

    // -------------------------------------------------------------------------
    // @DataProvider supplies multiple rows of test data.
    // The test runs once per row — here it runs 3 times with different users.
    // -------------------------------------------------------------------------
    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentialsData() {
        return new Object[][] {
            {"invalid_user",   "wrong_password", "Username and password do not match"},
            {"",               "secret_sauce",   "Username is required"},
            {"standard_user",  "",               "Password is required"},
        };
    }

    @Test(groups = {"regression"}, dataProvider = "invalidCredentials")
    @Story("Failed login")
    @Description("Verify correct error messages for various invalid credential combinations")
    @Severity(SeverityLevel.NORMAL)
    public void invalidCredentialsTest(String username, String password, String expectedError) {
        openLoginPage();
        enterCredentials(username, password);
        clickLoginButton();

        WebElement errorMessage = getDriver().findElement(By.cssSelector("[data-test='error']"));
        Assert.assertTrue(errorMessage.isDisplayed(), "Error message should be visible");
        Assert.assertTrue(errorMessage.getText().contains(expectedError),
                "Error should contain: " + expectedError);

        takeScreenshot("Invalid credentials: " + username);
    }

    @Step("Open login page")
    private void openLoginPage() {
        getDriver().get("https://www.saucedemo.com");
    }

    @Step("Enter credentials: username={username}")
    private void enterCredentials(String username, String password) {
        getDriver().findElement(By.id("user-name")).sendKeys(username);
        getDriver().findElement(By.id("password")).sendKeys(password);
    }

    @Step("Click login button")
    private void clickLoginButton() {
        getDriver().findElement(By.id("login-button")).click();
    }

    @Step("Take screenshot: {name}")
    private void takeScreenshot(String name) {
        Allure.addAttachment(name, new ByteArrayInputStream(
                ((TakesScreenshot) getDriver()).getScreenshotAs(OutputType.BYTES)));
    }
}
