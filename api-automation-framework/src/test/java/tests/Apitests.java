@Test
public void getUsersTest() {

given()
.when()
.get("https://reqres.in/api/users?page=2")
.then()
.statusCode(200);

}