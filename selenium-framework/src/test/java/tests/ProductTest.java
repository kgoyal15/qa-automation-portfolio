package tests;

import io.qameta.allure.*;
import org.testng.ITestContext;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.ByteArrayInputStream;
import java.util.List;

@Feature("Products")
public class ProductTest extends BaseTest {

    @Override
    @BeforeMethod(alwaysRun = true)
    public void setUp(ITestContext context) throws java.net.MalformedURLException {
        super.setUp(context);
        login();
    }

    @Test(groups = {"smoke", "regression"})
    @Story("Product listing")
    @Description("Verify all 6 products are displayed on the inventory page")
    @Severity(SeverityLevel.CRITICAL)
    public void productsAreDisplayedTest() {
        List<WebElement> products = getDriver().findElements(By.className("inventory_item"));
        Assert.assertEquals(products.size(), 6, "Should display 6 products");
        takeScreenshot("Product listing");
    }

    @Test(groups = {"regression"})
    @Story("Product listing")
    @Description("Verify each product has a name, description, price and add-to-cart button")
    @Severity(SeverityLevel.NORMAL)
    public void productDetailsAreVisibleTest() {
        List<WebElement> names = getDriver().findElements(By.className("inventory_item_name"));
        List<WebElement> prices = getDriver().findElements(By.className("inventory_item_price"));
        List<WebElement> buttons = getDriver().findElements(By.cssSelector("button.btn_inventory"));

        Assert.assertFalse(names.isEmpty(), "Product names should be visible");
        Assert.assertEquals(names.size(), prices.size(), "Each product should have a price");
        Assert.assertEquals(names.size(), buttons.size(), "Each product should have an Add to Cart button");

        takeScreenshot("Product details visible");
    }

    @Test(groups = {"smoke", "regression"})
    @Story("Add to cart")
    @Description("Verify a product can be added to cart and cart badge updates")
    @Severity(SeverityLevel.CRITICAL)
    public void addProductToCartTest() {
        getDriver().findElement(By.id("add-to-cart-sauce-labs-backpack")).click();

        WebElement cartBadge = getDriver().findElement(By.className("shopping_cart_badge"));
        Assert.assertEquals(cartBadge.getText(), "1", "Cart badge should show 1 item");

        takeScreenshot("Product added to cart");
    }

    @Test(groups = {"regression"})
    @Story("Add to cart")
    @Description("Verify multiple products can be added to cart")
    @Severity(SeverityLevel.NORMAL)
    public void addMultipleProductsToCartTest() {
        getDriver().findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
        getDriver().findElement(By.id("add-to-cart-sauce-labs-bike-light")).click();

        WebElement cartBadge = getDriver().findElement(By.className("shopping_cart_badge"));
        Assert.assertEquals(cartBadge.getText(), "2", "Cart badge should show 2 items");

        takeScreenshot("Multiple products in cart");
    }

    @Test(groups = {"regression"})
    @Story("Product detail")
    @Description("Verify clicking a product name opens the product detail page")
    @Severity(SeverityLevel.NORMAL)
    public void openProductDetailTest() {
        String productName = getDriver().findElement(By.className("inventory_item_name")).getText();
        getDriver().findElement(By.className("inventory_item_name")).click();

        Assert.assertTrue(getDriver().getCurrentUrl().contains("inventory-item"), "Should navigate to product detail page");

        WebElement detailName = getDriver().findElement(By.className("inventory_details_name"));
        Assert.assertEquals(detailName.getText(), productName, "Product name should match on detail page");

        takeScreenshot("Product detail page");
    }

    @Step("Login as standard user")
    private void login() {
        getDriver().get("https://www.saucedemo.com");
        getDriver().findElement(By.id("user-name")).sendKeys("standard_user");
        getDriver().findElement(By.id("password")).sendKeys("secret_sauce");
        getDriver().findElement(By.id("login-button")).click();
    }

    @Step("Take screenshot: {name}")
    private void takeScreenshot(String name) {
        Allure.addAttachment(name, new ByteArrayInputStream(
                ((TakesScreenshot) getDriver()).getScreenshotAs(OutputType.BYTES)));
    }
}
