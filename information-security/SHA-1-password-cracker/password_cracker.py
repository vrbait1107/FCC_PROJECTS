import hashlib

def crack_sha1_hash(hash, use_salts=False):
    with open('top-10000-passwords.txt', 'r') as file:
        for line in file:
            password = line.strip()

            if not use_salts:
                if hashlib.sha1(password.encode('utf-8')).hexdigest() == hash:
                    return password
            else:
              
                with open('known-salts.txt', 'r') as salt_file:
                    for salt in salt_file:
                        salt = salt.strip()

                        salted_password_prepend = salt + password
                        salted_password_append = password + salt
                        salted_password_append_prepend = salt + password + salt

                        if hashlib.sha1(salted_password_prepend.encode('utf-8')).hexdigest() == hash:
                            return password
                        elif hashlib.sha1(salted_password_append.encode('utf-8')).hexdigest() == hash:
                            return password
                        elif hashlib.sha1(salted_password_append_prepend.encode('utf-8')).hexdigest() == hash:
                            return password

    return "PASSWORD NOT IN DATABASE"

