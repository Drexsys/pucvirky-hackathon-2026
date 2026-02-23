import subprocess
import os

def create():
    if os.path.isdir('./certs'):
        subprocess.run(['rm', '-rf', './certs'])

    os.mkdir('./certs')

    args = [
        'openssl', 'req', '-x509', '-newkey', 'rsa:4096', '-nodes',
        '-keyout', './certs/hackathon-2026.key',
        '-out', './certs/hackathon-2026.crt',
        '-days', '365',
        '-subj', '/CN=*.hackathon-2026'
    ]

    subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
