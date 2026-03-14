package tests;

import driver.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.net.MalformedURLException;

public class BaseTest {

    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp(ITestContext context) throws MalformedURLException {
        String browser = context.getCurrentXmlTest().getParameter("browser");
        //System.out.println(">>> setUp called, browser=" + browser + ", thread=" + Thread.currentThread().getName());
        driver = DriverFactory.createRemoteDriver(browser);
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

    protected WebDriver getDriver() {
        return driver;
    }
}
