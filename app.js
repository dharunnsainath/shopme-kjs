function takeToLogin()
{
    window.location.href='login.html'
}

function takeToSignup()
{
    window.location.href='signup.html'
}

function Product(image,name,desc,price)
{
    var self = this;
    self.image = image
    self.name = name
    self.desc = desc
    self.price = price

}

function Cart(product,quantity)
{
    var self = this;
    self.product = product
    self.quantity = ko.observable(quantity)

    // console.log(self.product.price,self.quantity())
    self.subtotal = ko.computed(function() {
        return self.product.price* self.quantity();
      });
    

}



function AppViewModel() {
    var self = this;

    self.signupUsername = ko.observable('');
    self.signupPassword = ko.observable('');
    self.loginUsername = ko.observable('');
    self.loginPassword = ko.observable('');
    self.isCartOpen = ko.observable(false);
    self.loginToggle = ko.observable(false)
    

    self.isLogin = ko.observable(false)

    

    self.products = ko.observableArray(
        [
            new Product('url','Samsung S23','A gun product by samsung',75000),
            new Product('url','Iphone 14','Cooked by our CEO Tim Cook',74000),
            new Product('url','Pixewl 7a','Looking for a killer camera, we are always available',71000),
            new Product('url','Samsung S22','A gun product by samsung',54000),
            new Product('url','Iphone 13','Cooked by our CEO Tim Cook',60000),
            new Product('url','Pixewl 6','Looking for a killer camera, we are always available',68000),
            


        ]
    )
    self.cartItems = ko.observableArray([]);


    

    


    self.total=ko.computed(function()
    {
        var total = 0;
        ko.utils.arrayForEach(self.cartItems(), function(item) {
            console.log(item.quantity())
            total += parseFloat(item.product.price)*parseInt(item.quantity());
          });
          return total;
    })

    self.addToCart = function(product)
    {
        if(self.isLogin)

        {

            console.log(self.cartItems())   


            var existingCartItem = ko.utils.arrayFirst(self.cartItems(), function(item) {
                return item.product === product;
              });

              console.log(existingCartItem)
          
              if (existingCartItem) {
                existingCartItem.quantity(existingCartItem.quantity() + 1);
              } else {
                self.cartItems.push(new Cart(product, 1));
              }
        }
        else
        {
            document.getElementById('showToLogin').textContent='LOGIN FIRST'
        }
      
        
    }

    self.removeFromCart = function(cartItem)
    {
        self.cartItems.remove(cartItem)
       

    }

    self.toggleCart = function() {
        self.isCartOpen(!self.isCartOpen());
      };

      
    self.changeLoginToggle = function(){
        self.loginToggle(!self.loginToggle())
    }


    self.signup = function() {
        
        var user = {
            username: self.signupUsername(),
            password: self.signupPassword()
        };

        // Retrieve existing users from local storage or initialize an empty array
        var users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username is already taken
        var isUsernameTaken = users.some(function(existingUser) {
            return existingUser.username === user.username;
        });

        if (isUsernameTaken) {
            alert('Username is already taken!');
            return;
        }

        // Add the new user to the array
        users.push(user);

        // Store the updated user array in local storage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Clear signup form
        self.signupUsername('');
        self.signupPassword('');

        self.isLogin(true)
       
        alert('Signup successful!');
    };

    self.login = function() {
        
        var username = self.loginUsername();
        var password = self.loginPassword();

        // Retrieve existing users from local storage
        var users = JSON.parse(localStorage.getItem('users')) || [];

        // Find the user with the matching username and password
        var foundUser = users.find(function(existingUser) {
            return existingUser.username === username && existingUser.password === password;
        });

        if (foundUser) {
            
            self.isLogin(true)
        } else {
            alert('Invalid username or password!');
        }


        // Clear login form
        self.loginUsername('');
        self.loginPassword('');
    };
}




var appViewModel = new AppViewModel()



ko.applyBindings(appViewModel);

