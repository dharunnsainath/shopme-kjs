function Product(name, price) {
    var self = this;
    self.name = name;
    self.price = price;
  }
  
  function CartItem(product, quantity) {
    var self = this;
    self.product = product;
    self.quantity = ko.observable(quantity);
  
    // Computed observable to calculate the item subtotal
    self.subtotal = ko.computed(function() {
      return self.product.price * self.quantity();
    });
  }
  
  function CartViewModel() {
    var self = this;
  
    // Array to hold the products
    self.products = ko.observableArray([
      new Product("Product 1", 10),
      new Product("Product 2", 20),
      new Product("Product 3", 30)
    ]);
  
    // Array to hold the cart items
    self.cartItems = ko.observableArray([]);
  
    // Computed observable to calculate the total price
    self.total = ko.computed(function() {
      var total = 0;
      ko.utils.arrayForEach(self.cartItems(), function(item) {
        total += item.subtotal();
      });
      return total;
    });
  
    // Observable to track sign-in state
    self.isSignedIn = ko.observable(false);
  
    // Observable to track cart visibility
    self.isCartOpen = ko.observable(false);
  
    // Add to cart function
    self.addToCart = function(product) {
      var existingCartItem = ko.utils.arrayFirst(self.cartItems(), function(item) {
        return item.product === product;
      });
  
      if (existingCartItem) {
        existingCartItem.quantity(existingCartItem.quantity() + 1);
      } else {
        self.cartItems.push(new CartItem(product, 1));
      }
    };
  
    // Remove from cart function
    self.removeFromCart = function(cartItem) {
      self.cartItems.remove(cartItem);
    };
  
    // Update quantity function
    self.updateQuantity = function(cartItem) {
      var newQuantity = parseInt(cartItem.quantity(), 10);
      if (isNaN(newQuantity) || newQuantity < 1) {
        cartItem.quantity(1);
      } else {
        cartItem.quantity(newQuantity);
      }
    };
  
    // Toggle cart visibility
    self.toggleCart = function() {
      self.isCartOpen(!self.isCartOpen());
    };
  
    // Sign-in function
    self.signIn = function() {
      self.isSignedIn(true);
    };
  
    // Sign-out function
    self.signOut = function() {
      self.isSignedIn(false);
      self.cartItems.removeAll();
    };

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
            alert('Login successful!');
            self.isLogin(true)
        } else {
            alert('Invalid username or password!');
        }


        // Clear login form
        self.loginUsername('');
        self.loginPassword('');
    };
  }
  
  // Apply bindings
  var cartVM = new CartViewModel();
  ko.applyBindings(cartVM, document.getElementById("cart"));
  ko.applyBindings(cartVM, document.getElementById("hamburger"));
  ko.applyBindings(cartVM, document.getElementById("products"));
  