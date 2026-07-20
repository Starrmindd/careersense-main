"""
Generate a secure SECRET_KEY for Django production deployment.
Run this script and copy the output to your hosting platform's environment variables.
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("\n" + "="*60)
    print("Your new SECRET_KEY for production:")
    print("="*60)
    print(secret_key)
    print("="*60)
    print("\nCopy this and add it to your Railway/Render environment variables")
    print("as SECRET_KEY (without quotes)\n")
