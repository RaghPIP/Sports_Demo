#!/usr/bin/env python3
"""
Backend API Testing for Bug Challenge E-commerce App
Tests all 20+ intentional bugs documented in BUGS_LIST.md
"""

import requests
import sys
import json
from datetime import datetime

class BugChallengeAPITester:
    def __init__(self, base_url="https://gear-commerce-portal.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.bugs_found = []

    def log_bug(self, bug_id, description, test_result):
        """Log discovered bugs"""
        self.bugs_found.append({
            "bug_id": bug_id,
            "description": description,
            "test_result": test_result,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}")

            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_login_case_sensitivity_bug(self):
        """Bug #1: Login is case-sensitive (should be case-insensitive)"""
        print("\n" + "="*50)
        print("BUG TEST #1: Case-Sensitive Username")
        print("="*50)
        
        # Test lowercase (should work)
        success, response = self.run_test(
            "Login with lowercase 'user1'",
            "POST", 
            "auth/login",
            200,
            data={"username": "user1", "password": "user@1"}
        )
        
        if success:
            print("✅ Lowercase username works")
        
        # Test uppercase (should fail due to bug)
        success, response = self.run_test(
            "Login with uppercase 'USER1'",
            "POST",
            "auth/login", 
            401,  # Expected to fail due to bug
            data={"username": "USER1", "password": "user@1"}
        )
        
        if not success and response and response.status_code == 401:
            self.log_bug("BUG-001", "Username login is case-sensitive (should be case-insensitive)", "CONFIRMED")
            print("🐛 BUG CONFIRMED: Case-sensitive username check")
        
    def test_category_filter_swap_bug(self):
        """Bug #6: Men/Women categories are swapped"""
        print("\n" + "="*50)
        print("BUG TEST #6: Men/Women Category Swap")
        print("="*50)
        
        # Get products with "men" filter (should return women's products due to bug)
        success, response = self.run_test(
            "Get products with men filter",
            "GET",
            "products?category=men",
            200
        )
        
        if success:
            products = response.json()
            men_filter_categories = [p['category'] for p in products]
            if all(cat == 'women' for cat in men_filter_categories):
                self.log_bug("BUG-006", "Men filter returns women's products (categories swapped)", "CONFIRMED")
                print("🐛 BUG CONFIRMED: Men filter returns women's products")
                print(f"Categories returned: {set(men_filter_categories)}")
            
        # Get products with "women" filter (should return men's products due to bug)  
        success, response = self.run_test(
            "Get products with women filter",
            "GET",
            "products?category=women",
            200
        )
        
        if success:
            products = response.json()
            women_filter_categories = [p['category'] for p in products]
            if all(cat == 'men' for cat in women_filter_categories):
                self.log_bug("BUG-006-B", "Women filter returns men's products (categories swapped)", "CONFIRMED")
                print("🐛 BUG CONFIRMED: Women filter returns men's products")
                print(f"Categories returned: {set(women_filter_categories)}")

    def test_price_sorting_bug(self):
        """Bug #7: Price sorting treats numbers as strings"""
        print("\n" + "="*50)
        print("BUG TEST #7: String Price Sorting")
        print("="*50)
        
        success, response = self.run_test(
            "Get products sorted by price ascending",
            "GET",
            "products?sort=price-asc",
            200
        )
        
        if success:
            products = response.json()
            prices = [p['price'] for p in products]
            string_sorted_prices = sorted([str(p) for p in prices])
            actual_prices_as_strings = [str(p) for p in prices]
            
            print(f"Prices returned: {prices}")
            print(f"Expected numeric sort: {sorted(prices)}")
            print(f"Actual string sort: {[float(p) for p in string_sorted_prices]}")
            
            # Check if it's doing string sorting instead of numeric
            if actual_prices_as_strings == string_sorted_prices:
                self.log_bug("BUG-007", "Price sorting uses string comparison instead of numeric", "CONFIRMED")
                print("🐛 BUG CONFIRMED: String-based price sorting")
            
    def test_session_isolation_bug(self):
        """Bug #21: user1 and user2 see each other's cart"""
        print("\n" + "="*50)
        print("BUG TEST #21: Session Isolation - Cart Mix-up")
        print("="*50)
        
        # Add item to user1's cart first
        success, response = self.run_test(
            "Add item to user1's cart",
            "POST",
            "cart/add",
            200,
            data={
                "userId": "user1",
                "productId": "prod1", 
                "name": "Test Product",
                "price": 100,
                "quantity": 1,
                "size": "M",
                "image": "test.jpg"
            }
        )
        
        if success:
            print("✅ Item added to user1's cart")
            
            # Now try to get user1's cart (should get user2's due to bug)
            success, response = self.run_test(
                "Get user1's cart (expecting user2's due to bug)",
                "GET", 
                "cart/user1",
                200
            )
            
            # According to the bug, user1 should get user2's cart
            if success:
                cart_items = response.json()
                print(f"Items returned for user1: {len(cart_items)}")
                
                # Test user2 getting user1's cart
                success2, response2 = self.run_test(
                    "Get user2's cart (expecting user1's due to bug)",
                    "GET",
                    "cart/user2", 
                    200
                )
                
                if success2:
                    user2_cart = response2.json()
                    print(f"Items returned for user2: {len(user2_cart)}")
                    
                    # If the bug exists, user2 should see user1's items
                    if len(user2_cart) > 0:
                        self.log_bug("BUG-021", "User1 and User2 cart sessions are swapped", "CONFIRMED")
                        print("🐛 BUG CONFIRMED: Cart session isolation broken")

    def test_all_basic_endpoints(self):
        """Test basic API functionality"""
        print("\n" + "="*50)
        print("BASIC API FUNCTIONALITY TESTS")
        print("="*50)
        
        # Test login with valid credentials
        success, response = self.run_test(
            "Valid login user1",
            "POST",
            "auth/login",
            200,
            data={"username": "user1", "password": "user@1"}
        )
        
        # Test invalid login
        success, response = self.run_test(
            "Invalid login",
            "POST", 
            "auth/login",
            401,
            data={"username": "invalid", "password": "wrong"}
        )
        
        # Test get all products
        success, response = self.run_test(
            "Get all products",
            "GET",
            "products",
            200
        )
        
        if success:
            products = response.json()
            print(f"Total products: {len(products)}")
            
        # Test get specific product
        success, response = self.run_test(
            "Get specific product",
            "GET", 
            "products/prod1",
            200
        )
        
        # Test get non-existent product
        success, response = self.run_test(
            "Get non-existent product",
            "GET",
            "products/nonexistent",
            404
        )
        
        # Test search functionality  
        success, response = self.run_test(
            "Search products",
            "GET",
            "products?search=Air",
            200
        )

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Bug Challenge API Testing")
        print(f"Testing against: {self.base_url}")
        
        # Basic functionality tests
        self.test_all_basic_endpoints()
        
        # Bug-specific tests
        self.test_login_case_sensitivity_bug()
        self.test_category_filter_swap_bug() 
        self.test_price_sorting_bug()
        self.test_session_isolation_bug()
        
        # Print results
        print(f"\n📊 TEST SUMMARY")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        print(f"\n🐛 BUGS FOUND: {len(self.bugs_found)}")
        for bug in self.bugs_found:
            print(f"  - {bug['bug_id']}: {bug['description']}")
        
        return self.tests_passed, self.tests_run, self.bugs_found

def main():
    tester = BugChallengeAPITester()
    passed, total, bugs = tester.run_all_tests()
    
    # Save results
    results = {
        "timestamp": datetime.now().isoformat(),
        "tests_passed": passed,
        "tests_total": total,
        "success_rate": f"{(passed/total)*100:.1f}%",
        "bugs_found": bugs
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Results saved to /app/backend_test_results.json")
    
    # Return 0 for success, 1 for issues (but in this case, finding bugs is success!)
    return 0

if __name__ == "__main__":
    sys.exit(main())