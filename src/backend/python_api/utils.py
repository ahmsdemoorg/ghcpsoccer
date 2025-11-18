
import re
import hashlib
import uuid

def CheckIfFileExists(filepath):
    try:
        with open(filepath, 'r'):
            return True
    except FileNotFoundError:
        return False
    
# generate a unique filename


def generate_unique_filename(original_filename):
    unique_id = uuid.uuid4().hex
    return f"{unique_id}_{original_filename}"


def is_valid_email(email):
    """
    Validates whether a given string is a valid email address.

    Args:
        email (str): The email address string to validate.

    Returns:
        bool: True if the email address matches the valid email pattern, False otherwise.

    Example:
        >>> is_valid_email("user@example.com")
        True
        >>> is_valid_email("invalid.email")
        False

    Note:
        The function uses a regular expression pattern that checks for:
        - Local part: alphanumeric characters, dots, underscores, percent signs, plus and minus signs
        - @ symbol
        - Domain name: alphanumeric characters, dots, and hyphens
        - Top-level domain: at least 2 alphabetic characters
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None



def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def is_strong_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    if not re.search(r'[\W_]', password):
        return False
    return True

# create function to write to a file called log.txt
def log_message(message):
    from datetime import datetime
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open('log.txt', 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] {message}\n")
    except Exception as e:
        print(f"Error writing to log file: {e}")

# create function to read from log.txt. it must use bad practices like no exception handling and no context manager
def read_log():
    try:
        f = open('log.txt', 'r', encoding='utf-8')
        content = f.read()
        f.close()
        return content
    except (FileNotFoundError, IOError) as e:
        print(f"Error reading log file: {e}")
        return ""
