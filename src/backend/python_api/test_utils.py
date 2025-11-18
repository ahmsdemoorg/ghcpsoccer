import unittest
from utils import is_strong_password, is_valid_email, hash_password

class TestUtils(unittest.TestCase):
    def test_strong_password_valid(self):
        # Test a valid strong password
        self.assertTrue(is_strong_password("Test123!@"))
        self.assertTrue(is_strong_password("StrongP@ss1"))
        self.assertTrue(is_strong_password("C0mplex!ty"))

    def test_strong_password_too_short(self):
        # Test password less than 8 chars
        self.assertFalse(is_strong_password("Ab1!"))
        
    def test_strong_password_no_uppercase(self):
        # Test password without uppercase
        self.assertFalse(is_strong_password("test123!@"))

    def test_strong_password_no_lowercase(self):
        # Test password without lowercase
        self.assertFalse(is_strong_password("TEST123!@"))

    def test_strong_password_no_number(self):
        # Test password without number
        self.assertFalse(is_strong_password("TestTest!@"))

    def test_strong_password_no_special(self):
        # Test password without special character
        self.assertFalse(is_strong_password("TestTest123"))

    def test_valid_email(self):
        # Test valid email addresses
        self.assertTrue(is_valid_email("test@example.com"))
        self.assertTrue(is_valid_email("user.name@domain.co.uk"))
        self.assertTrue(is_valid_email("user123@domain-test.com"))

    def test_invalid_email(self):
        # Test invalid email addresses
        self.assertFalse(is_valid_email("invalid.email"))
        self.assertFalse(is_valid_email("@domain.com"))
        self.assertFalse(is_valid_email("test@.com"))

    def test_hash_password(self):
        # Test password hashing
        password = "TestPass123!"
        hashed = hash_password(password)
        # Test that hashing is consistent
        self.assertEqual(hash_password(password), hashed)
        # Test that different passwords produce different hashes
        self.assertNotEqual(hash_password("DifferentPass123!"), hashed)

    def test_valid_email_with_plus_sign(self):
        # Test email with plus sign in local part
        self.assertTrue(is_valid_email("user+tag@example.com"))

    def test_valid_email_with_underscore(self):
        # Test email with underscore
        self.assertTrue(is_valid_email("user_name@example.com"))

    def test_valid_email_with_percent(self):
        # Test email with percent sign
        self.assertTrue(is_valid_email("user%test@example.com"))

    def test_valid_email_with_hyphen_in_domain(self):
        # Test email with hyphen in domain
        self.assertTrue(is_valid_email("user@my-domain.com"))

    def test_invalid_email_no_at_symbol(self):
        # Test email without @ symbol
        self.assertFalse(is_valid_email("userexample.com"))

    def test_invalid_email_no_domain(self):
        # Test email without domain name
        self.assertFalse(is_valid_email("user@"))

    def test_invalid_email_no_local_part(self):
        # Test email without local part
        self.assertFalse(is_valid_email("@example.com"))

    def test_invalid_email_no_tld(self):
        # Test email without top-level domain
        self.assertFalse(is_valid_email("user@domain"))

    def test_invalid_email_tld_too_short(self):
        # Test email with single character TLD
        self.assertFalse(is_valid_email("user@domain.c"))

    def test_invalid_email_multiple_at_symbols(self):
        # Test email with multiple @ symbols
        self.assertFalse(is_valid_email("user@@example.com"))

    def test_invalid_email_spaces(self):
        # Test email with spaces
        self.assertFalse(is_valid_email("user name@example.com"))

    def test_invalid_email_special_chars_in_domain(self):
        # Test email with invalid special characters in domain
        self.assertFalse(is_valid_email("user@exam ple.com"))

if __name__ == '__main__':
    unittest.main()