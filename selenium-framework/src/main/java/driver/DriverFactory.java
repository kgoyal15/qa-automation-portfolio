public static WebDriver createRemoteDriver(String browser)
throws MalformedURLException {

    URL gridUrl = new URL("http://localhost:4444/wd/hub");

    if(browser.equalsIgnoreCase("chrome")){

        ChromeOptions options = new ChromeOptions();
        return new RemoteWebDriver(gridUrl, options);

    }

    if(browser.equalsIgnoreCase("firefox")){

        FirefoxOptions options = new FirefoxOptions();
        return new RemoteWebDriver(gridUrl, options);

    }

    return null;
}