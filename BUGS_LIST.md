# Bug Challenge - Complete List of Bugs

## Total Bugs: 21 (16 Easy + 5 Hard)

---

## EASY BUGS (16)

### 1. **Login: Case-Sensitive Username** ⭐ EASY
- **Location**: `/app/backend/server.py` - Line 145-163
- **Description**: Username check is strictly case-sensitive. "user1" works but "User1" or "USER1" fails.
- **Expected**: Case-insensitive login
- **Actual**: Only exact lowercase matches work

### 1B. **Login: user1 Accepts Multiple Passwords** ⭐ EASY
- **Location**: `/app/backend/server.py` - Line 153-154
- **Description**: user1 can log in with BOTH "user@1" (correct) AND "user@2" (wrong - belongs to user2)
- **Expected**: Each user should only accept their own password
- **Actual**: user1 accepts user2's password due to flawed authentication logic
- **Security Impact**: Authentication bypass vulnerability

### 2. **Login: Password Visibility Toggle Broken** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Login.js` - Line 62-63
- **Description**: Password visibility toggle icon changes but input type stays as "password" (dots don't reveal)
- **Expected**: Clicking eye icon should show/hide password text
- **Actual**: Icon changes but password remains hidden

### 3. **Home: Cart Count Updates Only on Page Refresh** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Home.js` - Line 19-25, 37-44
- **Description**: Cart badge count is fetched only on component mount, doesn't update in real-time after adding items. Users must refresh the page to see updated count.
- **Expected**: Cart count should update immediately after adding items
- **Actual**: Requires page refresh to see updated count (stale state bug)

### 4. **Mobile Menu: Close Button Hidden (Z-Index Issue)** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Home.js` - Line 143
- **Description**: Mobile hamburger menu opens but close (X) button has negative z-index making it unclickable
- **Expected**: Close button should be clickable
- **Actual**: Close button is behind other elements due to `z-index: -10`

### 5. **Hero Section: "Shop Now" Button Unclickable** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Home.js` - Line 207
- **Description**: CTA button has invisible overlay div on top with higher z-index blocking clicks
- **Expected**: Button should be clickable
- **Actual**: Button appears clickable with hover effects but doesn't respond to clicks (invisible overlay intercepts clicks)

### 6. **Product Filters: Men/Women Categories Swapped** ⭐ EASY
- **Location**: `/app/backend/server.py` - Line 162-168
- **Description**: Clicking "Men" shows Women's products and vice versa
- **Expected**: "Men" filter should show men's products
- **Actual**: Backend logic swaps the categories

### 7. **Sorting: Price Sorts by String Instead of Number** ⭐ EASY
- **Location**: `/app/backend/server.py` - Line 175-178
- **Description**: Price sorting treats numbers as strings (e.g., "100" comes before "20")
- **Expected**: Numerical sorting (20, 85, 100, 120, 160)
- **Actual**: Alphabetical sorting (100, 120, 160, 20, 35, 65, 85)

### 8. **Search Bar: Enter Key Reloads Page** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Home.js` - Line 76-80
- **Description**: Pressing Enter in search box reloads entire page instead of searching
- **Expected**: Should perform search query
- **Actual**: Full page reload happens

### 9. **Product Gallery: Second Thumbnail is Broken Link** ⭐ EASY
- **Location**: `/app/backend/server.py` - Line 96 (and other products)
- **Description**: Second thumbnail image in product detail page shows 404
- **Expected**: All thumbnails should load properly
- **Actual**: Thumbnail 2 is a broken link (https://broken-link-404.com/image.jpg)

### 10. **Size Selection: No Visual Feedback** ⭐ EASY
- **Location**: `/app/frontend/src/pages/ProductDetail.js` - Line 76-82
- **Description**: Clicking size button updates state but doesn't apply active styling
- **Expected**: Selected size should have different background/border to show selection
- **Actual**: All buttons look the same even after selection (only text below shows selection)

### 11. **Add to Cart: Success Shows Error Toast** ⭐ EASY
- **Location**: `/app/frontend/src/pages/ProductDetail.js` - Line 46
- **Description**: Successfully adding item to cart displays success message, but cart count badge doesn't update until page reload (Bug #3)
- **Expected**: Should show success message AND update cart count immediately
- **Actual**: Shows success message but cart count stays stale until page refresh

### 12. **Cart Quantity: Allows Negative Numbers** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Cart.js` (Line 121-129) and `/app/frontend/src/pages/ProductDetail.js` (Line 148-158)
- **Description**: Both cart quantity input and product detail quantity input have `min="-999"` allowing negative values (e.g., -1, -5, -100)
- **Expected**: Should only allow positive integers (min 1)
- **Actual**: Can type negative numbers down to -999 in both cart and product pages without validation

### 13. **Cart Total: Subtotal Ignores Last Item** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Cart.js` - Line 48-52
- **Description**: Subtotal calculation uses `slice(0, -1)` which excludes the last item
- **Expected**: All items should be included in subtotal
- **Actual**: Last item in cart is not counted in subtotal



### 14. **Checkout: "Billing Same as Shipping" Checkbox Does Nothing** ⭐ EASY
- **Location**: `/app/frontend/src/pages/Checkout.js` - Line 102-107
- **Description**: Checkbox has no onChange handler, clicking it has no effect
- **Expected**: Should toggle `billingSameAsShipping` state
- **Actual**: Checkbox state doesn't change when clicked

---

## HARD BUGS (5)

### 16. **Payment Form: Credit Card Number No Auto-Format** 🔥 HARD
- **Location**: `/app/frontend/src/pages/Checkout.js` - Line 119-126
- **Description**: Credit card input doesn't format with spaces (e.g., "1234 5678 9012 3456")
- **Expected**: Should auto-format with spaces every 4 digits
- **Actual**: Plain text input without formatting
- **Why Hard**: Requires implementing input masking logic

### 17. **Profile: Save Changes Button Has No onClick Handler** 🔥 HARD
- **Location**: `/app/frontend/src/pages/Profile.js` - Line 65-70
- **Description**: "Save Changes" button exists but has no onClick function (dead button)
- **Expected**: Should save updated profile information
- **Actual**: Button does nothing when clicked
- **Why Hard**: Students need to implement full save functionality with API call

### 18. **Footer: Returns Link Points to 404 Page** 🔥 HARD
- **Location**: `/app/frontend/src/pages/Home.js` - Line 216
- **Description**: "Returns & Exchanges" link goes to `/returns` which shows 404
- **Expected**: Should go to valid returns policy page
- **Actual**: Routes to non-existent page
- **Why Hard**: Requires creating new route and page component

### 19. **Responsive Grid: Mobile Product Cards Too Narrow** 🔥 HARD
- **Location**: `/app/frontend/src/pages/Home.js` - Line 197
- **Description**: Product grid on mobile has `gap-2` making cards look cramped, should be `gap-4` or higher
- **Expected**: Proper spacing between product cards on mobile
- **Actual**: Very tight spacing makes UI look broken
- **Why Hard**: CSS/responsive design understanding required

### 20. **Accessibility: Focus Outline Disabled on All Interactive Elements** 🔥 HARD
- **Location**: `/app/frontend/src/App.css` - Line 21-25
- **Description**: All buttons/links/inputs have `outline: none !important` breaking keyboard navigation
- **Expected**: Visible focus indicator for keyboard users
- **Actual**: No visual feedback when tabbing through elements
- **Why Hard**: Requires understanding of accessibility and CSS specificity

---

## BONUS BUG (From User Requirement)

### 21. **Session Isolation: User1 and User2 See Same Cart** 🔥 HARD
- **Location**: `/app/backend/server.py` - Line 205-210
- **Description**: User1 and User2 have their userIds swapped in the cart endpoint causing them to see each other's carts
- **Expected**: Each user should see only their own cart
- **Actual**: User1 sees User2's cart and vice versa
- **Why Hard**: Backend logic bug that's not visually obvious

---

## Testing Tips for Students

1. **Easy bugs** are usually visible immediately or with basic interaction
2. **Hard bugs** require deeper testing, multiple steps, or specific scenarios
3. Test on different screen sizes (desktop, tablet, mobile)
4. Use keyboard navigation (Tab key) to test accessibility
5. Check browser console for errors and network requests
6. Try edge cases (empty fields, negative numbers, special characters)
7. Test the complete user flow from login to checkout

## Bug Categories Summary

- **UI/Visual**: Bugs 4, 5, 10, 19, 20
- **Logic Errors**: Bugs 6, 7, 11, 13, 21
- **Input Validation**: Bugs 1, 12, 14, 16
- **Functionality**: Bugs 2, 3, 8, 15, 17
- **Navigation/Links**: Bugs 9, 18

Good luck finding all the bugs! 🐛🔍
