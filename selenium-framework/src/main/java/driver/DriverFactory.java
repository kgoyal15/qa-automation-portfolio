package driver;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;

public class DriverFactory {

    public static WebDriver createDriver(String browser) {
        if (browser.equalsIgnoreCase("chrome")) {
            WebDriverManager.chromedriver().setup();
            return new ChromeDriver(new ChromeOptions());
        }

        if (browser.equalsIgnoreCase("firefox")) {
            WebDriverManager.firefoxdriver().setup();
            return new FirefoxDriver(new FirefoxOptions());
        }

        throw new IllegalArgumentException("Unsupported browser: " + browser);
    }

    public static WebDriver createRemoteDriver(String browser) throws MalformedURLException {
        String gridHost = System.getProperty("grid.url", "http://localhost:4444");
        URL gridUrl = URI.create(gridHost).toURL();
        Exception lastException = null;

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                if (browser.equalsIgnoreCase("chrome")) {
                    return new RemoteWebDriver(gridUrl, new ChromeOptions());
                }
                if (browser.equalsIgnoreCase("firefox")) {
                    return new RemoteWebDriver(gridUrl, new FirefoxOptions());
                }
                throw new IllegalArgumentException("Unsupported browser: " + browser);
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                lastException = e;
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        }
        throw new RuntimeException("Failed to create remote driver after 3 attempts", lastException);
    }
}
